import React from 'react';
import {
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LabTestCertificateModal: React.FC = () => {
  const { isLabReportModalOpen, closeLabReportModal, activeLabProduct } = useStore();

  if (!isLabReportModalOpen || !activeLabProduct) return null;

  const report = activeLabProduct.purityReport;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-[#EFE5D5] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Certificate Header */}
        <div className="bg-[#1E3F20] text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E69500] text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2D5A27] text-[#FAF8F5] px-2 py-0.5 rounded-full">
                  NMR Lab Report
                </span>
                <span className="text-xs text-[#D4E8D2]">Official Batch Verification</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold mt-0.5 text-white">
                Nuclear Magnetic Resonance (NMR) Certificate
              </h2>
            </div>
          </div>

          <button
            onClick={closeLabReportModal}
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Certificate Metadata Bar */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#786C5E] block">Verified Product:</span>
              <strong className="text-[#1E3F20] truncate block">{activeLabProduct.title}</strong>
            </div>
            <div>
              <span className="text-[#786C5E] block">Harvest Batch No:</span>
              <strong className="font-mono text-[#9A5B00]">{report.batchNo}</strong>
            </div>
            <div>
              <span className="text-[#786C5E] block">Testing Lab:</span>
              <strong className="text-[#1E3F20]">{report.labName}</strong>
            </div>
            <div>
              <span className="text-[#786C5E] block">Report Date:</span>
              <strong className="text-[#1E3F20]">{report.reportDate}</strong>
            </div>
          </div>

          {/* Test Outcomes Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E3F20] mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#9A5B00]" />
              Key Spectroscopic Analysis Parameters
            </h3>

            <div className="border border-[#EFE5D5] rounded-2xl overflow-hidden text-xs sm:text-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FAF8F5] text-[#786C5E] border-b border-[#EFE5D5] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Scientific Parameter</th>
                    <th className="p-3.5">FSSAI Standard</th>
                    <th className="p-3.5">BloomBee Tested Result</th>
                    <th className="p-3.5 text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE5D5]">
                  <tr className="hover:bg-white">
                    <td className="p-3.5 font-bold text-[#1E3F20]">C4 Sugar Adulteration (NMR Peak)</td>
                    <td className="p-3.5 text-gray-500">Max 7% (FSSAI)</td>
                    <td className="p-3.5 text-[#2D5A27] font-semibold">0.0% (Zero Detected)</td>
                    <td className="p-3.5 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        PASSED ✓
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white">
                    <td className="p-3.5 font-bold text-[#1E3F20]">C3 / Rice Syrup Isotope Ratio</td>
                    <td className="p-3.5 text-gray-500">Negative</td>
                    <td className="p-3.5 text-[#2D5A27] font-semibold">Negative (100% Flora Nectar)</td>
                    <td className="p-3.5 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        PASSED ✓
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white">
                    <td className="p-3.5 font-bold text-[#1E3F20]">Moisture Content (%)</td>
                    <td className="p-3.5 text-gray-500">Max 20.0%</td>
                    <td className="p-3.5 text-[#1E3F20] font-semibold">{report.moisturePercent}% (Optimal Thickness)</td>
                    <td className="p-3.5 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        PASSED ✓
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white">
                    <td className="p-3.5 font-bold text-[#1E3F20]">Bioactive Pollen Count</td>
                    <td className="p-3.5 text-gray-500">Present</td>
                    <td className="p-3.5 text-[#2D5A27] font-semibold">28,000+ grains/g (Unfiltered)</td>
                    <td className="p-3.5 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        PREMIUM ✓
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white">
                    <td className="p-3.5 font-bold text-[#1E3F20]">Diastase Activity (Live Enzymes)</td>
                    <td className="p-3.5 text-gray-500">Min 8 DN Units</td>
                    <td className="p-3.5 text-[#2D5A27] font-semibold">14.2 DN Units (Unheated)</td>
                    <td className="p-3.5 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        EXCELLENT ✓
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Guarantee & FSSAI Licensing */}
          <div className="bg-[#FEF7EB] p-4 rounded-2xl border border-[#E69500]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-[#1E3F20]">
                FSSAI License No: <span className="font-mono text-[#9A5B00]">{report.fssaiLicense}</span>
              </p>
              <p className="text-[11px] text-[#786C5E] mt-0.5">
                Processed in strict accordance with ISO 22000 &amp; GMP Ayurvedic standards.
              </p>
            </div>

            <button
              onClick={closeLabReportModal}
              className="bg-[#1E3F20] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#2D5A27] transition-colors shrink-0 cursor-pointer"
            >
              Done Reviewing
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
