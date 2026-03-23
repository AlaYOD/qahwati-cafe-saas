"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";

export async function getAdminTablesData() {
  const tables = await prisma.tables.findMany({
    orderBy: { name: 'asc' },
    include: {
      orders: {
        where: { status: 'pending' },
        include: {
          order_items: {
            include: {
              menu_item: true
            }
          }
        }
      }
    }
  });

  return serializePrisma(tables);
}

import { v4 as uuidv4 } from 'uuid'

export async function createTable(data: { name: string, capacity: number, zone: string }) {
  try {
    const newTable = await prisma.tables.create({
      data: {
        id: uuidv4(),
        name: data.name,
        capacity: data.capacity,
        zone: data.zone,
        status: 'available'
      }
    });
    return { success: true, table: serializePrisma(newTable) };
  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, error: 'A table with this name already exists.' };
    return { success: false, error: error.message };
  }
}

