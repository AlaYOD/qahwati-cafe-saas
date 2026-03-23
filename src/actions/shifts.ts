"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";

export async function getActiveShift() {
  const shift = await prisma.shifts.findFirst({
    where: { status: "open" },
    orderBy: { start_time: "desc" },
    include: {
      profile: { select: { full_name: true } },
      transactions: { orderBy: { created_at: "desc" } },
    },
  });
  return serializePrisma(shift);
}

export async function getShiftsHistory() {
  const shifts = await prisma.shifts.findMany({
    orderBy: { start_time: "desc" },
    take: 20,
    include: {
      profile: { select: { full_name: true } },
      transactions: true,
    },
  });
  return serializePrisma(shifts);
}

export async function openShift(userId: string, openingBalance: number) {
  try {
    const existingOpen = await prisma.shifts.findFirst({ where: { status: "open" } });
    if (existingOpen) {
      return { success: false, error: "A shift is already open. Close it first." };
    }

    const shift = await prisma.shifts.create({
      data: {
        user_id: userId,
        opening_balance: openingBalance,
        expected_balance: openingBalance,
        status: "open",
      },
    });

    await prisma.transactions.create({
      data: {
        shift_id: shift.id,
        amount: openingBalance,
        type: "opening",
        description: "Shift opened",
      },
    });

    return { success: true, shift: serializePrisma(shift) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function closeShift(shiftId: string, actualBalance: number) {
  try {
    const shift = await prisma.shifts.findUnique({
      where: { id: shiftId },
      include: { transactions: true },
    });
    if (!shift) return { success: false, error: "Shift not found." };

    const salesTotal = shift.transactions
      .filter((t) => t.type === "sale_cash" || t.type === "sale_card")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expectedBalance = Number(shift.opening_balance) + salesTotal;

    await prisma.shifts.update({
      where: { id: shiftId },
      data: {
        status: "closed",
        end_time: new Date(),
        actual_balance: actualBalance,
        expected_balance: expectedBalance,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addTransaction(shiftId: string, amount: number, type: string, description?: string) {
  try {
    const tx = await prisma.transactions.create({
      data: { shift_id: shiftId, amount, type, description: description || null },
    });
    return { success: true, transaction: serializePrisma(tx) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
