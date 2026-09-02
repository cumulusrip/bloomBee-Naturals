import React from 'react';
import { useStore } from '../context/StoreContext';
import { productMatchesCategory } from '../data/initialData';
import { ProductCard } from './ProductCard';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { products, categories, setSelectedCategory, setCurrentView } = useStore();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7EB] border border-[#F5DCB7] text-[#9A5B00] text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-4 h-4" />
            <span>FSSAI Central Licensed Food Business</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#1E3F20] font-serif mb-4 tracking-tight">
            {categories.length} Authorized Himalayan Food Categories
          </h1>

          <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
            BloomBee Naturals is legally certified and authorized across {categories.length} distinct FSSAI Food Categories under License <strong>#11026999000182</strong>. Every category adheres to rigorous farmgate purity, NMR spectroscopy, and zero-adulteration standards.
          </p>

          {/* Trust Banner */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#EFE5D5] shadow-xs">
            <div className="text-center p-2 flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-[#2D5A27] mb-1" />
              <strong className="text-xs text-[#1E3F20] block">100% NMR Tested</strong>
              <span className="text-[10px] text-[#786C5E]">Zero synthetic syrups</span>
            </div>
            <div className="text-center p-2 flex flex-col items-center">
              <Award className="w-5 h-5 text-[#9A5B00] mb-1" />
              <strong className="text-xs text-[#1E3F20] block">Jammu &amp; Kashmir</strong>
              <span className="text-[10px] text-[#786C5E]">High altitude harvest</span>
            </div>
            <div className="text-center p-2 flex flex-col items-center">
              <Sparkles className="w-5 h-5 text-[#9A5B00] mb-1" />
              <strong className="text-xs text-[#1E3F20] block">Vedic Bilona</strong>
              <span className="text-[10px] text-[#786C5E]">Curd-churned ghee</span>
            </div>
            <div className="text-center p-2 flex flex-col items-center">
              <FileText className="w-5 h-5 text-[#2D5A27] mb-1" />
              <strong className="text-xs text-[#1E3F20] block">{categories.length} Food Codes</strong>
              <span className="text-[10px] text-[#786C5E]">Fully authorized</span>
            </div>
          </div>
        </div>

        {/* 8 Categories Deep Dive */}
        <div className="space-y-12 sm:space-y-16">
          {categories.map((cat, idx) => {
            const categoryProducts = products.filter((p) => productMatchesCategory(p, cat.id));

            return (
              <section
                key={cat.id}
                id={`category-${cat.id}`}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5D5] shadow-xs relative overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFE5D5] pb-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FEF7EB] flex items-center justify-center text-[#9A5B00] border border-[#F5DCB7] shrink-0">
                      <Layers className="w-7 h-7 text-[#9A5B00]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#1E3F20] text-white text-[10px] font-bold tracking-wider uppercase">
                          Food Code {cat.fssaiCode}
                        </span>
                        <span className="text-xs font-semibold text-[#9A5B00]">
                          {categoryProducts.length} Harvest Products
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1E3F20] font-serif">
                        {cat.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#786C5E] mt-1 max-w-2xl">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCategorySelect(cat.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0 self-start md:self-auto"
                  >
                    <span>View All {cat.shortName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Products Preview */}
                {categoryProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.slice(0, 3).map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-[#FAF8F5] rounded-2xl text-center border border-[#EFE5D5]">
                    <p className="text-xs text-[#786C5E]">Seasonal batch currently being harvested in Jammu &amp; Kashmir.</p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Regulatory Footer Callout */}
        <div className="mt-12 bg-[#1E3F20] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-[#F3C067]" />
              <span>Government FSSAI License: 11026999000182</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
              Interested in Bulk Supply Across Any Category?
            </h3>
            <p className="text-sm text-gray-200 mb-6 leading-relaxed">
              We supply pure raw honey, Vedic A2 Bilona Ghee, Mamra almonds, and saffron in commercial bulk containers (50kg to 10+ metric tonnes) directly to organic brands, ayurvedic pharmacies, and exporters.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('wholesale');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#E69500] hover:bg-[#CC8400] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Access B2B Wholesale Portal →
              </button>
              <button
                onClick={() => {
                  setCurrentView('lab-reports');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                View Lab Test Certificates
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};