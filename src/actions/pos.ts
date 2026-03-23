"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";

export async function getPosData() {
  const categories = await prisma.categories.findMany({
    where: { type: 'menu' }
  });

  const menuItems = await prisma.menu_items.findMany({
    where: { is_available: true },
    include: { category: true }
  });

  const tables = await prisma.tables.findMany();

  return serializePrisma({ categories, menuItems, tables });
}
