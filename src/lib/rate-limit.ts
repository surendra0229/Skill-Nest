import Redis from "ioredis";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

/**
 * Pre-configured rate limit action tiers and quotas.
 * Window is in seconds.
 */
export const RATE_LIMIT_TIERS = {
  ats_resume_analysis: {
    limit: 5,
    windowSeconds: 24 * 60 * 60, // 24 hours
    label: "ATS Resume Analysis",
    description: "5 scans per 24 hours",
  },
  latex_resume_build: {
    limit: 10,
    windowSeconds: 60 * 60, // 1 hour
    label: "LaTeX Resume Compilation",
    description: "10 compilations per hour",
  },
  contest_room_create: {
    limit: 3,
    windowSeconds: 60 * 60, // 1 hour
    label: "Contest Room Creation",
    description: "3 rooms per hour",
  },
  ai_tutor_chat: {
    limit: 25,
    windowSeconds: 60 * 60, // 1 hour
    label: "AI Tutor Messages",
    description: "25 messages per hour",
  },
  judge0_code_run: {
    limit: 30,
    windowSeconds: 15 * 60, // 15 minutes
    label: "Judge0 Code Executions",
    description: "30 runs per 15 mins",
  },
  jsearch_job_query: {
    limit: 15,
    windowSeconds: 60 * 60, // 1 hour
    label: "Job Board Searches",
    description: "15 searches per hour",
  },
  youtube_ai_search: {
    limit: 20,
    windowSeconds: 60 * 60, // 1 hour
    label: "YouTube AI Searches",
    description: "20 queries per hour",
  },
  auth_attempt: {
    limit: 5,
    windowSeconds: 15 * 60, // 15 minutes
    label: "Authentication Attempts",
    description: "5 attempts per 15 mins",
  },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMIT_TIERS;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetInMinutes: number;
  message: string;
}

// --------------------------------------------------------------------------
// 1. Redis Client Setup with Graceful Fallback
// --------------------------------------------------------------------------
let redisClient: Redis | null = null;
let isRedisAvailable = false;

if (process.env.REDIS_URL && !process.env.REDIS_URL.includes("dummy")) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 2) return null; // stop reconnecting to avoid spamming logs
        return 1000;
      },
    });

    redisClient.on("connect", () => {
      isRedisAvailable = true;
    });

    redisClient.on("error", () => {
      isRedisAvailable = false;
    });
  } catch {
    isRedisAvailable = false;
  }
}

// In-memory fallback map (per node process instance)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

// --------------------------------------------------------------------------
// 2. Core Rate Limiting Check Function
// --------------------------------------------------------------------------
export async function checkRateLimit(
  identifier: string,
  action: RateLimitAction,
  userRole?: string
): Promise<RateLimitResult> {
  const tier = RATE_LIMIT_TIERS[action];
  if (!tier) {
    throw new Error(`Unknown rate limit action: ${action}`);
  }

  // Admins bypass all rate limits
  if (userRole === "admin") {
    return {
      allowed: true,
      remaining: tier.limit,
      limit: tier.limit,
      resetInMinutes: 0,
      message: "Admin privilege: Unlimited access.",
    };
  }

  const key = `ratelimit:${action}:${identifier}`;

  // Attempt 1: Redis Rate Limiting
  if (redisClient && isRedisAvailable) {
    try {
      const current = await redisClient.incr(key);
      if (current === 1) {
        await redisClient.expire(key, tier.windowSeconds);
      }
      const ttl = await redisClient.ttl(key);
      const resetInMinutes = Math.max(1, Math.ceil(ttl / 60));

      if (current > tier.limit) {
        return {
          allowed: false,
          remaining: 0,
          limit: tier.limit,
          resetInMinutes,
          message: `Rate limit reached for ${tier.label}! You can use this feature again in ${resetInMinutes} minute${resetInMinutes === 1 ? "" : "s"}.`,
        };
      }

      return {
        allowed: true,
        remaining: Math.max(0, tier.limit - current),
        limit: tier.limit,
        resetInMinutes,
        message: "Request permitted within quota.",
      };
    } catch {
      isRedisAvailable = false;
      // Fall through to database/memory fallback
    }
  }

  // Attempt 2: Drizzle ORM PostgreSQL Fallback (`rate_limits` table)
  try {
    const recordId = `${identifier}:${action}`;
    const now = new Date();

    const [existing] = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.id, recordId))
      .limit(1);

    if (existing && existing.resetAt > now) {
      if (existing.count >= tier.limit) {
        const diffMs = existing.resetAt.getTime() - now.getTime();
        const resetInMinutes = Math.max(1, Math.ceil(diffMs / (60 * 1000)));

        return {
          allowed: false,
          remaining: 0,
          limit: tier.limit,
          resetInMinutes,
          message: `Rate limit reached for ${tier.label}! You can use this feature again in ${resetInMinutes} minute${resetInMinutes === 1 ? "" : "s"}.`,
        };
      }

      // Increment count
      const updatedCount = existing.count + 1;
      await db
        .update(rateLimits)
        .set({ count: updatedCount })
        .where(eq(rateLimits.id, recordId));

      const diffMs = existing.resetAt.getTime() - now.getTime();
      const resetInMinutes = Math.max(1, Math.ceil(diffMs / (60 * 1000)));

      return {
        allowed: true,
        remaining: Math.max(0, tier.limit - updatedCount),
        limit: tier.limit,
        resetInMinutes,
        message: "Request permitted within quota.",
      };
    }

    // New window or expired record: reset record
    const resetAt = new Date(Date.now() + tier.windowSeconds * 1000);
    await db
      .insert(rateLimits)
      .values({
        id: recordId,
        action,
        count: 1,
        resetAt,
      })
      .onConflictDoUpdate({
        target: rateLimits.id,
        set: {
          count: 1,
          resetAt,
        },
      });

    return {
      allowed: true,
      remaining: tier.limit - 1,
      limit: tier.limit,
      resetInMinutes: Math.ceil(tier.windowSeconds / 60),
      message: "Request permitted within quota.",
    };
  } catch (dbErr) {
    // Attempt 3: In-Memory Map Fallback (Guarantees zero crashes even if DB connection has a blip)
    const now = Date.now();
    const stored = memoryStore.get(key);

    if (stored && stored.resetAt > now) {
      if (stored.count >= tier.limit) {
        const resetInMinutes = Math.max(1, Math.ceil((stored.resetAt - now) / 60000));
        return {
          allowed: false,
          remaining: 0,
          limit: tier.limit,
          resetInMinutes,
          message: `Rate limit reached for ${tier.label}! You can use this feature again in ${resetInMinutes} minute${resetInMinutes === 1 ? "" : "s"}.`,
        };
      }
      stored.count += 1;
      const resetInMinutes = Math.max(1, Math.ceil((stored.resetAt - now) / 60000));
      return {
        allowed: true,
        remaining: tier.limit - stored.count,
        limit: tier.limit,
        resetInMinutes,
        message: "Request permitted within quota.",
      };
    }

    const resetAt = now + tier.windowSeconds * 1000;
    memoryStore.set(key, { count: 1, resetAt });

    return {
      allowed: true,
      remaining: tier.limit - 1,
      limit: tier.limit,
      resetInMinutes: Math.ceil(tier.windowSeconds / 60),
      message: "Request permitted within quota.",
    };
  }
}

// --------------------------------------------------------------------------
// 3. User Remaining Quotas Inspector (For Dashboard Popover)
// --------------------------------------------------------------------------
export async function getRemainingQuotas(userId: string, role?: string) {
  if (role === "admin") {
    return {
      isAdmin: true,
      quotas: [
        { action: "ats_resume_analysis", label: "ATS Scans", limit: 5, remaining: 5, used: 0, unit: "daily" },
        { action: "latex_resume_build", label: "LaTeX Builds", limit: 10, remaining: 10, used: 0, unit: "hourly" },
        { action: "contest_room_create", label: "Contest Rooms", limit: 3, remaining: 3, used: 0, unit: "hourly" },
        { action: "ai_tutor_chat", label: "AI Tutor", limit: 25, remaining: 25, used: 0, unit: "hourly" },
        { action: "judge0_code_run", label: "Judge0 Code Runs", limit: 30, remaining: 30, used: 0, unit: "15-min" },
      ],
    };
  }

  const inspectedActions: RateLimitAction[] = [
    "ats_resume_analysis",
    "latex_resume_build",
    "contest_room_create",
    "ai_tutor_chat",
    "judge0_code_run",
  ];

  const quotas = await Promise.all(
    inspectedActions.map(async (act) => {
      const tier = RATE_LIMIT_TIERS[act];
      let used = 0;

      try {
        const recordId = `${userId}:${act}`;
        const [existing] = await db
          .select()
          .from(rateLimits)
          .where(and(eq(rateLimits.id, recordId), gt(rateLimits.resetAt, new Date())))
          .limit(1);

        if (existing) {
          used = Math.min(existing.count, tier.limit);
        }
      } catch {
        used = 0;
      }

      return {
        action: act,
        label: tier.label.replace(" Compilation", "").replace(" Messages", "").replace(" Executions", ""),
        limit: tier.limit,
        remaining: Math.max(0, tier.limit - used),
        used,
        unit: tier.windowSeconds >= 86400 ? "daily" : "hourly",
      };
    })
  );

  return {
    isAdmin: false,
    quotas,
  };
}
