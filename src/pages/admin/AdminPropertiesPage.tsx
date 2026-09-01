import React, { useState } from 'react';
import { Property, PropertyStatus } from '../../types/property';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Share2,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Copy,
  SlidersHorizontal,
} from 'lucide-react';
import { propertyService } from '../../lib/supabase';
import { generateColleagueWhatsAppText } from '../../lib/whatsappUtils';

interface AdminPropertiesPageProps {
  properties: Property[];
  onRefresh: () => void;
  onNavigateTab: (tab: string, param?: string) => void;
  onPreviewProperty: (slug: string) => void;
}

export const AdminPropertiesPage: React.FC<AdminPropertiesPageProps> = ({
  properties,
  onRefresh,
  onNavigateTab,
  onPreviewProperty,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedForShare, setSelectedForShare] = useState<Property | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const filtered = properties.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.location_neighborhood.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleFeatured = (id: string) => {
    propertyService.toggleFeatured(id);
    onRefresh();
  };

  const handleStatusChange = (id: string, status: PropertyStatus) => {
    propertyService.updateStatus(id, status);
    onRefresh();
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Estás segura de eliminar la propiedad "${title}"?`)) {
      propertyService.deleteProperty(id);
      onRefresh();
    }
  };

  const getColleagueUrl = (slug: string) => `${window.location.origin}/?colleague=1&p=${slug}`;

  const handleCopyColleagueUrl = (slug: string) => {
    navigator.clipboard.writeText(getColleagueUrl(slug));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyColleagueText = (property: Property) => {
    const text = generateColleagueWhatsAppText(property, getColleagueUrl(property.slug));
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-archivo text-2xl sm:text-3xl font-bold text-zinc-900">
            Inventario de Inmuebles
          </h1>
          <p className="text-xs text-zinc-500 font-light">
            Carga, edición de precios, fotos y generación de fichas para colegas.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('property-new')}
          className="bg-adelina-dark hover:bg-black text-white font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-adelina-accent" />
          <span>Nueva Propiedad</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, barrio o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponibles</option>
            <option value="reserved">Reservadas</option>
            <option value="sold">Vendidas</option>
            <option value="rented">Alquiladas</option>
            <option value="hidden">Ocultas</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 border-b border-zinc-200 font-archivo text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-4">Inmueble</th>
                <th className="py-3.5 px-4">Operación</th>
                <th className="py-3.5 px-4">Valor</th>
                <th className="py-3.5 px-4 text-center">Home</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((property) => (
                <tr key={property.id} className="hover:bg-zinc-50/80 transition-colors">
                  {/* Property Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.featured_image || property.images[0] || '/assets/chic-living.jpg'}
                        alt={property.title}
                        className="w-14 h-14 rounded-xl object-cover border border-zinc-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-archivo font-bold text-xs sm:text-sm text-zinc-900 block truncate max-w-xs">
                          {property.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 block truncate">
                          {property.location_neighborhood}, {property.location_city} • {property.bedrooms}d / {property.bathrooms}b / {property.total_area_sqm || property.covered_area_sqm}m²
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Operation */}
                  <td className="py-3.5 px-4">
                    <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase">
                      {property.operation_type === 'sale' ? 'Venta' : property.operation_type === 'rent' ? 'Alquiler' : 'Temporario'}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-archivo font-bold text-xs sm:text-sm text-zinc-900">
                    {property.currency === 'USD' ? `USD $${property.price_usd?.toLocaleString()}` : `$${property.price_ars?.toLocaleString()}`}
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(property.id)}
                      title={property.is_featured ? 'Quitar de portada' : 'Destacar en portada'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        property.is_featured ? 'text-amber-500 bg-amber-50' : 'text-zinc-300 hover:text-zinc-500'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={property.status}
                      onChange={(e) => handleStatusChange(property.id, e.target.value as PropertyStatus)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                        property.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : property.status === 'reserved'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : property.status === 'sold'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : property.status === 'rented'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                      }`}
                    >
                      <option value="available">Disponible</option>
                      <option value="reserved">Reservada</option>
                      <option value="sold">Vendida</option>
                      <option value="rented">Alquilada</option>
                      <option value="hidden">Oculta</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* WhatsApp / Colleague share modal button */}
                      <button
                        onClick={() => setSelectedForShare(property)}
                        title="Ficha Colega / Venta Compartida"
                        className="p-1.5 text-zinc-600 hover:text-emerald-700 bg-zinc-50 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Preview on live web */}
                      <button
                        onClick={() => onPreviewProperty(property.slug)}
                        title="Ver en la Web"
                        className="p-1.5 text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onNavigateTab('property-edit', property.id)}
                        title="Editar Inmueble"
                        className="p-1.5 text-zinc-600 hover:text-adelina-dark bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(property.id, property.title)}
                        title="Eliminar Inmueble"
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Compartir Ficha Colega / WhatsApp */}
      {selectedForShare && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-adelina-sand flex items-center justify-center text-adelina-dark">
                  <Share2 className="w-4 h-4 text-adelina-accent" />
                </div>
                <h3 className="font-archivo font-bold text-lg text-adelina-dark truncate max-w-xs">
                  Difusión: {selectedForShare.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedForShare(null)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Option 1: WhatsApp Group Text */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                1. Texto con Emojis para Grupos de WhatsApp
              </span>
              <p className="text-xs text-zinc-600">
                Copia el texto estructurado con la Ficha Marca Blanca incluida, listo para enviar en grupos de inmobiliarias.
              </p>
              <button
                onClick={() => handleCopyColleagueText(selectedForShare)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{copiedText ? '¡Texto Copiado!' : 'Copiar Texto Completo de WhatsApp'}</span>
              </button>
            </div>

            {/* Option 2: Pure White Label Link */}
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                2. Link Marca Blanca Directo (Sin tus datos)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getColleagueUrl(selectedForShare.slug)}
                  className="flex-1 bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-700 font-mono"
                />
                <button
                  onClick={() => handleCopyColleagueUrl(selectedForShare.slug)}
                  className="bg-adelina-dark hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedForShare(null)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium px-5 py-2 rounded-full transition-colors"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
