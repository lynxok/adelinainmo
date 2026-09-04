import React from 'react';
import { Property, Lead } from '../../types/property';
import { Building2, Sparkles, MessageCircle, TrendingUp, Plus, ArrowRight, ExternalLink, Share2, Rss, Quote, Star } from 'lucide-react';
import { testimonialService } from '../../lib/supabase';

interface AdminDashboardPageProps {
  properties: Property[];
  leads: Lead[];
  onNavigateTab: (tab: string, param?: string) => void;
  onViewWeb: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  properties,
  leads,
  onNavigateTab,
  onViewWeb,
}) => {
  const activeCount = properties.filter(p => p.status === 'available').length;
  const featuredCount = properties.filter(p => p.is_featured).length;
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const activeTestimonialsCount = testimonialService.getActiveTestimonials().length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-adelina-dark to-zinc-900 text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-adelina-accent font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel de Control Inmobiliario</span>
          </div>
          <h1 className="font-archivo text-2xl sm:text-3xl font-bold tracking-tight">
            Hola, Adelina
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl">
            Tenés <strong className="text-white font-semibold">{activeCount}</strong> propiedades activas y <strong className="text-adelina-accent font-semibold">{newLeadsCount}</strong> consultas nuevas pendientes de respuesta.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigateTab('property-new')}
            className="bg-adelina-accent hover:bg-adelina-gold text-adelina-dark font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Propiedad</span>
          </button>

          <button
            onClick={onViewWeb}
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors border border-white/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver Web en Vivo</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigateTab('properties')}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Inmuebles Activos</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="font-archivo text-3xl font-bold text-zinc-900">{activeCount}</div>
          <span className="text-[11px] text-zinc-500 font-light block">Listas para venta/alquiler</span>
        </div>

        <div
          onClick={() => onNavigateTab('properties')}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Destacadas Home</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="font-archivo text-3xl font-bold text-zinc-900">{featuredCount}</div>
          <span className="text-[11px] text-zinc-500 font-light block">Visibles en portada</span>
        </div>

        <div
          onClick={() => onNavigateTab('testimonials')}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Testimonios</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Quote className="w-5 h-5" />
            </div>
          </div>
          <div className="font-archivo text-3xl font-bold text-zinc-900">{activeTestimonialsCount}</div>
          <span className="text-[11px] text-zinc-500 font-light block">Reseñas activas en web</span>
        </div>

        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Nuevas Consultas</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="font-archivo text-3xl font-bold text-zinc-900">{newLeadsCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium block">Por responder</span>
        </div>

        <div
          onClick={() => onNavigateTab('xml-feed')}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Feeds Portales</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rss className="w-5 h-5" />
            </div>
          </div>
          <div className="font-archivo text-xl font-bold text-zinc-900">Zonaprop / ML</div>
          <span className="text-[11px] text-zinc-500 font-light block">XML automático activo</span>
        </div>
      </div>

      {/* Recent Properties & Recent Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Properties (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="font-archivo text-base font-bold text-zinc-900">
              Últimas Propiedades Cargadas
            </h2>
            <button
              onClick={() => onNavigateTab('properties')}
              className="text-xs text-adelina-accent hover:underline font-medium"
            >
              Ver todas ({properties.length})
            </button>
          </div>

          <div className="space-y-3">
            {properties.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-100 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.featured_image || p.images[0] || '/assets/chic-living.jpg'}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-archivo font-bold text-xs sm:text-sm text-zinc-900 truncate">
                      {p.title}
                    </h4>
                    <span className="text-[11px] text-zinc-500 block truncate">
                      {p.location_neighborhood} • {p.currency === 'USD' ? `USD $${p.price_usd?.toLocaleString()}` : `$${p.price_ars?.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('property-edit', p.id)}
                  className="bg-white border border-zinc-200 text-zinc-700 hover:text-adelina-dark px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="font-archivo text-base font-bold text-zinc-900">
              Consultas Recientes
            </h2>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-adelina-accent hover:underline font-medium"
            >
              Ver bandeja
            </button>
          </div>

          <div className="space-y-3">
            {leads.slice(0, 4).map((l) => (
              <div
                key={l.id}
                className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-archivo font-bold text-xs text-zinc-900">{l.full_name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    l.status === 'new' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {l.status === 'new' ? 'Nuevo' : 'Atendido'}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-light line-clamp-2">
                  {l.message}
                </p>
                <span className="text-[10px] text-zinc-400 block">{l.phone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
