import React, { useState } from 'react';
import { Property } from '../types/property';
import {
  Bed,
  Bath,
  Maximize2,
  Car,
  MapPin,
  MessageCircle,
  Share2,
  ChevronLeft,
  CheckCircle2,
  Shield,
  Phone,
  Send,
  Building,
  Sparkles,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { ADELINA_PHONE_FORMATTED, getWhatsAppInquiryUrl, generateColleagueWhatsAppText } from '../lib/whatsappUtils';
import { leadService } from '../lib/supabase';

interface PropertyDetailPageProps {
  property: Property;
  onBack: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  onBack,
  onNavigate,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [colleagueModalOpen, setColleagueModalOpen] = useState(false);
  const [copiedColleagueText, setCopiedColleagueText] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSent, setFormSent] = useState(false);

  const images = property.images.length > 0 ? property.images : ['/assets/chic-living.jpg'];

  const displayPrice = property.currency === 'USD'
    ? `USD $${(property.price_usd || 0).toLocaleString('es-AR')}`
    : `$${(property.price_ars || 0).toLocaleString('es-AR')}`;

  const operationLabel = property.operation_type === 'sale'
    ? 'En Venta'
    : property.operation_type === 'rent'
    ? 'En Alquiler'
    : 'Alquiler Temporario';

  const typeLabels: Record<string, string> = {
    house: 'Casa',
    apartment: 'Departamento',
    land: 'Terreno / Lote',
    commercial: 'Local Comercial',
    field: 'Campo / Quinta',
    duplex: 'Duplex',
    office: 'Oficina',
    other: 'Inmueble',
  };

  const colleagueShareUrl = `${window.location.origin}/?colleague=1&p=${property.slug}`;

  const handleCopyColleagueUrl = () => {
    navigator.clipboard.writeText(colleagueShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyColleagueWhatsApp = () => {
    const text = generateColleagueWhatsAppText(property, colleagueShareUrl);
    navigator.clipboard.writeText(text);
    setCopiedColleagueText(true);
    setTimeout(() => setCopiedColleagueText(false), 2500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    leadService.createLead({
      property_id: property.id,
      property_title: property.title,
      full_name: name,
      phone: phone,
      email: email,
      message: message || `Consulta directa por ${property.title}`,
      source: 'web_form',
    });
    setFormSent(true);
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Back button & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 hover:text-adelina-dark transition-colors bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al listado</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Colleague Share Button */}
          <button
            onClick={() => setColleagueModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700 hover:text-adelina-dark bg-adelina-sand/60 hover:bg-adelina-sand px-3.5 py-2 rounded-full border border-adelina-border transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-adelina-accent" />
            <span>Ficha Colega (Marca Blanca)</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photos & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-zinc-900 shadow-lg border border-zinc-200">
              <img
                src={images[selectedImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover animate-fadeIn"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-adelina-dark/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {operationLabel}
                </span>
                <span className="bg-white/95 backdrop-blur-md text-zinc-900 text-xs font-medium px-3 py-1 rounded-full">
                  {typeLabels[property.property_type] || property.property_type}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-adelina-accent scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Location & Price */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-adelina-border/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <MapPin className="w-4 h-4 text-adelina-accent" />
                  <span>{property.location_neighborhood}, {property.location_city}</span>
                </div>
                <h1 className="font-archivo text-2xl sm:text-3xl font-bold text-adelina-dark">
                  {property.title}
                </h1>
                <p className="text-xs text-zinc-400 font-light">
                  Ubicación aproximada: {property.address_approx}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Valor</span>
                <span className="font-archivo text-3xl sm:text-4xl font-bold text-adelina-dark tracking-tight">
                  {displayPrice}
                </span>
              </div>
            </div>

            {/* Technical Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              {property.property_type !== 'land' ? (
                <>
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center space-y-1">
                    <Bed className="w-5 h-5 text-adelina-accent mx-auto" />
                    <span className="text-xs text-zinc-500 block font-light">Dormitorios</span>
                    <span className="font-archivo font-bold text-base text-zinc-900">{property.bedrooms}</span>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center space-y-1">
                    <Bath className="w-5 h-5 text-adelina-accent mx-auto" />
                    <span className="text-xs text-zinc-500 block font-light">Baños</span>
                    <span className="font-archivo font-bold text-base text-zinc-900">{property.bathrooms}</span>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center space-y-1">
                    <Car className="w-5 h-5 text-adelina-accent mx-auto" />
                    <span className="text-xs text-zinc-500 block font-light">Cocheras</span>
                    <span className="font-archivo font-bold text-base text-zinc-900">{property.garages}</span>
                  </div>
                </>
              ) : (
                <div className="col-span-2 sm:col-span-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex items-center gap-3">
                  <Building className="w-6 h-6 text-adelina-accent" />
                  <div>
                    <span className="font-archivo font-bold text-sm text-zinc-900 block">Lote Residencial</span>
                    <span className="text-xs text-zinc-500 font-light">Apto desarrollo inmediato / Escritura</span>
                  </div>
                </div>
              )}

              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center space-y-1">
                <Maximize2 className="w-5 h-5 text-adelina-accent mx-auto" />
                <span className="text-xs text-zinc-500 block font-light">Sup. Total</span>
                <span className="font-archivo font-bold text-base text-zinc-900">
                  {property.total_area_sqm || property.covered_area_sqm} m²
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <h3 className="font-archivo text-lg font-bold text-adelina-dark">Descripción General</h3>
              <p className="font-poppins text-zinc-600 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                {property.description}
              </p>
            </div>

            {/* Amenities List */}
            {property.amenities.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-100">
                <h3 className="font-archivo text-lg font-bold text-adelina-dark">Características y Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-700 bg-zinc-50 px-3.5 py-2.5 rounded-xl border border-zinc-100">
                      <CheckCircle2 className="w-4 h-4 text-adelina-accent shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Seguridad y Privacidad del Propietario</strong>
                La ubicación indicada en el mapa y ficha es aproximada. Para coordinar una visita personalizada y conocer la dirección exacta, contactate con nosotros.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Contact Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-adelina-border shadow-xl space-y-6">
            {/* Agent Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-100">
              <img
                src="/assets/adelina-portrait.jpg"
                alt="Adelina Luján"
                className="w-14 h-14 rounded-full object-cover border-2 border-adelina-accent"
              />
              <div>
                <h3 className="font-archivo font-bold text-base text-adelina-dark">Adelina Luján</h3>
                <span className="text-xs text-zinc-500 block font-light">Corredora Inmobiliaria</span>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Disponible para consultas
                </span>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <a
              href={getWhatsAppInquiryUrl(property)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Consultar por WhatsApp</span>
            </a>

            <div className="text-center">
              <span className="text-xs text-zinc-400">o dejanos tu mensaje directo</span>
            </div>

            {/* Quick Contact Form */}
            {formSent ? (
              <div className="text-center py-6 space-y-2 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-archivo font-bold text-sm text-emerald-900">¡Consulta enviada!</h4>
                <p className="text-xs text-emerald-700 font-light">
                  Adelina se pondrá en contacto pronto para coordinar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Tu Nombre completo *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-adelina-accent"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Teléfono / WhatsApp *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-adelina-accent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Correo Electrónico (opcional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-adelina-accent"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    placeholder="Hola, me gustaría coordinar una visita..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:border-adelina-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-adelina-dark hover:bg-black text-white py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all shadow active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 text-adelina-accent" />
                  <span>Enviar Consulta</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Ficha Colega / Venta Compartida (Marca Blanca) */}
      {colleagueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-adelina-sand flex items-center justify-center text-adelina-dark">
                  <Share2 className="w-4 h-4 text-adelina-accent" />
                </div>
                <h3 className="font-archivo font-bold text-lg text-adelina-dark">
                  Ficha Colega (Marca Blanca)
                </h3>
              </div>
              <button
                onClick={() => setColleagueModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
              Este enlace y texto están especialmente preparados para **colegas inmobiliarios**: no contienen logos, teléfonos ni datos de contacto de Adelina. Podés enviárselo a tu cliente con total tranquilidad para coordinar una venta compartida.
            </p>

            <div className="space-y-4">
              {/* Option 1: Copy clean link */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Link Neutro para tu Cliente
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={colleagueShareUrl}
                    className="flex-1 bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-700 font-mono"
                  />
                  <button
                    onClick={handleCopyColleagueUrl}
                    className="bg-adelina-dark hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Copy formatted WhatsApp message for groups */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Texto Formateado para WhatsApp / Grupos Inmobiliarios
                </span>
                <button
                  onClick={handleCopyColleagueWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{copiedColleagueText ? '¡Texto de WhatsApp Copiado!' : 'Copiar Texto Completo de WhatsApp'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={colleagueShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 font-medium"
              >
                <span>Previsualizar Ficha Neutra</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setColleagueModalOpen(false)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium px-5 py-2 rounded-full transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
