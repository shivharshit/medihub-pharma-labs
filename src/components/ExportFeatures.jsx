import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Snowflake, Plane, FileCheck, Package, Lock, Award, Clock } from 'lucide-react';

export default function ExportFeatures() {
  const { t } = useTranslation();
  const features = [
    {
      icon: ShieldCheck,
      title: 'WHO-GMP Certified Formulations',
      desc: 'All finished formulations adhere strictly to WHO-GMP standards with rigorous purity, potency, and quality assays.'
    },
    {
      icon: Snowflake,
      title: 'Cold-Chain Shipping (2°C - 8°C)',
      desc: 'Specialized insulated thermoboxes and temperature dataloggers for temperature-sensitive peptides, injectables, and biologics.'
    },
    {
      icon: FileCheck,
      title: 'Full COA & MOA Documentation',
      desc: 'Certificate of Analysis (COA) and Method of Analysis (MOA) supplied with every commercial batch.'
    },
    {
      icon: Plane,
      title: 'Worldwide Express Air Cargo',
      desc: 'Rapid international delivery with tracked courier channels (DHL, FedEx Express, EMS, and dedicated freight forwarders).'
    },
    {
      icon: Package,
      title: 'Discreet & Secure Packaging',
      desc: 'Double-walled pharmaceutical cushioning, tamper-evident seals, and zero-leakage vials for zero transit damage.'
    },
    {
      icon: Lock,
      title: 'Customs Clearance Assistance',
      desc: 'Complete export documentation support, invoice declarations, HS code verification, and customs guidance.'
    }
  ];

  return (
    <section id="export-services" className="py-16 bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-blue tracking-wider uppercase bg-brand-blue-light px-3 py-1 rounded-full">
            {t('nav.exportServices')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {t('exportFeatures.heading')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t('exportFeatures.subheading')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-blue/40 shadow-xs hover:shadow-card transition-all duration-300 space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-blue-light text-brand-blue group-hover:bg-brand-blue group-hover:text-white flex items-center justify-center transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Global Delivery Banner */}
        <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy rounded-3xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700 shadow-xl">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold">{t('exportFeatures.ctaTitle')}</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {t('exportFeatures.ctaSub')}
            </p>
          </div>
          <a
            href="https://wa.me/919244200415?text=Hello%20Medihub%20Pharma%20Labs,%20I%20would%20like%20to%20request%20an%20export%20formulations%20catalog."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-brand-green hover:bg-brand-green-dark text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5"
          >
            {t('exportFeatures.ctaButton')}
          </a>
        </div>

      </div>
    </section>
  );
}
