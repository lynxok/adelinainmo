import React, { useState } from 'react';
import { Search, Home, Building2, MapPin, Tag } from 'lucide-react';
import { OperationType, PropertyType } from '../../types/property';

interface SearchFilterBarProps {
  onSearch: (filters: {
    operation?: OperationType | 'all';
    type?: PropertyType | 'all';
    location?: string;
  }) => void;
  compact?: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ onSearch, compact = false }) => {
  const [operation, setOperation] = useState<OperationType | 'all'>('sale');
  const [type, setType] = useState<PropertyType | 'all'>('all');
  const [location, setLocation] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ operation, type, location });
  };

  return (
    <div className={`w-full ${compact ? '' : 'max-w-4xl mx-auto shadow-2xl rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-6 border border-white/40'}`}>
      {/* Operation Tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setOperation('sale')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            operation === 'sale'
              ? 'bg-adelina-dark text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          Comprar
        </button>
        <button
          type="button"
          onClick={() => setOperation('rent')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            operation === 'rent'
              ? 'bg-adelina-dark text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          Alquilar
        </button>
        <button
          type="button"
          onClick={() => setOperation('all')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            operation === 'all'
              ? 'bg-adelina-dark text-white shadow-md'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          Todas
        </button>
      </div>

      {/* Filter Inputs Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-3 items-center">
        {/* Type Selector */}
        <div className="lg:col-span-3 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-adelina-accent focus-within:bg-white transition-all">
          <Building2 className="w-4 h-4 text-zinc-400 shrink-0" />
          <div className="w-full">
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Tipo de Inmueble</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PropertyType | 'all')}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="house">Casas</option>
              <option value="apartment">Departamentos</option>
              <option value="land">Terrenos / Lotes</option>
              <option value="commercial">Locales Comerciales</option>
              <option value="field">Campos / Quintas</option>
            </select>
          </div>
        </div>

        {/* Location Input */}
        <div className="lg:col-span-3 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-adelina-accent focus-within:bg-white transition-all">
          <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
          <div className="w-full">
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Ubicación</label>
            <input
              type="text"
              placeholder="Ej. Centro, Parque Urquiza, Oro Verde..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-zinc-800 focus:outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1">
          <button
            type="submit"
            className="w-full h-full min-h-[50px] bg-adelina-dark hover:bg-black text-white hover:text-adelina-accent rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-md active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span className="lg:hidden">Buscar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
