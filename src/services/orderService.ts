import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Order, OrderItem } from '../data/mockData';

export interface CheckoutPayload {
  userId?: string;
  customerName: string;
  phone: string;
  address: string;
  deliverySlotName: string;
  items: OrderItem[];
  paymentMethod: 'razorpay' | 'phonepe' | 'cod' | 'upi';
  couponCode?: string;
  specialNotes?: string;
}

export const orderService = {
  /**
   * Recalculate Totals Server-Side & Validate Order Payload
   */
  calculateOrderTotals(items: OrderItem[], discountAmount = 0, deliveryFee = 0) {
    const subtotal = items.reduce((sum, item) => sum + Math.round(item.price * item.qty), 0);
    const cleaningFee = 0; // Hand-cutting & scaling is 100% FREE
    const calculatedDeliveryFee = subtotal > 500 ? 0 : (deliveryFee || 40);
    const taxAmount = Math.round(subtotal * 0.05); // 5% GST
    const totalAmount = Math.max(0, subtotal + calculatedDeliveryFee + taxAmount - discountAmount);

    return {
      subtotal,
      cleaningFee,
      deliveryFee: calculatedDeliveryFee,
      taxAmount,
      discountAmount,
      totalAmount
    };
  },

  /**
   * Create New Order Record
   */
  async createOrder(payload: CheckoutPayload): Promise<{ success: boolean; order?: Order; error?: string }> {
    const totals = this.calculateOrderTotals(payload.items);
    const orderNumber = `TKB-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderNumber,
      customerName: payload.customerName,
      phone: payload.phone,
      address: payload.address,
      deliverySlot: payload.deliverySlotName,
      items: payload.items,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.totalAmount,
      status: 'harbor_landed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '30 Minutes'
    };

    if (!isSupabaseConfigured) {
      return { success: true, order: newOrder };
    }

    try {
      // Insert into orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: payload.userId,
          customer_name: payload.customerName,
          customer_phone: payload.phone,
          delivery_address: payload.address,
          delivery_slot_name: payload.deliverySlotName,
          subtotal: totals.subtotal,
          delivery_fee: totals.deliveryFee,
          discount_amount: totals.discountAmount,
          tax_amount: totals.taxAmount,
          total_amount: totals.totalAmount,
          order_status: 'harbor_landed',
          payment_status: payload.paymentMethod === 'cod' ? 'cod_pending' : 'pending',
          payment_gateway: payload.paymentMethod,
          coupon_code: payload.couponCode || null,
          special_notes: payload.specialNotes || null
        })
        .select()
        .single();

      if (orderError || !orderData) {
        return { success: false, error: orderError?.message || 'Failed to record order' };
      }

      // Insert order items
      const itemsToInsert = payload.items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.name,
        price_per_kg: item.price,
        quantity_kg: item.qty,
        total_price: Math.round(item.price * item.qty),
        selected_cut: item.selectedCut || 'Whole Cleaned',
        selected_cleaning: 'Cleaned & Gutted'
      }));

      await supabase.from('order_items').insert(itemsToInsert);

      // Record status history log
      await supabase.from('order_status_history').insert({
        order_id: orderData.id,
        status: 'harbor_landed',
        notes: `Order created via ${payload.paymentMethod.toUpperCase()}`
      });

      return { success: true, order: newOrder };
    } catch (err: any) {
      return { success: false, error: err.message || 'Order execution error' };
    }
  },

  /**
   * Fetch Orders for Customer
   */
  async getCustomerOrders(userId: string): Promise<Order[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!data) return [];

      return data.map((o) => ({
        id: o.order_number || o.id,
        customerName: o.customer_name,
        phone: o.customer_phone,
        address: o.delivery_address,
        deliverySlot: o.delivery_slot_name,
        items: (o.order_items || []).map((i: any) => ({
          productId: i.product_id,
          name: i.product_name,
          price: Number(i.price_per_kg),
          unit: 'KG',
          qty: Number(i.quantity_kg),
          selectedCut: i.selected_cut
        })),
        subtotal: Number(o.subtotal),
        deliveryFee: Number(o.delivery_fee),
        total: Number(o.total_amount),
        status: o.order_status,
        createdAt: o.created_at,
        estimatedDelivery: '30 Minutes'
      }));
    } catch (err) {
      return [];
    }
  },

  /**
   * Admin: Update Order Status
   */
  async updateOrderStatus(orderId: string, newStatus: Order['status']): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus, updated_at: new Date().toISOString() })
        .eq('order_number', orderId);
      return !error;
    }
    return true;
  }
};
