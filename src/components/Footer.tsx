import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Award,
  Check,
  Layers,
  FileText,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BloomBeeLogo } from './BloomBeeLogo';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, adminSettings, categories } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNav = (view: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryNav = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.includes('@')) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-[#1E3F20] text-[#FAF8F5] pt-16 pb-16 md:pb-12 border-t-4 border-[#E69500]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Newsletter Strip */}
        <div className="bg-[#163018] rounded-3xl p-6 sm:p-10 border border-[#2D5A27] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[#E69500] text-xs font-bold uppercase tracking-widest flex items-center justify-center lg:justify-start gap-1.5">
              <Sparkles className="w-4 h-4" />
              Pure Jammu &amp; Kashmir Harvests
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              From the Himalayas to Your Home
            </h3>
            <p className="text-xs sm:text-sm text-[#D4E8D2] max-w-md">
              Subscribe for seasonal micro-harvest notifications, fresh NMR batch lab certificates, and exclusive member savings.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="bg-[#F0F7EE] text-[#1E3F20] px-6 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-[#2D5A27]" />
                <span>Subscribed! Use code <strong>BLOOM10</strong> for 10% off your first order.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-2xl px-4 py-3 text-xs outline-none focus:border-[#E69500] flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#E69500] hover:bg-[#D48B00] text-[#1E3F20] px-6 py-3 rounded-2xl font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-[#D4E8D2]">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BloomBeeLogo variant="white" size="lg" />

            <p className="text-xs text-[#CBD5C0] leading-relaxed max-w-sm">
              BloomBee Naturals delivers wild, raw, unheated mountain honey, Vedic A2 Bilona cow ghee, Kashmiri Mamra almonds, and authentic organic staples directly from verified grower cooperatives in Jammu &amp; Kashmir.
            </p>

            <div className="pt-2 text-[11px] text-[#A3B899] space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E69500] shrink-0" />
                <span>Valley Orchard Road, Srinagar, Jammu &amp; Kashmir - 190001, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#E69500] shrink-0" />
                <span>FSSAI Central License: 11026999000182 (8 Categories)</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#E69500] shrink-0" />
                <span>Standard Delivery: 5–7 Business Days across India</span>
              </div>
            </div>
          </div>

          {/* Col 2: Licensed Product Categories (dynamic — mirrors Admin > Categories) */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-serif">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryNav(cat.id)}
                    className="hover:text-[#E69500] transition-colors cursor-pointer text-left"
                  >
                    {cat.shortName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-serif">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-[#E69500] transition-colors cursor-pointer">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#E69500] transition-colors cursor-pointer">
                  Our Story &amp; Heritage
                </button>
              </li>
              {/* <li>
                <button onClick={() => handleNav('lab-reports')} className="hover:text-[#E69500] transition-colors cursor-pointer">
                  NMR Lab Test Certificates
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('wholesale')} className="hover:text-[#E69500] transition-colors cursor-pointer">
                  B2B Wholesale &amp; Bulk
                </button>
              </li> */}
              <li>
                <button onClick={() => handleNav('tracking')} className="hover:text-[#E69500] transition-colors cursor-pointer">
                  Track Order (AWB)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#E69500] transition-colors cursor-pointer">
                  Customer Support &amp; FAQs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account')} className="hover:text-[#E69500] transition-colors cursor-pointer">
                  Guest Hub &amp; Favorites
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin')} className="hover:text-[#E69500] transition-colors text-amber-400 font-semibold cursor-pointer">
                  Admin Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-serif">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('privacy-policy')} className="hover:text-[#E69500] transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms-conditions')} className="hover:text-[#E69500] transition-colors cursor-pointer text-left">
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('returns-refunds')} className="hover:text-[#E69500] transition-colors cursor-pointer text-left">
                  Returns &amp; Refunds Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shipping-delivery')} className="hover:text-[#E69500] transition-colors cursor-pointer text-left">
                  Shipping &amp; Delivery Policy
                </button>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <h5 className="font-semibold text-white text-[11px] uppercase tracking-wider">
                Direct Contact
              </h5>
              <p className="text-[#CBD5C0]">
                Email: <a href="mailto:info@bloombeenaturals.com" className="text-white hover:underline">info@bloombeenaturals.com</a>
              </p>
              <p className="text-[#CBD5C0]">
                Phone: <a href="tel:+918146553516" className="text-white hover:underline">+91 81465 53516</a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A3B899]">
          <p>© 2026 BloomBee Naturals. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('privacy-policy')} className="hover:text-white transition-colors cursor-pointer">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => handleNav('terms-conditions')} className="hover:text-white transition-colors cursor-pointer">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => handleNav('returns-refunds')} className="hover:text-white transition-colors cursor-pointer">
              Returns &amp; Refunds
            </button>
            <span>•</span>
            <button onClick={() => handleNav('shipping-delivery')} className="hover:text-white transition-colors cursor-pointer">
              Shipping &amp; Delivery
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};