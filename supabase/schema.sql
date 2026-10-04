-- ============================================================================
-- TAKABATHE PRODUCTION DATABASE SCHEMA (Supabase PostgreSQL)
-- Complete schema for Indian Fresh-Fish Ordering Platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-- ----------------------------------------------------------------------------
CREATE TYPE user_role_enum AS ENUM ('customer', 'admin', 'manager', 'staff');
CREATE TYPE order_status_enum AS ENUM (
  'pending', 
  'payment_pending', 
  'confirmed', 
  'preparing', 
  'packed', 
  'out_for_delivery', 
  'delivered', 
  'cancelled', 
  'refunded'
);
CREATE TYPE payment_status_enum AS ENUM (
  'pending', 
  'processing', 
  'paid', 
  'failed', 
  'refunded', 
  'cod_pending'
);
CREATE TYPE payment_gateway_enum AS ENUM ('razorpay', 'phonepe', 'cashfree', 'cod', 'upi');
CREATE TYPE address_type_enum AS ENUM ('home', 'work', 'other');

-- ----------------------------------------------------------------------------
-- 2. USER PROFILES & ROLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role user_role_enum DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to check if user has admin/manager role
CREATE OR REPLACE FUNCTION public.is_admin_or_manager(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 3. CUSTOMER ADDRESSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  house_flat VARCHAR(100) NOT NULL,
  street_building VARCHAR(200) NOT NULL,
  area_landmark VARCHAR(200),
  city VARCHAR(100) DEFAULT 'Udupi' NOT NULL,
  state VARCHAR(100) DEFAULT 'Karnataka' NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  address_type address_type_enum DEFAULT 'home' NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. CATEGORIES, PRODUCTS & CUTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  price_per_kg DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'KG' NOT NULL,
  rating DECIMAL(3,2) DEFAULT 4.9,
  reviews_count INT DEFAULT 0,
  harbor_origin VARCHAR(150),
  bone_type VARCHAR(100),
  texture VARCHAR(100),
  best_cooking_style VARCHAR(200),
  image_url TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  supported_cuts JSONB DEFAULT '["Whole Cleaned", "Pan Fry Steaks", "Curry Cut", "Fillet"]'::jsonb,
  supported_cleaning JSONB DEFAULT '["Cleaned & Gutted", "Whole Scaled", "As-is"]'::jsonb,
  weight_steps JSONB DEFAULT '[0.5, 1.0, 1.5, 2.0, 2.5, 3.0]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- ----------------------------------------------------------------------------
-- 5. INVENTORY & STOCK MANAGEMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE NOT NULL,
  stock_quantity_kg DECIMAL(10,2) DEFAULT 50.00 NOT NULL,
  reserved_quantity_kg DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  low_stock_threshold_kg DECIMAL(10,2) DEFAULT 5.00 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. CARTS & CART ITEMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  selected_cut VARCHAR(100) DEFAULT 'Whole Cleaned',
  selected_cleaning VARCHAR(100) DEFAULT 'Cleaned & Gutted',
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. DELIVERY SLOTS & AREAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_name VARCHAR(100) NOT NULL, -- e.g. Morning 8:00 AM - 11:00 AM
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INT DEFAULT 30 NOT NULL,
  current_bookings INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.delivery_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pincode VARCHAR(10) UNIQUE NOT NULL,
  area_name VARCHAR(150) NOT NULL,
  city VARCHAR(100) DEFAULT 'Udupi' NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 40.00 NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 200.00 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- ----------------------------------------------------------------------------
-- 8. COUPONS & DISCOUNTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) DEFAULT 'percentage' NOT NULL, -- percentage or fixed
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0.00,
  max_discount_amount DECIMAL(10,2),
  expiry_date TIMESTAMPTZ,
  usage_limit INT DEFAULT 500,
  current_usage INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. ORDERS & ORDER ITEMS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  delivery_slot_id UUID REFERENCES public.delivery_slots(id) ON DELETE SET NULL,
  delivery_slot_name VARCHAR(100) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  delivery_address TEXT NOT NULL,
  
  subtotal DECIMAL(10,2) NOT NULL,
  cleaning_fee DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  
  order_status order_status_enum DEFAULT 'pending' NOT NULL,
  payment_status payment_status_enum DEFAULT 'pending' NOT NULL,
  payment_gateway payment_gateway_enum DEFAULT 'cod' NOT NULL,
  
  coupon_code VARCHAR(50),
  special_notes TEXT,
  estimated_delivery TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name VARCHAR(150) NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  selected_cut VARCHAR(100) DEFAULT 'Whole Cleaned',
  selected_cleaning VARCHAR(100) DEFAULT 'Cleaned & Gutted',
  special_instructions TEXT
);

CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status order_status_enum NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. PAYMENTS & TRANSACTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  gateway_payment_id VARCHAR(100),
  gateway_order_id VARCHAR(100),
  gateway_signature VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  gateway payment_gateway_enum NOT NULL,
  status payment_status_enum DEFAULT 'pending' NOT NULL,
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. IN-APP NOTIFICATIONS & AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'order_update',
  read BOOLEAN DEFAULT FALSE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(150) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for products, categories, delivery slots
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Delivery Slots" ON public.delivery_slots FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Delivery Areas" ON public.delivery_areas FOR SELECT USING (is_active = true);

-- Customer RLS Policies (Data Isolation)
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own carts" ON public.carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users read own cart items" ON public.cart_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_items.cart_id AND user_id = auth.uid())
);
CREATE POLICY "Users insert own cart items" ON public.cart_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_items.cart_id AND user_id = auth.uid())
);
CREATE POLICY "Users update own cart items" ON public.cart_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_items.cart_id AND user_id = auth.uid())
);
CREATE POLICY "Users delete own cart items" ON public.cart_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_items.cart_id AND user_id = auth.uid())
);

CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Users read own order history" ON public.order_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_status_history.order_id AND user_id = auth.uid())
);
CREATE POLICY "Users read own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- Admin Full Management Policies
CREATE POLICY "Admin full access profiles" ON public.profiles FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access inventory" ON public.inventory FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access order_items" ON public.order_items FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access payments" ON public.payments FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access coupons" ON public.coupons FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access slots" ON public.delivery_slots FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access areas" ON public.delivery_areas FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Admin full access audit_logs" ON public.admin_audit_logs FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- ----------------------------------------------------------------------------
-- 13. SEED INITIAL DATA
-- ----------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, description, display_order) VALUES
('Fresh Fish', 'fresh-fish', 'Daily morning harbor catch sold by weight', 1),
('Premium Fish', 'premium-fish', 'High-end delicacies like Pomfret and Surmai', 2),
('Shellfish', 'shellfish', 'Cleaned Prawns, Lobsters and Crabs', 3),
('Fish Masala', 'fish-masala', 'Stone-ground coastal pan-fry pastes', 4),
('Ready-to-Cook', 'ready-to-cook', 'Marinated seafood prepped for pan fry', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.delivery_slots (slot_name, start_time, end_time, max_capacity, is_active) VALUES
('Morning 8:00 AM - 11:00 AM (Express Catch)', '08:00:00', '11:00:00', 30, true),
('Afternoon 12:00 PM - 3:00 PM', '12:00:00', '15:00:00', 25, true),
('Evening 5:00 PM - 8:00 PM', '17:00:00', '20:00:00', 25, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.delivery_areas (pincode, area_name, city, delivery_fee, min_order_amount) VALUES
('576108', 'Malpe Beach Road', 'Udupi', 0.00, 200.00),
('576101', 'Udupi Town & Manipal', 'Udupi', 40.00, 250.00),
('575001', 'Mangalore Central', 'Mangalore', 50.00, 300.00)
ON CONFLICT (pincode) DO NOTHING;
