/**
 * seed-roles.ts
 * Creates one test user per role in Supabase Auth + matching profile rows via Prisma.
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Run:      npm run seed:roles
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Role      │ Email                    │ Password               │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  admin     │ admin@qahwati.com        │ Qahwati@Admin1         │
 * │  manager   │ manager@qahwati.com      │ Qahwati@Manager1       │
 * │  cashier   │ cashier@qahwati.com      │ Qahwati@Cashier1       │
 * │  barista   │ barista@qahwati.com      │ Qahwati@Barista1       │
 * │  waiter    │ waiter@qahwati.com       │ Qahwati@Waiter1        │
 * └─────────────────────────────────────────────────────────────────┘
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

// ── Env ────────────────────────────────────────────────────────────────────
const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CONNECTION_STRING = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !CONNECTION_STRING) {
  console.error('');
  console.error('❌  Missing environment variables. Make sure .env.local has:');
  console.error('      NEXT_PUBLIC_SUPABASE_URL');
  console.error('      SUPABASE_SERVICE_ROLE_KEY');
  console.error('      DIRECT_URL  (or DATABASE_URL)');
  console.error('');
  process.exit(1);
}

// ── Clients ────────────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const adapter = new PrismaPg({ connectionString: CONNECTION_STRING });
const prisma  = new PrismaClient({ adapter });

// ── Seed data ──────────────────────────────────────────────────────────────
const USERS = [
  { email: 'admin@qahwati.com',   password: 'Qahwati@Admin1',   full_name: 'Admin User',      role: 'admin'   },
  { email: 'manager@qahwati.com', password: 'Qahwati@Manager1', full_name: 'Sara Al-Manager', role: 'manager' },
  { email: 'cashier@qahwati.com', password: 'Qahwati@Cashier1', full_name: 'Khaled Cashier',  role: 'cashier' },
  { email: 'barista@qahwati.com', password: 'Qahwati@Barista1', full_name: 'Layla Barista',   role: 'barista' },
  { email: 'waiter@qahwati.com',  password: 'Qahwati@Waiter1',  full_name: 'Omar Waiter',     role: 'waiter'  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
async function resolveAuthId(email: string, password: string): Promise<string> {
  // 1. Try to create the user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (!error) return data.user.id;

  // 2. If user exists, find them and UPDATE their password to match this seeder
  if (error.message.toLowerCase().includes('already been registered') ||
      error.message.toLowerCase().includes('already exists')) {
    
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (listErr || !list) throw new Error(`Cannot list users: ${listErr?.message}`);
    
    const found = list.users.find((u) => u.email === email);
    if (!found) throw new Error(`Auth user exists for ${email} but could not be found in list`);

    // Force update the password for the existing user
    const { error: updateError } = await supabase.auth.admin.updateUserById(found.id, {
      password: password
    });

    if (updateError) throw new Error(`Failed to update password for ${email}: ${updateError.message}`);

    return found.id;
  }

  throw new Error(`Auth error for ${email}: ${error.message}`);
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('🌱  Seeding role users for Qahwati Cafe SaaS');
  console.log('─'.repeat(60));

  const results: { role: string; email: string; password: string; status: string }[] = [];

  for (const user of USERS) {
    process.stdout.write(`  → [${user.role.padEnd(7)}] ${user.email} ... `);

    try {
      // 1. Auth user
      const userId = await resolveAuthId(user.email, user.password);

      // 2. Profile row
      await prisma.profiles.upsert({
        where:  { id: userId },
        update: { full_name: user.full_name, role: user.role },
        create: { id: userId, full_name: user.full_name, role: user.role },
      });

      console.log('✅');
      results.push({ role: user.role, email: user.email, password: user.password, status: 'ok' });

    } catch (err: any) {
      console.log(`❌  ${err.message}`);
      results.push({ role: user.role, email: user.email, password: user.password, status: 'error' });
    }
  }

  // ── Summary table ─────────────────────────────────────────────────────
  console.log('');
  console.log('─'.repeat(60));
  console.log('  Login Credentials');
  console.log('─'.repeat(60));
  console.log(`  ${'Role'.padEnd(9)} ${'Email'.padEnd(28)} Password`);
  console.log('─'.repeat(60));
  for (const r of results) {
    const icon = r.status === 'ok' ? '✅' : '❌';
    console.log(`  ${icon} ${r.role.padEnd(7)} ${r.email.padEnd(28)} ${r.password}`);
  }
  console.log('─'.repeat(60));
  console.log('');
  console.log('  Each user is routed to their role dashboard on login:');
  console.log('    admin   → /admin/dashboard');
  console.log('    manager → /manager/inventory');
  console.log('    cashier → /cashier/pos');
  console.log('    barista → /barista/orders');
  console.log('    waiter  → /waiter/tables');
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
