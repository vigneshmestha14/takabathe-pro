import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPage } from './pages/LegalPage';

import { ShoppingBag, ArrowRight } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { cartCount, cartSubtotal, toastMessage } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07171d] text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-0 mx-auto max-w-sm z-50 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-300 px-4 py-3 font-display text-xs font-bold text-center shadow-2xl backdrop-blur-md animate-bounce">
          ✨ {toastMessage}
        </div>
      )}

      {/* Main Responsive Header Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
          <Route path="/orders/:id" element={<OrderTrackingPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          
          {/* Legal routes */}
          <Route path="/about" element={<LegalPage />} />
          <Route path="/contact" element={<LegalPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/refund-policy" element={<LegalPage />} />
          <Route path="/cancellation-policy" element={<LegalPage />} />
          <Route path="/delivery-policy" element={<LegalPage />} />
        </Routes>
      </main>

      {/* Sticky Mobile Cart Bar */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-4 inset-x-4 z-30">
          <div
            onClick={() => setIsCartOpen(true)}
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 text-slate-950 font-black shadow-2xl ring-2 ring-white/20 cursor-pointer active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-slate-950 text-cyan-300">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider block font-bold">
                  {cartCount} Items in Cart
                </span>
                <span className="font-display text-lg leading-none">
                  ₹{cartSubtotal}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs uppercase tracking-wider font-display font-extrabold bg-slate-950 text-white px-3.5 py-2 rounded-xl">
              <span>View Cart</span>
              <ArrowRight className="size-4" />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={() => setIsAuthOpen(false)}
      />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
