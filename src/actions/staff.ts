"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";
import { v4 as uuidv4 } from 'uuid'

export async function getAdminStaffData() {
  const staff = await prisma.profiles.findMany({
    orderBy: { created_at: 'desc' }
  });

  return serializePrisma(staff);
}

export async function createStaffProfile(data: { full_name: string, role: string }) {
  try {
    const newStaff = await prisma.profiles.create({
      data: {
        id: uuidv4(),
        full_name: data.full_name,
        role: data.role
      }
    });
    return { success: true, staff: serializePrisma(newStaff) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
