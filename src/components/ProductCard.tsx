import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  ShoppingBag,
  Zap,
  ArrowRight,
  ExternalLink,
  Check,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openPDP, setIsGuestCheckoutOpen, openLabReportModal } = useStore();
  // Track only the selected variant's id/weight, and always look up the live
  // variant object from `product.variants` on every render. This way, when an
  // admin updates a price, `product` (and its `.variants`) re-renders with
  // fresh data and the displayed price updates immediately everywhere this
  // card is shown — instead of freezing a stale price/stock snapshot forever.
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id
  );
  const selectedVariant: ProductVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = Math.round(
    ((selectedVariant.originalPrice - selectedVariant.price) /
      selectedVariant.originalPrice) *
      100
  );

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    setIsGuestCheckoutOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
  };

  const hasMarketplace =
    product.marketplaceLinks &&
    (product.marketplaceLinks.amazonUrl ||
      product.marketplaceLinks.flipkartUrl ||
      product.marketplaceLinks.meeshoUrl ||
      product.marketplaceLinks.jiomartUrl);

  return (
    <div
      onClick={() => openPDP(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE5D5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] mb-4 border border-[#EFE5D5]/60">
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.isBestSeller && (
              <span className="bg-[#1E3F20] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Best Seller
              </span>
            )}
            <span className="bg-[#E69500] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          </div>

          {/* NMR Verified Tag */}
          {product.purityReport?.nmrTested && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openLabReportModal(product);
              }}
              className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs text-[#2D5A27] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#2D5A27]/20 flex items-center gap-1 shadow-xs hover:bg-[#2D5A27] hover:text-white transition-colors"
              title="Click to view NMR Lab Certificate"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E69500]" />
              <span>NMR Tested</span>
            </button>
          )}

          {/* Product Image with Smooth Transition */}
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Flora Tag */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] text-white font-medium truncate">
            🌸 Flora: {product.floraSource}
          </div>
        </div>

        {/* Rating & Review */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
          <div className="flex items-center gap-1 text-[#9A5B00] font-bold">
            <Star className="w-3.5 h-3.5 fill-[#E69500] text-[#E69500]" />
            <span>{product.rating}</span>
            <span className="text-[#786C5E] font-normal">({product.reviewCount})</span>
          </div>
          <span className="text-[10px] text-[#2D5A27] font-semibold bg-[#2D5A27]/10 px-2 py-0.5 rounded-md truncate max-w-[120px]">
            {product.categoryLabel || '100% Pure'}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-display text-lg font-bold text-[#1E3F20] leading-snug group-hover:text-[#9A5B00] transition-colors mb-1 line-clamp-1">
          {product.title}
        </h3>

        {/* Subtitle / Short description */}
        <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed mb-3">
          {product.subtitle}
        </p>

        {/* Pack Size Variant Selector */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-[#786C5E] mb-1.5 flex justify-between">
            <span>Select Pack Size:</span>
            <span className="text-[#2D5A27]">In Stock: {selectedVariant.stock} units</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.variants.map((v) => {
              const isSelected = selectedVariant.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantId(v.id);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E3F20] text-white border-[#1E3F20] shadow-xs'
                      : 'bg-[#FAF8F5] text-[#374151] border-[#D9CDBF] hover:border-[#9A5B00]'
                  }`}
                >
                  {v.weight}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Price & Action Buttons */}
      <div className="pt-2 border-t border-[#EFE5D5]/80 space-y-3">
        
        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold text-[#9A5B00]">
            ₹{selectedVariant.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{selectedVariant.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#2D5A27] font-semibold ml-auto">
            {selectedVariant.weight}
          </span>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#FAF8F5] hover:bg-[#EFE5D5] text-[#1E3F20] border border-[#D9CDBF] py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#9A5B00]" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="w-full bg-[#E69500] hover:bg-[#D48B00] text-white py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>

        {/* Multi-Channel Marketplace Badges */}
        {hasMarketplace && (
          <div className="pt-1">
            <p className="text-[10px] text-gray-500 font-medium mb-1">
              Also available on:
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.marketplaceLinks.amazonUrl && (
                <a
                  href={product.marketplaceLinks.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-[#FF9900]/10 text-[#B36B00] hover:bg-[#FF9900]/20 rounded-md border border-[#FF9900]/30 transition-colors"
                >
                  <span>Amazon</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {product.marketplaceLinks.flipkartUrl && (
                <a
                  href={product.marketplaceLinks.flipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-[#2874F0]/10 text-[#1B52B3] hover:bg-[#2874F0]/20 rounded-md border border-[#2874F0]/30 transition-colors"
                >
                  <span>Flipkart</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {product.marketplaceLinks.meeshoUrl && (
                <a
                  href={product.marketplaceLinks.meeshoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-[#F43397]/10 text-[#9C135A] hover:bg-[#F43397]/20 rounded-md border border-[#F43397]/30 transition-colors"
                >
                  <span>Meesho</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {product.marketplaceLinks.jiomartUrl && (
                <a
                  href={product.marketplaceLinks.jiomartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-[#0078AD]/10 text-[#00557A] hover:bg-[#0078AD]/20 rounded-md border border-[#0078AD]/30 transition-colors"
                >
                  <span>JioMart</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};