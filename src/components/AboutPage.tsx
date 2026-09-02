import React from 'react';
import { useStore } from '../context/StoreContext';
import { ComparisonChart } from './ComparisonChart';
import { BrandVideoStory } from './BrandVideoStory';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  Trees,
  CheckCircle2,
  Mountain,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7EB] border border-[#F5DCB7] text-[#9A5B00] text-xs font-bold uppercase tracking-wider mb-4">
            <Mountain className="w-4 h-4" />
            <span>High-Altitude Himalayan Heritage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#1E3F20] font-serif mb-6 tracking-tight">
            Preserving Kashmir's Purest Mountain Harvests
          </h1>

          <p className="text-base sm:text-lg text-[#786C5E] leading-relaxed">
            BloomBee Naturals was born in the pristine valleys of Jammu &amp; Kashmir with a singular mission: to deliver wild, unheated, unpasteurized honey, Vedic A2 Bilona ghee, and artisan dry fruits directly from the hive and grove to your table.
          </p>
        </div>

        {/* 3 Origin Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-[#EFE5D5] shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7EB] flex items-center justify-center text-[#9A5B00] mb-4 border border-[#F5DCB7]">
              <Mountain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1E3F20] font-serif mb-2">
              High Altitude Apiaries
            </h3>
            <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed">
              Our bee boxes reside in untouched Himalayan alpine meadows between 6,000 to 9,500 feet above sea level, foraging on wild Acacia, Sidr, Kikar, and Kashmiri forest blooms far away from pesticide spray zones.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EFE5D5] shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7EB] flex items-center justify-center text-[#2D5A27] mb-4 border border-[#F5DCB7]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1E3F20] font-serif mb-2">
              Zero-Harm Ethical Beekeeping
            </h3>
            <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed">
              We never smoke out or harm bees, and we never harvest their winter honey stores. We only extract the natural surplus using traditional cold gravity straining, leaving live pollen and diastase enzymes intact.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EFE5D5] shadow-xs relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7EB] flex items-center justify-center text-[#9A5B00] mb-4 border border-[#F5DCB7]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1E3F20] font-serif mb-2">
              Every Batch NMR Tested
            </h3>
            <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed">
              Nuclear Magnetic Resonance (NMR) spectroscopy profiles 100% of organic compounds. Every batch is certified free of C4 inverted corn syrups, C3 rice syrup, adulterants, and artificial preservatives.
            </p>
          </div>
        </div>

        {/* Video Story Section */}
        <div className="mb-16">
          <BrandVideoStory />
        </div>

        {/* Raw vs Commercial Comparison Chart */}
        <div className="mb-16">
          <ComparisonChart />
        </div>

        {/* Meet Our Cooperative Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EFE5D5] shadow-xs mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF7EB] text-[#9A5B00] text-xs font-bold mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>Valley Cooperative Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3F20] font-serif mb-4">
                Empowering Over 180+ Kashmiri Beekeeper Families
              </h2>
              <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed mb-4">
                By eliminating exploitative middlemen and commercial processing factories, BloomBee Naturals pays fair, premium farmgate prices directly to traditional apiarists across Srinagar, Pulwama, Pahalgam, Kishtwar, and Bhaderwah.
              </p>
              <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed mb-6">
                This enables our artisan partners to continue ancient Himalayan beekeeping practices without using chemical accelerants or sugar syrups to artificially boost yields.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EFE5D5]">
                <div>
                  <strong className="text-2xl font-bold text-[#1E3F20] font-serif block">180+</strong>
                  <span className="text-xs text-[#786C5E]">Beekeeper Partners</span>
                </div>
                <div>
                  <strong className="text-2xl font-bold text-[#1E3F20] font-serif block">8</strong>
                  <span className="text-xs text-[#786C5E]">FSSAI Licensed Lines</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#EFE5D5] shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=1000"
                alt="Beekeeping in Kashmir Valley"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold text-[#F3C067] uppercase tracking-wider">Pahalgam Apiary, J&amp;K</span>
                <h4 className="text-base font-bold">Traditional wooden hive extraction during wild acacia bloom season</h4>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Callout */}
        <div className="text-center bg-[#FEF7EB] border border-[#F5DCB7] rounded-3xl p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1E3F20] font-serif mb-3">
            Taste the Himalayan Difference Today
          </h3>
          <p className="text-sm text-[#786C5E] max-w-xl mx-auto mb-6">
            Explore our laboratory-tested raw honey, Vedic A2 Bilona cow ghee, and Kashmiri Mamra almonds with direct door delivery across India.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Pure Harvests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentView('lab-reports');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white hover:bg-[#FAF8F5] text-[#1E3F20] text-xs font-bold rounded-xl border border-[#EFE5D5] transition-all cursor-pointer"
            >
              Verify Batch NMR Certificate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
