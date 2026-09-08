import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const { t } = useTranslation();
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
    window.open(`https://wa.me/919244200415?text=${encodeURIComponent(text)}`, '_blank');
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
    window.location.href = `mailto:support@medihubpharmalabs.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <section id="contact-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-green tracking-wider uppercase bg-brand-green-light px-3 py-1 rounded-full">
            {t('contact.badge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {t('contact.heading')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('contact.subheading')}
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
                  <h3 className="font-bold text-base">{t('contact.whatsappCardTitle')}</h3>
                  <p className="text-xs text-emerald-100">{t('contact.whatsappCardSubtitle')}</p>
                </div>
              </div>

              <p className="text-xs text-emerald-50 leading-relaxed">
                {t('contact.whatsappCardDesc')}
              </p>

              <a
                href="https://wa.me/919244200415?text=Hello%20Medihub%20Pharma%20Labs,%20I%20want%20to%20place%20an%20export%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold text-xs px-5 py-2.5 rounded-xl shadow hover:bg-emerald-50 transition-colors"
              >
                <span>{t('contact.chatOnWhatsapp')}</span>
              </a>
            </div>

            {/* Contact Details List */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 text-xs">
              
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block">{t('contact.phoneHelpline')}</span>
                  <a href="tel:+919244200415" className="font-bold text-slate-800 text-sm hover:text-brand-blue">
                    +91 9244200415
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block">{t('contact.officialEmail')}</span>
                  <a href="mailto:support@medihubpharmalabs.com" className="font-bold text-slate-800 text-sm hover:text-brand-blue">
                    support@medihubpharmalabs.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block">{t('contact.exportHub')}</span>
                  <span className="font-semibold text-slate-800">
                    {t('contact.exportHubValue')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-brand-green-light text-brand-green flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block">{t('contact.workingHours')}</span>
                  <span className="font-medium text-slate-800">
                    {t('contact.workingHoursValue')}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right: Direct Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{t('contact.formTitle')}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t('contact.formSubtitle')}
                </p>
              </div>

              {submitted && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong>{t('contact.successMsg')}</strong>
                  </div>
                </div>
              )}

              <form className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t('rfq.fullName')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('contact.namePlaceholder')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t('rfq.country')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('contact.countryPlaceholder')}
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t('rfq.phone')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('contact.phonePlaceholder')}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">{t('rfq.email')}</label>
                    <input
                      type="email"
                      required
                      placeholder={t('contact.emailPlaceholder')}
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
                    placeholder={t('contact.productsPlaceholder')}
                    value={formData.productOfInterest}
                    onChange={(e) => setFormData({ ...formData, productOfInterest: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">{t('rfq.notes')}</label>
                  <textarea
                    rows={3}
                    placeholder={t('contact.messagePlaceholder')}
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
                    <span>{t('contact.sendWhatsapp')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitEmail}
                    className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('contact.sendEmail')}</span>
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
