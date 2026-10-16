import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables for Drizzle Kit CLI migrations
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
