import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { UserProfile } from '../services/authService';
import { productService } from '../services/productService';
import type { Product } from '../services/productService';
import { orderService } from '../services/orderService';
import type { Order } from '../data/mockData';
import { PRODUCTS } from '../data/mockData';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
  selectedCut?: string;
  selectedCleaning?: string;
  specialInstructions?: string;
  image?: string;
}

interface AppContextType {
  user: UserProfile | null;
  isLoadingUser: boolean;
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  location: string;
  setLocation: (loc: string) => void;
  orders: Order[];
  activeOrder: Order | null;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  addToCart: (item: CartItem) => void;
  updateCartQty: (productId: string, selectedCut: string | undefined, qty: number) => void;
  removeFromCart: (productId: string, selectedCut?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  loginUser: (phone: string, token: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  createOrder: (orderData: any) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [products, setProducts] = useState<Product[]>(PRODUCTS as any);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('takabathe_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [location, setLocation] = useState<string>('Udupi (576101)');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Cart to Local Storage
  useEffect(() => {
    localStorage.setItem('takabathe_cart', JSON.stringify(cart));
  }, [cart]);

  // Load User Session on Mount
  useEffect(() => {
    async function loadSession() {
      setIsLoadingUser(true);
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error fetching current user:', err);
      } finally {
        setIsLoadingUser(false);
      }
    }
    loadSession();
  }, []);

  // Fetch Products from Supabase or Fallback
  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const fetched = await productService.getProducts();
      if (fetched && fetched.length > 0) {
        setProducts(fetched);
      }
    } catch (err) {
      console.error('Failed to load products from DB, using defaults:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === newItem.productId && i.selectedCut === newItem.selectedCut
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].qty = Math.round((updated[existingIdx].qty + newItem.qty) * 10) / 10;
        return updated;
      }
      return [...prev, newItem];
    });
    showToast(`${newItem.name} (${newItem.qty} ${newItem.unit}) added to cart`);
  };

  const updateCartQty = (productId: string, selectedCut: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, selectedCut);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedCut === selectedCut
          ? { ...item, qty: Math.round(qty * 10) / 10 }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, selectedCut?: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.selectedCut === selectedCut))
    );
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + Math.round(item.price * item.qty), 0);
  const cartCount = cart.length;

  const loginUser = async (phone: string, token: string) => {
    const res = await authService.verifyPhoneOtp(phone, token);
    if (res.success && res.user) {
      setUser(res.user);
      showToast(`Welcome back, ${res.user.full_name || 'Customer'}!`);
      return true;
    }
    return false;
  };

  const logoutUser = async () => {
    await authService.signOut();
    setUser(null);
    showToast('Logged out successfully');
  };

  const createOrder = async (orderPayload: any): Promise<Order | null> => {
    try {
      const result = await orderService.createOrder({
        userId: user?.id || 'guest-1',
        customerName: orderPayload.customerName,
        phone: orderPayload.phone,
        address: orderPayload.address,
        deliverySlotName: orderPayload.deliverySlot,
        items: cart,
        paymentMethod: orderPayload.paymentMethod || 'cod'
      });

      if (result.success && result.order) {
        const newOrder = result.order;
        setOrders((prev: Order[]) => [newOrder, ...prev]);
        setActiveOrder(newOrder);
        clearCart();
        showToast(`Order #${newOrder.id} placed successfully!`);
        return newOrder;
      }
      return null;
    } catch (err) {
      showToast('Failed to create order. Please try again.');
      return null;
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev: Order[]) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Order #${orderId} status updated to ${status}`);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoadingUser,
        products,
        isLoadingProducts,
        cart,
        location,
        setLocation,
        orders,
        activeOrder,
        toastMessage,
        showToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        loginUser,
        logoutUser,
        refreshProducts,
        createOrder,
        updateOrderStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
