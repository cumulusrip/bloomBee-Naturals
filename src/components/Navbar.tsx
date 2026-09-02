import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Truck,
  Sparkles,
  PhoneCall,
  Layers,
  ArrowRight,
  LogOut,
  Settings,
  Heart,
  User as UserIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BloomBeeLogo } from './BloomBeeLogo';
import { getCategoryProductCount } from '../data/initialData';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsB2BModalOpen,
    products,
    categories,
    openPDP,
    closePDP,
    currentView,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    openLabReportModal,
    searchQuery: globalSearchQuery,
    setSearchQuery: setGlobalSearchQuery,
    isAdmin,
    adminUser,
    openAuthModal,
    logoutAdmin,
    wishlist,
  } = useStore();

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const activeSearch = localSearchQuery || globalSearchQuery || '';

  const searchResults = activeSearch.trim()
    ? products.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(activeSearch.toLowerCase()) ||
          (p.categoryLabel || '').toLowerCase().includes(activeSearch.toLowerCase()) ||
          (p.origin || '').toLowerCase().includes(activeSearch.toLowerCase())
      )
    : [];

  const handleNavClick = (view: any) => {
    closePDP();
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setIsAdminDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryId: string) => {
    closePDP();
    setSelectedCategory(categoryId);
    setCurrentView('shop');
    setIsCategoriesDropdownOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EFE5D5]">
      {/* Top Announcement Bar */}
      <div className="bg-[#1E3F20] text-[#FAF8F5] text-xs font-medium py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 text-[#F3C067] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F3C067]" />
              <span className="hidden xs:inline">FSSAI Lic #11026999000182 •</span> 100% NMR Tested Pure
            </span>
            <span className="hidden md:inline-block text-[#9EB39C]">|</span>
            <span className="hidden md:flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#F3C067]" />
              Express Delivery Across India (5–7 Days) • Instant Guest Checkout
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <button
              onClick={() => handleNavClick('tracking')}
              className="text-[#D4E8D2] hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <Truck className="w-3 h-3 text-[#F3C067]" />
              <span>Track Order</span>
            </button>
            {/* <span className="text-[#9EB39C]">|</span> */}
            {/* <button
              onClick={() => handleNavClick('wholesale')}
              className="text-[#F3C067] hover:text-[#FFB833] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3 h-3" />
              <span>B2B Supply</span>
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4 xl:gap-8 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center cursor-pointer text-left focus:outline-none"
              aria-label="BloomBee Naturals Home"
            >
              <BloomBeeLogo size="md" variant="full" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentView === 'home'
                    ? 'bg-[#1E3F20] text-white shadow-xs'
                    : 'text-[#1E3F20] hover:bg-[#EFE5D5]/50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavClick('shop')}
                className={`px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentView === 'shop'
                    ? 'bg-[#1E3F20] text-white shadow-xs'
                    : 'text-[#1E3F20] hover:bg-[#EFE5D5]/50'
                }`}
              >
                Shop All
              </button>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsCategoriesDropdownOpen(false), 200)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    currentView === 'categories'
                      ? 'bg-[#1E3F20] text-white shadow-xs'
                      : 'text-[#1E3F20] hover:bg-[#EFE5D5]/50'
                  }`}
                >
                  <span>Categories ({categories.length})</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isCategoriesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EFE5D5] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-[#FAF8F5]">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#786C5E]">
                        FSSAI Licensed Categories
                      </span>
                    </div>
                    <div className="py-1 space-y-0.5">
                      {categories.map((cat) => {
                        // Real, live product count for this category — not
                        // the static FSSAI registration code — so it updates
                        // as products are added/edited.
                        const catCount = getCategoryProductCount(products, cat.id);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#1F2937] hover:bg-[#FEF7EB] hover:text-[#1E3F20] rounded-xl transition-colors text-left cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5 text-[#9A5B00]" />
                              <span>{cat.name}</span>
                            </span>
                            <span className="text-[10px] text-[#9A5B00] font-bold">
                              {catCount} {catCount === 1 ? 'Product' : 'Products'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="pt-2 border-t border-[#EFE5D5]">
                      <button
                        onClick={() => handleNavClick('categories')}
                        className="w-full text-center text-xs font-bold text-[#9A5B00] hover:underline py-1 cursor-pointer"
                      >
                        Explore All {categories.length} Categories →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* <button
                onClick={() => handleNavClick('lab-reports')}
                className={`px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentView === 'lab-reports'
                    ? 'bg-[#1E3F20] text-white shadow-xs'
                    : 'text-[#1E3F20] hover:bg-[#EFE5D5]/50'
                }`}
              >
                NMR Lab Reports
              </button> */}
{/* 
              <button
                onClick={() => handleNavClick('wholesale')}
                className={`px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentView === 'wholesale'
                    ? 'bg-[#1E3F20] text-white shadow-xs'
                    : 'text-[#9A5B00] hover:bg-[#FEF7EB]'
                }`}
              >
                B2B Wholesale
              </button> */}

              <button
                onClick={() => handleNavClick('about')}
                className={`hidden xl:inline-block px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentView === 'about'
                    ? 'bg-[#1E3F20] text-white shadow-xs'
                    : 'text-[#1E3F20] hover:bg-[#EFE5D5]/50'
                }`}
              >
                Our Story
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className={`hidden xl:inline-block px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  currentView === 'contact'
                    ? 'bg-[#1E3F20] text-white shadow-xs'
                    : 'text-[#1E3F20] hover:bg-[#EFE5D5]/50'
                }`}
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Live Search Bar */}
            <div className="relative">
              <div className="hidden md:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={localSearchQuery}
                  onChange={(e) => {
                    setLocalSearchQuery(e.target.value);
                    setGlobalSearchQuery(e.target.value);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-36 lg:w-48 xl:w-60 pl-8 pr-3 py-2 bg-white/90 border border-[#EFE5D5] rounded-full text-xs text-[#1F2937] placeholder-[#786C5E] focus:outline-none focus:ring-2 focus:ring-[#1E3F20] focus:bg-white transition-all shadow-xs"
                />
                <Search className="w-3.5 h-3.5 text-[#786C5E] absolute left-2.5 pointer-events-none" />
                {localSearchQuery && (
                  <button
                    onClick={() => {
                      setLocalSearchQuery('');
                      setGlobalSearchQuery('');
                    }}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Search dropdown results */}
              {isSearchOpen && searchResults.length > 0 && (
                <div
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#EFE5D5] p-2 z-50 max-h-96 overflow-y-auto"
                >
                  <div className="p-2 border-b border-[#FAF8F5] flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#1E3F20]">Matching Products</span>
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        openPDP(p);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-[#FAF8F5] rounded-xl text-left transition-colors cursor-pointer"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-lg border border-[#EFE5D5]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1F2937] truncate">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-[#2D5A27]">
                          From ₹{p.variants[0].price} • {p.variants[0].weight}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search Icon Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white border border-[#EFE5D5] text-[#786C5E] hover:text-[#1E3F20] transition-colors shadow-xs flex items-center justify-center cursor-pointer"
              title="Search Products"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button (Guests can save favorites!) */}
            <button
              onClick={() => handleNavClick('account')}
              className="relative p-2 sm:p-2.5 rounded-full bg-white border border-[#EFE5D5] hover:border-[#9A5B00] text-[#786C5E] hover:text-[#9A5B00] transition-colors shadow-xs flex items-center justify-center cursor-pointer"
              title="Saved Favorites"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9A5B00] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            {isAdmin ? (
              <div className="relative">
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1E3F20] text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:bg-[#2D5A27]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F3C067]" />
                  <span className="hidden sm:inline">Admin</span>
                  <ChevronDown className="w-3 h-3 text-[#F3C067]" />
                </button>

                {isAdminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-[#EFE5D5] p-2 z-50 animate-in fade-in duration-150">
                    <div className="p-2 border-b border-[#FAF8F5]">
                      <p className="text-xs font-bold text-[#1E3F20] truncate">Store Administrator</p>
                      <p className="text-[10px] text-[#786C5E] truncate">{adminUser?.email || 'admin@bloombee.com'}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#1E3F20] hover:bg-[#FEF7EB] rounded-xl transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-[#9A5B00]" />
                        <span>Admin Dashboard</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-[#EFE5D5]">
                      <button
                        onClick={() => {
                          logoutAdmin();
                          setIsAdminDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out Admin</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FEF7EB] border border-[#EFE5D5] hover:border-[#F5DCB7] text-xs font-bold text-[#1E3F20] transition-colors cursor-pointer shadow-xs"
                title="Admin Control Login"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#9A5B00]" />
                <span>Admin</span>
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full bg-[#1E3F20] text-white hover:bg-[#2D5A27] transition-colors shadow-sm flex items-center justify-center cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E69500] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#FAF8F5] animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-[#1F2937] hover:bg-[#EFE5D5]/50 rounded-xl cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#EFE5D5] bg-[#FAF8F5] space-y-2 animate-in slide-in-from-top-2 duration-150">
            {/* Mobile Search input */}
            <div className="px-1 mb-2">
              <input
                type="text"
                placeholder="Search raw honey, Vedic ghee..."
                value={localSearchQuery}
                onChange={(e) => {
                  setLocalSearchQuery(e.target.value);
                  setGlobalSearchQuery(e.target.value);
                }}
                className="w-full px-3 py-2 bg-white border border-[#EFE5D5] rounded-xl text-xs"
              />
            </div>

            {/* Admin Portal Fast Link in Mobile */}
            <div className="p-3 bg-white rounded-2xl border border-[#EFE5D5] mb-2 flex items-center justify-between">
              {isAdmin ? (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <strong className="text-xs text-[#1E3F20] block font-bold">Admin Active</strong>
                    <span className="text-[10px] text-[#786C5E]">{adminUser?.email}</span>
                  </div>
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="px-3 py-1 bg-[#1E3F20] text-white text-xs font-bold rounded-lg"
                  >
                    Dashboard →
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-white border border-[#EFE5D5] text-[#1E3F20] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#9A5B00]" />
                  <span>Admin Portal Login</span>
                </button>
              )}
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                currentView === 'home' ? 'bg-[#1E3F20] text-white' : 'text-[#1E3F20] hover:bg-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('shop')}
              className={`block w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                currentView === 'shop' ? 'bg-[#1E3F20] text-white' : 'text-[#1E3F20] hover:bg-white'
              }`}
            >
              Shop All Products
            </button>

            <button
              onClick={() => handleNavClick('categories')}
              className={`block w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                currentView === 'categories' ? 'bg-[#1E3F20] text-white' : 'text-[#1E3F20] hover:bg-white'
              }`}
            >
              8 FSSAI Licensed Categories
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`block w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                currentView === 'about' ? 'bg-[#1E3F20] text-white' : 'text-[#1E3F20] hover:bg-white'
              }`}
            >
              Our Story &amp; Kashmir Valley Apiaries
            </button>

            <button
              onClick={() => handleNavClick('lab-reports')}
              className={`block w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                currentView === 'lab-reports' ? 'bg-[#1E3F20] text-white' : 'text-[#1E3F20] hover:bg-white'
              }`}
            >
              Lab Test Certificates (NMR Reports)
            </button>

            <button
              onClick={() => handleNavClick('wholesale')}
              className={`block w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                currentView === 'wholesale' ? 'bg-[#1E3F20] text-white' : 'text-[#9A5B00] hover:bg-white'
              }`}
            >
              B2B &amp; Bulk Wholesale Supply
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`block w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl ${
                currentView === 'contact' ? 'bg-[#1E3F20] text-white' : 'text-[#1E3F20] hover:bg-white'
              }`}
            >
              Contact Customer Desk &amp; FAQs
            </button>

            <button
              onClick={() => handleNavClick('tracking')}
              className="block w-full text-left px-3.5 py-2.5 text-xs font-bold text-[#2D5A27] hover:bg-white rounded-xl"
            >
              Track Order (AWB)
            </button>

            <button
              onClick={() => handleNavClick('privacy-policy')}
              className="block w-full text-left px-3.5 py-2.5 text-xs font-medium text-[#786C5E] hover:bg-white rounded-xl"
            >
              Privacy Policy &amp; Terms
            </button>
          </div>
        )}
      </div>
    </header>
  );
};