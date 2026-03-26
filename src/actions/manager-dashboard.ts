"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";

export async function getManagerDashboardData() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    // All cashier profiles
    cashiers,
    // All shifts (recent 50)
    shifts,
    // Today's orders
    todayOrders,
    // This week's orders
    weekOrders,
    // This month's orders
    monthOrders,
    // All transactions today
    todayTransactions,
  ] = await Promise.all([
    prisma.profiles.findMany({
      where: { role: "cashier" },
      orderBy: { created_at: "desc" },
    }),
    prisma.shifts.findMany({
      orderBy: { start_time: "desc" },
      take: 50,
      include: {
        profile: { select: { id: true, full_name: true, role: true } },
        transactions: { orderBy: { created_at: "desc" } },
      },
    }),
    prisma.orders.findMany({
      where: { created_at: { gte: startOfDay } },
      include: {
        profile: { select: { id: true, full_name: true } },
        order_items: { include: { menu_item: true } },
        table: true,
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.orders.findMany({
      where: { created_at: { gte: startOfWeek }, status: "completed" },
      select: { total_amount: true, created_at: true, payment_method: true },
    }),
    prisma.orders.findMany({
      where: { created_at: { gte: startOfMonth }, status: "completed" },
      select: { total_amount: true, created_at: true },
    }),
    prisma.transactions.findMany({
      where: { created_at: { gte: startOfDay } },
      include: {
        shift: {
          include: { profile: { select: { id: true, full_name: true } } },
        },
      },
      orderBy: { created_at: "desc" },
    }),
  ]);

  // --- Compute stats ---

  // Today's revenue
  const todayCompleted = todayOrders.filter((o) => o.status === "completed");
  const todayRevenue = todayCompleted.reduce((s, o) => s + Number(o.total_amount), 0);
  const todayOrderCount = todayOrders.length;
  const todayPending = todayOrders.filter((o) => o.status === "pending").length;
  const todayCancelled = todayOrders.filter((o) => o.status === "cancelled").length;

  // Week revenue
  const weekRevenue = weekOrders.reduce((s, o) => s + Number(o.total_amount), 0);

  // Month revenue
  const monthRevenue = monthOrders.reduce((s, o) => s + Number(o.total_amount), 0);

  // Payment method breakdown (today)
  const paymentBreakdown = {
    cash: 0,
    card: 0,
    wallet: 0,
  };
  todayCompleted.forEach((o) => {
    const method = o.payment_method as string;
    if (method === "cash") paymentBreakdown.cash += Number(o.total_amount);
    else if (method === "card") paymentBreakdown.card += Number(o.total_amount);
    else if (method === "wallet") paymentBreakdown.wallet += Number(o.total_amount);
  });

  // Active shift(s)
  const activeShifts = shifts.filter((s) => s.status === "open");
  const closedShiftsToday = shifts.filter(
    (s) => s.status === "closed" && s.end_time && new Date(s.end_time) >= startOfDay
  );

  // Cash drawer status per active shift
  const cashDrawers = activeShifts.map((shift) => {
    const cashSales = shift.transactions
      .filter((t) => t.type === "sale_cash")
      .reduce((s, t) => s + Number(t.amount), 0);
    const cardSales = shift.transactions
      .filter((t) => t.type === "sale_card")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expenses = shift.transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
    const cashOuts = shift.transactions
      .filter((t) => t.type === "cash_out")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expectedCash = Number(shift.opening_balance) + cashSales - expenses - cashOuts;

    return {
      shiftId: shift.id,
      cashierName: shift.profile?.full_name || "Unknown",
      cashierId: shift.profile?.id || null,
      openingBalance: Number(shift.opening_balance),
      cashSales,
      cardSales,
      expenses,
      cashOuts,
      expectedCash,
      startTime: shift.start_time,
      transactionCount: shift.transactions.length,
    };
  });

  // Shortage history (closed shifts with discrepancy)
  const shortageHistory = shifts
    .filter((s) => s.status === "closed" && s.actual_balance !== null)
    .map((s) => {
      const variance = Number(s.actual_balance) - Number(s.expected_balance);
      return {
        shiftId: s.id,
        cashierName: s.profile?.full_name || "Unknown",
        cashierId: s.profile?.id || null,
        startTime: s.start_time,
        endTime: s.end_time,
        openingBalance: Number(s.opening_balance),
        expectedBalance: Number(s.expected_balance),
        actualBalance: Number(s.actual_balance),
        variance,
        status: Math.abs(variance) < 0.01 ? "balanced" : variance > 0 ? "overage" : "shortage",
      };
    })
    .slice(0, 20);

  // Cashier performance (orders by cashier today)
  const cashierPerformance = cashiers.map((c) => {
    const cashierOrders = todayOrders.filter((o) => o.user_id === c.id);
    const completed = cashierOrders.filter((o) => o.status === "completed");
    const revenue = completed.reduce((s, o) => s + Number(o.total_amount), 0);
    const activeShift = activeShifts.find((s) => s.profile?.id === c.id);

    return {
      id: c.id,
      name: c.full_name || "Unknown",
      totalOrders: cashierOrders.length,
      completedOrders: completed.length,
      cancelledOrders: cashierOrders.filter((o) => o.status === "cancelled").length,
      revenue,
      avgOrderValue: completed.length > 0 ? revenue / completed.length : 0,
      isActive: !!activeShift,
      shiftStart: activeShift?.start_time || null,
    };
  });

  // Hourly sales distribution (today)
  const hourlySales: { hour: number; revenue: number; orders: number }[] = [];
  for (let h = 0; h < 24; h++) {
    const hourOrders = todayCompleted.filter((o) => {
      const d = new Date(o.created_at!);
      return d.getHours() === h;
    });
    if (hourOrders.length > 0 || h <= now.getHours()) {
      hourlySales.push({
        hour: h,
        revenue: hourOrders.reduce((s, o) => s + Number(o.total_amount), 0),
        orders: hourOrders.length,
      });
    }
  }

  return serializePrisma({
    // Summary stats
    todayRevenue,
    weekRevenue,
    monthRevenue,
    todayOrderCount,
    todayPending,
    todayCancelled,
    todayCompletedCount: todayCompleted.length,

    // Payment breakdown
    paymentBreakdown,

    // Cashier data
    cashierPerformance,
    cashDrawers,
    activeShiftCount: activeShifts.length,
    closedShiftsTodayCount: closedShiftsToday.length,

    // Shortage/reconciliation
    shortageHistory,

    // Orders feed
    recentOrders: todayOrders.slice(0, 15),

    // Transactions
    recentTransactions: todayTransactions.slice(0, 20),

    // Hourly data
    hourlySales,
  });
}
