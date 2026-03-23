"use server";

import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";

export async function getAdminOrdersData() {
  const orders = await prisma.orders.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      table: true,
      profile: true,
      order_items: {
        include: {
          menu_item: true
        }
      }
    }
  });

  return serializePrisma(orders);
}

export async function updateOrderStatus(orderId: string, status: string, payment_method?: string) {
  try {
    const dataPayload: any = { status };
    if (payment_method) {
      dataPayload.payment_method = payment_method;
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.orders.update({
        where: { id: orderId },
        data: dataPayload
      });

      if ((status === 'completed' || status === 'cancelled') && updatedOrder.table_id) {
        await tx.tables.update({
          where: { id: updatedOrder.table_id },
          data: { 
            status: 'available',
            current_order_id: null 
          }
        });

        // Accounting Functionality: Create Transaction
        if (status === 'completed') {
           // Find latest open shift for the user or any open shift
           const activeShift = await tx.shifts.findFirst({
             where: { status: 'open' },
             orderBy: { start_time: 'desc' }
           });

           await tx.transactions.create({
             data: {
               shift_id: activeShift?.id || null,
               amount: updatedOrder.total_amount,
               type: payment_method === 'cash' ? 'sale_cash' : 'sale_card',
               description: `Order #${updatedOrder.id.slice(-6)} completed`
             }
           });
        }
      }
      return updatedOrder;
    });

    return { success: true, order: serializePrisma(result) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createOrder(data: {
  table_id?: string;
  user_id?: string;
  payment_method: string;
  total_amount: number;
  customer_name?: string;
  items: { menu_item_id: string, quantity: number, unit_price: number }[];
}) {
  try {
    // 1. Transaction to guarantee safety
    const result = await prisma.$transaction(async (tx) => {
      // 2. Lock Table check
      if (data.table_id) {
        const table = await tx.tables.findUnique({ where: { id: data.table_id } });
        if (table?.status === 'occupied') throw new Error("Table is already occupied by another order.");
      }
        
      // 3. Create Order
      const newOrder = await tx.orders.create({
        data: {
          table_id: data.table_id || null,
          user_id: data.user_id || null,
          payment_method: data.payment_method,
          total_amount: data.total_amount,
          customer_name: data.customer_name || null,
          status: 'pending'
        }
      });

      if (data.table_id) {
        await tx.tables.update({
          where: { id: data.table_id },
          data: { 
            status: 'occupied',
            current_order_id: newOrder.id
          }
        });
      }

      // 4. Create Items
      if (data.items.length > 0) {
         await tx.order_items.createMany({
           data: data.items.map(item => ({
             order_id: newOrder.id,
             menu_item_id: item.menu_item_id,
             quantity: item.quantity,
             unit_price: item.unit_price
           }))
         });
      }

      return newOrder;
    });

    return { success: true, order: serializePrisma(result) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const order = await prisma.orders.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found.");

    await prisma.$transaction(async (tx) => {
       await tx.orders.delete({ where: { id: orderId } });
       if (order.table_id && order.status === 'pending') {
          await tx.tables.update({
             where: { id: order.table_id },
             data: { 
               status: 'available',
               current_order_id: null
             }
          });
       }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrder(orderId: string, data: {
  customer_name?: string;
  total_amount: number;
  items: { menu_item_id: string, quantity: number, unit_price: number }[];
}) {
  try {
    await prisma.$transaction(async (tx) => {
       await tx.orders.update({
         where: { id: orderId },
         data: {
           customer_name: data.customer_name || null,
           total_amount: data.total_amount
         }
       });

       await tx.order_items.deleteMany({ where: { order_id: orderId } });

       if (data.items.length > 0) {
         await tx.order_items.createMany({
           data: data.items.map(item => ({
             order_id: orderId,
             menu_item_id: item.menu_item_id,
             quantity: item.quantity,
             unit_price: item.unit_price
           }))
         });
       }
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
