import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Package,
  Heart,
  Settings,
  LogOut,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Truck,
  Sparkles,
  Search,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    isAdmin,
    adminUser,
    orders,
    wishlist,
    products,
    logoutAdmin,
    openAuthModal,
    addToCart,
    toggleWishlist,
    setCurrentView,
    setTrackedOrderNumber,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'wishlist' | 'track' | 'admin'>('wishlist');
  const [orderQuery, setOrderQuery] = useState('');

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      setTrackedOrderNumber(orderQuery.trim());
      setCurrentView('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF7EB] border border-[#F5DCB7] flex items-center justify-center text-2xl text-[#9A5B00]">
              {isAdmin ? '🛡️' : '🍯'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1E3F20]">
                  {isAdmin ? 'Admin Control Center' : 'Guest Hub & Favorites'}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F0F7EE] text-[#2D5A27] border border-[#D4E8D2]">
                  {isAdmin ? 'Admin Active' : 'Universal Guest Access'}
                </span>
              </div>
              <p className="text-xs text-[#786C5E] mt-1">
                {isAdmin
                  ? `Signed in as ${adminUser?.email || 'Store Administrator'}`
                  : 'Manage your saved natural superfoods, track orders with 1-click, and checkout with zero account hurdles.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="px-4 py-2.5 rounded-xl bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#F3C067]" />
                  <span>Open Admin Portal</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#EFE5D5] hover:bg-[#FEF7EB] text-[#1E3F20] text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#9A5B00]" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EFE5D5] gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'bg-[#1E3F20] text-white shadow-xs'
                : 'bg-white text-[#786C5E] hover:text-[#1E3F20] border border-[#EFE5D5]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favorites ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'track'
                ? 'bg-[#1E3F20] text-white shadow-xs'
                : 'bg-white text-[#786C5E] hover:text-[#1E3F20] border border-[#EFE5D5]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Track Any Order</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-[#1E3F20] text-white shadow-xs'
                : 'bg-white text-[#786C5E] hover:text-[#1E3F20] border border-[#EFE5D5]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#E69500]" />
            <span>Admin Control Desk</span>
          </button>
        </div>

        {/* Tab 1: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EFE5D5] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#EFE5D5] flex items-center justify-center text-3xl mx-auto text-gray-400">
                  💛
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1E3F20]">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-[#786C5E] max-w-sm mx-auto">
                  Click the heart icon on any Himalayan wildflower honey, Vedic bilona ghee, or saffron to save it here for later.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-[#1E3F20] hover:bg-[#2D5A27] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Explore Harvests</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F3C067]" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE5D5] shadow-xs flex flex-col justify-between space-y-4 relative group"
                  >
                    <div>
                      <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-3 bg-[#FAF8F5]">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-xs rounded-full text-red-500 hover:bg-white shadow-xs cursor-pointer"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] font-bold text-[#9A5B00] uppercase tracking-wider bg-[#FEF7EB] px-2 py-0.5 rounded-md border border-[#F5DCB7] inline-block mb-1.5">
                        {p.categoryLabel}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#1E3F20] leading-snug">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-[#786C5E] mt-1">
                        Origin: {p.origin}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EFE5D5] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs text-[#786C5E] block">Price:</span>
                        <span className="font-bold text-sm text-[#1E3F20]">
                          ₹{p.variants[0].price}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(p, p.variants[0], 1)}
                        className="px-4 py-2 bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#F3C067]" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Track Any Order */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5D5] shadow-xs max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F7EE] text-[#2D5A27] flex items-center justify-center text-xl mx-auto border border-[#D4E8D2]">
                🚚
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1E3F20]">
                Instant Courier Tracking
              </h3>
              <p className="text-xs text-[#786C5E]">
                Enter your BloomBee Order ID (e.g. BBN-8492) to view live BlueDart / Delhivery dispatch status, NMR lab records, and estimated arrival.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Order # (e.g. BBN-8492)"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#EFE5D5] rounded-2xl text-xs sm:text-sm font-mono text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3F20]"
                />
                <Search className="w-4 h-4 text-[#786C5E] absolute left-3.5 top-3.5" />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track Shipment Now</span>
                <ArrowRight className="w-4 h-4 text-[#F3C067]" />
              </button>
            </form>

            <div className="bg-[#FEF7EB] p-4 rounded-2xl border border-[#F5DCB7] text-xs text-[#786C5E] space-y-1">
              <span className="font-bold text-[#1E3F20] block">Recent Orders on this device:</span>
              {orders.slice(0, 3).map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => {
                    setTrackedOrderNumber(ord.orderNumber);
                    setCurrentView('tracking');
                  }}
                  className="w-full flex items-center justify-between text-left py-1 hover:text-[#9A5B00] transition-colors cursor-pointer"
                >
                  <span className="font-mono font-semibold text-[#1E3F20]">#{ord.orderNumber}</span>
                  <span className="text-[11px] capitalize text-[#2D5A27]">{ord.status} • ₹{ord.pricing.total}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Admin Desk */}
        {activeTab === 'admin' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5D5] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFE5D5]">
              <div>
                <span className="text-xs uppercase font-bold text-[#9A5B00] tracking-wider">
                  Store Administration
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1E3F20]">
                  Admin Credentials &amp; Control
                </h3>
                <p className="text-xs text-[#786C5E] mt-0.5">
                  Full control over product catalog, orders, live FSSAI batch certificates, and B2B wholesale inquiries.
                </p>
              </div>

              {isAdmin ? (
                <button
                  onClick={() => setCurrentView('admin')}
                  className="px-5 py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#F3C067]" />
                  <span>Launch Admin Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-5 py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#F3C067]" />
                  <span>Sign In as Admin</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE5D5] space-y-2">
                <span className="text-xs font-bold text-[#1E3F20] block">Master Admin Credentials:</span>
                <div className="font-mono text-xs text-[#1F2937] space-y-1">
                  <div>Email: <strong className="text-[#1E3F20]">admin@bloombeenaturals.com</strong></div>
                  <div>Password: <strong className="text-[#1E3F20]">bloombee@admin2025</strong></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE5D5] space-y-2">
                <span className="text-xs font-bold text-[#1E3F20] block">Manager Admin Credentials:</span>
                <div className="font-mono text-xs text-[#1F2937] space-y-1">
                  <div>Email: <strong className="text-[#1E3F20]">admin@bloombee.com</strong></div>
                  <div>Password: <strong className="text-[#1E3F20]">admin123</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
