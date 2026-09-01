import React, { useState } from 'react';
import { KeyRound, Send, CheckCircle2, ShieldCheck, Phone, FileText } from 'lucide-react';
import { leadService } from '../lib/supabase';
import { ADELINA_PHONE_FORMATTED, getWhatsAppGeneralUrl } from '../lib/whatsappUtils';

export const ValuationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: 'house',
    operationType: 'sale',
    neighborhood: '',
    coveredArea: '',
    totalArea: '',
    bedrooms: '2',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const summaryMsg = `[TASACIÓN SOLICITADA] Tipo: ${formData.propertyType} | Operación: ${formData.operationType} | Zona: ${formData.neighborhood} | Sup: ${formData.coveredArea} m² cub. / ${formData.totalArea} m² tot. | Dorms: ${formData.bedrooms} | Notas: ${formData.details}`;

      leadService.createLead({
        full_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: summaryMsg,
        source: 'valuation_request',
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-adelina-accent text-xs font-semibold uppercase tracking-widest block">
          Tasaciones Profesionales
        </span>
        <h1 className="font-archivo text-3xl sm:text-4xl font-bold text-adelina-dark tracking-tight">
          Tasá y Vendé tu Propiedad
        </h1>
        <p className="font-poppins text-zinc-500 text-sm font-light leading-relaxed">
          Determinamos el valor real y competitivo de tu inmueble con análisis comparativo de mercado y asesoramiento personalizado.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-adelina-border shadow-xl">
        {submitted ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-archivo text-2xl font-bold text-adelina-dark">
              ¡Solicitud de Tasación Recibida!
            </h2>
            <p className="text-sm text-zinc-600 max-w-md mx-auto font-light leading-relaxed">
              Muchas gracias por confiar en mi gestión. Me pondré en contacto con vos a la brevedad para coordinar la visita y entrega del informe de tasación.
            </p>
            <div className="pt-4">
              <a
                href={getWhatsAppGeneralUrl('Consulta por Tasación')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-medium px-6 py-3 rounded-full hover:bg-emerald-700 transition-all shadow"
              >
                <Phone className="w-4 h-4" />
                <span>Escribirme directamente por WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="font-archivo font-bold text-base text-adelina-dark mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-adelina-accent" />
                <span>1. Datos del Inmueble</span>
              </h3>
              <p className="text-xs text-zinc-400 font-light">Contanos sobre la propiedad que querés tasar.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Tipo de Propiedad</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                >
                  <option value="house">Casa</option>
                  <option value="apartment">Departamento</option>
                  <option value="land">Terreno / Lote</option>
                  <option value="commercial">Local Comercial</option>
                  <option value="field">Campo / Quinta</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Operación deseada</label>
                <select
                  value={formData.operationType}
                  onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                >
                  <option value="sale">Venta</option>
                  <option value="rent">Alquiler Tradicional</option>
                  <option value="temporary_rent">Alquiler Temporario</option>
                  <option value="only_valuation">Solo Tasación Informativa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Barrio / Zona *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Centro, Parque Urquiza..."
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Superficie Cubierta (m² aprox)</label>
                <input
                  type="number"
                  placeholder="Ej. 120"
                  value={formData.coveredArea}
                  onChange={(e) => setFormData({ ...formData, coveredArea: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Superficie Total / Terreno (m²)</label>
                <input
                  type="number"
                  placeholder="Ej. 350"
                  value={formData.totalArea}
                  onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Dormitorios</label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                >
                  <option value="0">Monoambiente / Sin dorms</option>
                  <option value="1">1 Dormitorio</option>
                  <option value="2">2 Dormitorios</option>
                  <option value="3">3 Dormitorios</option>
                  <option value="4+">4+ Dormitorios</option>
                </select>
              </div>
            </div>

            <div className="border-b border-zinc-100 pt-4 pb-4">
              <h3 className="font-archivo font-bold text-base text-adelina-dark mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-adelina-accent" />
                <span>2. Tus Datos de Contacto</span>
              </h3>
              <p className="text-xs text-zinc-400 font-light">Para coordinar la visita con reserva y confidencialidad.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="343 4567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Observaciones o detalles extra</label>
              <textarea
                rows={3}
                placeholder="Estado general de conservación, si cuenta con cochera, gas natural, pileta, etc."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-adelina-dark hover:bg-black text-white font-medium py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-adelina-accent" />
              <span>{loading ? 'Procesando...' : 'Solicitar Tasación Sin Compromiso'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
