import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Returns a validated database connection string.
 * Uses DIRECT_URL or DATABASE_URL.
 */
function getSafeConnectionString(): string {
  const envUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!envUrl) {
    return "postgresql://postgres:postgres@localhost:5432/postgres";
  }

  // Gracefully handle unpopulated template placeholders with brackets
  if (envUrl.includes("[") || envUrl.includes("]")) {
    return "postgresql://postgres:postgres@localhost:5432/postgres";
  }

  try {
    new URL(envUrl);
    return envUrl;
  } catch {
    return "postgresql://postgres:postgres@localhost:5432/postgres";
  }
}

const connectionString = getSafeConnectionString();

/**
 * Configure postgres client with 'prepare: false'.
 * This is CRITICAL for Supabase connection pooling (Transaction Pooler / PgBouncer on port 6543)
 * because PgBouncer does not support prepared statements across sessions.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const client =
  globalForDb.conn ??
  postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = client;
}

export const db = drizzle(client, { schema });
export type DB = typeof db;
export * from "./schema";
