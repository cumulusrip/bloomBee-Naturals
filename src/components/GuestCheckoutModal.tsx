import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  Smartphone,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerGuestInfo } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const GuestCheckoutModal: React.FC = () => {
  const {
    isGuestCheckoutOpen,
    setIsGuestCheckoutOpen,
    cart,
    cartSubtotal,
    shippingFee,
    cartTotal,
    discountAmount,
    appliedCoupon,
    createRazorpayOrder,
    createGuestOrder,
    adminSettings,
  } = useStore();

  const [formData, setFormData] = useState<CustomerGuestInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'upi'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isGuestCheckoutOpen) return null;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const fullName = (formData?.fullName || '').trim();
    const email = (formData?.email || '').trim();
    const phone = (formData?.phone || '').trim();
    const address = (formData?.address || '').trim();
    const city = (formData?.city || '').trim();
    const state = (formData?.state || '').trim();
    const pincode = (formData?.pincode || '').trim();

    if (!fullName) errors.fullName = 'Please enter your full name';
    if (!email || !email.includes('@')) errors.email = 'Valid email required for order confirmation';
    if (!phone || phone.length < 10) errors.phone = '10-digit phone required for delivery SMS & WhatsApp updates';
    if (!address) errors.address = 'Street address required for courier delivery';
    if (!city) errors.city = 'City required';
    if (!state) errors.state = 'State required';
    if (!pincode || pincode.length < 6) errors.pincode = '6-digit Indian PIN code required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePincodeChange = (pincodeVal: string) => {
    const cleanPin = pincodeVal.replace(/[^0-9]/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: cleanPin }));

    // Simple heuristic auto-fill for major Indian pincode zones
    if (cleanPin.length === 6) {
      if (cleanPin.startsWith('560')) setFormData((p) => ({ ...p, city: 'Bengaluru', state: 'Karnataka' }));
      else if (cleanPin.startsWith('110')) setFormData((p) => ({ ...p, city: 'New Delhi', state: 'Delhi' }));
      else if (cleanPin.startsWith('400')) setFormData((p) => ({ ...p, city: 'Mumbai', state: 'Maharashtra' }));
      else if (cleanPin.startsWith('600')) setFormData((p) => ({ ...p, city: 'Chennai', state: 'Tamil Nadu' }));
      else if (cleanPin.startsWith('700')) setFormData((p) => ({ ...p, city: 'Kolkata', state: 'West Bengal' }));
      else if (cleanPin.startsWith('500')) setFormData((p) => ({ ...p, city: 'Hyderabad', state: 'Telangana' }));
      else if (cleanPin.startsWith('302')) setFormData((p) => ({ ...p, city: 'Jaipur', state: 'Rajasthan' }));
      else if (cleanPin.startsWith('411')) setFormData((p) => ({ ...p, city: 'Pune', state: 'Maharashtra' }));
      else if (cleanPin.startsWith('380')) setFormData((p) => ({ ...p, city: 'Ahmedabad', state: 'Gujarat' }));
    }
  };

  // Finalizes the order on our backend once Razorpay has actually
  // confirmed a payment. paymentConfirmation is REQUIRED for the
  // razorpay method — the backend independently verifies the signature
  // before ever marking an order "paid", so a fabricated/missing
  // confirmation is rejected server-side rather than silently accepted.
  const executeOrderCreation = async (paymentConfirmation?: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    setIsProcessing(true);
    setCheckoutError(null);
    try {
      const result = await createGuestOrder(formData, paymentMethod, paymentConfirmation);
      if (!result.success) {
        setCheckoutError(result.error || 'Your order could not be placed. Please try again.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setCheckoutError('Something went wrong placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    if (!validateForm()) return;

    const razorpayKey = adminSettings.razorpay.keyId;

    if (paymentMethod !== 'razorpay') {
      // COD / manual UPI — no gateway confirmation needed, hand straight
      // to order creation (backend leaves these as "pending" until an
      // admin confirms payment).
      await executeOrderCreation();
      return;
    }

    if (!window.Razorpay) {
      setCheckoutError('Payment gateway failed to load. Please refresh the page and try again.');
      return;
    }

    if (!razorpayKey) {
      setCheckoutError(
        'Online payment is not set up yet for this store. Please contact us to complete your order, or ask the store owner to add Razorpay credentials in Admin → Razorpay Gateway.'
      );
      return;
    }

    setIsProcessing(true);

    // 1. Create a real order on Razorpay's servers via our backend —
    //    Razorpay Checkout requires a genuine order_id, and a payment
    //    can only be verified against an order Razorpay actually issued.
    const orderResult = await createRazorpayOrder(cartTotal);
    if (!orderResult.success) {
      setIsProcessing(false);
      setCheckoutError(orderResult.error);
      return;
    }

    // 2. Open the real Razorpay checkout with that order_id.
    const options = {
      key: orderResult.keyId,
      order_id: orderResult.razorpayOrderId,
      amount: orderResult.amount,
      currency: orderResult.currency,
      name: adminSettings.store.name,
      description: `Order for ${formData.fullName} - Standard 5–7 Days Delivery`,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80',
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#E69500',
      },
      // 3. Only once Razorpay hands back a payment_id + signature do we
      //    finalize the order — and the backend re-verifies that
      //    signature itself before marking anything "paid".
      handler: function (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        executeOrderCreation({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      setIsProcessing(false);
      setCheckoutError(
        response?.error?.description || 'Payment failed or was declined by your bank. No charge was made — please try again.'
      );
    });
    setIsProcessing(false);
    rzp.open();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#EFE5D5] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#1E3F20] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#E69500] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                100% Guest Checkout
              </span>
              <span className="text-xs text-[#D4E8D2] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#E69500]" />
                Zero Password / No Signup Required
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold mt-1 text-white">
              Complete Your Natural Harvest Order
            </h2>
          </div>

          <button
            onClick={() => setIsGuestCheckoutOpen(false)}
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Frictionless Guest Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Mandatory Delivery Notice */}
              <div className="bg-[#FEF7EB] border-l-4 border-[#E69500] p-3.5 rounded-xl flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#9A5B00] shrink-0 mt-0.5" />
                <div className="text-xs text-[#785315]">
                  <strong>Standard Delivery Time: 5–7 Business Days across India.</strong>
                  <p className="mt-0.5 text-[11px] text-[#9A5B00]">
                    Shipped in insulated, eco-bubble reinforced glass jar safety packaging.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                
                {/* Contact Information */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3F20] mb-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1E3F20] text-white text-[11px] flex items-center justify-center">1</span>
                    Customer Contact (For WhatsApp &amp; Tracking Updates)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Radhika Menon"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className={`w-full text-xs sm:text-sm bg-[#FAF8F5] border rounded-xl px-3 py-2.5 outline-none transition-colors ${
                          formErrors.fullName ? 'border-red-500 bg-red-50' : 'border-[#D9CDBF] focus:border-[#9A5B00]'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Phone Number (WhatsApp updates) *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9811234567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value.replace(/[^0-9+]/g, ''),
                          })
                        }
                        className={`w-full text-xs sm:text-sm bg-[#FAF8F5] border rounded-xl px-3 py-2.5 outline-none transition-colors ${
                          formErrors.phone ? 'border-red-500 bg-red-50' : 'border-[#D9CDBF] focus:border-[#9A5B00]'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-[#374151] mb-1">
                      Email Address (For Tax Invoice &amp; Dispatch Tracking) *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. radhika@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full text-xs sm:text-sm bg-[#FAF8F5] border rounded-xl px-3 py-2.5 outline-none transition-colors ${
                        formErrors.email ? 'border-red-500 bg-red-50' : 'border-[#D9CDBF] focus:border-[#9A5B00]'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3F20] mb-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1E3F20] text-white text-[11px] flex items-center justify-center">2</span>
                    Pan-India Delivery Address
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        House / Flat No., Building, Street Address *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Flat 402, Oakwood Greens, Outer Ring Road"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className={`w-full text-xs sm:text-sm bg-[#FAF8F5] border rounded-xl px-3 py-2.5 outline-none transition-colors ${
                          formErrors.address ? 'border-red-500 bg-red-50' : 'border-[#D9CDBF] focus:border-[#9A5B00]'
                        }`}
                      />
                      {formErrors.address && (
                        <p className="text-[11px] text-red-500 mt-1">{formErrors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                          6-Digit PIN Code *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 560103"
                          value={formData.pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          className={`w-full text-xs sm:text-sm bg-[#FAF8F5] border rounded-xl px-3 py-2.5 outline-none transition-colors ${
                            formErrors.pincode ? 'border-red-500 bg-red-50' : 'border-[#D9CDBF] focus:border-[#9A5B00]'
                          }`}
                        />
                        {formErrors.pincode && (
                          <p className="text-[11px] text-red-500 mt-1">{formErrors.pincode}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bengaluru"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          className={`w-full text-xs sm:text-sm bg-[#FAF8F5] border rounded-xl px-3 py-2.5 outline-none transition-colors ${
                            formErrors.city ? 'border-red-500 bg-red-50' : 'border-[#D9CDBF] focus:border-[#9A5B00]'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Karnataka"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          className={`w-full text-xs sm:text-sm bg-[#FAF8F5] border rounded-xl px-3 py-2.5 outline-none transition-colors ${
                            formErrors.state ? 'border-red-500 bg-red-50' : 'border-[#D9CDBF] focus:border-[#9A5B00]'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near EcoWorld Tech Park Gate 2"
                        value={formData.landmark}
                        onChange={(e) =>
                          setFormData({ ...formData, landmark: e.target.value })
                        }
                        className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A5B00]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3F20] mb-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1E3F20] text-white text-[11px] flex items-center justify-center">3</span>
                    Instant Payment via Razorpay
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-[#2D5A27] bg-[#F0F7EE] shadow-xs'
                          : 'border-[#D9CDBF] bg-white hover:border-[#9A5B00]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="text-[#2D5A27] focus:ring-[#2D5A27]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#1E3F20]">
                          <Smartphone className="w-4 h-4 text-[#2D5A27]" />
                          <span>Razorpay UPI &amp; Cards</span>
                        </div>
                        <span className="text-[10px] text-[#5D6B5C]">
                          Google Pay, PhonePe, Paytm, Cards, NetBanking
                        </span>
                      </div>
                    </label>

                    {/* <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#2D5A27] bg-[#F0F7EE] shadow-xs'
                          : 'border-[#D9CDBF] bg-white hover:border-[#9A5B00]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-[#2D5A27] focus:ring-[#2D5A27]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#1E3F20]">
                          <Truck className="w-4 h-4 text-[#9A5B00]" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                        <span className="text-[10px] text-[#5D6B5C]">
                          Pay cash upon home delivery
                        </span>
                      </div>
                    </label> */}
                  </div>
                </div>

                {/* Checkout Error */}
                {checkoutError && (
                  <div className="bg-red-50 border border-red-300 text-red-700 text-xs font-semibold p-3 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#E69500] hover:bg-[#D48B00] text-white py-4 rounded-2xl font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isProcessing ? (
                    <span>Securing Order &amp; Connecting Razorpay...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{cartTotal.toLocaleString('en-IN')} &amp; Confirm Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

            </div>

            {/* Right Column: Order Summary & Purity Promise */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-5 sm:p-6 rounded-3xl border border-[#EFE5D5] flex flex-col justify-between space-y-6">
              
              <div>
                <h3 className="font-display text-base font-bold text-[#1E3F20] mb-3">
                  Order Items ({cart.reduce((t, i) => t + i.quantity, 0)})
                </h3>

                <div className="divide-y divide-[#EFE5D5] max-h-56 overflow-y-auto pr-1 space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.variant.id}
                      className="pt-2 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-[#EFE5D5] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#1E3F20] truncate">
                            {item.product.title}
                          </p>
                          <p className="text-[11px] text-[#786C5E]">
                            Size: {item.variant.weight} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#9A5B00] shrink-0">
                        ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="mt-4 pt-4 border-t border-[#EFE5D5] space-y-2 text-xs text-[#4B5563]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1F2937]">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#2D5A27] font-semibold">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Pan-India Delivery</span>
                    <span className="font-semibold text-[#2D5A27]">
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#1E3F20] pt-2 border-t border-[#D9CDBF]">
                    <span>Total Amount</span>
                    <span className="text-[#9A5B00]">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white p-4 rounded-2xl border border-[#EFE5D5] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E3F20]">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
                  <span>The BloomBee Purity Guarantee</span>
                </div>
                <p className="text-[11px] text-[#5D6B5C] leading-relaxed">
                  ✓ 100% Raw &amp; Unheated &nbsp;•&nbsp; ✓ NMR Lab Tested Purity &nbsp;•&nbsp; ✓ Shatterproof Eco Packaging.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
