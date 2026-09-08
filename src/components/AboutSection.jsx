import React from 'react';
import { Building2, Award, CheckCircle2, Globe2, ShieldCheck, FileCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-blue-light text-brand-blue px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              <span>About Medihub Pharma Labs</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              A Global Leader in Advanced Pharmaceutical Sourcing & Formulations
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              <strong>Medihub Pharma Labs</strong> is an internationally accredited exporter and manufacturer network specializing in premium finished pharmaceuticals, generic tablets, high-potency injectables, research peptides, and specialized healthcare solutions.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Guided by our foundational motto — <em className="font-semibold text-slate-800">"Importing Health, Exporting Wellness Worldwide"</em> — we provide direct B2B supply lines to pharmacies, medical institutions, clinical researchers, and licensed wholesale distributors across 60+ countries.
            </p>

            {/* Core Values / Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-brand-blue" />
                  <span>WHO-GMP Quality Assurance</span>
                </div>
                <p className="text-xs text-slate-500">
                  Strict batch testing, validated active pharmaceutical ingredients (APIs), and authentic anti-counterfeit verification.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Globe2 className="w-4 h-4 text-brand-green" />
                  <span>60+ Global Export Markets</span>
                </div>
                <p className="text-xs text-slate-500">
                  Reliable express air-cargo distribution, customs clearance assistance, and temperature-controlled cold-chain support.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Company Credentials Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
              
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <img src="/logo.png" alt="Medihub Pharma Labs" className="h-14 object-contain" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Medihub Pharma Labs</h3>
                  <p className="text-xs text-slate-500">International Export & Formulations Division</p>
                </div>
              </div>

              {/* Verified Details */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Manufacturing Certification:</span>
                    <strong className="text-slate-900 font-semibold">WHO-GMP & European Pharmacopeia Compliant</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <FileCheck className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Documentation Provided:</span>
                    <span className="text-slate-800 font-semibold">
                      Complete Certificate of Analysis (COA), MOA, & Batch Release Testing
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Globe2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">International Operations:</span>
                    <span className="text-slate-800 font-semibold">
                      Global B2B Supply & Cold-Chain Logistics Across 60+ Nations
                    </span>
                  </div>
                </div>
              </div>

              {/* Tagline Box */}
              <div className="bg-gradient-to-r from-brand-blue to-sky-600 rounded-2xl p-4 text-white text-center shadow-md">
                <div className="text-xs font-semibold tracking-wider uppercase text-sky-100">Our International Promise</div>
                <div className="text-sm font-extrabold mt-0.5">Importing Health, Exporting Wellness</div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
