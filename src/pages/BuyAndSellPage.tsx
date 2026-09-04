import React, { useState, useMemo, useEffect } from 'react';
import { Property, OperationType, PropertyType, PropertyCategory } from '../types/property';
import { categoryService, matchesPropertyCategory, getPropertyTypeLabel } from '../lib/supabase';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Bed,
  Bath,
  Car,
  Maximize2,
  MapPin,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Phone,
  Building2,
  Check,
  Tag,
} from 'lucide-react';
import { ADELINA_PHONE_FORMATTED, getWhatsAppInquiryUrl, getWhatsAppGeneralUrl } from '../lib/whatsappUtils';

interface BuyAndSellPageProps {
  properties: Property[];
  onSelectProperty: (slug: string) => void;
  onNavigate: (view: string, param?: string) => void;
  initialFilters?: {
    operation?: OperationType | 'all';
    type?: PropertyType | 'all';
    location?: string;
  };
}

export const BuyAndSellPage: React.FC<BuyAndSellPageProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
  initialFilters,
}) => {
  // Filter states
  const [operation, setOperation] = useState<OperationType | 'all'>(initialFilters?.operation || 'all');
  const [propertyType, setPropertyType] = useState<PropertyType | 'all'>(initialFilters?.type || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.location || '');
  const [bedrooms, setBedrooms] = useState<number | 'all'>('all');
  const [bathrooms, setBathrooms] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Categories from service
  const [categories, setCategories] = useState<PropertyCategory[]>(() => categoryService.getCategories());

  useEffect(() => {
    const updateCats = () => setCategories(categoryService.getCategories());
    window.addEventListener('adelina-categories-changed', updateCats);
    return () => window.removeEventListener('adelina-categories-changed', updateCats);
  }, []);

  // Sync state if initialFilters changes
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.operation !== undefined) setOperation(initialFilters.operation);
      if (initialFilters.type !== undefined) setPropertyType(initialFilters.type);
      if (initialFilters.location !== undefined) setSearchQuery(initialFilters.location);
    }
  }, [initialFilters]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [operation, propertyType, searchQuery, bedrooms, bathrooms, sortBy]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        if (p.status === 'hidden') return false;

        // Operation filter
        if (operation !== 'all' && p.operation_type !== operation) return false;

        // Type / Category filter
        if (propertyType !== 'all' && !matchesPropertyCategory(p.property_type, propertyType)) return false;

        // Bedrooms
        if (bedrooms !== 'all' && p.bedrooms < Number(bedrooms)) return false;

        // Bathrooms
        if (bathrooms !== 'all' && p.bathrooms < Number(bathrooms)) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.location_city.toLowerCase().includes(q) ||
            p.location_neighborhood.toLowerCase().includes(q) ||
            p.address_approx.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return (a.price_usd || a.price_ars || 0) - (b.price_usd || b.price_ars || 0);
        }
        if (sortBy === 'price_desc') {
          return (b.price_usd || b.price_ars || 0) - (a.price_usd || a.price_ars || 0);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [properties, operation, propertyType, searchQuery, bedrooms, bathrooms, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / itemsPerPage));
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const clearFilters = () => {
    setOperation('all');
    setPropertyType('all');
    setSearchQuery('');
    setBedrooms('all');
    setBathrooms('all');
  };

  const hasActiveFilters =
    operation !== 'all' ||
    propertyType !== 'all' ||
    searchQuery !== '' ||
    bedrooms !== 'all' ||
    bathrooms !== 'all';

  // Title calculation matching Figma style (e.g. "Casas en venta", "Propiedades disponibles")
  const pageTitle = useMemo(() => {
    if (propertyType !== 'all') {
      const catLabel = getPropertyTypeLabel(propertyType, categories);
      if (operation === 'sale') return `${catLabel} en venta`;
      if (operation === 'rent') return `${catLabel} en alquiler`;
      return `${catLabel}`;
    }
    if (operation === 'sale') return 'Propiedades en venta';
    if (operation === 'rent') return 'Propiedades en alquiler';
    return 'Propiedades disponibles';
  }, [propertyType, operation, categories]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen text-adelina-dark">
      {/* 1. HEADER SECTION (FIGMA 1:1) */}
      <section className="relative min-h-[480px] sm:min-h-[540px] flex flex-col justify-between pt-32 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
        {/* Background Image from Figma */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/comprar-vender-hero.jpg"
            alt="Interiores modernos de diseño"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Dark Overlay (rgba(0,0,0,0.72)) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/80" />
        </div>

        {/* Top Breadcrumbs */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <nav className="flex items-center gap-2 text-xs text-zinc-300 font-archivo font-light uppercase tracking-wider mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-adelina-accent transition-colors"
            >
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-adelina-accent font-medium">Comprar y Vender</span>
          </nav>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-4">
          <h1 className="font-archivo text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08]">
            Propiedades
          </h1>
          <p className="font-archivo text-base sm:text-xl md:text-2xl text-zinc-200 font-normal max-w-2xl leading-relaxed">
            Una selección de propiedades para vivir, invertir o proyectar tu próximo paso.
          </p>
        </div>

        {/* Decorative subtle bottom border */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-4" />
      </section>

      {/* 2. SEARCH & FILTER BAR ("BUSCADOR" FIGMA 1:1 CON GLASSMORPHISM / TRANSPARENCIA) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-12 sm:-mt-16 relative z-20">
        <div className="bg-white/35 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-white/60 ring-1 ring-black/5 transition-all">
          {/* Operation switch buttons: Comprar / Vender / Todos */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/40">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 mr-1 hidden sm:inline">
                Operación:
              </span>
              <button
                type="button"
                onClick={() => setOperation('all')}
                className={`px-4 py-2 rounded-full text-xs font-archivo font-medium transition-all ${
                  operation === 'all'
                    ? 'bg-adelina-dark text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-white/40 hover:bg-white/70 text-zinc-800 border border-white/60 backdrop-blur-sm shadow-sm'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setOperation('sale')}
                className={`px-4 py-2 rounded-full text-xs font-archivo font-medium transition-all ${
                  operation === 'sale'
                    ? 'bg-adelina-dark text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-white/40 hover:bg-white/70 text-zinc-800 border border-white/60 backdrop-blur-sm shadow-sm'
                }`}
              >
                Comprar / Venta
              </button>
              <button
                type="button"
                onClick={() => setOperation('rent')}
                className={`px-4 py-2 rounded-full text-xs font-archivo font-medium transition-all ${
                  operation === 'rent'
                    ? 'bg-adelina-dark text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-white/40 hover:bg-white/70 text-zinc-800 border border-white/60 backdrop-blur-sm shadow-sm'
                }`}
              >
                Alquiler
              </button>
            </div>

            {/* Quick Link to Valuation for Sellers */}
            <button
              onClick={() => {
                const el = document.getElementById('seccion-vender');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-adelina-accent hover:text-adelina-gold hover:underline font-semibold transition-colors"
            >
              <span>¿Querés tasar o vender tu propiedad?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. Tipo de propiedad */}
            <div className="bg-white/50 backdrop-blur-md border border-white/60 hover:border-adelina-accent focus-within:border-adelina-accent focus-within:bg-white/85 rounded-xl px-3 py-2.5 transition-all shadow-sm">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-0.5">
                Tipo de propiedad
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType | 'all')}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Dormitorios */}
            <div className="bg-white/50 backdrop-blur-md border border-white/60 hover:border-adelina-accent focus-within:border-adelina-accent focus-within:bg-white/85 rounded-xl px-3 py-2.5 transition-all shadow-sm">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-0.5">
                Dormitorios
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Cualquier cantidad</option>
                <option value="1">1+ Dormitorio</option>
                <option value="2">2+ Dormitorios</option>
                <option value="3">3+ Dormitorios</option>
                <option value="4+">4+ Dormitorios</option>
              </select>
            </div>

            {/* 3. Baños */}
            <div className="bg-white/50 backdrop-blur-md border border-white/60 hover:border-adelina-accent focus-within:border-adelina-accent focus-within:bg-white/85 rounded-xl px-3 py-2.5 transition-all shadow-sm">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-0.5">
                Baños
              </label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Cualquier cantidad</option>
                <option value="1">1+ Baño</option>
                <option value="2">2+ Baños</option>
                <option value="3">3+ Baños</option>
              </select>
            </div>

            {/* 4. Ubicación / Búsqueda */}
            <div className="bg-white/50 backdrop-blur-md border border-white/60 hover:border-adelina-accent focus-within:border-adelina-accent focus-within:bg-white/85 rounded-xl px-3 py-2.5 transition-all shadow-sm sm:col-span-2 lg:col-span-1">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-0.5">
                Ubicación / Barrio
              </label>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Ej. Centro, Parque Urquiza..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* 5. Clear / Status Action */}
            <div className="flex items-center gap-2">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full h-full min-h-[48px] bg-white/60 hover:bg-white text-zinc-700 font-archivo font-medium px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm border border-white/60 backdrop-blur-sm"
                >
                  <X className="w-4 h-4 text-rose-500" />
                  <span>Limpiar filtros</span>
                </button>
              ) : (
                <div className="w-full h-full min-h-[48px] bg-adelina-dark/90 backdrop-blur-md text-white rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-xs font-archivo font-medium shadow-md">
                  <Search className="w-4 h-4 text-adelina-accent" />
                  <span>Filtrando en vivo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROPIEDADES CATALOG SHOWCASE (FIGMA 1:1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-20">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-zinc-200">
          <div>
            <h2 className="font-archivo text-2xl sm:text-3xl lg:text-4xl font-light text-zinc-900 tracking-tight">
              {pageTitle}
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1 font-light">
              Mostrando <strong className="text-zinc-900 font-semibold">{filteredProperties.length}</strong> inmuebles en Paraná y Entre Ríos
            </p>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs text-zinc-600 self-end sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 font-medium focus:outline-none focus:border-adelina-accent cursor-pointer shadow-sm"
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 max-w-xl mx-auto my-12 space-y-4">
            <Building2 className="w-12 h-12 text-zinc-300 mx-auto" />
            <h3 className="font-archivo font-bold text-lg text-zinc-900">
              No encontramos propiedades con estos filtros
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Probá seleccionando otra categoría o limpiando los filtros para ver todas las opciones disponibles.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-adelina-accent text-adelina-dark font-archivo font-bold px-5 py-2.5 rounded-xl text-xs transition-transform active:scale-95 shadow-md"
            >
              <span>Ver todas las propiedades</span>
            </button>
          </div>
        )}

        {/* Properties Grid (Cards Figma 1:1) */}
        {paginatedProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProperties.map((property) => {
              const operationLabel =
                property.operation_type === 'sale'
                  ? 'Venta'
                  : property.operation_type === 'rent'
                  ? 'Alquiler'
                  : 'Alquiler Temporario';

              const categoryLabel = getPropertyTypeLabel(property.property_type, categories);
              const mainImage = property.featured_image || property.images[0] || '/assets/chic-living.jpg';
              const displayPrice =
                property.currency === 'USD'
                  ? `USD ${(property.price_usd || 0).toLocaleString('es-AR')}`
                  : `$ ${(property.price_ars || 0).toLocaleString('es-AR')}`;

              return (
                <article
                  key={property.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-zinc-200/80 hover:border-adelina-accent/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                  onClick={() => onSelectProperty(property.slug)}
                >
                  {/* Card Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      src={mainImage}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-adelina-dark/85 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {operationLabel}
                      </span>
                      <span className="bg-white/90 backdrop-blur-md text-zinc-800 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {categoryLabel}
                      </span>
                    </div>

                    {property.status === 'reserved' && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        Reservado
                      </span>
                    )}
                  </div>

                  {/* Card Content Box ("recuadro") */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      {/* Copete */}
                      <span className="text-[11px] font-archivo uppercase font-bold tracking-widest text-adelina-accent block">
                        {categoryLabel}
                      </span>

                      {/* Title (20px Archivo SemiBold in Figma) */}
                      <h3 className="font-archivo font-semibold text-lg text-zinc-900 group-hover:text-adelina-accent transition-colors line-clamp-2">
                        {property.title}
                      </h3>

                      {/* Location (16px Archivo in Figma) */}
                      <p className="text-zinc-500 text-xs sm:text-sm font-light flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{property.address_approx || `${property.location_neighborhood}, ${property.location_city}`}</span>
                      </p>
                    </div>

                    {/* Technical Specs Row (Figma icon row) */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-zinc-600 text-xs">
                      {/* Dormitorios */}
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1" title={`${property.bedrooms} Dormitorios`}>
                          <Bed className="w-4 h-4 text-adelina-accent" />
                          <span className="font-semibold text-zinc-800">{property.bedrooms}</span>
                        </div>
                      )}

                      {/* Baños */}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-1" title={`${property.bathrooms} Baños`}>
                          <Bath className="w-4 h-4 text-adelina-accent" />
                          <span className="font-semibold text-zinc-800">{property.bathrooms}</span>
                        </div>
                      )}

                      {/* Cocheras */}
                      {property.garages > 0 && (
                        <div className="flex items-center gap-1" title={`${property.garages} Cochera(s)`}>
                          <Car className="w-4 h-4 text-adelina-accent" />
                          <span className="font-semibold text-zinc-800">{property.garages}</span>
                        </div>
                      )}

                      {/* Superficie Total / Cubierta */}
                      <div className="flex items-center gap-1" title="Superficie Total">
                        <Maximize2 className="w-4 h-4 text-adelina-accent" />
                        <span className="font-semibold text-zinc-800">
                          {property.total_area_sqm || property.covered_area_sqm} m²
                        </span>
                      </div>
                    </div>

                    {/* Price & Actions (28px Archivo Bold in Figma) */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-light block uppercase tracking-wider">
                          Valor de publicación
                        </span>
                        <span className="font-archivo text-xl sm:text-2xl font-bold text-zinc-900">
                          {displayPrice}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={getWhatsAppInquiryUrl(property)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="Consultar por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => onSelectProperty(property.slug)}
                          className="px-3.5 py-2 rounded-xl bg-adelina-dark text-white hover:bg-zinc-800 text-xs font-archivo font-medium transition-colors"
                        >
                          Ver ficha
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 4. PAGINATION (FIGMA 1:1) */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center transition-colors ${
                currentPage === 1
                  ? 'text-zinc-300 border-zinc-200 cursor-not-allowed'
                  : 'text-zinc-700 hover:border-adelina-dark hover:bg-white'
              }`}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              const formattedNumber = pageNum < 10 ? `0${pageNum}` : `${pageNum}`;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-full text-xs font-archivo font-semibold transition-all ${
                    isActive
                      ? 'bg-adelina-dark text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-white'
                  }`}
                >
                  {formattedNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center transition-colors ${
                currentPage === totalPages
                  ? 'text-zinc-300 border-zinc-200 cursor-not-allowed'
                  : 'text-zinc-700 hover:border-adelina-dark hover:bg-white'
              }`}
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* 5. DEDICATED "VENDER / TASAR" SECTION FOR OWNERS */}
      <section id="seccion-vender" className="bg-adelina-dark text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-adelina-accent text-[11px] font-semibold uppercase tracking-widest">
              <span>Para Propietarios</span>
            </div>
            <h2 className="font-archivo text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
              ¿Querés conocer el valor actual de tu propiedad?
            </h2>
            <p className="font-archivo text-zinc-300 text-sm sm:text-base font-light leading-relaxed max-w-xl">
              Te acompaño con una tasación profesional y una mirada clara para que puedas avanzar con mayor seguridad.
            </p>

            {/* Benefit Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                <Check className="w-4 h-4 text-adelina-accent shrink-0" />
                <span>Tasación profesional y realista</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                <Check className="w-4 h-4 text-adelina-accent shrink-0" />
                <span>Fotografía & video de calidad</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                <Check className="w-4 h-4 text-adelina-accent shrink-0" />
                <span>Publicación en portales líderes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-200">
                <Check className="w-4 h-4 text-adelina-accent shrink-0" />
                <span>Asesoramiento legal y notarial</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-adelina-accent hover:bg-adelina-gold text-adelina-dark font-archivo font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-lg active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Solicitar Tasación por WhatsApp</span>
              </a>

              <button
                onClick={() => onNavigate('valuation')}
                className="inline-flex items-center gap-2 text-zinc-300 hover:text-white border border-white/20 hover:border-white/40 px-6 py-3.5 rounded-full text-xs sm:text-sm font-archivo font-medium transition-colors"
              >
                <span>Completar Formulario de Tasación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
              <img
                src="/assets/office-facade-sign.png"
                alt="Oficina Adelina Luján"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-adelina-accent text-[10px] font-semibold uppercase tracking-wider block">
                  Matrícula Oficial N° 1789
                </span>
                <span className="font-archivo text-base font-bold block">
                  Adelina Luján • Asesoramiento Inmobiliario
                </span>
                <span className="text-zinc-400 text-xs font-light block">
                  Paraná, Entre Ríos • Atención personalizada
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
