import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search, Filter, SlidersHorizontal, RotateCcw, PackageSearch, ArrowUpDown } from 'lucide-react';

export default function ProductCatalog({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onSelectProduct,
  onAddToRfq,
  rfqItems
}) {
  const [selectedForm, setSelectedForm] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(24);

  // Form Filter options
  const formOptions = [
    { label: 'All Forms', value: 'all' },
    { label: 'Tablets', value: 'tablet' },
    { label: 'Injections / Vials', value: 'injection' },
    { label: 'Peptides', value: 'peptide' },
    { label: 'Capsules', value: 'capsule' },
    { label: 'Oral Jellies & Gels', value: 'jelly' },
    { label: 'Inhalers & Sprays', value: 'spray' }
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category Match
      const matchesCat = 
        selectedCategory === 'all' || 
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search Query Match (search in title, active ingredient, category, dosage)
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.dosage && p.dosage.toLowerCase().includes(q)) ||
        (p.specifications?.Composition && p.specifications.Composition.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      // Dosage Form Match
      const formLower = (p.form || '').toLowerCase();
      const nameLower = p.name.toLowerCase();
      let matchesForm = true;
      if (selectedForm === 'tablet') {
        matchesForm = formLower.includes('tablet') || (!formLower.includes('injection') && !formLower.includes('capsule') && !formLower.includes('jelly'));
      } else if (selectedForm === 'injection') {
        matchesForm = formLower.includes('injection') || formLower.includes('vial') || nameLower.includes('injection');
      } else if (selectedForm === 'peptide') {
        matchesForm = formLower.includes('peptide') || p.category.toLowerCase().includes('peptides');
      } else if (selectedForm === 'capsule') {
        matchesForm = formLower.includes('capsule') || nameLower.includes('capsule');
      } else if (selectedForm === 'jelly') {
        matchesForm = formLower.includes('jelly') || formLower.includes('gel') || nameLower.includes('jelly');
      } else if (selectedForm === 'spray') {
        matchesForm = formLower.includes('spray') || formLower.includes('inhaler') || nameLower.includes('inhaler');
      }

      return matchesCat && matchesSearch && matchesForm;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'featured') {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
      }
      return 0;
    });
  }, [products, selectedCategory, searchTerm, selectedForm, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const rfqProductIds = useMemo(() => {
    return new Set(rfqItems.map(item => item.id));
  }, [rfqItems]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setSelectedForm('all');
    setSortBy('featured');
    setVisibleCount(24);
  };

  return (
    <section id="catalog-section" className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-brand-blue font-semibold text-xs tracking-wider uppercase">
              <span>Complete Export Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Pharmaceutical Catalog & Formulations
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Explore 337+ certified pharmaceutical finished formulations ready for international B2B export.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs">
            <PackageSearch className="w-4 h-4 text-brand-blue" />
            <span>
              Showing <strong className="text-slate-900">{displayedProducts.length}</strong> of{' '}
              <strong className="text-slate-900">{filteredProducts.length}</strong> matching formulations
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          
          {/* Top Row: Search Input & Sort Selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product name, active molecule, dosage, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2">
              <div className="relative w-full">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white text-slate-700 appearance-none font-medium"
                >
                  <option value="featured">Sort: Featured & Popular</option>
                  <option value="name-asc">Sort: Product Name (A to Z)</option>
                  <option value="name-desc">Sort: Product Name (Z to A)</option>
                  <option value="category">Sort: Category Group</option>
                </select>
              </div>

              {(selectedCategory !== 'all' || searchTerm || selectedForm !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  title="Reset all filters"
                  className="p-2.5 text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition-colors flex-shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dosage Form Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mr-1">
              Dosage Form:
            </span>
            {formOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedForm(opt.value)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedForm === opt.value
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onAddToRfq={onAddToRfq}
                  isInRfq={rfqProductIds.has(product.id)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {displayedProducts.length < filteredProducts.length && (
              <div className="flex flex-col items-center justify-center pt-8 pb-4 space-y-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="bg-white hover:bg-slate-50 text-brand-blue font-bold px-8 py-3 rounded-xl border border-brand-blue/30 shadow-sm hover:shadow transition-all"
                >
                  Load More Products ({filteredProducts.length - displayedProducts.length} remaining)
                </button>
                <span className="text-xs text-slate-400">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </span>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No matching formulations found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any products matching your search query: <strong className="text-slate-700">"{searchTerm}"</strong> in category <strong>"{selectedCategory}"</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                className="bg-brand-blue text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow hover:bg-brand-blue-dark transition-colors"
              >
                Reset Filters & View All 337 Products
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
