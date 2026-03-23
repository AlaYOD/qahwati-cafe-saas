"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";

export async function getDashboardData() {
  const [
    totalOrdersCount,
    allOrders,
    allTables,
    recentOrders,
    orderItemsData
  ] = await Promise.all([
    prisma.orders.count(), // Total generic orders
    prisma.orders.findMany({
      where: { status: 'completed' },
      select: { total_amount: true, created_at: true }
    }), // Completed sales
    prisma.tables.findMany(),
    // Recent 5 orders for table feed
    prisma.orders.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        order_items: { include: { menu_item: true } }
      }
    }),
    // Order items grouped to figure out top products
    prisma.order_items.findMany({
      include: { 
        menu_item: { include: { category: true } }, 
        order: { select: { status: true } } 
      }
    })
  ]);

  // Aggregate Total Sales
  const totalSales = allOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);

  // Aggregate Tables
  const occupiedTablesCount = allTables.filter(t => t.status === 'occupied').length;
  const totalTablesCount = allTables.length;

  // Aggregate Top Products
  const productSalesMap: Record<string, { id: string, name: string, sold: number, revenue: number, icon: string }> = {};
  const categorySalesMap: Record<string, { id: string, name: string, count: number }> = {};
  
  orderItemsData.forEach(item => {
    if (item.order?.status !== 'completed') return; // only count completed ones 
    if (!item.menu_item_id || !item.menu_item) return;

    // Top Products
    if (!productSalesMap[item.menu_item_id]) {
      productSalesMap[item.menu_item_id] = {
        id: item.menu_item_id,
        name: item.menu_item.name,
        sold: 0,
        revenue: 0,
        icon: item.menu_item.category?.name.toLowerCase().includes('coffee') ? 'coffee' : 'local_cafe'
      };
    }
    const qty = item.quantity || 1;
    productSalesMap[item.menu_item_id].sold += qty;
    productSalesMap[item.menu_item_id].revenue += Number(item.unit_price) * qty;

    // Sales by Category
    const catId = item.menu_item.category_id;
    const catName = item.menu_item.category?.name || 'Other';
    if (!categorySalesMap[catId!]) {
      categorySalesMap[catId!] = { id: catId!, name: catName, count: 0 };
    }
    categorySalesMap[catId!].count += qty;
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.sold - a.sold).slice(0, 4);
  const salesByCategory = Object.values(categorySalesMap).sort((a, b) => b.count - a.count);

  return serializePrisma({
    totalSales,
    totalOrdersCount,
    occupiedTablesCount,
    totalTablesCount,
    topProducts,
    salesByCategory,
    recentOrders
  });
}
