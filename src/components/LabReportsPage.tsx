import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  FileCheck,
  Search,
  CheckCircle2,
  ShieldCheck,
  Download,
  Printer,
  Sparkles,
  Award,
  ExternalLink,
  Info,
  ChevronRight,
} from 'lucide-react';

export const LabReportsPage: React.FC = () => {
  const { products, openLabReportModal } = useStore();
  const [searchBatch, setSearchBatch] = useState('BBN-JK-2026');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchBatch.trim().toUpperCase();
    const found = products.find(
      (p) =>
        p.purityReport.batchNo.toUpperCase() === clean ||
        p.purityReport.batchNo.toUpperCase().includes(clean)
    );
    if (found) {
      setSelectedProduct(found);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7EB] border border-[#F5DCB7] text-[#9A5B00] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Traceability &amp; Purity Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#1E3F20] font-serif mb-4 tracking-tight">
            Batch-Wise NMR Lab Test Reports
          </h1>

          <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
            Every harvest batch of BloomBee Naturals undergoes independent Nuclear Magnetic Resonance (NMR) spectroscopy and multi-parameter quality testing. Enter your batch number printed on the back of the bottle or box to verify.
          </p>

          {/* Search Batch Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchBatch}
                onChange={(e) => setSearchBatch(e.target.value)}
                placeholder="e.g. BBN-JK-2026, BBN-AC-2026"
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#EFE5D5] rounded-2xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20] uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Search</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Click Batch Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#786C5E]">
            <span>Try sample batches:</span>
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSearchBatch(p.purityReport.batchNo);
                  setSelectedProduct(p);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-colors cursor-pointer ${
                  selectedProduct.id === p.id
                    ? 'bg-[#1E3F20] text-white border-[#1E3F20]'
                    : 'bg-white text-[#374151] border-[#EFE5D5] hover:bg-[#FEF7EB]'
                }`}
              >
                {p.purityReport.batchNo}
              </button>
            ))}
          </div>
        </div>

        {/* Certificate Display Card */}
        {selectedProduct && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5D5] shadow-md mb-16 relative overflow-hidden">
            
            {/* Header / Watermark info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFE5D5] pb-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FEF7EB] flex items-center justify-center text-[#9A5B00] border border-[#F5DCB7] shrink-0">
                  <FileCheck className="w-7 h-7 text-[#9A5B00]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-green-100 text-green-800 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-700" />
                      <span>Certified 100% Authentic</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-[#9A5B00]">
                      Batch #{selectedProduct.purityReport.batchNo}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E3F20] font-serif">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xs text-[#786C5E] mt-0.5">
                    Analyzed by {selectedProduct.purityReport.labName} • Report Date: {selectedProduct.purityReport.reportDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openLabReportModal(selectedProduct)}
                  className="px-4 py-2.5 bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Interactive Certificate</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2.5 bg-[#FAF8F5] hover:bg-[#EFE5D5]/50 text-[#374151] rounded-xl border border-[#EFE5D5] transition-colors cursor-pointer"
                  title="Print Certificate"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Test Results Parameter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EFE5D5]">
                <span className="text-xs text-[#786C5E] block mb-1">NMR Spectroscopy Profile</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <strong className="text-sm text-[#1E3F20]">100% Pure Profile</strong>
                </div>
                <span className="text-[10px] text-green-700 mt-1 block">Zero foreign peak deviations</span>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EFE5D5]">
                <span className="text-xs text-[#786C5E] block mb-1">C4 Cane &amp; Corn Sugars</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <strong className="text-sm text-[#1E3F20]">0.0% (ND / Negative)</strong>
                </div>
                <span className="text-[10px] text-[#786C5E] mt-1 block">FSSAI Limit: &lt; 7.0%</span>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EFE5D5]">
                <span className="text-xs text-[#786C5E] block mb-1">Moisture Level</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <strong className="text-sm text-[#1E3F20]">{selectedProduct.purityReport.moisturePercent}%</strong>
                </div>
                <span className="text-[10px] text-[#786C5E] mt-1 block">FSSAI Limit: Max 20.0%</span>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EFE5D5]">
                <span className="text-xs text-[#786C5E] block mb-1">Live Pollen &amp; Enzymes</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <strong className="text-sm text-[#1E3F20]">Preserved &amp; Active</strong>
                </div>
                <span className="text-[10px] text-green-700 mt-1 block">Cold-gravity strained under 40°C</span>
              </div>
            </div>

            {/* Detailed Parameters Table */}
            <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-6 border border-[#EFE5D5] mb-8">
              <h3 className="text-sm font-bold text-[#1E3F20] font-serif mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#9A5B00]" />
                <span>Comprehensive Chemical &amp; Biological Evaluation Matrix</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EFE5D5] text-[#786C5E] font-semibold">
                      <th className="pb-3">Test Parameter</th>
                      <th className="pb-3">Method Protocol</th>
                      <th className="pb-3">Observed Result</th>
                      <th className="pb-3">FSSAI / Codex Standard</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE5D5]">
                    <tr>
                      <td className="py-3 font-semibold text-[#1F2937]">NMR Fingerprint Deviation</td>
                      <td className="py-3 text-[#786C5E]">Bruker 400 MHz 1H-NMR</td>
                      <td className="py-3 text-green-700 font-bold">Conforms to Genuine Honey Model</td>
                      <td className="py-3 text-[#786C5E]">Target Pattern Match</td>
                      <td className="py-3 text-right text-green-700 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-[#1F2937]">C4 Sugars (Carbon Isotope IRMS)</td>
                      <td className="py-3 text-[#786C5E]">AOAC 998.12 EA-IRMS</td>
                      <td className="py-3 text-green-700 font-bold">&lt; 0.5% (Not Detected)</td>
                      <td className="py-3 text-[#786C5E]">Max 7.0%</td>
                      <td className="py-3 text-right text-green-700 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-[#1F2937]">Hydroxymethylfurfural (HMF)</td>
                      <td className="py-3 text-[#786C5E]">HPLC-UV @ 284nm</td>
                      <td className="py-3 text-green-700 font-bold">12.4 mg/kg</td>
                      <td className="py-3 text-[#786C5E]">Max 80.0 mg/kg</td>
                      <td className="py-3 text-right text-green-700 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-[#1F2937]">Diastase Activity</td>
                      <td className="py-3 text-[#786C5E]">Schade Photometric</td>
                      <td className="py-3 text-green-700 font-bold">18.6 Schade Units</td>
                      <td className="py-3 text-[#786C5E]">Min 8.0 Schade Units</td>
                      <td className="py-3 text-right text-green-700 font-bold">PASS</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-[#1F2937]">Specific Gravity @ 27°C</td>
                      <td className="py-3 text-[#786C5E]">Hydrometer Method</td>
                      <td className="py-3 text-green-700 font-bold">1.42</td>
                      <td className="py-3 text-[#786C5E]">Min 1.35</td>
                      <td className="py-3 text-right text-green-700 font-bold">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Certification Stamp Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-dashed border-[#9A5B00]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEF7EB] flex items-center justify-center text-xl text-[#9A5B00]">
                  🏛️
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E3F20]">
                    Authorized Quality Assurance Laboratory
                  </p>
                  <p className="text-[10px] text-[#786C5E]">
                    Accredited in accordance with ISO/IEC 17025:2017 &amp; FSSAI Standards
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-[#1E3F20] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#EFE5D5]">
                FSSAI Lic: 11026999000182
              </span>
            </div>

          </div>
        )}

        {/* All Products Reports Grid */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#1E3F20] font-serif">
              Browse All Active Harvest Batches
            </h3>
            <p className="text-xs sm:text-sm text-[#786C5E] mt-0.5">
              Click on any product to view its certificate or open the interactive modal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  setSelectedProduct(prod);
                  setSearchBatch(prod.purityReport.batchNo);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="bg-white rounded-2xl p-5 border border-[#EFE5D5] shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-14 h-14 rounded-xl object-cover border border-[#EFE5D5]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#9A5B00] bg-[#FEF7EB] px-2 py-0.5 rounded-md">
                      {prod.purityReport.batchNo}
                    </span>
                    <h4 className="text-xs font-bold text-[#1E3F20] mt-1 line-clamp-1 group-hover:text-[#9A5B00] transition-colors">
                      {prod.title}
                    </h4>
                    <span className="text-[10px] text-[#786C5E]">{prod.origin}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EFE5D5] flex items-center justify-between text-[11px]">
                  <span className="text-green-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>NMR Tested</span>
                  </span>
                  <span className="text-[#9A5B00] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    <span>View Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
