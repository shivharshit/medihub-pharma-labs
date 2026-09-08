import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    productOfInterest: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitWhatsApp = (e) => {
    e.preventDefault();
    let text = `*NEW EXPORT INQUIRY - MEDIHUB PHARMA LABS*\n`;
    text += `*Name:* ${formData.name}\n`;
    text += `*Country:* ${formData.country}\n`;
    text += `*Email:* ${formData.email}\n`;
    text += `*Phone:* ${formData.phone}\n`;
    text += `*Products of Interest:* ${formData.productOfInterest}\n`;
    text += `*Message/Quantity:* ${formData.message}\n`;
    window.open(`https://wa.me/918043812772?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Export Inquiry from ${formData.name} (${formData.country}) - Medihub Pharma Labs`);
    let body = `Name: ${formData.name}\n`;
    body += `Country: ${formData.country}\n`;
    body += `Email: ${formData.email}\n`;
    body += `Phone: ${formData.phone}\n`;
    body += `Products: ${formData.productOfInterest}\n`;
    body += `Message: ${formData.message}\n`;
    window.location.href = `mailto:medihubpharmaceutical@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <section id="contact-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-green tracking-wider uppercase bg-brand-green-light px-3 py-1 rounded-full">
            Connect With Global Export Desk
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Request Export Quotations & Rate Cards
          </h2>
          <p className="text-sm text-slate-600">
            Reach out directly for wholesale inquiries, batch certificate requests, customs queries, or custom formulations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Export Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Direct Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Direct WhatsApp Export Desk</h3>
                  <p className="text-xs text-emerald-100">Fastest response for international buyers</p>
                </div>
              </div>

              <p className="text-xs text-emerald-50 leading-relaxed">
                Chat with our export specialists for live batch photos, ready stock confirmation, and instant proforma invoices.
              </p>

              <a
                href="https://wa.me/918043812772?text=Hello%20Medihub%20Pharma%20Labs,%20I%20want%20to%20place%20an%20export%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold text-xs px-5 py-2.5 rounded-xl shadow hover:bg-emerald-50 transition-colors"
              >
                <span>Chat on WhatsApp (+91 8043812772)</span>
              </a>
            </div>

            {/* Contact Details List */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 text-xs">
              
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block">Phone / Export Helpline:</span>
                  <a href="tel:+918043812772" className="font-bold text-slate-800 text-sm hover:text-brand-blue">
                    +91 8043812772 / 08043812772
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block">Official Export Email:</span>
                  <a href="mailto:medihubpharmaceutical@gmail.com" className="font-bold text-slate-800 text-sm hover:text-brand-blue">
                    medihubpharmaceutical@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block">Export Hub & Global Network:</span>
                  <span className="font-semibold text-slate-800">
                    International Pharmaceutical Formulations & Worldwide Export Hub
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-green-light text-brand-green flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block">Export Desk Hours:</span>
                  <span className="font-medium text-slate-800">
                    24/7 International Timezone Support (Response &lt; 2h)
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right: Direct Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Send an Export RFQ Message</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out your requirements below and submit directly to our export team.
                </p>
              </div>

              {submitted && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong>Inquiry Form Dispatched!</strong> Our team will contact you shortly with your quotation.
                  </div>
                </div>
              )}

              <form className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Your Full Name / Company *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe / HealthCorp"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Destination Country / City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. United Kingdom / London"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="buyer@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Products / Categories of Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Cenforce 100mg, Anavar 10mg, Semaglutide, Testosterone Enanthate"
                    value={formData.productOfInterest}
                    onChange={(e) => setFormData({ ...formData, productOfInterest: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Estimated Quantity & Delivery Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Provide estimated pack quantities, desired packaging format, or target timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-xs"
                  ></textarea>
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSubmitWhatsApp}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Inquiry on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitEmail}
                    className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry via Email</span>
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
