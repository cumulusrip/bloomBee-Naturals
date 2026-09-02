import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { productMatchesCategory, getCategoryProductCount } from '../data/initialData';
import {
  SlidersHorizontal,
  Search,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
  Grid,
  List,
  Layers,
  RotateCcw,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    openPDP,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category filter
      if (selectedCategory && selectedCategory !== 'all') {
        if (!productMatchesCategory(product, selectedCategory)) return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesOrigin = product.origin.toLowerCase().includes(q);
        const matchesCategoryLabel = product.categoryLabel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesOrigin && !matchesCategoryLabel) {
          return false;
        }
      }

      // 3. In stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // 4. Price range filter
      const minPrice = Math.min(...product.variants.map((v) => v.price));
      if (minPrice > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        const priceA = Math.min(...a.variants.map((v) => v.price));
        const priceB = Math.min(...b.variants.map((v) => v.price));
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        const priceA = Math.min(...a.variants.map((v) => v.price));
        const priceB = Math.min(...b.variants.map((v) => v.price));
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'discount') {
        const discountA = Math.max(...a.variants.map((v) => v.originalPrice - v.price));
        const discountB = Math.max(...b.variants.map((v) => v.originalPrice - v.price));
        return discountB - discountA;
      }
      // default: featured
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, priceRange, sortBy]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setPriceRange(3000);
    setSortBy('featured');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-xs text-[#786C5E] mb-2 font-medium">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#1E3F20] font-bold">Shop Pure Harvests</span>
            {activeCategoryObj && (
              <>
                <span>/</span>
                <span className="text-[#9A5B00]">{activeCategoryObj.shortName}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EFE5D5] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF7EB] border border-[#F5DCB7] text-[#9A5B00] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Tested Himalayan Staples</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#1E3F20] font-serif">
                {activeCategoryObj ? activeCategoryObj.name : 'All Himalayan Harvests & Staples'}
              </h1>
              <p className="text-sm sm:text-base text-[#786C5E] mt-1 max-w-2xl">
                {activeCategoryObj
                  ? activeCategoryObj.description
                  : 'Pure raw mountain honey, Vedic Bilona A2 Ghee, Mamra almonds, Mongra saffron, and wood-pressed virgin oils sourced directly from Jammu & Kashmir.'}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#786C5E] bg-white px-3 py-2 rounded-xl border border-[#EFE5D5] shadow-xs">
                Showing <strong className="text-[#1E3F20]">{filteredProducts.length}</strong> items
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-[#1E3F20] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Tabs Bar (Horizontal Scrollable) */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-[#1E3F20] text-white border-[#1E3F20] shadow-sm'
                : 'bg-white text-[#374151] border-[#EFE5D5] hover:bg-[#FEF7EB]'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const catProductCount = getCategoryProductCount(products, cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1E3F20] text-white border-[#1E3F20] shadow-sm'
                    : 'bg-white text-[#374151] border-[#EFE5D5] hover:bg-[#FEF7EB]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF8F5] text-[#786C5E]'
                }`}>
                  {catProductCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Pill Bar & Controls */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#EFE5D5] mb-8 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Active Filter Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#786C5E] mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Active:</span>
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEF7EB] text-[#9A5B00] border border-[#F5DCB7] text-xs font-bold">
                <span>{activeCategoryObj?.shortName || selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEF7EB] text-[#9A5B00] border border-[#F5DCB7] text-xs font-bold">
                <span>"{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {priceRange < 3000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#374151] border border-[#EFE5D5] text-xs font-bold">
                <span>Under ₹{priceRange}</span>
                <button onClick={() => setPriceRange(3000)} className="hover:text-red-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(selectedCategory !== 'all' || searchQuery || inStockOnly || priceRange < 3000) && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-[#9A5B00] hover:underline font-bold ml-2 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Sort By & View Controls */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#374151]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#786C5E]" />
              <span className="font-semibold hidden sm:inline">Sort:</span>
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20] cursor-pointer"
              >
                <option value="featured">Featured & Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex rounded-xl bg-[#FAF8F5] p-0.5 border border-[#EFE5D5]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#1E3F20] text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#1E3F20] text-white' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid & Desktop Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#EFE5D5] shadow-xs sticky top-28 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE5D5]">
                <h3 className="font-bold text-[#1E3F20] text-sm font-serif flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#9A5B00]" />
                  <span>Filter Products</span>
                </h3>
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-semibold text-[#786C5E] hover:text-[#9A5B00] cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Search Inside Catalog */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-2">
                  Keyword Search
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Honey, Ghee, Almonds..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* FSSAI Categories Filter */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-2">
                  FSSAI Food Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#1E3F20] text-white'
                        : 'text-[#374151] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>All {categories.length} Categories</span>
                    <span className="text-[10px] opacity-75">{products.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#1E3F20] text-white'
                          : 'text-[#374151] hover:bg-[#FEF7EB]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="truncate max-w-[140px]">{cat.shortName}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        selectedCategory === cat.id ? 'bg-white/20' : 'bg-[#FAF8F5] text-[#786C5E]'
                      }`}>
                        {getCategoryProductCount(products, cat.id)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Slider */}
              <div className="pt-2 border-t border-[#EFE5D5]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#374151]">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-[#9A5B00]">
                    Up to ₹{priceRange}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#1E3F20] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#786C5E] mt-1">
                  <span>₹200</span>
                  <span>₹1,500</span>
                  <span>₹3,000</span>
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="pt-2 border-t border-[#EFE5D5]">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-[#374151]">
                    In Stock Items Only
                  </span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-[#1E3F20] rounded-sm focus:ring-[#1E3F20] accent-[#1E3F20]"
                  />
                </label>
              </div>

              {/* Trust Badge */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFE5D5] text-center">
                <span className="text-lg block mb-1">🏔️</span>
                <p className="text-xs font-bold text-[#1E3F20]">Direct Farmgate Harvest</p>
                <p className="text-[10px] text-[#786C5E] mt-0.5">
                  Every jar NMR lab-tested with verifiable batch reports.
                </p>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EFE5D5] shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FEF7EB] flex items-center justify-center text-3xl mx-auto mb-4 border border-[#F5DCB7]">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-[#1E3F20] mb-2 font-serif">
                  No products matched your criteria
                </h3>
                <p className="text-sm text-[#786C5E] max-w-md mx-auto mb-6">
                  Try clearing the search query or adjusting your filters to see our full range of 100% pure Himalayan staples.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 bg-[#1E3F20] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#2D5A27] transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>

      </div>

      {/* Mobile Filter Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white h-full ml-auto p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EFE5D5]">
                <h3 className="font-bold text-[#1E3F20] font-serif flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#9A5B00]" />
                  <span>Filter Products</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-[#FAF8F5] rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FSSAI Categories */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left ${
                      selectedCategory === 'all' ? 'bg-[#1E3F20] text-white' : 'text-[#374151] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px]">{products.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left ${
                        selectedCategory === cat.id ? 'bg-[#1E3F20] text-white' : 'text-[#374151] hover:bg-[#FEF7EB]'
                      }`}
                    >
                      <span>{cat.icon} {cat.shortName}</span>
                      <span className="text-[10px]">{getCategoryProductCount(products, cat.id)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#374151]">Max Price</label>
                  <span className="text-xs font-bold text-[#9A5B00]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#1E3F20]"
                />
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#374151]">In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#1E3F20]"
                  />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EFE5D5] flex gap-3">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2.5 bg-[#FAF8F5] text-[#374151] text-xs font-bold rounded-xl border border-[#EFE5D5] cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#1E3F20] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};