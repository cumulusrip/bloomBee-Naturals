import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
  Mail,
  Phone,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Printer,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { NavigationView } from '../types';

interface LegalPoliciesViewProps {
  initialTab?: 'privacy' | 'terms' | 'returns' | 'shipping';
}

export const LegalPoliciesView: React.FC<LegalPoliciesViewProps> = ({ initialTab }) => {
  const { currentView, setCurrentView } = useStore();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'returns' | 'shipping'>('privacy');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentView === 'privacy-policy') setActiveTab('privacy');
    else if (currentView === 'terms-conditions') setActiveTab('terms');
    else if (currentView === 'returns-refunds') setActiveTab('returns');
    else if (currentView === 'shipping-delivery') setActiveTab('shipping');
    else if (initialTab) setActiveTab(initialTab);
  }, [currentView, initialTab]);

  const handleTabChange = (tab: 'privacy' | 'terms' | 'returns' | 'shipping') => {
    setActiveTab(tab);
    if (tab === 'privacy') setCurrentView('privacy-policy');
    else if (tab === 'terms') setCurrentView('terms-conditions');
    else if (tab === 'returns') setCurrentView('returns-refunds');
    else if (tab === 'shipping') setCurrentView('shipping-delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#786C5E] hover:text-[#1E3F20] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EFE5D5] rounded-xl text-xs text-[#786C5E] hover:text-[#1E3F20] hover:border-[#1E3F20] transition-all cursor-pointer shadow-2xs"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A27]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Policy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EFE5D5] rounded-xl text-xs text-[#786C5E] hover:text-[#1E3F20] hover:border-[#1E3F20] transition-all cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Header Title Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5D5] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F7EE] text-[#2D5A27] text-xs font-bold border border-[#D4E8D2] mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official Legal &amp; Compliance Center</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3F20] tracking-tight">
                BloomBee Naturals Legal Information
              </h1>
              <p className="text-xs sm:text-sm text-[#786C5E] mt-2 max-w-2xl leading-relaxed">
                Clear, transparent, and legally binding guidelines regarding your privacy, purchases, 
                courier logistics, and consumer guarantees.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] text-xs text-[#786C5E] space-y-2 shrink-0">
              <div className="font-bold text-[#1E3F20] flex items-center gap-1.5">
                <span>Customer Care &amp; Grievance</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#9A5B00]" />
                <a href="mailto:info@bloombeenaturals.com" className="text-[#1E3F20] hover:underline font-medium">
                  info@bloombeenaturals.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#2D5A27]" />
                <a href="tel:+918146553516" className="text-[#1E3F20] hover:underline font-medium">
                  +91 81465 53516
                </a>
              </div>
            </div>
          </div>

          {/* Policy Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-8 pt-6 border-t border-[#EFE5D5]">
            <button
              onClick={() => handleTabChange('privacy')}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#1E3F20] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#786C5E] hover:bg-[#FEF7EB] hover:text-[#1E3F20] border border-[#EFE5D5]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="truncate">Privacy Policy</span>
            </button>

            <button
              onClick={() => handleTabChange('terms')}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#1E3F20] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#786C5E] hover:bg-[#FEF7EB] hover:text-[#1E3F20] border border-[#EFE5D5]'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">Terms &amp; Conditions</span>
            </button>

            <button
              onClick={() => handleTabChange('returns')}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'returns'
                  ? 'bg-[#1E3F20] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#786C5E] hover:bg-[#FEF7EB] hover:text-[#1E3F20] border border-[#EFE5D5]'
              }`}
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span className="truncate">Returns &amp; Refunds</span>
            </button>

            <button
              onClick={() => handleTabChange('shipping')}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'shipping'
                  ? 'bg-[#1E3F20] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#786C5E] hover:bg-[#FEF7EB] hover:text-[#1E3F20] border border-[#EFE5D5]'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span className="truncate">Shipping &amp; Delivery</span>
            </button>
          </div>
        </div>

        {/* Policy Document Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#EFE5D5] shadow-xs">
          
          {/* TAB 1: Privacy Policy */}
          {activeTab === 'privacy' && (
            <article className="prose prose-stone max-w-none text-[#1F2937] space-y-8">
              <div className="border-b border-[#EFE5D5] pb-6">
                <span className="text-xs uppercase font-bold text-[#9A5B00] tracking-wider">
                  Data Governance &amp; Information Security
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3F20] mt-1 mb-2">
                  Privacy Policy – BloomBee Naturals
                </h2>
                <p className="text-xs text-[#786C5E] font-medium">
                  Last Updated: 30 August 2026
                </p>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-[#374151]">
                <p>
                  At <strong>BloomBee Naturals</strong>, we respect your privacy and are committed to protecting the personal information you share with us when you use our website or purchase our products.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Information We Collect
                </h3>
                <p>When you place an order or contact us, we may collect:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Your name</li>
                  <li>Mobile number</li>
                  <li>Email address</li>
                  <li>Shipping and billing address</li>
                  <li>Order and transaction details</li>
                  <li>Information you voluntarily provide when contacting us</li>
                </ul>
                <div className="bg-[#FAF8F5] border-l-4 border-[#9A5B00] p-4 rounded-r-xl text-xs text-[#786C5E] mt-3">
                  Payment information is processed securely through our payment gateway partners. We do not intentionally store your complete debit/credit card, UPI, or banking credentials.
                </div>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  How We Use Your Information
                </h3>
                <p>We may use your information to:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Process and deliver your orders</li>
                  <li>Send order and shipping updates</li>
                  <li>Respond to customer enquiries</li>
                  <li>Process refunds or cancellations</li>
                  <li>Improve our products and website</li>
                  <li>Prevent fraudulent or unauthorized transactions</li>
                  <li>Comply with applicable legal and tax requirements</li>
                </ul>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Sharing of Information
                </h3>
                <p>We may share necessary information with trusted service providers such as:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Payment gateway providers</li>
                  <li>Courier and logistics partners</li>
                  <li>Website/technology service providers</li>
                  <li>Government or regulatory authorities where legally required</li>
                </ul>
                <p className="font-semibold text-[#1E3F20]">
                  We do not sell your personal information to third parties.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Cookies
                </h3>
                <p>
                  Our website may use cookies and similar technologies to improve website functionality, understand website usage, and provide a better customer experience.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Data Security
                </h3>
                <p>
                  We take reasonable measures to protect your personal information. However, no method of internet transmission or electronic storage can be guaranteed to be completely secure.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Your Rights
                </h3>
                <p>
                  You may contact us to request information regarding the personal data we hold about you, subject to applicable law.
                </p>

                <div className="mt-8 pt-6 border-t border-[#EFE5D5] bg-[#FAF8F5] p-6 rounded-2xl">
                  <h4 className="font-serif font-bold text-base text-[#1E3F20] mb-2">
                    Contact Us
                  </h4>
                  <p className="text-xs text-[#786C5E] mb-3">For privacy-related questions:</p>
                  <div className="space-y-1 text-xs text-[#1F2937]">
                    <div className="font-bold text-[#1E3F20]">BloomBee Naturals</div>
                    <div>Email: <a href="mailto:info@bloombeenaturals.com" className="text-[#9A5B00] hover:underline">info@bloombeenaturals.com</a></div>
                    <div>Phone: <a href="tel:+918146553516" className="text-[#1E3F20] hover:underline">+91 81465 53516</a></div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* TAB 2: Terms & Conditions */}
          {activeTab === 'terms' && (
            <article className="prose prose-stone max-w-none text-[#1F2937] space-y-8">
              <div className="border-b border-[#EFE5D5] pb-6">
                <span className="text-xs uppercase font-bold text-[#9A5B00] tracking-wider">
                  Terms of Service &amp; Purchase Agreement
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3F20] mt-1 mb-2">
                  Terms &amp; Conditions – BloomBee Naturals
                </h2>
                <p className="text-xs text-[#786C5E] font-medium">
                  Last Updated: 30 August 2026
                </p>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-[#374151]">
                <p>
                  Welcome to <strong>BloomBee Naturals</strong>. By accessing or using our website, you agree to these Terms &amp; Conditions.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Products
                </h3>
                <p>
                  We currently offer BloomBee Naturals Himalayan Honey – 250 g.
                </p>
                <p className="text-xs text-[#786C5E]">
                  Product images are provided for representation and may vary slightly from the actual product due to photography, screen settings, packaging updates, or manufacturing variations.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Pricing
                </h3>
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFE5D5] space-y-1 text-xs">
                  <p className="font-semibold text-[#1E3F20]">
                    The MRP of the 250 g Himalayan Honey is ₹249.
                  </p>
                  <p className="text-[#786C5E]">
                    Our current website selling price is ₹229, subject to any applicable offers or promotions displayed on the website.
                  </p>
                </div>
                <p>
                  We reserve the right to change prices, offers, or product availability without prior notice. Orders already confirmed will generally be processed at the price displayed at the time of purchase.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Orders
                </h3>
                <p>
                  After placing an order, you will receive an order confirmation through the contact details provided by you.
                </p>
                <p>We reserve the right to cancel an order in circumstances such as:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Product unavailability</li>
                  <li>Incorrect pricing or product information</li>
                  <li>Suspected fraudulent transactions</li>
                  <li>Incorrect or incomplete customer information</li>
                  <li>Delivery limitations</li>
                </ul>
                <p>
                  If an order is cancelled after payment has been received, the eligible amount will be refunded through the applicable payment method.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Payment
                </h3>
                <p>
                  Payments may be processed through our authorized payment gateway. You agree to provide accurate information necessary to complete your purchase.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Delivery
                </h3>
                <p>
                  Orders will be shipped to the address provided during checkout. Delivery timelines may vary depending on your location, courier service, weather, holidays, operational issues, or other circumstances beyond our control.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Product Usage
                </h3>
                <p>
                  Please read the product packaging and label information before consuming the product.
                </p>
                <p className="font-semibold text-[#9A5B00]">
                  Do not use the product if the packaging appears damaged, opened, or tampered with at the time of delivery. Contact us promptly if this occurs.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Intellectual Property
                </h3>
                <p>
                  All website content, including the BloomBee Naturals brand name, logo, product photographs, text, graphics, and other materials, belongs to or is used by BloomBee Naturals with appropriate rights and may not be reproduced without permission.
                </p>

                <div className="mt-8 pt-6 border-t border-[#EFE5D5] bg-[#FAF8F5] p-6 rounded-2xl">
                  <h4 className="font-serif font-bold text-base text-[#1E3F20] mb-2">
                    Contact
                  </h4>
                  <p className="text-xs text-[#786C5E] mb-3">For questions regarding these Terms &amp; Conditions:</p>
                  <div className="space-y-1 text-xs text-[#1F2937]">
                    <div>Email: <a href="mailto:info@bloombeenaturals.com" className="text-[#9A5B00] hover:underline">info@bloombeenaturals.com</a></div>
                    <div>Phone: <a href="tel:+918146553516" className="text-[#1E3F20] hover:underline">+91 81465 53516</a></div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* TAB 3: Returns & Refunds */}
          {activeTab === 'returns' && (
            <article className="prose prose-stone max-w-none text-[#1F2937] space-y-8">
              <div className="border-b border-[#EFE5D5] pb-6">
                <span className="text-xs uppercase font-bold text-[#9A5B00] tracking-wider">
                  Consumer Guarantee &amp; Food Safety Standards
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3F20] mt-1 mb-2">
                  Returns &amp; Refunds Policy – BloomBee Naturals
                </h2>
                <p className="text-xs text-[#786C5E] font-medium">
                  Last Updated: 30 August 2026
                </p>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-[#374151]">
                <p>
                  At <strong>BloomBee Naturals</strong>, we want you to receive your order safely and in good condition.
                </p>
                <div className="bg-[#FAF8F5] border-l-4 border-[#2D5A27] p-4 rounded-r-xl text-xs text-[#1E3F20] font-semibold">
                  Because honey is a food product, returns are subject to the conditions below.
                </div>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Damaged or Tampered Product
                </h3>
                <p>If you receive a product that is:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Damaged</li>
                  <li>Leaking</li>
                  <li>Broken</li>
                  <li>Tampered with</li>
                  <li>Incorrectly delivered</li>
                </ul>
                <p className="font-semibold text-[#1E3F20]">
                  Please contact us as soon as possible after delivery.
                </p>

                <p>Please provide:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Your order number</li>
                  <li>Photographs of the product</li>
                  <li>Photographs of the outer packaging</li>
                  <li>A brief description of the issue</li>
                </ul>
                <p>
                  Our team will review the request and, where applicable, arrange a replacement or refund.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Wrong Product
                </h3>
                <p>
                  If you receive a product different from the one you ordered, please contact us promptly with your order details and photographs. After verification, we may arrange a replacement or eligible refund.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Change of Mind
                </h3>
                <p>
                  For food and consumable products, we generally do not accept returns simply because the customer has changed their mind, unless otherwise required by applicable law.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Refunds
                </h3>
                <p>
                  If a refund is approved, the refund will generally be processed through the original payment method or another appropriate method. The time taken for the amount to appear in your account may depend on your bank/payment provider.
                </p>

                <div className="mt-8 pt-6 border-t border-[#EFE5D5] bg-[#FAF8F5] p-6 rounded-2xl">
                  <h4 className="font-serif font-bold text-base text-[#1E3F20] mb-2">
                    Contact for Returns &amp; Refunds
                  </h4>
                  <div className="space-y-1 text-xs text-[#1F2937]">
                    <div className="font-bold text-[#1E3F20]">BloomBee Naturals</div>
                    <div>Email: <a href="mailto:info@bloombeenaturals.com" className="text-[#9A5B00] hover:underline">info@bloombeenaturals.com</a></div>
                    <div>Phone: <a href="tel:+918146553516" className="text-[#1E3F20] hover:underline">+91 81465 53516</a></div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* TAB 4: Shipping & Delivery */}
          {activeTab === 'shipping' && (
            <article className="prose prose-stone max-w-none text-[#1F2937] space-y-8">
              <div className="border-b border-[#EFE5D5] pb-6">
                <span className="text-xs uppercase font-bold text-[#9A5B00] tracking-wider">
                  Logistics, Dispatch Timelines &amp; Fulfillment
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E3F20] mt-1 mb-2">
                  Shipping &amp; Delivery Policy – BloomBee Naturals
                </h2>
                <p className="text-xs text-[#786C5E] font-medium">
                  Last Updated: 30 August 2026
                </p>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-[#374151]">
                <p>
                  We aim to process and dispatch your <strong>BloomBee Naturals</strong> orders as quickly as possible.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Order Processing
                </h3>
                <p>
                  Orders are normally processed after successful payment and order confirmation. Processing time may vary depending on order volume, product availability, holidays, and operational circumstances.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Delivery
                </h3>
                <p>
                  Orders are delivered through third-party courier/logistics partners. Delivery time may vary depending on:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Delivery location</li>
                  <li>Courier availability</li>
                  <li>Weather conditions</li>
                  <li>Public holidays</li>
                  <li>Operational delays</li>
                  <li>Remote or difficult-to-service locations</li>
                </ul>
                <p className="text-xs text-[#786C5E]">
                  The estimated delivery timeline shown during checkout, where available, should be treated as an estimate rather than an absolute guarantee.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Shipping Charges
                </h3>
                <p>
                  Applicable shipping charges, if any, will be displayed during checkout before you complete your purchase.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Incorrect Address
                </h3>
                <p>
                  Please ensure that your name, phone number, and delivery address are correct before placing your order.
                </p>
                <p className="text-xs text-[#786C5E]">
                  BloomBee Naturals may not be responsible for delays or failed deliveries caused by an incorrect or incomplete address or unavailable recipient.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Damaged Package
                </h3>
                <p>
                  If your package appears seriously damaged or tampered with when delivered, please document the condition with photographs and contact us as soon as possible.
                </p>

                <h3 className="font-serif text-lg font-bold text-[#1E3F20] pt-4">
                  Delivery Issues
                </h3>
                <p>
                  If your order has not arrived within the expected delivery period, contact us with your order number so we can assist you.
                </p>

                <div className="mt-8 pt-6 border-t border-[#EFE5D5] bg-[#FAF8F5] p-6 rounded-2xl">
                  <h4 className="font-serif font-bold text-base text-[#1E3F20] mb-2">
                    Contact Us
                  </h4>
                  <div className="space-y-1 text-xs text-[#1F2937]">
                    <div className="font-bold text-[#1E3F20]">BloomBee Naturals</div>
                    <div>Email: <a href="mailto:info@bloombeenaturals.com" className="text-[#9A5B00] hover:underline">info@bloombeenaturals.com</a></div>
                    <div>Phone: <a href="tel:+918146553516" className="text-[#1E3F20] hover:underline">+91 81465 53516</a></div>
                  </div>
                </div>
              </div>
            </article>
          )}

        </div>

      </div>
    </div>
  );
};
