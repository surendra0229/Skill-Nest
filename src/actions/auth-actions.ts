"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { resend, DEFAULT_FROM_EMAIL } from "@/lib/email";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth";

/**
 * Register a new user with 5 mandatory fields & terms acceptance
 * - Full Name, Username, Email, Password, Confirm Password, Accept Terms
 * - Checks if email or username already exists with distinct error messages
 */
export async function registerUser(input: RegisterInput) {
  try {
    const validated = registerSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input data.",
      };
    }

    const { fullName, username, email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check if email is already taken
    const [existingEmail] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingEmail) {
      return {
        success: false,
        error: "Email is already registered",
      };
    }

    // Check if username is already taken
    const [existingUsername] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, normalizedUsername))
      .limit(1);

    if (existingUsername) {
      return {
        success: false,
        error: "Username is already taken",
      };
    }

    // Hash password with bcryptjs
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user into Supabase PostgreSQL
    await db.insert(users).values({
      name: fullName.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      acceptedTerms: true,
    });

    return {
      success: true,
      message: "Account created successfully! Redirecting to login...",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("registerUser error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating your account. Please try again.",
    };
  }
}

/**
 * Authenticate user with Email and Password
 */
export async function loginWithCredentials(input: LoginInput) {
  try {
    const validated = loginSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid email or password.",
      };
    }

    const { email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Invalid email or password. Please verify your credentials and try again.",
          };
        default:
          return {
            success: false,
            error: "Authentication failed. Please try again.",
          };
      }
    }

    console.error("loginWithCredentials error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Request Password Reset
 * Generates a 1-hour secure token, saves it in passwordResetTokens, and sends an email via Resend
 */
export async function requestPasswordReset(input: ForgotPasswordInput) {
  try {
    const validated = forgotPasswordSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Please enter a valid email.",
      };
    }

    const { email } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      // Return success message regardless to prevent user enumeration attacks
      return {
        success: true,
        message: "If an account exists with that email, a password reset link has been dispatched.",
      };
    }

    // Generate secure token with 1 hour expiration
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    // Delete any old tokens for this email first
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.email, normalizedEmail));

    // Save token to database
    await db.insert(passwordResetTokens).values({
      email: normalizedEmail,
      token,
      expires,
    });

    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/reset-password?token=${token}`;

    // Local development fallback log:
    console.log("🔗 PASSWORD RESET LINK:", resetUrl);

    // Send email via Resend if API key is configured
    if (
      process.env.RESEND_API_KEY &&
      !process.env.RESEND_API_KEY.includes("your_resend") &&
      !process.env.RESEND_API_KEY.includes("dummy")
    ) {
      try {
        await resend.emails.send({
          from: DEFAULT_FROM_EMAIL,
          to: normalizedEmail,
          subject: "Reset your Skill Nest password",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ededed; padding: 40px 24px; border-radius: 16px; max-width: 500px; margin: auto;">
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin-bottom: 12px;">Reset Your Password</h2>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                We received a request to reset the password for your Skill Nest account. Click the button below to choose a new password.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="background-color: #ffffff; color: #000000; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin-top: 32px; border-top: 1px solid #27272a; pt-4;">
                This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error("Resend delivery failed, logged reset URL to console:", err);
      }
    }

    return {
      success: true,
      message: "If an account exists with that email, a password reset link has been dispatched.",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("requestPasswordReset error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Reset Password using Token
 */
export async function resetPassword(input: ResetPasswordInput) {
  try {
    const validated = resetPasswordSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input data.",
      };
    }

    const { token, password } = validated.data;

    // Look up token in database
    const [tokenRecord] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (!tokenRecord) {
      return {
        success: false,
        error: "Invalid or expired password reset link.",
      };
    }

    // Check expiration
    if (new Date(tokenRecord.expires) < new Date()) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, tokenRecord.id));

      return {
        success: false,
        error: "This password reset link has expired. Please request a new one.",
      };
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password in users table
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.email, tokenRecord.email));

    // Delete consumed token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, tokenRecord.id));

    return {
      success: true,
      message: "Password reset successfully! Redirecting to login...",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("resetPassword error:", error);
    return {
      success: false,
      error: "An unexpected error occurred while resetting your password.",
    };
  }
}

/**
 * Trigger OAuth sign in
 */
export async function loginWithOAuth(provider: "google" | "github") {
  try {
    await signIn(provider, { redirectTo: "/dashboard" });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(`OAuth error for provider ${provider}:`, error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}
