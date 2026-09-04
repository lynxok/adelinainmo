import React, { useState, useMemo, useEffect } from 'react';
import { Property, OperationType, PropertyType, PropertyCategory } from '../types/property';
import { PropertyCard } from '../components/public/PropertyCard';
import { Filter, Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { categoryService, matchesPropertyCategory } from '../lib/supabase';

interface PropertiesCatalogPageProps {
  properties: Property[];
  onSelectProperty: (slug: string) => void;
  initialFilters?: {
    operation?: OperationType | 'all';
    type?: PropertyType | 'all';
    location?: string;
  };
}

export const PropertiesCatalogPage: React.FC<PropertiesCatalogPageProps> = ({
  properties,
  onSelectProperty,
  initialFilters,
}) => {
  const [operation, setOperation] = useState<OperationType | 'all'>(initialFilters?.operation || 'all');
  const [propertyType, setPropertyType] = useState<PropertyType | 'all'>(initialFilters?.type || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.location || '');
  const [bedrooms, setBedrooms] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [categories, setCategories] = useState<PropertyCategory[]>(() => categoryService.getCategories());

  useEffect(() => {
    const updateCats = () => setCategories(categoryService.getCategories());
    window.addEventListener('adelina-categories-changed', updateCats);
    return () => window.removeEventListener('adelina-categories-changed', updateCats);
  }, []);

  // Sync state if initialFilters changes externally (e.g. user clicks category in navbar)
  useEffect(() => {
    if (initialFilters) {
      setOperation(initialFilters.operation || 'all');
      setPropertyType(initialFilters.type || 'all');
      setSearchQuery(initialFilters.location || '');
    }
  }, [initialFilters]);

  // Filter logic
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Exclude hidden
        if (p.status === 'hidden') return false;

        // Operation filter
        if (operation !== 'all' && p.operation_type !== operation) return false;

        // Type / Category filter with intelligent matching
        if (propertyType !== 'all' && !matchesPropertyCategory(p.property_type, propertyType)) return false;

        // Bedrooms filter
        if (bedrooms !== 'all' && p.bedrooms < Number(bedrooms)) return false;

        // Query filter (searches in title, description, location, neighborhood)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
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
        // Newest default
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [properties, operation, propertyType, searchQuery, bedrooms, sortBy]);

  const clearFilters = () => {
    setOperation('all');
    setPropertyType('all');
    setSearchQuery('');
    setBedrooms('all');
  };

  const hasActiveFilters = operation !== 'all' || propertyType !== 'all' || searchQuery !== '' || bedrooms !== 'all';

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <span className="text-adelina-accent text-xs font-semibold uppercase tracking-widest block">
          Catálogo Inmobiliario
        </span>
        <h1 className="font-archivo text-3xl sm:text-4xl font-bold text-adelina-dark tracking-tight">
          Propiedades Disponibles
        </h1>
        <p className="text-zinc-500 text-sm font-light">
          Encontrá la propiedad que mejor se adapta a tus necesidades en Paraná y alrededores.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-adelina-border/80 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Query */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por barrio, zona o palabras clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent transition-colors"
            />
          </div>

          {/* Operation */}
          <div>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as OperationType | 'all')}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent transition-colors cursor-pointer"
            >
              <option value="all">Todas las operaciones</option>
              <option value="sale">En Venta</option>
              <option value="rent">En Alquiler</option>
              <option value="temporary_rent">Alquiler Temporario</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType | 'all')}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent transition-colors cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent transition-colors cursor-pointer"
            >
              <option value="all">Cualquier cantidad de dorms</option>
              <option value="1">1+ Dormitorios</option>
              <option value="2">2+ Dormitorios</option>
              <option value="3">3+ Dormitorios</option>
              <option value="4">4+ Dormitorios</option>
            </select>
          </div>
        </div>

        {/* Results count & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
          <div className="flex items-center gap-3">
            <span>
              Mostrando <strong className="text-zinc-900 font-semibold">{filteredProperties.length}</strong> propiedades
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-300 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-archivo text-lg font-bold text-zinc-800">
            No encontramos propiedades con los filtros seleccionados
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Probá modificando los criterios de búsqueda o hacé clic en limpiar filtros para ver todas las opciones disponibles.
          </p>
          <button
            onClick={clearFilters}
            className="bg-adelina-dark text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black transition-colors"
          >
            Ver todas las propiedades
          </button>
        </div>
      )}
    </div>
  );
};
