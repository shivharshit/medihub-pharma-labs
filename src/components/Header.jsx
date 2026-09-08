import React, { useState } from 'react';
import { Search, ShoppingBag, Phone, Mail, Menu, X, Globe, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  rfqItemsCount,
  setIsRfqOpen,
  onNavigate
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setIsCatDropdownOpen(false);
    setIsMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Export Compliance & Contact Strip */}
      <div className="bg-brand-navy text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              WHO-GMP Sourced & Certified Global Exporter
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-brand-blue" />
              Exporting to 60+ Countries Worldwide (COA & MOA Verified)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="tel:+917587970797" 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-green" />
              <span>+91 7587970797</span>
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href="https://wa.me/917587970797?text=Hello%20Medihub%20Pharma%20Labs,%20I%20want%20to%20inquire%20about%20pharmaceutical%20products" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav className="glass-nav border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 flex-shrink-0 group">
            <img 
              src="/logo.png" 
              alt="Medihub Pharma Labs" 
              className="h-11 sm:h-13 object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* Center Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search 598+ export products (e.g., Aquabol, Cenforce, Anavar, Semaglutide)...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/90 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links & Actions */}
          <div className="hidden md:flex items-center gap-5">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-brand-blue py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-all"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    All {categories.length} Categories
                  </div>
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-brand-blue-light transition-colors ${
                      selectedCategory === 'all' ? 'text-brand-blue bg-brand-blue-light/50 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>All Products (View All)</span>
                    <span className="text-slate-400 font-mono">598+ items</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-brand-blue-light transition-colors ${
                        selectedCategory === cat.name ? 'text-brand-blue bg-brand-blue-light/50 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a 
              href="#catalog-section" 
              className="text-sm font-medium text-slate-700 hover:text-brand-blue transition-colors"
            >
              Catalog
            </a>
            <a 
              href="#export-services" 
              className="text-sm font-medium text-slate-700 hover:text-brand-blue transition-colors"
            >
              Export Services
            </a>
            <a 
              href="#about-section" 
              className="text-sm font-medium text-slate-700 hover:text-brand-blue transition-colors"
            >
              About Us
            </a>
            <a 
              href="#contact-section" 
              className="text-sm font-medium text-slate-700 hover:text-brand-blue transition-colors"
            >
              Contact
            </a>

            {/* RFQ Cart Button */}
            <button
              onClick={() => setIsRfqOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-brand-blue to-sky-600 hover:from-brand-blue-dark hover:to-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Inquiry List</span>
              {rfqItemsCount > 0 && (
                <span className="flex items-center justify-center bg-brand-green text-white text-xs font-bold w-5 h-5 rounded-full border-2 border-white -mr-1 animate-pulse">
                  {rfqItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsRfqOpen(true)}
              className="relative p-2 text-brand-blue hover:bg-slate-100 rounded-lg"
              aria-label="Inquiry Basket"
            >
              <ShoppingBag className="w-6 h-6" />
              {rfqItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {rfqItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-brand-blue hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar in Navbar */}
        <div className="mt-3 lg:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 337+ products (e.g. Cenforce, Anavar)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-slate-200 mt-3 space-y-2">
            <a
              href="#catalog-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Browse Catalog (337 Products)
            </a>
            <a
              href="#export-services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Export Logistics & Compliance
            </a>
            <a
              href="#about-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              About Medihub
            </a>
            <a
              href="#contact-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Contact & Bulk RFQ
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
