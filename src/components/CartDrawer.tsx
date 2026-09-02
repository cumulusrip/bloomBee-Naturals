import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Check,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    shippingFee,
    cartTotal,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    adminSettings,
    setIsGuestCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = adminSettings.store.freeShippingThreshold;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCoupon = (couponInput || '').trim();
    if (!cleanCoupon) return;
    const res = applyCoupon(cleanCoupon);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsGuestCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#EFE5D5] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#EFE5D5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1E3F20] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#E69500]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-[#1E3F20]">
                  Your Harvest Cart
                </h2>
                <p className="text-[11px] text-[#786C5E]">
                  {cart.length === 0
                    ? 'No items in cart'
                    : `${cart.reduce((t, i) => t + i.quantity, 0)} item(s) selected`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#FEF7EB] px-5 py-3 border-b border-[#F5DEB3]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#9A5B00] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#2D5A27]" />
                {remainingForFreeShipping === 0
                  ? 'Qualified for FREE Pan-India Shipping'
                  : `Add ₹${remainingForFreeShipping} more for FREE Pan-India Shipping`}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-[#EFE5D5] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D48B00] to-[#2D5A27] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 rounded-full bg-[#FEF7EB] flex items-center justify-center text-[#9A5B00] mb-3 border border-[#F5DCB7]">
                  <ShoppingBag className="w-8 h-8 text-[#9A5B00]" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1E3F20] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#786C5E] max-w-xs mb-6">
                  Experience the therapeutic benefits of 100% cold-extracted, raw unheated forest honey.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#1E3F20] text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#2D5A27] transition-colors"
                >
                  Explore Pure Harvests
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.variant.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#EFE5D5] shadow-xs flex gap-3.5 items-center"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-xl object-cover border border-[#EFE5D5] shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1E3F20] truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-[11px] text-[#786C5E]">
                      Pack Size: <span className="font-semibold text-[#1E3F20]">{item.variant.weight}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display text-sm font-bold text-[#9A5B00]">
                        ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#D9CDBF] rounded-lg overflow-hidden bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#1E3F20] hover:bg-[#EFE5D5] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-[#1E3F20]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#1E3F20] hover:bg-[#EFE5D5] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.variant.id)}
                    className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#EFE5D5] space-y-4">
              
              {/* Coupon Engine */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#F0F7EE] p-2.5 rounded-xl border border-[#2D5A27]/30 text-xs">
                    <div className="flex items-center gap-1.5 text-[#2D5A27] font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{appliedCoupon}</strong> Applied (-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-500 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. BLOOM10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 uppercase outline-none focus:border-[#9A5B00]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1E3F20] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#2D5A27] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback?.message && (
                  <p
                    className={`text-[11px] mt-1 ${
                      couponFeedback.success ? 'text-[#2D5A27]' : 'text-red-500'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#4B5563]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F2937]">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2D5A27] font-medium">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping (Pan-India)</span>
                  <span className="font-semibold text-[#2D5A27]">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1E3F20] pt-2 border-t border-[#EFE5D5]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#9A5B00]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Delivery Notice */}
              <p className="text-[11px] text-[#786C5E] text-center">
                🚚 <strong>Standard Delivery Time:</strong> 5–7 Business Days across India.
              </p>

              {/* Primary Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#E69500] hover:bg-[#D48B00] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Proceed to Frictionless Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#2D5A27]" />
                  100% Secure Razorpay Checkout
                </span>
                <span>•</span>
                <span>No Password / Account Required</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
