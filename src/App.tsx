import React, { useState, useEffect } from 'react';
import { Property, Lead, PropertyFilter, UserProfile } from './types/property';
import { propertyService, leadService, authService } from './lib/supabase';
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
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { XmlFeedPage } from './pages/admin/XmlFeedPage';
type AppView = 'home' | 'catalog' | 'buy-sell' | 'detail' | 'colleague' | 'valuation' | 'admin' | 'about';

interface RouteState {
  view: AppView;
  slug?: string;
  filters?: PropertyFilter;
}

function parseRouteFromUrl(): RouteState {
  const params = new URLSearchParams(window.location.search);
  const pSlug = params.get('p');
  const isColleague = params.get('colleague') === '1';
  const viewParam = params.get('view');
  const tipo = params.get('tipo');
  const op = params.get('op') as 'sale' | 'rent' | null;

  if (pSlug) {
    if (isColleague) {
      return { view: 'colleague', slug: pSlug };
    }
    return { view: 'detail', slug: pSlug };
  }

  if (viewParam === 'tasaciones' || viewParam === 'valuation') {
    return { view: 'valuation' };
  }
  if (viewParam === 'sobre-mi' || viewParam === 'about') {
    return { view: 'about' };
  }
  if (viewParam === 'admin') {
    return { view: 'admin' };
  }
  if (viewParam === 'propiedades' || viewParam === 'catalog' || viewParam === 'buy-sell') {
    const filters: PropertyFilter = {};
    if (tipo) filters.type = tipo;
    if (op === 'sale' || op === 'rent') filters.operation = op;
    return { view: 'buy-sell', filters: Object.keys(filters).length > 0 ? filters : undefined };
  }

  return { view: 'home' };
}

function buildRouteUrl(view: AppView, slug?: string, filters?: PropertyFilter): string {
  const pathname = window.location.pathname;
  if (view === 'colleague' && slug) {
    return `${pathname}?colleague=1&p=${encodeURIComponent(slug)}`;
  }
  if (view === 'detail' && slug) {
    return `${pathname}?p=${encodeURIComponent(slug)}`;
  }
  if (view === 'buy-sell' || view === 'catalog') {
    const params = new URLSearchParams();
    params.set('view', 'propiedades');
    if (filters?.type) params.set('tipo', filters.type);
    if (filters?.operation) params.set('op', filters.operation);
    return `${pathname}?${params.toString()}`;
  }
  if (view === 'valuation') {
    return `${pathname}?view=tasaciones`;
  }
  if (view === 'about') {
    return `${pathname}?view=sobre-mi`;
  }
  if (view === 'admin') {
    return `${pathname}?view=admin`;
  }
  return pathname;
}

export function App() {
  const [properties, setProperties] = useState<Property[]>(() => propertyService.getProperties());
  const [leads, setLeads] = useState<Lead[]>(() => leadService.getLeads());
  const [currentView, setCurrentView] = useState<AppView>(() => parseRouteFromUrl().view);
  const [selectedPropertySlug, setSelectedPropertySlug] = useState<string>(() => parseRouteFromUrl().slug || '');
  const [catalogFilters, setCatalogFilters] = useState<PropertyFilter | undefined>(() => parseRouteFromUrl().filters);

  // Admin states & Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => authService.getCurrentProfile());
  const [adminTab, setAdminTab] = useState<'dashboard' | 'properties' | 'property-new' | 'property-edit' | 'categories' | 'testimonials' | 'leads' | 'users' | 'xml-feed'>('dashboard');
  const [editingPropertyId, setEditingPropertyId] = useState<string | undefined>(undefined);

  // Navigation with browser history synchronization
  const navigate = (
    view: AppView,
    options?: { slug?: string; filters?: PropertyFilter; replace?: boolean }
  ) => {
    const targetView = view === 'catalog' ? 'buy-sell' : view;
    const targetSlug = options?.slug || '';
    const targetFilters = options?.filters;
    const targetUrl = buildRouteUrl(targetView, targetSlug, targetFilters);

    if (options?.replace) {
      window.history.replaceState({ view: targetView, slug: targetSlug, filters: targetFilters }, '', targetUrl);
    } else {
      window.history.pushState({ view: targetView, slug: targetSlug, filters: targetFilters }, '', targetUrl);
    }

    setCurrentView(targetView);
    setSelectedPropertySlug(targetSlug);
    setCatalogFilters(targetFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load initial properties & leads
  const refreshData = async () => {
    const cached = propertyService.getProperties();
    if (cached.length > 0) setProperties(cached);
    setLeads(leadService.getLeads());
    try {
      const [remoteProps, remoteLeads] = await Promise.all([
        propertyService.fetchProperties(),
        leadService.fetchLeads(),
      ]);
      if (remoteProps && remoteProps.length > 0) setProperties(remoteProps);
      if (remoteLeads) setLeads(remoteLeads);
    } catch (err) {
      console.error('Error fetching fresh data from Supabase:', err);
    }
  };

  useEffect(() => {
    refreshData();

    window.addEventListener('adelina-properties-changed', refreshData);
    window.addEventListener('adelina-leads-changed', refreshData);

    // Save initial state into browser history if not already set
    const initialRoute = parseRouteFromUrl();
    window.history.replaceState(
      { view: initialRoute.view, slug: initialRoute.slug || '', filters: initialRoute.filters },
      '',
      window.location.href
    );

    // Handle browser back and forward buttons
    const handlePopState = () => {
      const route = parseRouteFromUrl();
      setCurrentView(route.view);
      setSelectedPropertySlug(route.slug || '');
      setCatalogFilters(route.filters);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);

    // Check saved admin auth
    const savedAuth = localStorage.getItem('adelina_admin_auth');
    if (savedAuth === 'true') {
      setIsAdminAuthenticated(true);
      const current = authService.getCurrentProfile();
      if (current) {
        setUserProfile(current);
        if (current.role === 'corredor') {
          setAdminTab('properties');
        }
      }
      authService.fetchCurrentProfile().then((p) => {
        if (p) {
          setUserProfile(p);
          if (p.role === 'corredor') {
            setAdminTab('properties');
          }
        }
      });
    }

    return () => {
      window.removeEventListener('adelina-properties-changed', refreshData);
      window.removeEventListener('adelina-leads-changed', refreshData);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Navigation handlers
  const handleNavigate = (view: string, param?: string) => {
    if (view === 'home') {
      navigate('home');
    } else if (view === 'buy-sell' || view === 'catalog') {
      let filters: PropertyFilter | undefined = undefined;
      if (param?.startsWith('category:')) {
        const catSlug = param.replace('category:', '');
        filters = { type: catSlug };
      } else if (param === 'operation:sale') {
        filters = { operation: 'sale' };
      } else if (param === 'operation:rent') {
        filters = { operation: 'rent' };
      }
      navigate('buy-sell', { filters });
    } else if (view === 'valuation') {
      navigate('valuation');
    } else if (view === 'about') {
      navigate('about');
    } else if (view === 'admin') {
      navigate('admin');
    }
  };

  const handleSelectProperty = (slug: string) => {
    navigate('detail', { slug });
  };

  const handleHeroSearch = (filters: { operation?: any; type?: any; location?: string }) => {
    navigate('buy-sell', {
      filters: {
        operation: filters.operation,
        type: filters.type,
        location: filters.location,
      },
    });
  };

  // Admin Navigation with RBAC
  const handleAdminNavigateTab = (tab: string, param?: string) => {
    if ((window as any).__ADELINA_IS_SAVING_PROPERTY__) {
      const confirmed = window.confirm(
        '⚠️ ¡Atención! Hay imágenes subiéndose o datos guardándose en el servidor.\n\nSi cambiás de pantalla ahora se cancelará la carga. ¿Estás seguro de que querés salir?'
      );
      if (!confirmed) return;
    }

    if (userProfile?.role === 'corredor' && tab !== 'properties' && tab !== 'property-new' && tab !== 'property-edit') {
      setAdminTab('properties');
      return;
    }

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

  const handleAdminLogout = async () => {
    if ((window as any).__ADELINA_IS_SAVING_PROPERTY__) {
      const confirmed = window.confirm(
        '⚠️ ¡Atención! Hay imágenes subiéndose o datos guardándose en el servidor.\n\nSi cerrás sesión ahora se cancelará la carga. ¿Estás seguro de que querés salir?'
      );
      if (!confirmed) return;
    }
    await authService.logout();
    setIsAdminAuthenticated(false);
    setUserProfile(null);
    setCurrentView('home');
  };

  const handleAdminViewWeb = () => {
    if ((window as any).__ADELINA_IS_SAVING_PROPERTY__) {
      const confirmed = window.confirm(
        '⚠️ ¡Atención! Hay imágenes subiéndose o datos guardándose en el servidor.\n\nSi vas al sitio web ahora se cancelará la carga. ¿Estás seguro de que querés salir?'
      );
      if (!confirmed) return;
    }
    handleNavigate('home');
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
          onLoginSuccess={(profile) => {
            setIsAdminAuthenticated(true);
            if (profile) setUserProfile(profile);
            if (profile?.role === 'corredor') {
              setAdminTab('properties');
            } else {
              setAdminTab('dashboard');
            }
          }}
          onBackToWeb={() => handleNavigate('home')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onNavigateTab={handleAdminNavigateTab}
        onLogout={handleAdminLogout}
        onViewWeb={handleAdminViewWeb}
        userProfile={userProfile}
      >
        {adminTab === 'dashboard' && userProfile?.role !== 'corredor' && (
          <AdminDashboardPage
            properties={properties}
            leads={leads}
            onNavigateTab={handleAdminNavigateTab}
            onViewWeb={handleAdminViewWeb}
            userProfile={userProfile}
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
        {adminTab === 'categories' && userProfile?.role !== 'corredor' && (
          <AdminCategoriesPage />
        )}
        {adminTab === 'testimonials' && userProfile?.role !== 'corredor' && (
          <AdminTestimonialsPage />
        )}
        {adminTab === 'leads' && userProfile?.role !== 'corredor' && (
          <AdminLeadsPage
            leads={leads}
            onRefresh={refreshData}
          />
        )}
        {adminTab === 'users' && userProfile?.role === 'superadmin' && (
          <AdminUsersPage userProfile={userProfile} />
        )}
        {adminTab === 'xml-feed' && userProfile?.role !== 'corredor' && (
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
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                handleNavigate('buy-sell');
              }
            }}
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
