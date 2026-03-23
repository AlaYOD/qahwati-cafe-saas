"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";
import { v4 as uuidv4 } from 'uuid'

export async function getAdminMenuData() {
  const categories = await prisma.categories.findMany({
    where: { type: 'menu' },
    orderBy: { name: 'asc' }
  });

  const menuItems = await prisma.menu_items.findMany({
    include: {
      category: true
    },
    orderBy: { name: 'asc' }
  });

  return serializePrisma({ categories, menuItems });
}

export async function createCategory(name: string) {
  try {
    const newCategory = await prisma.categories.create({
      data: {
        id: uuidv4(),
        name,
        type: 'menu'
      }
    });
    return { success: true, category: serializePrisma(newCategory) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createMenuItem(data: { name: string, category_id: string, price: number, image_url: string }) {
  try {
    const newItem = await prisma.menu_items.create({
      data: {
        id: uuidv4(),
        name: data.name,
        category_id: data.category_id,
        price: data.price,
        image_url: data.image_url,
        is_available: true
      }
    });
    return { success: true, item: serializePrisma(newItem) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
