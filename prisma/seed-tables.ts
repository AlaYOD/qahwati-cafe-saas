/**
 * seed-tables.ts
 * Creates 20 cafe tables across indoor, outdoor, and terrace zones.
 *
 * Run: npm run seed:tables
 *
 * ┌──────────────────────────────────────────────────┐
 * │  Zone     │ Tables          │ Capacity            │
 * ├──────────────────────────────────────────────────┤
 * │  indoor   │ T-01 → T-10     │ 2 or 4              │
 * │  outdoor  │ T-11 → T-16     │ 2 or 4              │
 * │  terrace  │ T-17 → T-20     │ 4 or 6              │
 * └──────────────────────────────────────────────────┘
 */

import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { v4 as uuidv4 } from 'uuid';

const CONNECTION_STRING = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;

if (!CONNECTION_STRING) {
  console.error('');
  console.error('❌  Missing environment variable: DIRECT_URL or DATABASE_URL');
  console.error('');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: CONNECTION_STRING });
const prisma = new PrismaClient({ adapter });

// ── Table definitions ───────────────────────────────────────────────────────
const TABLES = [
  // Indoor — small (2-top)
  { name: 'T-01', capacity: 2, zone: 'indoor',  status: 'available' },
  { name: 'T-02', capacity: 2, zone: 'indoor',  status: 'available' },
  { name: 'T-03', capacity: 2, zone: 'indoor',  status: 'occupied'  },
  { name: 'T-04', capacity: 2, zone: 'indoor',  status: 'available' },
  { name: 'T-05', capacity: 4, zone: 'indoor',  status: 'available' },
  { name: 'T-06', capacity: 4, zone: 'indoor',  status: 'occupied'  },
  { name: 'T-07', capacity: 4, zone: 'indoor',  status: 'available' },
  { name: 'T-08', capacity: 4, zone: 'indoor',  status: 'reserved'  },
  { name: 'T-09', capacity: 2, zone: 'indoor',  status: 'available' },
  { name: 'T-10', capacity: 4, zone: 'indoor',  status: 'available' },
  // Outdoor — medium
  { name: 'T-11', capacity: 2, zone: 'outdoor', status: 'available' },
  { name: 'T-12', capacity: 2, zone: 'outdoor', status: 'occupied'  },
  { name: 'T-13', capacity: 4, zone: 'outdoor', status: 'available' },
  { name: 'T-14', capacity: 4, zone: 'outdoor', status: 'available' },
  { name: 'T-15', capacity: 2, zone: 'outdoor', status: 'reserved'  },
  { name: 'T-16', capacity: 4, zone: 'outdoor', status: 'available' },
  // Terrace — large
  { name: 'T-17', capacity: 6, zone: 'terrace', status: 'available' },
  { name: 'T-18', capacity: 6, zone: 'terrace', status: 'available' },
  { name: 'T-19', capacity: 4, zone: 'terrace', status: 'occupied'  },
  { name: 'T-20', capacity: 6, zone: 'terrace', status: 'available' },
];

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('🪑  Seeding 20 cafe tables...');
  console.log('─'.repeat(50));

  let created = 0;
  let skipped = 0;

  for (const table of TABLES) {
    const existing = await prisma.tables.findFirst({ where: { name: table.name } });

    if (existing) {
      console.log(`  ⚠️  ${table.name} already exists — skipped`);
      skipped++;
    } else {
      await prisma.tables.create({
        data: { id: uuidv4(), ...table },
      });
      console.log(`  ✅  ${table.name.padEnd(5)} | zone: ${table.zone.padEnd(8)} | capacity: ${table.capacity} | status: ${table.status}`);
      created++;
    }
  }

  console.log('─'.repeat(50));
  console.log(`  Created : ${created}`);
  console.log(`  Skipped : ${skipped}`);
  console.log(`  Total   : ${TABLES.length}`);
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
