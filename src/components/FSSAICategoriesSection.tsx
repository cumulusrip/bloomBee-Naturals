import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { getCategoryProductCount } from '../data/initialData';
import { ProductCategory } from '../types';
import { useStore } from '../context/StoreContext';

interface FSSAICategoriesSectionProps {
  activeCategory: string;
  onSelectCategory: (cat: ProductCategory | 'all') => void;
}

export const FSSAICategoriesSection: React.FC<FSSAICategoriesSectionProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { products, categories, setSelectedCategory, setCurrentView } = useStore();

  const handleCategoryClick = (catId: ProductCategory) => {
    setSelectedCategory(catId);
    onSelectCategory(catId);
    const catalogElem = document.getElementById('products-catalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="fssai-categories" className="py-14 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] border-b border-[#EFE5D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1E3F20]/10 text-[#1E3F20] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#1E3F20]/20 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
              Official FSSAI Multi-Category Licensed Portfolio
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E3F20]">
              From the Himalayas to Your Home: <br className="hidden sm:inline" />
              <span className="text-[#9A5B00]">Pure Staples Across {categories.length} Licensed Categories</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5D6B5C] max-w-2xl mt-2">
              Beyond pure raw honey, BloomBee Naturals is licensed for wholesale &amp; retail trade across 8 essential food product categories—bringing unadulterated Himalayan superfoods to your pantry.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FEF7EB] border border-[#E69500]/30 rounded-xl px-4 py-2 text-xs text-[#9A5B00] font-medium shrink-0">
            <Sparkles className="w-4 h-4 text-[#E69500]" />
            <span>FSSAI Lic. No: <strong>11025210000092</strong></span>
          </div>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const count = getCategoryProductCount(products, cat.id);
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FEF9F0] border-[#E69500] shadow-md ring-2 ring-[#E69500]/20'
                    : 'bg-white border-[#EFE5D5] hover:border-[#D9CDBF] hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Top Bar: Icon & Category Code */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFE5D5] group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </span>
                    <span className="text-[11px] font-bold text-[#786C5E] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EFE5D5]">
                      Cat {cat.fssaiCode}
                    </span>
                  </div>

                  {/* Category Name */}
                  <h3 className="font-display text-base font-bold text-[#1E3F20] group-hover:text-[#9A5B00] transition-colors mb-1.5">
                    {cat.shortName}
                  </h3>

                  {/* FSSAI Official Subtext */}
                  <p className="text-[11px] font-medium text-[#786C5E] mb-2 line-clamp-1">
                    {cat.fssaiOfficialTitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-[#5D6B5C] leading-relaxed line-clamp-3 mb-4">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-3 border-t border-[#EFE5D5]/80 text-xs font-semibold">
                  <span className="text-[#9A5B00]">
                    {count > 0 ? `${count} ${count === 1 ? 'Product' : 'Products'}` : 'Available'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#1E3F20] group-hover:text-[#9A5B00] transition-colors">
                    Explore
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wholesale & Retail Trade Notice */}
        <div className="mt-8 bg-[#1E3F20] text-white rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#E69500]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#E69500]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Authorized for Trade/Retail Wholesaler &amp; Retailer
              </h4>
              <p className="text-xs text-[#D4E8D2] mt-0.5">
                Bulk ordering, B2B wholesale dispatch, and direct-to-consumer delivery for all {categories.length} categories across India.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectCategory('all');
              const catalogElem = document.getElementById('products-catalog');
              if (catalogElem) {
                catalogElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 bg-[#E69500] hover:bg-[#D48B00] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};