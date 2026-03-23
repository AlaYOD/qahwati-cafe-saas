"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";

export async function getInventoryData() {
  const items = await prisma.inventory_items.findMany({
    orderBy: { category: 'asc' }
  });

  return serializePrisma(items);
}

export async function updateStockQuantity(id: string, quantity: number) {
  try {
    const updated = await prisma.inventory_items.update({
      where: { id },
      data: { quantity, updated_at: new Date() },
    });
    return { success: true, item: serializePrisma(updated) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
