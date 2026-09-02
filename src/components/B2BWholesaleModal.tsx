import React, { useState } from 'react';
import {
  X,
  Layers,
  Building,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const B2BWholesaleModal: React.FC = () => {
  const { isB2BModalOpen, setIsB2BModalOpen, submitWholesaleInquiry } = useStore();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    estimatedMonthlyKg: '50-100 kg',
    businessType: 'Retailer' as const,
    productsInterested: ['Raw Forest Wildflower Honey'],
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isB2BModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWholesaleInquiry(formData);
    setSubmitted(true);
  };

  const handleProductToggle = (prodName: string) => {
    setFormData((prev) => {
      const exists = prev.productsInterested.includes(prodName);
      if (exists) {
        return {
          ...prev,
          productsInterested: prev.productsInterested.filter((p) => p !== prodName),
        };
      } else {
        return {
          ...prev,
          productsInterested: [...prev.productsInterested, prodName],
        };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#EFE5D5] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#1E3F20] text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E69500] text-white px-2 py-0.5 rounded-full">
                B2B &amp; Bulk Supply
              </span>
              <span className="text-xs text-[#D4E8D2]">Direct from Farmgate Apiaries</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold mt-1 text-white">
              Wholesale &amp; Institutional Inquiries
            </h2>
          </div>

          <button
            onClick={() => {
              setIsB2BModalOpen(false);
              setSubmitted(false);
            }}
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F0F7EE] text-[#2D5A27] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1E3F20]">
                Wholesale Inquiry Received!
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.contactPerson}</strong>. Our institutional apiary manager will review your requirement for <strong>{formData.companyName}</strong> and contact you within 24 business hours with custom wholesale pricing &amp; lab samples.
              </p>

              <button
                onClick={() => {
                  setIsB2BModalOpen(false);
                  setSubmitted(false);
                }}
                className="bg-[#1E3F20] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#2D5A27] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[#4B5563]">
                We supply bulk raw unheated honey in 15kg/30kg food-grade carboys &amp; private label glass packaging to gourmet bakeries, ayurvedic pharmacies, luxury hotels, and organic supermarkets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Company / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Greens Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A5B00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A5B00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. procurement@organicgreens.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A5B00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9811002233"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A5B00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A5B00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Estimated Monthly Volume
                  </label>
                  <select
                    value={formData.estimatedMonthlyKg}
                    onChange={(e) => setFormData({ ...formData, estimatedMonthlyKg: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A5B00]"
                  >
                    <option value="25-50 kg">25 - 50 kg</option>
                    <option value="50-100 kg">50 - 100 kg</option>
                    <option value="100-500 kg">100 - 500 kg</option>
                    <option value="500kg+">500 kg+ (Commercial Drums)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e: any) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A5B00]"
                  >
                    <option value="Retailer">Organic Retailer</option>
                    <option value="Ayurvedic Brand">Ayurvedic Brand</option>
                    <option value="Bakery & Food Service">Bakery / Food Service</option>
                    <option value="Exporter">Exporter / Trader</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Products Interested in */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Products Interested in (Select multiple):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '🍯 Raw Forest Wildflower Honey (Cat 11)',
                    '🍯 Himalayan White Acacia Honey (Cat 11)',
                    '🧈 Vedic A2 Gir Cow Bilona Ghee (Cat 01)',
                    '🧈 Himalayan Badri Cow A2 Ghee (Cat 01)',
                    '🌰 Kashmiri Mamra Almonds (Cat 04)',
                    '🌰 Kashmiri Snow-White Walnuts (Cat 04)',
                    '🌸 Kashmiri Mongra Saffron (Cat 04)',
                    '🫒 Wood Cold-Pressed Mustard Oil (Cat 02)',
                    '🫒 Kashmiri Cold-Pressed Walnut Oil (Cat 02)',
                    '🌾 Authentic Bhaderwah Red Rajma (Cat 06)',
                    '🧂 Pink Himalayan Mineral Rock Salt (Cat 12)',
                    '🧂 Lakadong High-Curcumin Turmeric (Cat 12)',
                    '🍵 Kashmiri Shahi Kahwa Green Tea (Cat 14)',
                  ].map((pName) => {
                    const isSelected = formData.productsInterested.includes(pName);
                    return (
                      <button
                        type="button"
                        key={pName}
                        onClick={() => handleProductToggle(pName)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E3F20] text-white border-[#1E3F20] font-semibold shadow-xs'
                            : 'bg-[#FAF8F5] text-[#374151] border-[#D9CDBF] hover:border-[#9A5B00]'
                        }`}
                      >
                        {pName} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Specific Requirements / Questions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Looking for private label 500g glass jars with NMR certificates for our Mumbai organic stores."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E69500] hover:bg-[#D48B00] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Wholesale Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
