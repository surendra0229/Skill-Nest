import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

async function run() {
  console.log("Creating Admin CMS tables in Supabase PostgreSQL...");

  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS language_notes (
      id text PRIMARY KEY,
      language text NOT NULL,
      title text NOT NULL,
      category text NOT NULL,
      content text NOT NULL,
      use_cases text NOT NULL,
      code_example text,
      created_at timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dsa_questions (
      id text PRIMARY KEY,
      title text NOT NULL,
      difficulty text NOT NULL,
      pattern text NOT NULL,
      description text NOT NULL,
      starter_code text,
      test_cases text,
      leetcode_url text,
      created_at timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS career_roadmaps (
      id text PRIMARY KEY,
      role_title text NOT NULL,
      description text NOT NULL,
      skills_required text NOT NULL,
      estimated_duration text NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );

    ALTER TABLE language_notes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE dsa_questions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;
  `);

  console.log("✓ Tables and RLS created successfully!");

  // Seed default notes if empty
  const notesCount = await sql.unsafe(`SELECT count(*)::int as count FROM language_notes`);
  if (notesCount[0].count === 0) {
    console.log("Seeding sample language notes...");
    await sql.unsafe(`
      INSERT INTO language_notes (id, language, title, category, content, use_cases, code_example)
      VALUES 
        (
          gen_random_uuid()::text,
          'Python',
          'AsyncIO & Event Loops in High-Scale Systems',
          'Concurrency',
          'AsyncIO provides cooperative multitasking using coroutines. An event loop executes tasks sequentially, switching contexts when an I/O operation awaits.',
          'Microservices, FastAPI backends, High-QPS rate limiters, Real-time WebSockets',
          'import asyncio\n\nasync def fetch_item(id: int):\n    return f"Item {id}"'
        ),
        (
          gen_random_uuid()::text,
          'TypeScript',
          'Discriminated Unions & Exhaustiveness Checks',
          'Advanced Typing',
          'Discriminated unions model state machines with absolute type safety across reducers and handlers.',
          'API error envelopes, State machine reducers, AST compilers',
          'type Action = { type: "LOGIN"; user: string } | { type: "LOGOUT" };'
        );
    `);
  }

  // Seed default dsa questions if empty
  const dsaCount = await sql.unsafe(`SELECT count(*)::int as count FROM dsa_questions`);
  if (dsaCount[0].count === 0) {
    console.log("Seeding sample DSA questions...");
    await sql.unsafe(`
      INSERT INTO dsa_questions (id, title, difficulty, pattern, description, starter_code, test_cases, leetcode_url)
      VALUES
        (
          gen_random_uuid()::text,
          'Two Sum',
          'Easy',
          'Arrays & Hashing',
          'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
          'function twoSum(nums: number[], target: number): number[] {\n  return [];\n}',
          '[{"input": "[2,7,11,15], 9", "expected": "[0,1]"}]',
          'https://leetcode.com/problems/two-sum/'
        ),
        (
          gen_random_uuid()::text,
          'Longest Substring Without Repeating Characters',
          'Medium',
          'Sliding Window',
          'Given a string s, find the length of the longest substring without duplicate characters.',
          'function lengthOfLongestSubstring(s: string): number {\n  return 0;\n}',
          '[{"input": "abcabcbb", "expected": "3"}]',
          'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
        );
    `);
  }

  // Seed default roadmaps if empty
  const roadmapsCount = await sql.unsafe(`SELECT count(*)::int as count FROM career_roadmaps`);
  if (roadmapsCount[0].count === 0) {
    console.log("Seeding sample roadmaps...");
    await sql.unsafe(`
      INSERT INTO career_roadmaps (id, role_title, description, skills_required, estimated_duration)
      VALUES
        (
          gen_random_uuid()::text,
          'Full-Stack Next.js & Cloud Architect',
          'Master modern serverless web architectures, Next.js 15, PostgreSQL database modeling, and real-time systems.',
          'TypeScript, Next.js 15 App Router, Drizzle ORM, Supabase, Tailwind CSS, Redis Caching',
          '6 Months'
        ),
        (
          gen_random_uuid()::text,
          'AI/ML Systems & Backend Engineer',
          'Design production AI agents, vector database pipelines, ATS matching algorithms, and high-throughput Python APIs.',
          'Python, FastAPI, PyTorch, LangChain, Vector Embeddings (pgvector), Docker',
          '8 Months'
        );
    `);
  }

  console.log("✓ All Admin CMS tables and data verified in Supabase!");
  await sql.end();
}

run().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});
