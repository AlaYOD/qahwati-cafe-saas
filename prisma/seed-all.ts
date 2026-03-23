import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { v4 as uuidv4 } from 'uuid'

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Clearing existing data...')
  // Clear relational data first to avoid FK constraint fails
  await prisma.order_items.deleteMany()
  await prisma.transactions.deleteMany()
  await prisma.orders.deleteMany()
  await prisma.shifts.deleteMany()
  await prisma.menu_items.deleteMany()
  await prisma.categories.deleteMany()
  await prisma.tables.deleteMany()
  await prisma.inventory_items.deleteMany()
  // Note: we do not delete profiles to avoid breaking the real admin auth user

  console.log('Seeding Staff Profiles...')
  const staff1 = await prisma.profiles.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: { id: '00000000-0000-0000-0000-000000000001', full_name: 'Alice Manager', role: 'manager' }
  })
  const staff2 = await prisma.profiles.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: { id: '00000000-0000-0000-0000-000000000002', full_name: 'Bob Cashier', role: 'cashier' }
  })
  const staff3 = await prisma.profiles.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: { id: '00000000-0000-0000-0000-000000000003', full_name: 'Charlie Barista', role: 'barista' }
  })

  console.log('Seeding Categories...')
  const catHot = await prisma.categories.create({ data: { id: uuidv4(), name: 'Hot Drinks', type: 'menu' } })
  const catCold = await prisma.categories.create({ data: { id: uuidv4(), name: 'Cold Drinks', type: 'menu' } })
  const catPastries = await prisma.categories.create({ data: { id: uuidv4(), name: 'Pastries', type: 'menu' } })
  const catHookah = await prisma.categories.create({ data: { id: uuidv4(), name: 'Hookah', type: 'menu' } })
  const catBreakfast = await prisma.categories.create({ data: { id: uuidv4(), name: 'Breakfast', type: 'menu' } })

  console.log('Seeding Menu Items...')
  const doubleEspresso = await prisma.menu_items.create({
    data: { category_id: catHot.id, name: 'Double Espresso', price: 3.50, image_url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=2000&auto=format&fit=crop', is_available: true }
  })
  const spanishLatte = await prisma.menu_items.create({
    data: { category_id: catCold.id, name: 'Spanish Iced Latte', price: 5.25, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2000&auto=format&fit=crop', is_available: true }
  })
  const croissant = await prisma.menu_items.create({
    data: { category_id: catPastries.id, name: 'Butter Croissant', price: 2.75, image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2000&auto=format&fit=crop', is_available: true }
  })

  console.log('Seeding Inventory Items...')
  await prisma.inventory_items.createMany({
    data: [
      { id: uuidv4(), name: 'Harari Coffee Beans (Premium)', category: 'Coffee', unit: 'kg', quantity: 50, min_level: 10, cost_per_unit: 45.00 },
      { id: uuidv4(), name: 'Paper Cups 8oz', category: 'Packaging', unit: 'pcs', quantity: 1200, min_level: 500, cost_per_unit: 0.35 },
      { id: uuidv4(), name: 'Whole Milk', category: 'Dairy', unit: 'Liter', quantity: 15, min_level: 20, cost_per_unit: 3.50 }
    ]
  })

  console.log('Seeding Tables...')
  const table1 = await prisma.tables.create({ data: { id: uuidv4(), name: 'Table 1', capacity: 2, zone: 'indoor', status: 'occupied' } })
  const table2 = await prisma.tables.create({ data: { id: uuidv4(), name: 'Table 2', capacity: 4, zone: 'indoor', status: 'available' } })

  console.log('Seeding Orders & Order Items...')
  
  // Date generators for past orders
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // Order 1: Current Pending (Table 1, Bob Cashier)
  const order1 = await prisma.orders.create({
    data: { id: uuidv4(), table_id: table1.id, user_id: staff2.id, status: 'pending', payment_method: 'card', total_amount: 11.50, created_at: now }
  })
  await prisma.order_items.createMany({
    data: [
      { id: uuidv4(), order_id: order1.id, menu_item_id: doubleEspresso.id, quantity: 1, unit_price: 3.50 },
      { id: uuidv4(), order_id: order1.id, menu_item_id: spanishLatte.id, quantity: 1, unit_price: 5.25 },
      { id: uuidv4(), order_id: order1.id, menu_item_id: croissant.id, quantity: 1, unit_price: 2.75 }
    ]
  })

  // Order 2: Completed (Table 2, Bob)
  const order2 = await prisma.orders.create({
    data: { id: uuidv4(), table_id: table2.id, user_id: staff2.id, status: 'completed', payment_method: 'cash', total_amount: 3.50, created_at: now }
  })
  await prisma.order_items.create({
    data: { id: uuidv4(), order_id: order2.id, menu_item_id: doubleEspresso.id, quantity: 1, unit_price: 3.50 }
  })

  // Order 3: Pending Takeaway (No table, Alice Manager)
  const order3 = await prisma.orders.create({
    data: { id: uuidv4(), user_id: staff1.id, status: 'pending', payment_method: 'card', total_amount: 10.50, created_at: now }
  })
  await prisma.order_items.createMany({
    data: [
      { id: uuidv4(), order_id: order3.id, menu_item_id: spanishLatte.id, quantity: 2, unit_price: 5.25 }
    ]
  })

  // Order 4: Cancelled (Yesterday, Charlie Barista)
  const order4 = await prisma.orders.create({
    data: { id: uuidv4(), table_id: table1.id, user_id: staff3.id, status: 'cancelled', payment_method: 'cash', total_amount: 2.75, created_at: yesterday }
  })
  await prisma.order_items.create({
    data: { id: uuidv4(), order_id: order4.id, menu_item_id: croissant.id, quantity: 1, unit_price: 2.75 }
  })

  // Order 5: Large Completed Order (Yesterday)
  const order5 = await prisma.orders.create({
    data: { id: uuidv4(), table_id: table2.id, user_id: staff2.id, status: 'completed', payment_method: 'card', total_amount: 21.00, created_at: yesterday }
  })
  await prisma.order_items.createMany({
    data: [
      { id: uuidv4(), order_id: order5.id, menu_item_id: spanishLatte.id, quantity: 4, unit_price: 5.25 }
    ]
  })

  // Order 6: Completed Hookah (Yesterday, Charlie)
  const order6 = await prisma.orders.create({
    data: { id: uuidv4(), user_id: staff3.id, status: 'completed', payment_method: 'cash', total_amount: 21.50, created_at: yesterday }
  })
  // Assuming 18.00 Hookah + 3.50 Espresso (Note we don't have the hookah id variable handy, let's just use espresso/latte to avoid lookup failure)
  await prisma.order_items.createMany({
    data: [
      { id: uuidv4(), order_id: order6.id, menu_item_id: doubleEspresso.id, quantity: 3, unit_price: 3.50 },
      { id: uuidv4(), order_id: order6.id, menu_item_id: croissant.id, quantity: 4, unit_price: 2.75 }
    ]
  })

  // Order 7: Pending large order
  const order7 = await prisma.orders.create({
    data: { id: uuidv4(), table_id: table2.id, user_id: staff2.id, status: 'pending', payment_method: 'card', total_amount: 16.00, created_at: now }
  })
  await prisma.order_items.createMany({
    data: [
      { id: uuidv4(), order_id: order7.id, menu_item_id: doubleEspresso.id, quantity: 2, unit_price: 3.50 },
      { id: uuidv4(), order_id: order7.id, menu_item_id: spanishLatte.id, quantity: 1, unit_price: 5.25 },
      { id: uuidv4(), order_id: order7.id, menu_item_id: croissant.id, quantity: 1, unit_price: 2.75 },
      { id: uuidv4(), order_id: order7.id, menu_item_id: doubleEspresso.id, quantity: 1, unit_price: 1.00 } // modifier maybe?
    ]
  })
  
  // Order 8: Two Days Ago, Completed
  const order8 = await prisma.orders.create({
    data: { id: uuidv4(), user_id: staff1.id, status: 'completed', payment_method: 'card', total_amount: 5.25, created_at: twoDaysAgo }
  })
  await prisma.order_items.create({
    data: { id: uuidv4(), order_id: order8.id, menu_item_id: spanishLatte.id, quantity: 1, unit_price: 5.25 }
  })

  console.log('Seeding More Menu Items...')
  const menuData = [
    { category_id: catHot.id, name: 'Americano', price: 12.00, image_url: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=2000&auto=format&fit=crop' },
    { category_id: catHot.id, name: 'Cappuccino', price: 16.00, image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=2000&auto=format&fit=crop' },
    { category_id: catHot.id, name: 'Flat White', price: 15.00, image_url: 'https://images.unsplash.com/photo-1570968015849-df41ffcad63c?q=80&w=2000&auto=format&fit=crop' },
    { category_id: catCold.id, name: 'Iced Americano', price: 14.00, image_url: 'https://images.unsplash.com/photo-1517701604599-bb28158c0f4e?q=80&w=2000&auto=format&fit=crop' },
    { category_id: catPastries.id, name: 'Chocolate Muffin', price: 10.00, image_url: 'https://images.unsplash.com/photo-1607958996333-cd1a2adbee5a?q=80&w=2000&auto=format&fit=crop' },
    { category_id: catPastries.id, name: 'Cheese Croissant', price: 14.00, image_url: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=2000&auto=format&fit=crop' },
    { category_id: catBreakfast.id, name: 'Turkey Sandwich', price: 22.00, image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?q=80&w=2000&auto=format&fit=crop' },
    { category_id: catBreakfast.id, name: 'Caesar Salad', price: 25.00, image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=2000&auto=format&fit=crop' },
  ]
  const createdMenuItems = []
  for (const m of menuData) {
    const item = await prisma.menu_items.create({ data: { ...m, id: uuidv4(), is_available: true } })
    createdMenuItems.push(item)
  }
  // Add base items to the list for random selection
  createdMenuItems.push(doubleEspresso, spanishLatte, croissant)

  console.log('Seeding Bulk Order Items (30+ items across 10 random orders)...')
  const staffIds = [staff1.id, staff2.id, staff3.id]
  const tableIds = [table1.id, table2.id, null]
  const statuses = ['completed', 'pending', 'completed', 'completed', 'cancelled']
  const paymentMethods = ['cash', 'card']

  for (let i = 0; i < 10; i++) {
    const orderDate = new Date(now.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000) // Within last 5 days
    const orderStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const orderItemsCount = 2 + Math.floor(Math.random() * 4) // 2 to 5 items per order
    
    // Create Order
    const order = await prisma.orders.create({
      data: {
        id: uuidv4(),
        table_id: tableIds[Math.floor(Math.random() * tableIds.length)],
        user_id: staffIds[Math.floor(Math.random() * staffIds.length)],
        status: orderStatus,
        payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        total_amount: 0, // Will update after items
        created_at: orderDate
      }
    })

    let total = 0
    const orderItemData = []
    for (let j = 0; j < orderItemsCount; j++) {
      const menuItem = createdMenuItems[Math.floor(Math.random() * createdMenuItems.length)]
      const qty = 1 + Math.floor(Math.random() * 2)
      const price = Number(menuItem.price)
      total += price * qty
      
      orderItemData.push({
        id: uuidv4(),
        order_id: order.id,
        menu_item_id: menuItem.id,
        quantity: qty,
        unit_price: price
      })
    }
    
    await prisma.order_items.createMany({ data: orderItemData })
    await prisma.orders.update({
      where: { id: order.id },
      data: { total_amount: total }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
