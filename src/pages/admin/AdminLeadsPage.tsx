import React, { useState } from 'react';
import { Lead } from '../../types/property';
import {
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Archive,
  Search,
  ExternalLink,
} from 'lucide-react';
import { leadService } from '../../lib/supabase';

interface AdminLeadsPageProps {
  leads: Lead[];
  onRefresh: () => void;
}

export const AdminLeadsPage: React.FC<AdminLeadsPageProps> = ({ leads, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = leads.filter((l) => {
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.full_name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    leadService.updateLeadStatus(id, newStatus);
    onRefresh();
  };

  const getWhatsAppReplyUrl = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const greeting = `¡Hola ${name}! Te escribo desde Inmobiliaria Adelina Luján por la consulta que nos dejaste en la web. ¿En qué te puedo asesorar?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-archivo text-2xl sm:text-3xl font-bold text-zinc-900">
            Bandeja de Consultas & Leads
          </h1>
          <p className="text-xs text-zinc-500 font-light">
            Mensajes y solicitudes de tasación recibidos desde la web oficial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
            {leads.filter(l => l.status === 'new').length} consultas nuevas
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o contenido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="new">Nuevos</option>
            <option value="contacted">Contactados</option>
            <option value="closed">Cerrados / Concretados</option>
            <option value="discarded">Descartados</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((lead) => (
            <div
              key={lead.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm transition-all space-y-4 ${
                lead.status === 'new' ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-zinc-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    lead.status === 'new' ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {lead.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-archivo font-bold text-base text-zinc-900">
                      {lead.full_name}
                    </h3>
                    <span className="text-[11px] text-zinc-400 font-light flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {lead.property_title && ` • Inmueble: ${lead.property_title}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${
                      lead.status === 'new'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : lead.status === 'contacted'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : lead.status === 'closed'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    <option value="new">Nuevo (Sin responder)</option>
                    <option value="contacted">Contactado</option>
                    <option value="closed">Operación Cerrada</option>
                    <option value="discarded">Descartado</option>
                  </select>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 text-xs sm:text-sm text-zinc-700 font-light leading-relaxed whitespace-pre-line">
                {lead.message}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-4 text-xs text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-mono font-medium">{lead.phone}</span>
                  </div>
                  {lead.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getWhatsAppReplyUrl(lead.phone, lead.full_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Responder por WhatsApp</span>
                  </a>

                  {lead.status === 'new' && (
                    <button
                      onClick={() => handleStatusChange(lead.id, 'contacted')}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors"
                    >
                      Marcar como contactado
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 p-8">
            <CheckCircle2 className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
            <h3 className="font-archivo text-base font-bold text-zinc-700">No hay consultas en este filtro</h3>
            <p className="text-xs text-zinc-400 mt-1">Todas las consultas fueron procesadas.</p>
          </div>
        )}
      </div>
    </div>
  );
};
