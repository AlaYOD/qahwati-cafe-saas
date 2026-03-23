import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Load .env.local first (Supabase pooler URLs)
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});
