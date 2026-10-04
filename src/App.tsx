import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HarborTicker } from './components/HarborTicker';
import { CategoryFilter } from './components/CategoryFilter';
import type { CategoryType } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { RecipeModal } from './components/RecipeModal';
import { Footer } from './components/Footer';
import { PRODUCTS, RECIPES } from './data/mockData';
import type { Product, Recipe, OrderItem, Order } from './data/mockData';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [isDarkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, qty: number, selectedCut?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === product.id && i.selectedCut === selectedCut
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          qty,
          selectedCut,
          image: product.image
        }
      ];
    });

    showToast(`Added ${qty} ${product.unit} of ${product.name} to Basket!`);
  };

  const handleUpdateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, qty } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleOrderPlaced = (details: {
    customerName: string;
    phone: string;
    address: string;
    deliverySlot: string;
    items: OrderItem[];
    total: number;
  }) => {
    const newOrder: Order = {
      id: `TKB-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: details.customerName,
      phone: details.phone,
      address: details.address,
      deliverySlot: details.deliverySlot,
      items: details.items,
      subtotal: details.total,
      deliveryFee: 0,
      total: details.total,
      status: 'out_for_delivery',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '30 Minutes'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setIsTrackingOpen(true);
    showToast(`🎉 Order #${newOrder.id} successfully placed!`);
  };

  // Admin Product update
  const handleUpdateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    showToast('Updated item details on Daily Board');
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added ${newProd.name} to Daily Board!`);
  };

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' ||
      activeCategory === 'recipes' ||
      p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + Math.round(item.price * item.qty),
    0
  );

  const categoryCounts: Record<CategoryType, number> = {
    all: products.length,
    fish: products.filter((p) => p.category === 'fish').length,
    masala: products.filter((p) => p.category === 'masala').length,
    combo: products.filter((p) => p.category === 'combo').length,
    recipes: RECIPES.length
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 rounded-2xl bg-cyan-500 px-4 py-3 font-display text-sm font-bold text-slate-950 shadow-2xl shadow-cyan-500/40 animate-bounce flex items-center gap-2">
          <Sparkles className="size-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        cartCount={cartItems.length}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isAdmin={isAdminMode}
        onToggleAdmin={() => setIsAdminMode(!isAdminMode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdminModal={() => setIsAdminOpen(true)}
        onOpenTrackingModal={() => setIsTrackingOpen(true)}
        hasActiveOrder={activeOrder !== null}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Harbor Telemetry Ticker Banner */}
        <HarborTicker />

        {/* Category Pills Navigation */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={categoryCounts}
        />

        {/* Catalog Section */}
        <div className="w-full px-4">
          <div className="mx-auto max-w-6xl">
            
            {/* Category Title */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  {activeCategory === 'fish' && 'Fresh Fish Cuts (Priced per KG)'}
                  {activeCategory === 'masala' && 'Coastal Masalas & Pan-Fry Pastes'}
                  {activeCategory === 'combo' && 'Value Combo Feast Bundles'}
                  {activeCategory === 'recipes' && 'Coastal Chef Recipes & Cooking Guides'}
                  {activeCategory === 'all' && 'Today\'s Fresh Harbor Board'}
                </h2>
                <p className="text-xs text-slate-400">
                  {activeCategory === 'recipes'
                    ? 'Learn authentic coastal recipes and order fresh fish with 1 click.'
                    : 'Select your preferred weight & custom hand-cut style.'}
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                Showing {activeCategory === 'recipes' ? RECIPES.length : filteredProducts.length} items
              </span>
            </div>

            {/* If Category is Recipes */}
            {activeCategory === 'recipes' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RECIPES.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="glass-card cursor-pointer overflow-hidden rounded-2xl p-4 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative mb-3 h-48 w-full overflow-hidden rounded-xl bg-slate-950">
                        <img src={recipe.image} alt={recipe.title} className="size-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-xs font-bold text-slate-950">
                          {recipe.difficulty}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-100">{recipe.title}</h3>
                      <p className="mt-1 text-xs text-cyan-400 font-semibold">
                        Paired Fish: {recipe.pairedFish}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
                      <span className="text-xs text-slate-400">Prep: {recipe.prepTime} | Cook: {recipe.cookTime}</span>
                      <button className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-cyan-300 ring-1 ring-white/10 hover:bg-slate-700">
                        <BookOpen className="size-3.5" /> View Recipe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && activeCategory !== 'recipes' && (
              <div className="py-16 text-center rounded-2xl glass-panel p-8">
                <AlertCircle className="mx-auto size-10 text-slate-500 mb-3" />
                <h3 className="font-display text-lg font-bold text-slate-300">No items match your search</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Try searching for "Pomfret", "Surmai", "Prawns", or clear your filter.
                </p>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        allProducts={products}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderTrackingModal
        order={activeOrder}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
      />

      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        products={products}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
      />

    </div>
  );
}
