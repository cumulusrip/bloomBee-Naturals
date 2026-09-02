import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { TrustBadges } from './components/TrustBadges';
import { ComparisonChart } from './components/ComparisonChart';
import { BrandVideoStory } from './components/BrandVideoStory';
import { FSSAICategoriesSection } from './components/FSSAICategoriesSection';
import { ProductCard } from './components/ProductCard';
import { PDPView } from './components/PDPView';
import { CartDrawer } from './components/CartDrawer';
import { GuestCheckoutModal } from './components/GuestCheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { LabTestCertificateModal } from './components/LabTestCertificateModal';
import { B2BWholesaleModal } from './components/B2BWholesaleModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ShopPage } from './components/ShopPage';
import { CategoriesPage } from './components/CategoriesPage';
import { AboutPage } from './components/AboutPage';
import { LabReportsPage } from './components/LabReportsPage';
import { WholesalePage } from './components/WholesalePage';
import { ContactPage } from './components/ContactPage';
import { AccountPage } from './components/AccountPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LegalPoliciesView } from './components/LegalPoliciesView';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Star,
  ExternalLink,
  Truck,
  ArrowRight,
} from 'lucide-react';

const HomeView: React.FC = () => {
  const { setSelectedCategory, setCurrentView, products } = useStore();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <HeroBanner
        onExploreClick={() => {
          setCurrentView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onWhyRawClick={() => {
          document.getElementById('fssai-categories')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Trust & Purity Strip */}
      <TrustBadges />

      {/* 8 FSSAI Categories Showcase */}
      <div id="fssai-categories">
        <FSSAICategoriesSection
          activeCategory="all"
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      {/* Featured Harvest Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#9A5B00] bg-[#FEF7EB] px-3 py-1 rounded-full border border-[#F5DCB7] inline-block mb-2">
              Micro-Harvest Highlights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3F20]">
              Featured Mountain Superfoods
            </h2>
            <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
              Top lab-verified unheated honey, Vedic bilona ghee, and Kashmiri Mamra almonds.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1E3F20] hover:text-[#9A5B00] bg-white border border-[#EFE5D5] px-4 py-2.5 rounded-full transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Jammu & Kashmir Himalayan Valley Documentary & Cooperatives Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandVideoStory />
      </div>

      {/* Raw vs Commercial Honey Education Comparison */}
      <ComparisonChart />

      {/* Customer Testimonials Strip */}
      <section className="bg-[#FAF8F5] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9A5B00] bg-[#FEF7EB] px-3 py-1 rounded-full border border-[#F5DCB7] inline-block mb-2">
            Verified Customer Reviews
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3F20]">
            Loved by 12,000+ Wellness Enthusiasts
          </h2>
          <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
            Real feedback from conscious families who made the switch to authentic mountain harvests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Ananya Sengupta',
              role: 'Integrative Nutritionist, Bengaluru',
              rating: 5,
              title: 'Remarkable Diastase & Enzyme Activity',
              comment:
                'Recommending unheated, active honey is crucial for therapeutic gut microbiome benefits. BloomBee’s Wildflower Honey passed our independent checks with zero C4 sugar adulteration.',
              harvest: 'Raw Himalayan Wildflower Honey (500g)',
            },
            {
              name: 'Rajesh K. Varma',
              role: 'Verified Buyer, New Delhi',
              rating: 5,
              title: 'Seamless Checkout & 5-Day Delivery',
              comment:
                'The checkout took seconds. Received the glass jar cushioned safely in 5 business days. The aroma and crystallized texture prove its authenticity.',
              harvest: 'Himalayan White Acacia Honey (500g)',
            },
            {
              name: 'Pooja Deshmukh',
              role: 'Yoga Instructor & Mother, Pune',
              rating: 5,
              title: 'Subtle Floral Fragrance & Raw Pollen',
              comment:
                'The Kashmir Acacia is so delicate and pure. My family enjoys a spoonful every morning with lukewarm lemon water. Love having the NMR certificate right on the website.',
              harvest: 'Kashmiri Organic White Honey (500g)',
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-[#EFE5D5] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[#E69500]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E69500]" />
                  ))}
                </div>
                <h4 className="font-bold text-sm text-[#1E3F20]">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFE5D5]">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#1E3F20] block">{rev.name}</strong>
                    <span className="text-[11px] text-gray-500">{rev.role}</span>
                  </div>
                  <span className="text-[10px] bg-[#F0F7EE] text-[#2D5A27] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <span className="text-[10px] text-[#9A5B00] mt-1 block">
                  Purchased: {rev.harvest}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Channel Marketplace Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#1E3F20] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[#F3C067] text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              Omnichannel Experience
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Available on India's Leading Platforms
            </h3>
            <p className="text-xs sm:text-sm text-[#D4E8D2] leading-relaxed">
              BloomBee Naturals is also available with Prime and Assured fast delivery across leading e-commerce platforms. Every single package carries an authentic batch NMR lab certificate.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#1E3F20] px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
              >
                <span>Amazon Prime</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://flipkart.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#1E3F20] px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
              >
                <span>Flipkart Assured</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://meesho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#1E3F20] px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
              >
                <span>Meesho Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://jiomart.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#1E3F20] px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
              >
                <span>JioMart Grocery</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 opacity-5 select-none pointer-events-none">
            <Sparkles className="w-48 h-48 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
};

const MainContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedProduct,
    activePDPProduct,
    closePDP,
    trackedOrderNumber,
    setTrackedOrderNumber,
  } = useStore();

  const currentPDPProduct = activePDPProduct || selectedProduct;

  const renderCurrentView = () => {
    if (currentView === 'pdp' && currentPDPProduct) {
      return (
        <PDPView
          product={currentPDPProduct}
          onBack={() => {
            closePDP();
            setCurrentView('shop');
          }}
        />
      );
    }

    switch (currentView) {
      case 'shop':
      case 'catalog':
        return <ShopPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'about':
        return <AboutPage />;
      case 'lab-reports':
        return <LabReportsPage />;
      case 'wholesale':
        return <WholesalePage />;
      case 'contact':
        return <ContactPage />;
      case 'account':
        return <AccountPage />;
      case 'privacy-policy':
        return <LegalPoliciesView initialTab="privacy" />;
      case 'terms-conditions':
        return <LegalPoliciesView initialTab="terms" />;
      case 'returns-refunds':
        return <LegalPoliciesView initialTab="returns" />;
      case 'shipping-delivery':
        return <LegalPoliciesView initialTab="shipping" />;
      case 'tracking':
        return (
          <OrderTrackingView
            initialOrderNumber={trackedOrderNumber}
            onBackToShop={() => setCurrentView('shop')}
          />
        );
      case 'admin':
        return <AdminDashboard />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans antialiased text-[#1F2937] selection:bg-[#E69500] selection:text-white pb-16 lg:pb-0">
      {/* Sticky Brand Navigation */}
      <Navbar />

      {/* Main Multi-Page Route View */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <GuestCheckoutModal />
      <OrderSuccessModal
        onTrackOrder={(orderNumber) => {
          setTrackedOrderNumber(orderNumber);
          setCurrentView('tracking');
        }}
      />
      <LabTestCertificateModal />
      <B2BWholesaleModal />
      <AdminLoginModal />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}

