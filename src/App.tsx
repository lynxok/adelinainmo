import React, { useState, useEffect } from 'react';
import { Property, Lead, PropertyFilter } from './types/property';
import { propertyService, leadService } from './lib/supabase';
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { FloatingWhatsAppButton } from './components/public/FloatingWhatsAppButton';
import { HomePage } from './pages/HomePage';
import { PropertiesCatalogPage } from './pages/PropertiesCatalogPage';
import { BuyAndSellPage } from './pages/BuyAndSellPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { PropertyColleaguePage } from './pages/PropertyColleaguePage';
import { ValuationPage } from './pages/ValuationPage';
import { AboutAdelinaPage } from './pages/AboutAdelinaPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { AdminPropertyEditPage } from './pages/admin/AdminPropertyEditPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { XmlFeedPage } from './pages/admin/XmlFeedPage';

export function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'buy-sell' | 'detail' | 'colleague' | 'valuation' | 'admin' | 'about'>('home');
  const [selectedPropertySlug, setSelectedPropertySlug] = useState<string>('');
  const [catalogFilters, setCatalogFilters] = useState<PropertyFilter | undefined>(undefined);

  // Admin states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'properties' | 'property-new' | 'property-edit' | 'categories' | 'leads' | 'xml-feed'>('dashboard');
  const [editingPropertyId, setEditingPropertyId] = useState<string | undefined>(undefined);

  // Load initial properties & leads
  const refreshData = () => {
    setProperties(propertyService.getProperties());
    setLeads(leadService.getLeads());
  };

  useEffect(() => {
    refreshData();

    // Check saved admin auth
    const savedAuth = localStorage.getItem('adelina_admin_auth');
    if (savedAuth === 'true') {
      setIsAdminAuthenticated(true);
    }

    // Check URL parameters (e.g. ?colleague=1&p=slug or ?p=slug)
    const urlParams = new URLSearchParams(window.location.search);
    const pSlug = urlParams.get('p');
    const isColleague = urlParams.get('colleague') === '1';

    if (pSlug) {
      setSelectedPropertySlug(pSlug);
      if (isColleague) {
        setCurrentView('colleague');
      } else {
        setCurrentView('detail');
      }
    }
  }, []);

  // Navigation handlers
  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'home') {
      setCurrentView('home');
      setSelectedPropertySlug('');
    } else if (view === 'buy-sell' || view === 'catalog') {
      if (param?.startsWith('category:')) {
        const catSlug = param.replace('category:', '');
        setCatalogFilters({ type: catSlug });
      } else if (param === 'operation:sale') {
        setCatalogFilters({ operation: 'sale' });
      } else if (param === 'operation:rent') {
        setCatalogFilters({ operation: 'rent' });
      } else {
        setCatalogFilters(undefined);
      }
      setCurrentView('buy-sell');
    } else if (view === 'valuation') {
      setCurrentView('valuation');
    } else if (view === 'about') {
      setCurrentView('about');
    } else if (view === 'admin') {
      setCurrentView('admin');
    }
  };

  const handleSelectProperty = (slug: string) => {
    setSelectedPropertySlug(slug);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (filters: { operation?: any; type?: any; location?: string }) => {
    setCatalogFilters({
      operation: filters.operation,
      type: filters.type,
      location: filters.location,
    });
    setCurrentView('buy-sell');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Navigation
  const handleAdminNavigateTab = (tab: string, param?: string) => {
    if (tab === 'property-edit') {
      setEditingPropertyId(param);
      setAdminTab('property-edit');
    } else if (tab === 'property-new') {
      setEditingPropertyId(undefined);
      setAdminTab('property-new');
    } else {
      setAdminTab(tab as any);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adelina_admin_auth');
    setIsAdminAuthenticated(false);
    setCurrentView('home');
  };

  // Resolve selected property for detail or colleague view
  const activeProperty = properties.find(
    (p) => p.slug === selectedPropertySlug || p.id === selectedPropertySlug
  ) || properties[0];

  // ----------------------------------------------------
  // RENDER VIEWS
  // ----------------------------------------------------

  // 1. Colleague White-label View
  if (currentView === 'colleague') {
    return <PropertyColleaguePage property={activeProperty} />;
  }

  // 2. Admin Panel View
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true);
            setAdminTab('dashboard');
          }}
          onBackToWeb={() => setCurrentView('home')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onNavigateTab={handleAdminNavigateTab}
        onLogout={handleAdminLogout}
        onViewWeb={() => setCurrentView('home')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboardPage
            properties={properties}
            leads={leads}
            onNavigateTab={handleAdminNavigateTab}
            onViewWeb={() => setCurrentView('home')}
          />
        )}
        {adminTab === 'properties' && (
          <AdminPropertiesPage
            properties={properties}
            onRefresh={refreshData}
            onNavigateTab={handleAdminNavigateTab}
            onPreviewProperty={(slug) => {
              handleSelectProperty(slug);
            }}
          />
        )}
        {(adminTab === 'property-new' || adminTab === 'property-edit') && (
          <AdminPropertyEditPage
            propertyId={editingPropertyId}
            onBack={() => setAdminTab('properties')}
            onSaved={() => {
              refreshData();
              setAdminTab('properties');
            }}
          />
        )}
        {adminTab === 'categories' && (
          <AdminCategoriesPage />
        )}
        {adminTab === 'leads' && (
          <AdminLeadsPage
            leads={leads}
            onRefresh={refreshData}
          />
        )}
        {adminTab === 'xml-feed' && (
          <XmlFeedPage properties={properties} />
        )}
      </AdminLayout>
    );
  }

  // 3. Public Web Views (with Navbar and Footer)
  return (
    <div className="min-h-screen flex flex-col bg-adelina-light text-adelina-dark">
      <Navbar onNavigate={handleNavigate} currentView={currentView} />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
            onSearch={handleHeroSearch}
          />
        )}

        {(currentView === 'buy-sell' || currentView === 'catalog') && (
          <BuyAndSellPage
            properties={properties}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
            initialFilters={catalogFilters}
          />
        )}

        {currentView === 'detail' && activeProperty && (
          <PropertyDetailPage
            property={activeProperty}
            onBack={() => setCurrentView('buy-sell')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'valuation' && (
          <ValuationPage />
        )}

        {currentView === 'about' && (
          <AboutAdelinaPage onNavigate={handleNavigate} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Botón flotante de WhatsApp oficial (Figma 1:1) */}
      <FloatingWhatsAppButton
        currentView={currentView}
        activeProperty={activeProperty}
      />
    </div>
  );
}

export default App;
