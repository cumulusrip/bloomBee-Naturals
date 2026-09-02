import React from 'react';
import { Check, X, ShieldAlert, Sparkles, FileCheck, ArrowRight } from 'lucide-react';
import { RAW_HONEY_COMPARISON_DATA } from '../data/initialData';
import { useStore } from '../context/StoreContext';

export const ComparisonChart: React.FC = () => {
  const { products, openLabReportModal } = useStore();
  const rawHoneyProduct = products[0];

  return (
    <section id="why-raw-honey" className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] text-[#9A5B00] border border-[#E69500]/30 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            The Purity Truth
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E3F20] tracking-tight">
            Why 100% Raw Honey Matters
          </h2>
          <p className="mt-4 text-base text-[#4B5563] leading-relaxed">
            Commercial supermarket honeys are often heavily pasteurized, ultra-filtered, and diluted with synthetic C3/C4 sugar syrups. Here is how authentic BloomBee Raw Honey stands apart.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#EFE5D5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EFE5D5] bg-[#FAF8F5]">
                  <th className="py-5 px-6 font-display text-base font-bold text-[#1E3F20] w-1/3">
                    Quality Parameter
                  </th>
                  <th className="py-5 px-6 bg-[#FEF7EB] border-x border-[#EFE5D5] w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍯</span>
                      <div>
                        <div className="font-display text-base font-bold text-[#9A5B00]">
                          BloomBee Raw Honey
                        </div>
                        <div className="text-[11px] font-semibold text-[#2D5A27] uppercase tracking-wider">
                          100% Cold-Extracted &amp; NMR Tested
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="py-5 px-6 text-[#786C5E] w-1/3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="font-display text-base font-bold text-gray-700">
                          Commercial Ultra-Filtered Honey
                        </div>
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Standard Supermarket Brands
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE5D5] text-xs sm:text-sm">
                {RAW_HONEY_COMPARISON_DATA.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#FAF8F5]/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-[#1E3F20] align-top">
                      {row.parameter}
                    </td>

                    {/* BloomBee Cell */}
                    <td className="py-4 px-6 bg-[#FEF7EB]/40 border-x border-[#EFE5D5] text-[#1E3F20] font-medium align-top">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#2D5A27] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="leading-relaxed">{row.rawHoney}</span>
                      </div>
                    </td>

                    {/* Commercial Cell */}
                    <td className="py-4 px-6 text-gray-500 align-top">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="leading-relaxed">{row.commercialHoney}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Lab Verification CTA */}
          <div className="bg-[#1E3F20] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2D5A27] border border-[#3E7037] flex items-center justify-center text-[#E69500] shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-white">
                  Verify Your Honey Batch NMR Lab Report
                </h4>
                <p className="text-xs text-[#D4E8D2] mt-0.5">
                  We publish third-party Intertek &amp; Eurofins NMR spectroscopy certificates for every single harvest batch.
                </p>
              </div>
            </div>

            <button
              onClick={() => rawHoneyProduct && openLabReportModal(rawHoneyProduct)}
              className="bg-[#E69500] hover:bg-[#D48B00] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <span>View Sample NMR Certificate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
