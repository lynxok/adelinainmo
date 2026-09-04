import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  Phone,
  FileText,
  Calculator,
  HelpCircle,
  TrendingUp,
  Award,
  ArrowDown,
  Building,
  Check,
} from 'lucide-react';
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

  const scrollToForm = () => {
    const el = document.getElementById('formulario-tasacion');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-adelina-light min-h-screen text-adelina-dark pt-28 pb-24">
      {/* 1. HERO / BANNER HEADER */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-16 sm:mb-20">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-adelina-border text-adelina-accent text-[11px] font-archivo font-semibold uppercase tracking-widest shadow-sm">
            <Award className="w-3.5 h-3.5" />
            <span>Tasaciones Profesionales • Matrícula N° 1789</span>
          </div>

          <h1 className="font-archivo text-3xl sm:text-5xl lg:text-6xl font-light text-adelina-dark tracking-tight leading-[1.12]">
            Tasá y Vendé tu Propiedad
          </h1>

          <p className="font-archivo text-zinc-600 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Determinamos el valor real y competitivo de tu inmueble en Paraná y Entre Ríos mediante análisis comparativo de mercado riguroso y asesoramiento personalizado.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-adelina-dark hover:bg-black text-white text-xs sm:text-sm font-archivo font-medium px-6 py-3 rounded-full transition-all shadow-md active:scale-95"
            >
              <span>Completar Formulario Online</span>
              <ArrowDown className="w-4 h-4 text-adelina-accent" />
            </button>
            <a
              href={getWhatsAppGeneralUrl('Consulta sobre Tasación de Inmueble')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-archivo font-medium px-6 py-3 rounded-full transition-all shadow-md active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1: "¿CUÁNTO VALE TU PROPIEDAD?" (SPLIT SHOWCASE) */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-20">
        <div className="bg-white rounded-3xl border border-adelina-border p-6 sm:p-10 lg:p-14 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-1 bg-adelina-accent rounded-full mb-4" />
                <h2 className="font-archivo text-3xl sm:text-4xl lg:text-[42px] font-semibold text-adelina-dark tracking-tight leading-[1.18]">
                  ¿Cuánto vale tu propiedad?
                </h2>
              </div>

              <div className="space-y-4 font-archivo text-zinc-600 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  Conocer el valor de una propiedad es fundamental para tomar decisiones con mayor claridad, ya sea que estés pensando en vender, invertir o simplemente conocer su valor actual en el mercado.
                </p>

                <p>
                  Una tasación bien realizada no solo considera los metros cuadrados o la ubicación, sino también el estado del inmueble, sus características, su entorno y la demanda real del mercado. Por eso, contar con una mirada profesional te permite avanzar con más seguridad y mejores herramientas al momento de definir el próximo paso.
                </p>
              </div>

              {/* Value Props Pills */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 bg-adelina-light p-3 rounded-2xl border border-adelina-border/60">
                  <Check className="w-4 h-4 text-adelina-accent shrink-0" />
                  <span className="font-medium">Análisis de Mercado Real</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 bg-adelina-light p-3 rounded-2xl border border-adelina-border/60">
                  <Check className="w-4 h-4 text-adelina-accent shrink-0" />
                  <span className="font-medium">Inspección Ocular Técnica</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 bg-adelina-light p-3 rounded-2xl border border-adelina-border/60">
                  <Check className="w-4 h-4 text-adelina-accent shrink-0" />
                  <span className="font-medium">Confidencialidad Total</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-700 bg-adelina-light p-3 rounded-2xl border border-adelina-border/60">
                  <Check className="w-4 h-4 text-adelina-accent shrink-0" />
                  <span className="font-medium">Estrategia de Venta Óptima</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 text-adelina-dark font-archivo font-bold text-xs uppercase tracking-wider hover:text-adelina-accent transition-colors"
                >
                  <span>Solicitar estudio de tasación ahora</span>
                  <span className="text-lg leading-none">→</span>
                </button>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[3/4] max-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 group">
                <img
                  src="/assets/valuation-interior.jpg"
                  alt="Interior de diseño exclusivo - Tasaciones Adelina Luján"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-adelina-accent block">
                        Criterio Inmobiliario
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-adelina-dark block">
                        Valoraciones objetivas y respaldadas
                      </span>
                    </div>
                    <Building className="w-6 h-6 text-adelina-accent shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: 3 CARDS ("GUÍA Y PREGUNTAS CLAVE SOBRE TASACIONES") */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-adelina-accent text-xs font-semibold uppercase tracking-widest block">
            Información & Criterio
          </span>
          <h2 className="font-archivo text-2xl sm:text-3xl lg:text-4xl font-light text-adelina-dark tracking-tight">
            Todo lo que necesitas saber antes de tasar
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-light">
            Conceptos fundamentales para comprender el valor real de tu propiedad en el mercado actual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-adelina-border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-adelina-light border border-adelina-border flex items-center justify-center text-adelina-accent group-hover:bg-adelina-dark group-hover:text-adelina-accent transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>

              <h3 className="font-archivo text-xl sm:text-2xl font-bold text-adelina-dark tracking-tight leading-snug">
                ¿Qué es una tasación inmobiliaria?
              </h3>

              <p className="font-archivo text-zinc-600 text-xs sm:text-sm font-light leading-relaxed">
                Es una valoración profesional que permite estimar el precio de mercado de una propiedad según sus características, su ubicación y el contexto actual.
                <br /><br />
                Es una herramienta clave para tomar decisiones con mayor claridad y respaldo.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>Claridad & Respaldo</span>
              <span className="text-adelina-accent font-semibold">01</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-adelina-border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-adelina-light border border-adelina-border flex items-center justify-center text-adelina-accent group-hover:bg-adelina-dark group-hover:text-adelina-accent transition-colors">
                <Calculator className="w-5 h-5" />
              </div>

              <h3 className="font-archivo text-xl sm:text-2xl font-bold text-adelina-dark tracking-tight leading-snug">
                ¿Cómo se define el valor de una propiedad?
              </h3>

              <p className="font-archivo text-zinc-600 text-xs sm:text-sm font-light leading-relaxed">
                El valor surge del análisis de múltiples variables: zona, superficie, estado general, distribución, calidad constructiva, entorno y referencias comparables del mercado.
                <br /><br />
                No se trata solo de metros cuadrados, sino de interpretar cada propiedad dentro de su contexto real.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>Variables & Contexto</span>
              <span className="text-adelina-accent font-semibold">02</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-adelina-border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-adelina-light border border-adelina-border flex items-center justify-center text-adelina-accent group-hover:bg-adelina-dark group-hover:text-adelina-accent transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>

              <h3 className="font-archivo text-xl sm:text-2xl font-bold text-adelina-dark tracking-tight leading-snug">
                ¿Qué tan precisa es una tasación online?
              </h3>

              <p className="font-archivo text-zinc-600 text-xs sm:text-sm font-light leading-relaxed">
                Las herramientas online pueden ofrecer una referencia inicial, pero no reemplazan una evaluación profesional.
                <br /><br />
                Una tasación personalizada contempla aspectos particulares del inmueble y permite llegar a una valoración mucho más confiable.
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>Evaluación Profesional</span>
              <span className="text-adelina-accent font-semibold">03</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FORM SECTION (FINAL CTA) */}
      <section id="formulario-tasacion" className="px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto scroll-mt-28">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-adelina-border shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-adelina-accent text-[11px] font-bold uppercase tracking-widest block">
              Formulario de Solicitud
            </span>
            <h2 className="font-archivo text-2xl sm:text-3xl font-bold text-adelina-dark">
              ¿Querés conocer el valor actual de tu propiedad?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 font-light">
              Te acompaño con una tasación profesional y una mirada clara para que puedas avanzar con mayor seguridad.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-archivo text-2xl font-bold text-adelina-dark">
                ¡Solicitud de Tasación Recibida!
              </h3>
              <p className="text-sm text-zinc-600 max-w-md mx-auto font-light leading-relaxed">
                Muchas gracias por confiar en mi gestión. Me pondré en contacto con vos a la brevedad para coordinar la visita y entrega del informe de tasación.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <a
                  href={getWhatsAppGeneralUrl('Consulta por Tasación')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-medium px-6 py-3 rounded-full hover:bg-emerald-700 transition-all shadow"
                >
                  <Phone className="w-4 h-4" />
                  <span>Escribirme directamente por WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-700 text-xs font-medium px-6 py-3 rounded-full hover:bg-zinc-200 transition-all"
                >
                  <span>Enviar otra solicitud</span>
                </button>
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
      </section>
    </div>
  );
};
