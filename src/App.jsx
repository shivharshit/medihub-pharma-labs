import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedBrandsGrid from './components/FeaturedBrandsGrid';
import CategoryBar from './components/CategoryBar';
import ProductCatalog from './components/ProductCatalog';
import ProductModal from './components/ProductModal';
import RfqCartModal from './components/RfqCartModal';
import ExportFeatures from './components/ExportFeatures';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminPortal from './admin/AdminPortal';
import { syncLiveTranslations } from './services/translationService';
import { trackEvent } from './services/analyticsService';
import { pingBillaEyes, logBillaAction } from './services/billaEyesService';

import productsData from './data/products.json';
import categoriesData from './data/categories.json';

export default function App() {
  const checkIsAdmin = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.startsWith('/admin') || hash.startsWith('#admin') || search.includes('admin=true');
  };

  const [isAdminView, setIsAdminView] = useState(checkIsAdmin);

  const [products] = useState(productsData);
  const [categories] = useState(categoriesData);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRfqOpen, setIsRfqOpen] = useState(false);

  // Sync any cloud translations on startup, log initial visitor session & BILLA EYES heartbeat
  useEffect(() => {
    syncLiveTranslations();
    if (!isAdminView) {
      trackEvent('page_view', { path: window.location.pathname, ref: document.referrer || 'Direct' });
      pingBillaEyes('Browsing Storefront Catalog', window.location.pathname);

      // BILLA EYES continuous heartbeat ping every 10 seconds
      const heartbeatInterval = setInterval(() => {
        pingBillaEyes('Actively Browsing Catalog', window.location.pathname);
      }, 10000);

      const handleRouteChange = () => {
        setIsAdminView(checkIsAdmin());
      };

      window.addEventListener('hashchange', handleRouteChange);
      window.addEventListener('popstate', handleRouteChange);

      return () => {
        clearInterval(heartbeatInterval);
        window.removeEventListener('hashchange', handleRouteChange);
        window.removeEventListener('popstate', handleRouteChange);
      };
    } else {
      const handleRouteChange = () => {
        setIsAdminView(checkIsAdmin());
      };

      window.addEventListener('hashchange', handleRouteChange);
      window.addEventListener('popstate', handleRouteChange);

      return () => {
        window.removeEventListener('hashchange', handleRouteChange);
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, [isAdminView]);

  // RFQ Cart State persisted in LocalStorage
  const [rfqItems, setRfqItems] = useState(() => {
    try {
      const saved = localStorage.getItem('medihub_rfq_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('medihub_rfq_cart', JSON.stringify(rfqItems));
    } catch (e) {
      console.error('Failed to save RFQ cart:', e);
    }
  }, [rfqItems]);

  const handleAddToRfq = (product, quantity = 100) => {
    setRfqItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setRfqItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setRfqItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearRfq = () => {
    setRfqItems([]);
  };

  const handleSelectPopularCategory = (catName) => {
    setSelectedCategory(catName);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isAdminView) {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Navigation Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        rfqItemsCount={rfqItems.length}
        setIsRfqOpen={setIsRfqOpen}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* Hero Section with Dynamic Brand Category Pills */}
        <Hero
          onExploreClick={handleExploreClick}
          onSelectPopularCategory={handleSelectPopularCategory}
          categories={categories}
          totalProducts={products.length}
          totalCategories={categories.length}
        />

        {/* Premium Featured Brand & Category Showcase Grid with Live Product Previews */}
        <FeaturedBrandsGrid
          categories={categories}
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectPopularCategory}
          onSelectProduct={setSelectedProduct}
        />

        {/* Sticky Interactive Category Pills Navigation */}
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          totalProducts={products.length}
          onSelectCategory={(catName) => {
            setSelectedCategory(catName);
            const catalogEl = document.getElementById('catalog-section');
            if (catalogEl) {
              catalogEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Main Product Catalog Section with Live Filters & Search */}
        <ProductCatalog
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelectProduct={setSelectedProduct}
          onAddToRfq={handleAddToRfq}
          rfqItems={rfqItems}
        />

        {/* Export Capabilities & Logistics Features */}
        <ExportFeatures />

        {/* About Medihub Section & Verified Entity Info */}
        <AboutSection />

        {/* Direct Contact & RFQ Dispatch Section */}
        <ContactSection />
      </main>

      {/* Footer with All Categories & Disclaimers */}
      <Footer
        categories={categories}
        onSelectCategory={handleSelectPopularCategory}
      />

      {/* Floating 24/7 WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToRfq={handleAddToRfq}
          isInRfq={rfqItems.some((item) => item.id === selectedProduct.id)}
        />
      )}

      {/* Request For Quotation (RFQ) Cart Drawer */}
      <RfqCartModal
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        rfqItems={rfqItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearRfq={handleClearRfq}
      />

    </div>
  );
}
