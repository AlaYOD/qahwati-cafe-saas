import { PrismaClient } from '../src/generated/prisma';
import crypto from 'node:crypto'; // Use node crypto for randomUUID in script

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Categories
  const categories = [
    { name: 'Hot Coffee', type: 'menu' },
    { name: 'Cold Coffee', type: 'menu' },
    { name: 'Pastries', type: 'menu' },
    { name: 'Sandwiches', type: 'menu' },
    { name: 'Coffee Beans', type: 'inventory' },
    { name: 'Dairy', type: 'inventory' },
  ];

  for (const cat of categories) {
    await prisma.categories.upsert({
      where: { id: crypto.randomUUID() }, // This is just a placeholder, in a real seed we'd use a unique constraint
      update: {},
      create: cat,
    });
  }

  // To make it better, let's fetch the created categories to link items
  const allCats = await prisma.categories.findMany();
  const getCatId = (name: string) => allCats.find((c: { name: string; id: string }) => c.name === name)?.id;

  // 2. Menu Items
  const menuItems = [
    { name: 'Spanish Latte', description: 'Signature sweet latte', price: 18.00, category_id: getCatId('Hot Coffee'), is_available: true, image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Cortado', description: 'Equal parts espresso and warm milk', price: 14.00, category_id: getCatId('Hot Coffee'), is_available: true, image_url: 'https://images.unsplash.com/photo-1510707577719-af7c183a14df?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Iced Spanish Latte', description: 'Chilled signature sweet latte', price: 20.00, category_id: getCatId('Cold Coffee'), is_available: true, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Butter Croissant', description: 'Flaky French pastry', price: 12.00, category_id: getCatId('Pastries'), is_available: true, image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2000&auto=format&fit=crop' },
  ];

  for (const item of menuItems) {
    if (item.category_id) {
       // Since id is random/v4, we just create for testing if not existing by name
       const existing = await prisma.menu_items.findFirst({ where: { name: item.name }});
       if (!existing) {
         await prisma.menu_items.create({ data: item });
       } else {
         // Update existing items to include images if they were missing
         await prisma.menu_items.update({
           where: { id: existing.id },
           data: { image_url: item.image_url }
         });
       }
    }
  }

  // 3. Tables
  const tables = [
    { name: 'T-01', capacity: 2, status: 'available', zone: 'indoor' },
    { name: 'T-02', capacity: 2, status: 'available', zone: 'indoor' },
    { name: 'T-03', capacity: 4, status: 'available', zone: 'indoor' },
    { name: 'T-04', capacity: 4, status: 'occupied', zone: 'indoor' },
    { name: 'T-05', capacity: 2, status: 'available', zone: 'outdoor' },
  ];

  for (const table of tables) {
    const existing = await prisma.tables.findFirst({ where: { name: table.name }});
    if (!existing) {
      await prisma.tables.create({ data: table });
    }
  }

  // 4. Inventory
  const inventory = [
    { name: 'Ethiopian Yirgacheffe', category: 'Coffee Beans', unit: 'kg', quantity: 15.5, min_level: 5.0, cost_per_unit: 85.00 },
    { name: 'Full Fat Milk', category: 'Dairy', unit: 'Litre', quantity: 48, min_level: 12, cost_per_unit: 5.50 },
  ];

  for (const inv of inventory) {
    const existing = await prisma.inventory_items.findFirst({ where: { name: inv.name }});
    if (!existing) {
      await prisma.inventory_items.create({ data: inv });
    }
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
