import React from 'react';
import {
  ShieldCheck,
  Award,
  Truck,
  Leaf,
  HeartHandshake,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: <Award className="w-6 h-6 text-[#9A5B00]" />,
      title: '100% Raw & Unheated',
      description: 'Zero added sugar, zero corn/rice syrup, unpasteurized below 35°C.',
    },
 {
  icon: <ShieldCheck className="w-6 h-6 text-[#2D5A27]" />,
  title: 'FSSAI-Tested Quality',
  description: 'Every batch is tested to meet FSSAI food safety and quality standards.',
},
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#9A5B00]" />,
      title: 'Ethical Tribal Sourcing',
      description: 'Direct fair-trade partnerships with native forest apiaries.',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#2D5A27]" />,
      title: '5–7 Days Pan-India Delivery',
      description: 'Dispatched within 24h in tamper-proof, shatter-resistant glass packaging.',
    },
  ];

  return (
    <section className="py-10 bg-white border-b border-[#EFE5D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE5D5]/80 hover:border-[#D9CDBF] transition-all"
            >
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-[#EFE5D5] shrink-0">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E3F20] tracking-tight mb-1">
                  {badge.title}
                </h4>
                <p className="text-xs text-[#5D6B5C] leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
