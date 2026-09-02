import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Truck,
  Award,
  Flame,
  Star,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroBannerProps {
  onExploreClick: () => void;
  onWhyRawClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onWhyRawClick,
}) => {
  const { products, openPDP } = useStore();
  const featuredProduct = products[0];
  // Pull the live price from the featured product's first variant instead of
  // a hardcoded number, so this banner updates whenever an admin changes the price.
  const heroVariant = featuredProduct?.variants?.[0];
  const heroPrice = heroVariant?.price ?? 229;
  const heroOriginalPrice = heroVariant?.originalPrice ?? 249;
  const heroWeight = heroVariant?.weight ?? '250g';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FEF9F0] via-[#FAF8F5] to-[#FAF8F5] pt-8 pb-16 md:py-20 border-b border-[#EFE5D5]">
      
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#E69500]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#1E3F20]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#E69500]/40 rounded-full px-3.5 py-1.5 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#E69500] animate-pulse" />
              <span className="text-xs font-bold text-[#9A5B00] uppercase tracking-wider">
                FSSAI Licensed • Pure Himalayan Harvest • 8 Food Categories
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3F20] tracking-tight leading-[1.15]">
              Bringing the Pure Goodness of <br />
              <span className="text-[#9A5B00]">Jammu & Kashmir to Your Home</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl leading-relaxed font-normal">
              From the pristine valleys of Jammu & Kashmir to homes across India, BloomBee Naturals brings together nature’s finest offerings and traditional Indian goodness. 
              <strong className="text-[#1E3F20] font-semibold"> Explore 100% Pure Raw Honey, Vedic A2 Ghee, Kashmiri Mamra Almonds, Saffron, Cold-Pressed Oils and carefully selected mountain staples.


</strong>
            </p>

            {/* Key Value Propositions Checklist */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-medium text-[#2E382D]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0" />
                <span>100% Pure Himalayan Raw Honey</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0" />
                <span>Vedic Bilona A2 Gir Cow Ghee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0" />
                <span>GI-Tagged Kashmiri Produce &amp; Nuts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0" />
                <span>Wood Cold-Pressed Native Oils</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 bg-[#E69500] hover:bg-[#D48B00] text-white px-7 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Shop All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#fssai-categories"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#1E3F20] border border-[#D9CDBF] px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-xs hover:border-[#1E3F20] transition-colors cursor-pointer"
              >
                <span>Browse All FSSAI Categories</span>
              </a>
            </div>

            {/* Delivery Guarantee Notice */}
            <div className="flex items-center gap-2.5 pt-2 text-xs text-[#5D6B5C]">
              <Truck className="w-4 h-4 text-[#2D5A27] shrink-0" />
              <span>
                <strong>Standard Delivery:</strong> 5–7 Business Days across all pin codes in India.
              </span>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative mb-10 sm:mb-14">
            
            {/* Main Featured Glass Jar Card */}
            <div className="relative bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-[#EFE5D5] transition-all hover:shadow-2xl">
              
              {/* Badge Overlays */}
              <div className="absolute top-6 left-6 z-10 bg-[#1E3F20] text-[#FAF8F5] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#E69500]" />
                Jammu &amp; Kashmir Harvest
              </div>

              <div className="absolute top-6 right-6 z-10 bg-[#FEF7EB] text-[#9A5B00] border border-[#E69500]/30 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#E69500] text-[#E69500]" />
                5.0 (480+ reviews)
              </div>

              {/* Product Hero Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] mb-5 group cursor-pointer"
                   onClick={() => featuredProduct && openPDP(featuredProduct)}>
                <img
                  src={featuredProduct && featuredProduct.images && featuredProduct.images.length > 0 ? featuredProduct.images[0] : 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1000&q=80'}
                  alt="BloomBee Naturals Himalayan Honey Jar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Live Floating Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#EFE5D5] flex items-center justify-between text-xs shadow-sm">
                  <div>
                    <span className="font-bold text-[#1E3F20] block">
                      Himalayan Honey ({heroWeight})
                    </span>
                    <span className="text-[10px] text-[#2D5A27] font-semibold">
                      No Added Sugar • 100% Pure
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#9A5B00] text-sm block">
                      ₹{heroPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#786C5E] line-through">
                      MRP ₹{heroOriginalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & NMR Verification Pill */}
              <div className="space-y-3">
                {/* <div className="flex items-center justify-between text-xs text-[#5D6B5C] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EFE5D5]"> */}
                  {/* <span className="flex items-center gap-1.5 font-medium text-[#1E3F20]">
                    <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
                    NMR Batch: BBN-JK-2026
                  </span> */}
                  {/* <span className="text-[#2D5A27] font-semibold">100% Purity Certified</span> */}
                {/* </div> */}

                <button
                  onClick={() => featuredProduct && openPDP(featuredProduct)}
                  className="w-full bg-[#1E3F20] hover:bg-[#2D5A27] text-white py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Shop Himalayan Honey {heroWeight} (₹{heroPrice.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Floating Trust Card */}
            <div className="hidden sm:flex absolute -bottom-10 -left-6 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-[#EFE5D5] items-center gap-3 max-w-[220px]">
              <div className="w-10 h-10 rounded-full bg-[#E69500]/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#9A5B00]" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-[#1E3F20] leading-tight">
                  Ethical Beekeeping
                </p>
                <p className="text-[10px] text-[#786C5E] leading-tight mt-0.5">
                  Never harm queen bees or starve colonies.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};