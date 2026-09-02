import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  ShoppingBag,
  Layers,
  Truck,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartOpen,
    wishlist,
    isAdmin,
    openAuthModal,
  } = useStore();

  return (
    <div
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EFE5D5] shadow-lg pb-safe"
    >
      <div className="flex items-center justify-around py-2 px-1">
        
        {/* Home */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'home'
              ? 'text-[#1E3F20] font-bold'
              : 'text-[#786C5E] hover:text-[#1E3F20]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'shop'
              ? 'text-[#1E3F20] font-bold'
              : 'text-[#786C5E] hover:text-[#1E3F20]'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${currentView === 'shop' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Shop</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => {
            setCurrentView('categories');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'categories'
              ? 'text-[#1E3F20] font-bold'
              : 'text-[#786C5E] hover:text-[#1E3F20]'
          }`}
        >
          <Layers className={`w-5 h-5 ${currentView === 'categories' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Categories</span>
        </button>

        {/* Track Order */}
        <button
          onClick={() => {
            setCurrentView('tracking');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'tracking'
              ? 'text-[#1E3F20] font-bold'
              : 'text-[#786C5E] hover:text-[#1E3F20]'
          }`}
        >
          <Truck className={`w-5 h-5 ${currentView === 'tracking' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Track</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[#786C5E] hover:text-[#1E3F20] transition-all cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#9A5B00] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        {/* Admin Portal / Wishlist */}
        <button
          onClick={() => {
            if (isAdmin) {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              openAuthModal('login');
            }
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'admin'
              ? 'text-[#1E3F20] font-bold'
              : 'text-[#786C5E] hover:text-[#1E3F20]'
          }`}
        >
          <ShieldCheck className={`w-5 h-5 ${currentView === 'admin' ? 'stroke-[2.5] text-[#1E3F20]' : 'stroke-2 text-[#9A5B00]'}`} />
          <span className="text-[10px]">{isAdmin ? 'Admin' : 'Login'}</span>
        </button>

      </div>
    </div>
  );
};
