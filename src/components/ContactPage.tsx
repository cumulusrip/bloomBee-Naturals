import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { adminSettings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Query / Order Support');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does standard delivery take across India?',
      a: 'We ship from our Srinagar and Jammu central fulfillment centers via Bluedart and Express Air. Standard delivery takes 5 to 7 business days across all major Indian cities with complete live SMS & WhatsApp tracking.',
    },
    {
      q: 'Why does pure Himalayan raw honey crystallize in winter?',
      a: 'Crystallization is the single most definitive natural proof that honey is raw, unheated, and unadulterated. Because our honey is never pasteurized above 40°C, the natural glucose precipitates around wild pollen grains into a delicious spreadable texture. Simply place the jar in a bowl of warm water (under 45°C) to reliquefy.',
    },
    {
      q: 'How are glass honey and ghee jars protected during courier transit?',
      a: 'We use custom engineered 5-layer shockproof honeycomb air-cushion sleeves and double-walled outer corrugated cartons. In the rare event of transit damage, we offer an immediate, no-questions-asked free replacement within 24 hours.',
    },
    {
      q: 'How can I verify the NMR report of the jar I received?',
      a: 'Every single BloomBee Naturals jar has an authentic batch code printed near the manufacturing date (e.g. BBN-JK-2026). Simply enter this code on our Lab Reports portal to view the full Nuclear Magnetic Resonance spectrum and C4 isotope test results.',
    },
    {
      q: 'What makes Vedic A2 Bilona Ghee superior to regular butter ghee?',
      a: 'Commercial ghee is made by boiling fresh industrial cream directly. Vedic Bilona Ghee is made using the ancient Ayurvedic 5-step process: A2 cow milk is cultured into whole curd overnight, then hand-churned with a wooden bi-directional bilona to separate makkhan (butter), which is then slow-cooked on low firewood in brass pots to produce aromatic golden granules.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7EB] border border-[#F5DCB7] text-[#9A5B00] text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-4 h-4" />
            <span>Dedicated Customer Care Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#1E3F20] font-serif mb-4 tracking-tight">
            We're Here to Help You
          </h1>

          <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
            Have questions about our high-altitude harvests, your active shipment, bulk orders, or Ayurvedic usage? Reach out to our Jammu &amp; Kashmir customer desk.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-3xl border border-[#EFE5D5] shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7EB] flex items-center justify-center text-[#9A5B00] mb-4 border border-[#F5DCB7]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1E3F20] font-serif mb-1">
              Phone &amp; WhatsApp
            </h3>
            <p className="text-xs text-[#786C5E] mb-3">
              Direct assistance for orders &amp; inquiries.
            </p>
            <a
              href={`https://wa.me/91${adminSettings.store.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#1E3F20] hover:text-[#9A5B00] transition-colors"
            >
              {adminSettings.store.supportPhone}
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EFE5D5] shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7EB] flex items-center justify-center text-[#9A5B00] mb-4 border border-[#F5DCB7]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1E3F20] font-serif mb-1">
              Email Support
            </h3>
            <p className="text-xs text-[#786C5E] mb-3">
              We respond within 2 hours during work hours.
            </p>
            <a
              href={`mailto:${adminSettings.store.supportEmail}`}
              className="text-sm font-bold text-[#1E3F20] hover:text-[#9A5B00] transition-colors"
            >
              {adminSettings.store.supportEmail}
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EFE5D5] shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7EB] flex items-center justify-center text-[#9A5B00] mb-4 border border-[#F5DCB7]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1E3F20] font-serif mb-1">
              Valley Headquarters
            </h3>
            <p className="text-xs text-[#786C5E] leading-relaxed">
              {adminSettings.store.address}
            </p>
            <span className="text-[10px] text-[#9A5B00] font-bold mt-2 block">
              FSSAI Lic #11026999000182
            </span>
          </div>
        </div>

        {/* 2 Column Layout: Form & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Inquiry Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5D5] shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E3F20] font-serif mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs text-[#786C5E] mb-6">
              Leave your inquiry and our support team will reach out directly.
            </p>

            {isSent ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#1E3F20] mb-1">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-[#786C5E] mb-6">
                  Thank you {name}. A ticket has been created and our team will get back to {email} shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-5 py-2 bg-[#1E3F20] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aarav@example.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">Inquiry Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                  >
                    <option value="Product Query / Order Support">Product Query / Order Status</option>
                    <option value="Lab Report Inquiry">Lab Report &amp; NMR Certificate Question</option>
                    <option value="B2B Wholesale Inquiry">B2B Wholesale / Bulk Purchase</option>
                    <option value="Feedback / Suggestion">Feedback or Suggestion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with our Himalayan harvests?"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1E3F20]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Customer Desk</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQ Accordion (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-[#9A5B00]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E3F20] font-serif">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-xs text-[#786C5E] mb-6">
              Quick answers about shipping, raw crystallization, Vedic methods, and jar safety.
            </p>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#EFE5D5] overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#1E3F20] hover:bg-[#FEF7EB]/50 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#786C5E] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#9A5B00]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs sm:text-sm text-[#786C5E] leading-relaxed border-t border-[#FAF8F5]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
