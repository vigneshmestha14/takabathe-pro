import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PRODUCTS } from '../data/mockData';
import type { Product } from '../data/mockData';

export type { Product };

export const productService = {
  /**
   * Fetch all active products from Database
   */
  async getProducts(categorySlug?: string): Promise<Product[]> {
    if (!isSupabaseConfigured) {
      if (categorySlug && categorySlug !== 'all') {
        return PRODUCTS.filter((p) => p.category === categorySlug);
      }
      return PRODUCTS;
    }

    try {
      let query = supabase.from('products').select('*');
      if (categorySlug && categorySlug !== 'all') {
        query = query.eq('category', categorySlug);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return PRODUCTS;
      }

      return data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category || 'fish',
        price: Number(item.price_per_kg),
        unit: item.unit || 'KG',
        rating: Number(item.rating) || 4.9,
        reviewsCount: item.reviews_count || 10,
        description: item.description || '',
        harborOrigin: item.harbor_origin,
        boneType: item.bone_type,
        texture: item.texture,
        bestCookingStyle: item.best_cooking_style,
        cutOptions: item.supported_cuts || ['Whole Cleaned', 'Tawa Steaks', 'Curry Cut'],
        isAvailable: item.is_available,
        image: item.image_url,
        weightSteps: item.weight_steps || [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
      }));
    } catch (err) {
      return PRODUCTS;
    }
  },

  /**
   * Check inventory stock for product
   */
  async checkStock(productId: string, requestedKg: number): Promise<{ available: boolean; currentStock: number }> {
    if (!isSupabaseConfigured) {
      return { available: true, currentStock: 50 };
    }

    const { data } = await supabase
      .from('inventory')
      .select('stock_quantity_kg, reserved_quantity_kg')
      .eq('product_id', productId)
      .single();

    if (!data) return { available: true, currentStock: 50 };

    const netStock = data.stock_quantity_kg - data.reserved_quantity_kg;
    return {
      available: netStock >= requestedKg,
      currentStock: netStock
    };
  },

  /**
   * Admin: Update product price per KG
   */
  async updatePrice(productId: string, newPrice: number): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .update({ price_per_kg: newPrice, updated_at: new Date().toISOString() })
        .eq('id', productId);
      return !error;
    }
    return true;
  },

  /**
   * Admin: Toggle Product Stock Availability
   */
  async toggleAvailability(productId: string, isAvailable: boolean): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('products')
        .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
        .eq('id', productId);
      return !error;
    }
    return true;
  }
};
