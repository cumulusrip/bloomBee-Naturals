import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  ArrowLeft,
  ShoppingBag,
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Share2,
  FileText,
  Clock,
  Sparkles,
  Award,
  Check,
  Plus,
  MessageSquare,
  X,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useStore } from '../context/StoreContext';

interface PDPViewProps {
  product: Product;
  onBack: () => void;
}

export const PDPView: React.FC<PDPViewProps> = ({ product, onBack }) => {
  const { addToCart, setIsGuestCheckoutOpen, openLabReportModal, reviews, addReview } = useStore();

  const DEFAULT_VARIANT: ProductVariant = {
    id: `v-${product.id}-default`,
    weight: 'Standard Pack',
    price: 499,
    originalPrice: 599,
    stock: 50,
    sku: 'BBN-DEFAULT',
  };
  // Store only the selected variant id and re-derive the live variant object
  // from `product.variants` every render, so admin price/stock edits show up
  // immediately instead of being frozen in a stale useState snapshot.
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    (product.variants[0] || DEFAULT_VARIANT).id
  );
  const selectedVariant: ProductVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0] ||
    DEFAULT_VARIANT;
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review Form Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState(false);

  // Accordion open states
  const [openSection, setOpenSection] = useState<'nutrition' | 'origin' | 'purity' | 'faq'>('purity');

  const discountPercent =
    selectedVariant.originalPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.originalPrice - selectedVariant.price) /
            selectedVariant.originalPrice) *
            100
        )
      : 0;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    setIsGuestCheckoutOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    addReview({
      productId: product.id,
      author: newReviewAuthor.trim(),
      location: newReviewLocation.trim() || 'India',
      rating: newReviewRating,
      title: newReviewTitle.trim() || 'Verified Buyer Experience',
      comment: newReviewComment.trim(),
      verifiedBuyer: true,
      variantBought: selectedVariant.weight || 'Standard Pack',
    });

    setReviewSubmittedMsg(true);
    setTimeout(() => {
      setReviewSubmittedMsg(false);
      setIsReviewModalOpen(false);
      setNewReviewAuthor('');
      setNewReviewLocation('');
      setNewReviewTitle('');
      setNewReviewComment('');
    }, 2000);
  };

  return (
    <div className="py-6 sm:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EFE5D5] gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1E3F20] hover:text-[#9A5B00] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Collections</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#786C5E] hover:text-[#1E3F20] bg-white border border-[#D9CDBF] px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2D5A27]" />
                <span className="text-[#2D5A27]">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Product</span>
              </>
            )}
          </button>
        </div>

        {/* Product PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left Column: Image Gallery with Zoom / Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Featured Image with Zoom & Badges */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-[#EFE5D5] shadow-md group">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-[#1E3F20] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {product.categoryLabel}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-[#E69500] text-white text-[11px] sm:text-xs font-bold px-3 py-0.5 rounded-full shadow-sm">
                    {discountPercent}% SAVINGS
                  </span>
                )}
              </div>

              {/* NMR Certificate Badge trigger */}
              {/* {product.purityReport?.nmrTested && (
                <button
                  onClick={() => openLabReportModal(product)}
                  className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2.5 rounded-2xl border border-[#2D5A27]/20 flex items-center justify-between shadow-md hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D5A27] shrink-0" />
                    <span className="text-xs font-bold text-[#1E3F20] truncate">
                      NMR Tested Batch: {product.purityReport.batchNo}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#9A5B00] underline shrink-0">
                    View Lab Report →
                  </span>
                </button>
              )} */}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-[#9A5B00] shadow-md scale-105'
                        : 'border-[#EFE5D5] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Harvest Traceability Box */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EFE5D5] space-y-2.5 text-xs text-[#4B5563]">
              <div className="flex items-start sm:items-center justify-between border-b border-[#EFE5D5] pb-2 gap-2">
                <span className="font-semibold text-[#1E3F20] shrink-0">📍 Origin:</span>
                <span className="text-right text-[#1E3F20] font-medium">{product.origin || 'Pristine Valleys of Jammu & Kashmir, Himalayas, India'}</span>
              </div>
              <div className="flex items-start sm:items-center justify-between border-b border-[#EFE5D5] pb-2 gap-2">
                <span className="font-semibold text-[#1E3F20] shrink-0">🌸 Source / Variety:</span>
                <span className="text-right text-[#1E3F20] font-medium">{product.floraSource || 'Wild Himalayan Clover, Kashmir Apple Blossom, Robinia & Alpine Herbs'}</span>
              </div>
              <div className="flex items-start sm:items-center justify-between border-b border-[#EFE5D5] pb-2 gap-2">
                <span className="font-semibold text-[#1E3F20] shrink-0">⚙️ Process Method:</span>
                <span className="text-right text-[#2D5A27] font-semibold">{product.harvestingMethod || 'Traditional Gravity Cold-Filtration (<35°C, Zero Adulteration)'}</span>
              </div>
              {product.fssaiCategoryCode && (
                <div className="flex items-start sm:items-center justify-between gap-2">
                  <span className="font-semibold text-[#1E3F20] shrink-0">🛡️ FSSAI Category:</span>
                  <span className="text-right text-[#9A5B00] font-semibold">{product.fssaiCategoryCode}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: PDP Product Details & Checkout CTAs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Subtitle */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A5100] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#F5B324]/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#E69500]" />
                  {product.categoryLabel || '100% Pure & Lab Verified'}
                </span>

                <div className="flex items-center gap-1 text-[#9A5B00] font-bold text-sm">
                  <Star className="w-4 h-4 fill-[#E69500] text-[#E69500]" />
                  <span>{product.rating}</span>
                  <span className="text-[#786C5E] font-normal">
                    ({productReviews.length} reviews)
                  </span>
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E3F20] tracking-tight leading-tight">
                {product.title}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Price Showcase */}
            <div className="bg-[#FEF7EB] p-4 sm:p-5 rounded-2xl border border-[#E69500]/30 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#9A5B00]">
                    ₹{selectedVariant.price.toLocaleString('en-IN')}
                  </span>
                  {selectedVariant.originalPrice > selectedVariant.price && (
                    <>
                      <span className="text-sm sm:text-base text-gray-400 line-through">
                        ₹{selectedVariant.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-[#2D5A27] bg-[#2D5A27]/10 px-2 py-0.5 rounded-md">
                        Save ₹{(selectedVariant.originalPrice - selectedVariant.price).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[#786C5E] mt-1">
                  Inclusive of all taxes. Free Pan-India shipping on orders above ₹799.
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#2D5A27] bg-white px-3 py-1.5 rounded-full border border-[#2D5A27]/20 shadow-xs block">
                  ✓ In Stock ({selectedVariant.stock} units)
                </span>
              </div>
            </div>

            {/* Pack Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E3F20] flex items-center justify-between">
                <span>Select Weight / Pack Size:</span>
                <span className="text-[#9A5B00] font-normal normal-case text-xs">
                  Selected: <strong>{selectedVariant.weight}</strong>
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  const vDiscount =
                    v.originalPrice > v.price
                      ? Math.round(((v.originalPrice - v.price) / v.originalPrice) * 100)
                      : 0;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#9A5B00] bg-[#FEF7EB] shadow-xs'
                          : 'border-[#EFE5D5] bg-white hover:border-[#9A5B00]/50'
                      }`}
                    >
                      <span className="block text-xs sm:text-sm font-bold text-[#1E3F20]">
                        {v.weight}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs sm:text-sm font-extrabold text-[#9A5B00]">
                          ₹{v.price}
                        </span>
                        {v.originalPrice > v.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{v.originalPrice}
                          </span>
                        )}
                      </div>
                      {vDiscount > 0 && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold bg-[#E69500] text-white px-1.5 py-0.2 rounded-md">
                          {vDiscount}% OFF
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#D9CDBF] rounded-2xl bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-[#1E3F20] hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#1E3F20]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-[#1E3F20] hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#1E3F20] hover:bg-[#2D5A27] text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ₹{(selectedVariant.price * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-[#E69500] hover:bg-[#9A5B00] text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Instant Guest Checkout (No Login Needed)</span>
              </button>
            </div>

            {/* Marketplace Alternative Links */}
            {product.marketplaceLinks &&
              Object.values(product.marketplaceLinks).some((link) => link) && (
                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 rounded-2xl border border-[#EFE5D5] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#786C5E] block">
                    Also Available on Official Marketplaces:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.marketplaceLinks.amazonUrl && (
                      <a
                        href={product.marketplaceLinks.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF9900]/10 text-[#8C5400] hover:bg-[#FF9900]/20 rounded-xl border border-[#FF9900]/30 font-bold text-xs transition-colors shadow-2xs"
                      >
                        <span>Amazon India</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {product.marketplaceLinks.flipkartUrl && (
                      <a
                        href={product.marketplaceLinks.flipkartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2874F0]/10 text-[#1B52B3] hover:bg-[#2874F0]/20 rounded-xl border border-[#2874F0]/30 font-bold text-xs transition-colors shadow-2xs"
                      >
                        <span>Flipkart</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {product.marketplaceLinks.meeshoUrl && (
                      <a
                        href={product.marketplaceLinks.meeshoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F43397]/10 text-[#9C135A] hover:bg-[#F43397]/20 rounded-xl border border-[#F43397]/30 font-bold text-xs transition-colors shadow-2xs"
                      >
                        <span>Meesho</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {product.marketplaceLinks.jiomartUrl && (
                      <a
                        href={product.marketplaceLinks.jiomartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0078AD]/10 text-[#00557A] hover:bg-[#0078AD]/20 rounded-xl border border-[#0078AD]/30 font-bold text-xs transition-colors shadow-2xs"
                      >
                        <span>JioMart</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

            {/* Product Accordions */}
            <div className="space-y-3 pt-2">
              
              {/* Accordion 1: Purity & NMR Testing */}
              <div className="bg-white rounded-2xl border border-[#EFE5D5] overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenSection(openSection === 'purity' ? 'origin' : 'purity')}
                  className="w-full p-4 text-left font-display text-sm sm:text-base font-bold text-[#1E3F20] flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
                    Purity Assurance &amp; NMR Spectroscopy
                  </span>
                  {openSection === 'purity' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'purity' && (
                  <div className="p-4 pt-0 border-t border-[#EFE5D5] text-xs sm:text-sm text-[#4B5563] space-y-3">
                    <p className="leading-relaxed">{product.fullDescription}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#FAF8F5] p-3 rounded-xl">
                      <div>
                        <span className="text-[#786C5E] text-[11px] block">NMR Test:</span>
                        <strong className="text-[#2D5A27]">
                          {product.purityReport?.nmrTested ? '100% Passed (0% C4 Sugar)' : 'Batch Lab Certified'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#786C5E] text-[11px] block">Moisture Content:</span>
                        <strong className="text-[#1E3F20]">{product.purityReport?.moisturePercent || 17.2}% (Optimal)</strong>
                      </div>
                    </div>
                    <button
                      onClick={() => openLabReportModal(product)}
                      className="text-xs font-bold text-[#9A5B00] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect Official Lab Certificate Report</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 2: Nutritional Facts */}
              <div className="bg-white rounded-2xl border border-[#EFE5D5] overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenSection(openSection === 'nutrition' ? 'origin' : 'nutrition')}
                  className="w-full p-4 text-left font-display text-sm sm:text-base font-bold text-[#1E3F20] flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E69500]" />
                    Nutritional Information (Per 100g)
                  </span>
                  {openSection === 'nutrition' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'nutrition' && (
                  <div className="p-4 pt-0 border-t border-[#EFE5D5] text-xs sm:text-sm text-[#4B5563]">
                    <div className="divide-y divide-[#EFE5D5]">
                      {product.nutritionalFacts && product.nutritionalFacts.length > 0 ? (
                        product.nutritionalFacts.map((fact, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between">
                            <span className="font-medium text-[#1E3F20]">{fact.nutrient}</span>
                            <span className="font-bold text-[#9A5B00]">{fact.per100g}</span>
                          </div>
                        ))
                      ) : (
                        <div className="py-2 text-xs text-gray-500">
                          100% natural composition with zero synthetic additives.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Health Benefits & Taste Profile */}
              <div className="bg-white rounded-2xl border border-[#EFE5D5] overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenSection(openSection === 'origin' ? 'faq' : 'origin')}
                  className="w-full p-4 text-left font-display text-sm sm:text-base font-bold text-[#1E3F20] flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#2D5A27]" />
                    Taste Notes &amp; Wellness Benefits
                  </span>
                  {openSection === 'origin' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSection === 'origin' && (
                  <div className="p-4 pt-0 border-t border-[#EFE5D5] text-xs sm:text-sm text-[#4B5563] space-y-3">
                    <p className="bg-[#FAF8F5] p-3 rounded-xl italic border border-[#EFE5D5]">
                      <strong>Taste Palette:</strong> {product.tasteNotes}
                    </p>
                    <ul className="space-y-1.5">
                      {product.benefits && product.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#2D5A27] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[#EFE5D5]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E3F20]">
                Customer Reviews &amp; Verified Feedback ({productReviews.length})
              </h3>
              <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
                Real feedback from verified buyers across India.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-[#EFE5D5] shadow-xs">
                <Star className="w-4 h-4 fill-[#E69500] text-[#E69500]" />
                <span className="font-display text-base sm:text-lg font-bold text-[#1E3F20]">
                  {product.rating}
                </span>
                <span className="text-xs text-gray-500">/ 5.0</span>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-[#1E3F20] hover:bg-[#2D5A27] text-white px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>

          {productReviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#EFE5D5] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FEF7EB] text-[#9A5B00] flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-display text-base font-bold text-[#1E3F20]">
                Be the first to review {product.title}!
              </h4>
              <p className="text-xs text-[#786C5E] max-w-md mx-auto">
                Share your tasting experience and feedback with other natural food enthusiasts.
              </p>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-[#9A5B00] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#804b00] cursor-pointer"
              >
                Write Verified Review
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {productReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-[#EFE5D5] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-[#E69500]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#E69500]" />
                        ))}
                      </div>
                      <span className="text-[11px] text-gray-400">{rev.date}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1E3F20] mb-1.5">
                      {rev.title}
                    </h4>
                    <p className="text-xs text-[#4B5563] leading-relaxed mb-4">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#FAF8F5] flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-[#1E3F20] block">{rev.author}</span>
                      <span className="text-gray-400 block">{rev.location}</span>
                    </div>
                    <span className="bg-[#2D5A27]/10 text-[#2D5A27] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Buyer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Customer Write Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EFE5D5] overflow-hidden animate-scale my-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E3F20]">
                  Write a Verified Review
                </h3>
                <p className="text-xs text-[#786C5E] mt-0.5">
                  Reviewing: {product.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmittedMsg ? (
              <div className="p-6 text-center space-y-2 bg-[#F0F7EE] rounded-2xl border border-[#2D5A27]/20">
                <CheckCircle2 className="w-10 h-10 text-[#2D5A27] mx-auto" />
                <h4 className="font-display text-base font-bold text-[#1E3F20]">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-[#2D5A27]">
                  Your verified review has been published to the product page.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#1E3F20] mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReviewRating
                              ? 'fill-[#E69500] text-[#E69500]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#9A5B00] ml-2">
                      {newReviewRating} Star{newReviewRating > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1E3F20] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Priya Sharma"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2 outline-none focus:border-[#9A5B00]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E3F20] mb-1">
                      City &amp; State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={newReviewLocation}
                      onChange={(e) => setNewReviewLocation(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2 outline-none focus:border-[#9A5B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1E3F20] mb-1">
                    Review Headline / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Authentic floral honey with pure crystallization!"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2 outline-none focus:border-[#9A5B00]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1E3F20] mb-1">
                    Your Review &amp; Tasting Experience *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the aroma, taste, texture, and how you enjoy it..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl p-3 outline-none focus:border-[#9A5B00] resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#1E3F20] hover:bg-[#2D5A27] text-white py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-3 border border-[#D9CDBF] rounded-xl font-semibold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};