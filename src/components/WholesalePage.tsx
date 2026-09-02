import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Building2,
  Package,
  Calculator,
  ShieldCheck,
  Send,
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';

export const WholesalePage: React.FC = () => {
  const { currentUser, submitWholesaleInquiry } = useStore();

  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [contactPerson, setContactPerson] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState<'Retailer' | 'Ayurvedic Brand' | 'Bakery & Food Service' | 'Exporter' | 'Other'>('Ayurvedic Brand');
  const [estimatedMonthlyKg, setEstimatedMonthlyKg] = useState('100-500 kg');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    'Raw Himalayan Acacia Honey',
    'Vedic A2 Bilona Cow Ghee',
  ]);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Interactive Bulk Calculator state
  const [calcProduct, setCalcProduct] = useState<'honey' | 'ghee' | 'almonds' | 'saffron'>('honey');
  const [calcQuantityKg, setCalcQuantityKg] = useState<number>(100);

  const calculateEstimate = () => {
    let baseRate = 600; // Honey
    if (calcProduct === 'ghee') baseRate = 1800;
    if (calcProduct === 'almonds') baseRate = 2200;
    if (calcProduct === 'saffron') baseRate = 190000; // per kg

    // Volume discount brackets
    let discountPct = 0;
    if (calcQuantityKg >= 500) discountPct = 0.25;
    else if (calcQuantityKg >= 200) discountPct = 0.20;
    else if (calcQuantityKg >= 100) discountPct = 0.15;
    else if (calcQuantityKg >= 50) discountPct = 0.10;

    const ratePerKg = Math.round(baseRate * (1 - discountPct));
    const totalEst = ratePerKg * calcQuantityKg;

    return { ratePerKg, totalEst, discountPct: Math.round(discountPct * 100) };
  };

  const calcResult = calculateEstimate();

  const handleProductToggle = (prod: string) => {
    if (selectedProducts.includes(prod)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== prod));
    } else {
      setSelectedProducts([...selectedProducts, prod]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !email || !phone) return;

    submitWholesaleInquiry({
      companyName,
      contactPerson,
      email,
      phone,
      city,
      businessType,
      estimatedMonthlyKg,
      productsInterested: selectedProducts,
      message,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7EB] border border-[#F5DCB7] text-[#9A5B00] text-xs font-bold uppercase tracking-wider mb-4">
            <Building2 className="w-4 h-4" />
            <span>Commercial B2B Supply &amp; Private Label</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#1E3F20] font-serif mb-4 tracking-tight">
            Direct Himalayan Harvests in Bulk
          </h1>

          <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
            Supplying pharmaceutical-grade raw mountain honey, Vedic A2 Gir cow ghee, Kashmiri Mamra almonds, and GI-tagged Mongra saffron to over 250+ organic retail chains, wellness brands, and premium exporters worldwide.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#1E3F20] font-semibold">
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#EFE5D5]">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>MOQ Starting at 25 kg</span>
            </span>
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#EFE5D5]">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Batch-Wise NMR Reports Provided</span>
            </span>
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-[#EFE5D5]">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>FSSAI &amp; GST Invoicing</span>
            </span>
          </div>
        </div>

        {/* 2 Column Layout: Interactive Calculator & Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Column: Interactive Calculator & Specifications (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Bulk Price Estimator */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5D5] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-[#9A5B00]" />
                <h3 className="text-lg font-bold text-[#1E3F20] font-serif">
                  Instant Bulk Price Estimator
                </h3>
              </div>

              {/* Product Selector */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#374151] mb-2">
                  Select Product Line
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'honey', label: 'Raw Wild Honey' },
                    { id: 'ghee', label: 'Vedic A2 Bilona Ghee' },
                    { id: 'almonds', label: 'Mamra Almonds' },
                    { id: 'saffron', label: 'Grade A1 Saffron' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCalcProduct(item.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                        calcProduct === item.id
                          ? 'bg-[#1E3F20] text-white border-[#1E3F20]'
                          : 'bg-[#FAF8F5] text-[#374151] border-[#EFE5D5] hover:bg-[#FEF7EB]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#374151]">
                    Required Quantity
                  </label>
                  <span className="text-sm font-bold text-[#9A5B00]">
                    {calcQuantityKg} {calcProduct === 'saffron' ? 'Grams / Kg' : 'Kg'}
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="1000"
                  step="25"
                  value={calcQuantityKg}
                  onChange={(e) => setCalcQuantityKg(Number(e.target.value))}
                  className="w-full accent-[#1E3F20] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#786C5E] mt-1">
                  <span>25 Kg</span>
                  <span>250 Kg</span>
                  <span>500 Kg</span>
                  <span>1000+ Kg</span>
                </div>
              </div>

              {/* Calculated Results Box */}
              <div className="bg-[#FEF7EB] rounded-2xl p-4 border border-[#F5DCB7] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#786C5E]">Volume Discount:</span>
                  <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                    {calcResult.discountPct}% OFF
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#786C5E]">Estimated Rate:</span>
                  <span className="font-bold text-[#1E3F20]">
                    ₹{calcResult.ratePerKg.toLocaleString('en-IN')} / kg
                  </span>
                </div>
                <div className="pt-2 border-t border-[#F5DCB7] flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1E3F20]">Estimated Order Value:</span>
                  <span className="text-base font-bold text-[#9A5B00]">
                    ₹{calcResult.totalEst.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-[#786C5E] mt-3 italic">
                *Taxes and freight calculated based on destination hub (Ex-Srinagar / Ex-Jammu warehouse).
              </p>
            </div>

            {/* Packaging Options */}
            <div className="bg-white rounded-3xl p-6 border border-[#EFE5D5] shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#1E3F20] font-serif flex items-center gap-2">
                <Package className="w-4 h-4 text-[#9A5B00]" />
                <span>Commercial Packaging Formats</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFE5D5] flex items-center justify-between">
                  <span className="font-semibold text-[#1F2937]">Food-Grade HDPE Carboys</span>
                  <span className="text-[#786C5E]">25 kg / 50 kg Drums</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFE5D5] flex items-center justify-between">
                  <span className="font-semibold text-[#1F2937]">Stainless Steel IBC Totes</span>
                  <span className="text-[#786C5E]">500 kg / 1000 kg</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFE5D5] flex items-center justify-between">
                  <span className="font-semibold text-[#1F2937]">Private Label Finished Jars</span>
                  <span className="text-[#786C5E]">250g, 500g, 1kg Glass Jars</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Wholesale Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5D5] shadow-md">
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 mx-auto mb-4 border border-green-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E3F20] font-serif mb-2">
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-sm text-[#786C5E] max-w-md mx-auto mb-6">
                    Thank you <strong>{contactPerson}</strong> from <strong>{companyName}</strong>. Our B2B commercial desk will review your requirements and send a formal proforma quote &amp; sample kit within 24 business hours.
                  </p>
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EFE5D5] max-w-sm mx-auto text-xs text-[#786C5E] mb-6">
                    <p>Urgent inquiries? Direct line:</p>
                    <strong className="text-[#1E3F20] text-sm block mt-1">+91 94190 12345 (B2B Lead)</strong>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 bg-[#1E3F20] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#1E3F20] font-serif mb-1">
                      Request Formal B2B Quotation &amp; Sample Kit
                    </h3>
                    <p className="text-xs text-[#786C5E]">
                      Fill out your company details below to receive wholesale catalog sheets and laboratory specifications.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">
                        Company / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Pure Heritage Organics"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="e.g. Rohan Malhotra"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="procurement@company.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">
                        Destination City / State
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Maharashtra"
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1">
                        Business Type
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                      >
                        <option value="Ayurvedic Brand">Ayurvedic &amp; Herbal Pharmacy</option>
                        <option value="Retailer">Organic Supermarket / Retailer</option>
                        <option value="Bakery & Food Service">Commercial Bakery / Restaurant</option>
                        <option value="Exporter">International Exporter</option>
                        <option value="Other">Other Institutional Buyer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-2">
                      Products of Interest
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Raw Himalayan Acacia Honey',
                        'Wild Forest Multi-Flora Honey',
                        'Vedic A2 Bilona Cow Ghee',
                        'Kashmiri Mamra Almonds',
                        'Kashmiri Mongra Saffron',
                        'Cold-Pressed Mustard Oil',
                        'Bhaderwah Red Rajma',
                      ].map((item) => {
                        const isSelected = selectedProducts.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleProductToggle(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#1E3F20] text-white border-[#1E3F20]'
                                : 'bg-[#FAF8F5] text-[#374151] border-[#EFE5D5] hover:bg-[#FEF7EB]'
                            }`}
                          >
                            {isSelected && '✓ '}
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">
                      Estimated Monthly Volume
                    </label>
                    <select
                      value={estimatedMonthlyKg}
                      onChange={(e) => setEstimatedMonthlyKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                    >
                      <option value="25-50 kg">Trial Batch: 25 - 50 kg</option>
                      <option value="50-200 kg">Small Scale: 50 - 200 kg</option>
                      <option value="200-500 kg">Mid-tier: 200 - 500 kg</option>
                      <option value="500-1000 kg">Large Volume: 500 - 1,000 kg</option>
                      <option value="1000+ kg">Commercial Enterprise: 1,000+ kg (Metric Tonnes)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">
                      Additional Requirements / Sample Kit Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify private label packaging needs, custom certifications, or delivery timelines..."
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit B2B Inquiry &amp; Request Sample Kit</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
