import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Truck,
  Mail,
  FileText,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  X,
  Package,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OrderSuccessModalProps {
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  onTrackOrder,
}) => {
  const {
    showOrderSuccessModal,
    setShowOrderSuccessModal,
    lastCompletedOrder,
    emailLogs,
    adminSettings,
  } = useStore();

  const [showEmailPreview, setShowEmailPreview] = useState(false);

  useEffect(() => {
    if (showOrderSuccessModal) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E69500', '#1E3F20', '#D48B00', '#2D5A27'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [showOrderSuccessModal]);

  if (!showOrderSuccessModal || !lastCompletedOrder) return null;

  const latestEmail = emailLogs.find(
    (e) => e.orderId === lastCompletedOrder.id
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#EFE5D5] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-[#1E3F20] to-[#2D5A27] text-white p-6 text-center relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-[#E69500] text-white flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-white/20">
            <CheckCircle className="w-9 h-9" />
          </div>
          <span className="bg-white/15 text-[#E69500] font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
            Payment Captured &amp; Order Confirmed
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-white">
            Thank You, {lastCompletedOrder.customer.fullName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#D4E8D2] mt-1">
            Order <span className="font-mono font-bold text-white">#{lastCompletedOrder.orderNumber}</span> has transitioned to <strong>Processing</strong>.
          </p>

          <button
            onClick={() => setShowOrderSuccessModal(false)}
            className="absolute top-4 right-4 text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Mandatory Delivery Statement */}
          <div className="bg-[#F0F7EE] border-l-4 border-[#2D5A27] p-4 rounded-xl flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#2D5A27] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#1E3F20]">
                Standard Delivery Time: 5–7 Business Days across India.
              </p>
              <p className="text-xs text-[#5D6B5C] mt-0.5">
                Our apiary team is hand-packaging your raw honey jars with shatterproof cushioning.
              </p>
            </div>
          </div>

          {/* Automated Email Trigger Notice */}
          <div className="bg-[#FEF7EB] p-4 rounded-2xl border border-[#E69500]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E69500]/20 flex items-center justify-center text-[#9A5B00] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E3F20]">
                  Automated HTML Email Confirmation Dispatched
                </p>
                <p className="text-[11px] text-[#786C5E]">
                  Sent to <strong className="text-[#1E3F20]">{lastCompletedOrder.customer.email}</strong> via SMTP ({adminSettings.smtp.host}).
                </p>
              </div>
            </div>

            {latestEmail && (
              <button
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="text-xs font-bold text-[#9A5B00] bg-white border border-[#E69500]/30 px-3 py-1.5 rounded-xl hover:bg-[#FAF8F5] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{showEmailPreview ? 'Hide Email' : 'Inspect HTML Email'}</span>
              </button>
            )}
          </div>

          {/* Live HTML Email Preview Drawer */}
          {showEmailPreview && latestEmail && (
            <div className="border border-[#EFE5D5] rounded-2xl overflow-hidden shadow-inner">
              <div className="bg-[#FAF8F5] px-4 py-2 text-[11px] font-mono text-[#786C5E] border-b border-[#EFE5D5] flex items-center justify-between">
                <span>Subject: {latestEmail.subject}</span>
                <span className="text-[#2D5A27] font-bold">Status: {latestEmail.status.toUpperCase()}</span>
              </div>
              <div
                className="p-4 max-h-72 overflow-y-auto bg-white text-xs"
                dangerouslySetInnerHTML={{ __html: latestEmail.htmlContent }}
              />
            </div>
          )}

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5]">
              <h4 className="font-bold text-[#1E3F20] mb-2 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#9A5B00]" />
                Purchased Items ({lastCompletedOrder.items.length})
              </h4>
              <div className="space-y-1.5">
                {lastCompletedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#4B5563]">
                    <span className="truncate max-w-[160px]">
                      {item.product.title} ({item.variant.weight})
                    </span>
                    <span className="font-semibold text-[#1E3F20]">
                      ₹{(item.variant.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#EFE5D5] flex justify-between font-bold text-[#1E3F20]">
                  <span>Total Paid via Razorpay:</span>
                  <span className="text-[#9A5B00]">
                    ₹{lastCompletedOrder.pricing.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5]">
              <h4 className="font-bold text-[#1E3F20] mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#2D5A27]" />
                Delivery Address
              </h4>
              <p className="text-[#4B5563] leading-relaxed">
                <strong>{lastCompletedOrder.customer.fullName}</strong><br />
                {lastCompletedOrder.customer.address}<br />
                {lastCompletedOrder.customer.city}, {lastCompletedOrder.customer.state} - {lastCompletedOrder.customer.pincode}<br />
                Phone: {lastCompletedOrder.customer.phone}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => {
                setShowOrderSuccessModal(false);
                onTrackOrder(lastCompletedOrder.orderNumber);
              }}
              className="w-full sm:w-1/2 bg-[#1E3F20] hover:bg-[#2D5A27] text-white py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
            </button>

            <button
              onClick={() => setShowOrderSuccessModal(false)}
              className="w-full sm:w-1/2 bg-white hover:bg-[#FAF8F5] text-[#1E3F20] border border-[#D9CDBF] py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Continue Exploring Products
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
