/**
 * seed-user.ts
 * Creates a test auth user in Supabase + inserts a matching profile row via Prisma.
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Run:      npm run seed:user
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

// ── Config — all values come from .env.local via --env-file flag ───────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// DIRECT_URL = plain connection (no PgBouncer) — required for seed scripts
// DATABASE_URL = pooled connection (PgBouncer) — used by the Next.js app
const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Test user credentials (change as needed) ───────────────────────────────
const TEST_USER = {
  email: 'admin@qahwati.com',
  password: 'Test1234!',
  full_name: 'Admin User',
  role: 'admin',           // 'admin' | 'manager' | 'staff'
};

// ── Guard ──────────────────────────────────────────────────────────────────
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('');
  console.error('❌  Missing environment variables.');
  console.error('    Make sure .env.local contains:');
  console.error('      NEXT_PUBLIC_SUPABASE_URL=...');
  console.error('      SUPABASE_SERVICE_ROLE_KEY=...');
  console.error('');
  console.error('    Get your service role key from:');
  console.error('    Supabase Dashboard → Project Settings → API → service_role key');
  console.error('');
  process.exit(1);
}

// ── Supabase admin client (auth user creation only) ────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('');
  console.log('🌱  Seeding test user...');
  console.log(`    Email : ${TEST_USER.email}`);
  console.log(`    Role  : ${TEST_USER.role}`);
  console.log('');

  // 1. Create the auth user via Supabase Admin API
  //    (Prisma cannot write to auth.users — passwords require Supabase's bcrypt hashing)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: TEST_USER.email,
    password: TEST_USER.password,
    email_confirm: true,   // skip confirmation email
  });

  let userId: string;

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log('⚠️   Auth user already exists — looking up ID...');
      // getUserByEmail doesn't exist — use listUsers and filter by email
      const { data: list, error: listError } = await supabase.auth.admin.listUsers();
      if (listError || !list) {
        console.error('❌  Failed to list users:', listError?.message);
        process.exit(1);
      }
      const found = list.users.find((u) => u.email === TEST_USER.email);
      if (!found) {
        console.error('❌  Could not find existing user by email.');
        process.exit(1);
      }
      userId = found.id;
      console.log('✅  Found existing user:', userId);
    } else {
      console.error('❌  Failed to create auth user:', authError.message);
      process.exit(1);
    }
  } else {
    userId = authData.user.id;
    console.log('✅  Auth user created:', userId);
  }

  // 2. Upsert the profile row via Prisma
  await prisma.profiles.upsert({
    where: { id: userId },
    update: {
      full_name: TEST_USER.full_name,
      role: TEST_USER.role,
    },
    create: {
      id: userId,
      full_name: TEST_USER.full_name,
      role: TEST_USER.role,
    },
  });

  console.log('✅  Profile row upserted via Prisma.');
  console.log('');
  console.log('─────────────────────────────────');
  console.log('  Login credentials:');
  console.log(`  Email    : ${TEST_USER.email}`);
  console.log(`  Password : ${TEST_USER.password}`);
  console.log('─────────────────────────────────');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌  Unexpected error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
