import React, { useState } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
  onBackToShop: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderNumber = '',
  onBackToShop,
}) => {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);

  // Normalizes a query for order-number matching: trims whitespace,
  // strips a leading "#" (people naturally type "#BBN-3065"), and
  // lowercases for case-insensitive comparison.
  const normalizeOrderQuery = (value: string) =>
    (value || '').trim().replace(/^#/, '').toLowerCase();

  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderNumber && typeof initialOrderNumber === 'string') {
      const cleanInitial = normalizeOrderQuery(initialOrderNumber);
      return (
        orders.find(
          (o) =>
            (o.orderNumber || '').toLowerCase() === cleanInitial
        ) || null
      );
    }
    // Never default to showing an order before the customer has searched —
    // orders contain personal info (name, phone, address) that should only
    // be shown after the customer proves they own it via order #/phone/email.
    return null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderNumber));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const rawClean = (searchQuery || '').trim();
    if (!rawClean) return;
    const clean = normalizeOrderQuery(rawClean);
    const digitsOnly = clean.replace(/\D/g, '');

    const found = orders.find((o) => {
      const matchesOrderNumber = (o.orderNumber || '').toLowerCase() === clean;
      const matchesPhone =
        digitsOnly.length >= 10 && (o.customer?.phone || '').replace(/\D/g, '') === digitsOnly;
      const matchesEmail = (o.customer?.email || '').toLowerCase() === clean;
      return matchesOrderNumber || matchesPhone || matchesEmail;
    });

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending_payment':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 2;
    }
  };

  const currentStep = searchedOrder ? getStatusStep(searchedOrder.status) : 0;

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={onBackToShop}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3F20] hover:text-[#9A5B00] mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1E3F20]">
              Track Your Fresh Harvest Delivery
            </h1>
            <p className="text-xs sm:text-sm text-[#786C5E] mt-1">
              Enter your Order Number (e.g. BBN-8092) or 10-digit Phone number to view live status.
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 rounded-3xl border border-[#EFE5D5] shadow-md mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. BBN-8092) or Phone Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-[#D9CDBF] rounded-2xl text-xs sm:text-sm outline-none focus:border-[#9A5B00]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1E3F20] hover:bg-[#2D5A27] text-white px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer shrink-0"
            >
              Track Package
            </button>
          </form>
        </div>

        {/* Search Result */}
        {searchedOrder ? (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] shadow-xl overflow-hidden">
            
            {/* Top Bar */}
            <div className="p-6 bg-[#1E3F20] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#E69500] uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full">
                  Order Verified
                </span>
                <h2 className="font-display text-2xl font-bold mt-1 text-white">
                  Order #{searchedOrder.orderNumber}
                </h2>
                <p className="text-xs text-[#D4E8D2] mt-0.5">
                  Placed on {new Date(searchedOrder.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FEF7EB] text-[#9A5B00]">
                  Status: {searchedOrder.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Mandatory Standard Delivery Notice */}
              <div className="bg-[#F0F7EE] border-l-4 border-[#2D5A27] p-4 rounded-xl flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#2D5A27] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#1E3F20]">
                    🚚 Standard Delivery Time: 5–7 Business Days across India.
                  </p>
                  <p className="text-xs text-[#5D6B5C] mt-0.5">
                    Inspected &amp; packaged in reinforced eco glass jars to preserve live enzymes.
                  </p>
                </div>
              </div>

              {/* Step Progress Visual Tracker */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#786C5E] mb-6">
                  Live Dispatch Progression
                </h3>

                <div className="relative flex justify-between items-center max-w-xl mx-auto">
                  {/* Track Bar background */}
                  <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-[#EFE5D5] -translate-y-1/2 z-0" />
                  
                  {/* Active Track Bar */}
                  <div
                    className="absolute top-1/2 left-0 h-1.5 bg-[#2D5A27] -translate-y-1/2 z-0 transition-all duration-700"
                    style={{
                      width:
                        currentStep === 1
                          ? '10%'
                          : currentStep === 2
                          ? '38%'
                          : currentStep === 3
                          ? '70%'
                          : currentStep >= 4
                          ? '100%'
                          : '0%',
                    }}
                  />

                  {/* Step 1: Confirmed */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 1
                          ? 'bg-[#2D5A27] text-white shadow-md'
                          : 'bg-[#FAF8F5] text-gray-400 border border-[#D9CDBF]'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1E3F20] mt-2">
                      Confirmed
                    </span>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 2
                          ? 'bg-[#2D5A27] text-white shadow-md'
                          : 'bg-[#FAF8F5] text-gray-400 border border-[#D9CDBF]'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1E3F20] mt-2">
                      Hand-Packing
                    </span>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 3
                          ? 'bg-[#2D5A27] text-white shadow-md'
                          : 'bg-[#FAF8F5] text-gray-400 border border-[#D9CDBF]'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1E3F20] mt-2">
                      Dispatched
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 4
                          ? 'bg-[#2D5A27] text-white shadow-md'
                          : 'bg-[#FAF8F5] text-gray-400 border border-[#D9CDBF]'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1E3F20] mt-2">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Tracking Details if Dispatched */}
              {searchedOrder.tracking && (
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EFE5D5] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3F20]">
                    Courier Partner &amp; AWB Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[#786C5E] block">Logistics Partner:</span>
                      <strong className="text-[#1E3F20]">{searchedOrder.tracking.carrier}</strong>
                    </div>
                    <div>
                      <span className="text-[#786C5E] block">AWB Tracking Number:</span>
                      <strong className="font-mono text-[#9A5B00] bg-white px-2 py-0.5 border border-[#D9CDBF] rounded">
                        {searchedOrder.tracking.trackingNumber}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#786C5E] block">Estimated Delivery:</span>
                      <strong className="text-[#2D5A27]">{searchedOrder.tracking.estimatedDelivery}</strong>
                    </div>
                  </div>

                  {searchedOrder.tracking.trackingUrl && searchedOrder.tracking.trackingUrl.trim() && (
                    <div className="pt-2">
                      <a
                        href={searchedOrder.tracking.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#2D5A27] hover:bg-[#1E3F20] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        <span>Open Courier Live Tracker</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Order Timeline History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E3F20] mb-3">
                  Order Status Updates
                </h4>
                <div className="space-y-2.5">
                  {searchedOrder.timeline.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#EFE5D5]"
                    >
                      <Clock className="w-4 h-4 text-[#9A5B00] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#1E3F20]">{item.note}</p>
                        <span className="text-[11px] text-gray-400">
                          {new Date(item.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-[#EFE5D5]">
                <div>
                  <h5 className="font-bold text-[#1E3F20] mb-1">Customer Details:</h5>
                  <p className="text-[#4B5563]">
                    {searchedOrder.customer.fullName}<br />
                    Phone: {searchedOrder.customer.phone}<br />
                    Email: {searchedOrder.customer.email}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-[#1E3F20] mb-1">Delivery Address:</h5>
                  <p className="text-[#4B5563]">
                    {searchedOrder.customer.address}, {searchedOrder.customer.city}, {searchedOrder.customer.state} - {searchedOrder.customer.pincode}
                  </p>
                </div>
              </div>

            </div>
          </div>
        ) : hasSearched ? (
          <div className="bg-white p-8 rounded-3xl border border-[#EFE5D5] text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-display text-lg font-bold text-[#1E3F20]">
              No matching order found for "{searchQuery}"
            </h3>
            <p className="text-xs text-[#786C5E] max-w-md mx-auto">
              Please ensure you are entering the exact order number sent to your email (e.g. BBN-8092) or your 10-digit mobile number.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
};