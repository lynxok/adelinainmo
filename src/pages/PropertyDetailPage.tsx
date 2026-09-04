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
  ChevronRight,
  CheckCircle2,
  Shield,
  Send,
  Copy,
  ExternalLink,
  Compass,
  Sofa,
  UtensilsCrossed,
  X,
  ZoomIn,
} from 'lucide-react';
import { getWhatsAppInquiryUrl, generateColleagueWhatsAppText, getWhatsAppGeneralUrl } from '../lib/whatsappUtils';
import { leadService, getPropertyTypeLabel } from '../lib/supabase';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [colleagueModalOpen, setColleagueModalOpen] = useState(false);
  const [copiedColleagueText, setCopiedColleagueText] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSent, setFormSent] = useState(false);

  // Images list with elegant fallbacks from Figma
  const defaultFigmaImages = [
    '/assets/trendy-loft-studio.jpg',
    '/assets/modern-house-construction.jpg',
    '/assets/serene-white-modern-home.jpg',
    '/assets/3d-modern-facade-house.jpg',
  ];

  const images = property.images && property.images.length > 0
    ? property.images
    : defaultFigmaImages;

  const displayPrice = property.currency === 'USD'
    ? `USD ${(property.price_usd || 0).toLocaleString('es-AR')}`
    : `$ ${(property.price_ars || 0).toLocaleString('es-AR')}`;

  const operationLabel = property.operation_type === 'sale'
    ? 'En venta'
    : property.operation_type === 'rent'
    ? 'En alquiler'
    : 'Alquiler temporario';

  const categoryLabel = getPropertyTypeLabel(property.property_type);

  // Google Maps navigation url
  const mapsSearchQuery = encodeURIComponent(
    `${property.address_approx || property.location_neighborhood || ''}, ${property.location_city || 'Paraná'}, Entre Ríos, Argentina`
  );
  const googleMapsUrl = property.google_maps_url?.trim()
    ? property.google_maps_url.trim()
    : `https://www.google.com/maps/search/?api=1&query=${mapsSearchQuery}`;

  // WhatsApp Schedule Visit URL
  const whatsappVisitText = encodeURIComponent(
    `Hola Adelina! Me interesa programar una visita para la propiedad: "${property.title}" (Ref: ${property.slug || property.id}). ¿Qué días y horarios tenés disponibles?`
  );
  const whatsappVisitUrl = `https://wa.me/5493433001534?text=${whatsappVisitText}`;

  // Instagram profile URL
  const instagramUrl = 'https://www.instagram.com/adelinalujan.propiedades/';

  // White label colleague share url
  const colleagueShareUrl = `${window.location.origin}/?colleague=1&p=${property.slug || property.id}`;

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

  const handleShareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Mirá esta propiedad en Adelina Luján: ${property.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    leadService.createLead({
      property_id: property.id,
      property_title: property.title,
      full_name: name,
      phone: phone,
      email: email,
      message: message || `Consulta por ${property.title}`,
      source: 'web_form',
    });
    setFormSent(true);
    setTimeout(() => {
      setInquiryModalOpen(false);
      setFormSent(false);
    }, 3000);
  };

  // Living/Ambientes count logic
  const ambientesCount = property.bedrooms > 0 ? property.bedrooms + 1 : 1;

  return (
    <div className="bg-[#F2F2F2] min-h-screen text-[#303030] font-archivo">
      {/* Top spacing accounting for the fixed navbar */}
      <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto space-y-8">

        {/* 1. TOP BAR: Breadcrumbs & Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-zinc-300/80 text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors shadow-sm"
              title="Volver"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-archivo font-light text-xs sm:text-sm uppercase tracking-[0.15em] text-[#808080]">
                {categoryLabel} {operationLabel}
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareProperty}
              className="inline-flex items-center gap-2 text-xs font-archivo font-medium tracking-wide uppercase px-4 py-2.5 rounded-full bg-white border border-zinc-300/80 text-[#505050] hover:text-black hover:bg-zinc-100 transition-colors shadow-sm"
              title="Compartir propiedad"
            >
              <Share2 className="w-3.5 h-3.5 text-[#808080]" />
              <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={() => setColleagueModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-archivo font-medium tracking-wide uppercase px-4 py-2.5 rounded-full bg-[#E5E5E5] hover:bg-[#DADADA] text-[#303030] border border-zinc-300 transition-colors"
              title="Ficha Colega para inmobiliarias"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#808080]" />
              <span className="hidden sm:inline">Ficha Colega</span>
            </button>
          </div>
        </div>

        {/* 2. TITLE, LOCATION & PRICE HEADER */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-3 max-w-4xl">
              <h1 className="font-archivo font-semibold text-2xl sm:text-3xl md:text-[40px] text-[#303030] leading-[1.2] tracking-tight">
                {property.title}
              </h1>

              {/* Location with Pin */}
              <div className="flex items-center gap-2.5 text-[#808080] text-sm sm:text-base font-light">
                <MapPin className="w-5 h-5 text-[#808080] shrink-0" />
                <span>
                  {property.address_approx || property.location_neighborhood}, {property.location_city || 'Paraná'}, Entre Ríos
                </span>
              </div>
            </div>

            {/* Price Highlight */}
            <div className="lg:text-right shrink-0">
              <span className="font-archivo font-bold text-3xl sm:text-4xl md:text-[44px] text-[#303030] tracking-tight block">
                {displayPrice}
              </span>
            </div>
          </div>
        </div>

        {/* 3. HERO GALLERY & CAROUSEL */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Primary Main Image */}
            <div className="lg:col-span-8 relative aspect-[16/10] rounded-[25px] overflow-hidden bg-zinc-800 shadow-md border border-zinc-200 group">
              <img
                src={images[selectedImageIndex]}
                alt={`${property.title} - Imagen ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Status / Category Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                <span className="bg-[#303030]/85 backdrop-blur-md text-white font-archivo text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  {operationLabel}
                </span>
                <span className="bg-white/95 backdrop-blur-md text-[#303030] font-archivo text-xs font-medium px-4 py-1.5 rounded-full uppercase tracking-wider">
                  {categoryLabel}
                </span>
              </div>

              {/* Zoom prompt icon */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                title="Ampliar fotografía"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Secondary Image Preview / Side Peeking (Figma style) */}
            <div className="hidden lg:block lg:col-span-4 relative aspect-[16/10] lg:aspect-auto rounded-[25px] overflow-hidden bg-zinc-800 shadow-md border border-zinc-200">
              <img
                src={images[(selectedImageIndex + 1) % images.length]}
                alt="Vista previa siguiente"
                className="w-full h-full object-cover cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                onClick={handleNextImage}
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors pointer-events-none" />
              <button
                onClick={handleNextImage}
                className="absolute bottom-5 right-5 bg-white/90 hover:bg-white text-zinc-900 px-4 py-2 rounded-full font-archivo text-xs font-medium shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Carousel Pagination & Arrows (Figma style 01, 02, 03...) */}
          <div className="flex items-center justify-center gap-6 py-2">
            <button
              onClick={handlePrevImage}
              className="w-11 h-11 rounded-full bg-white border border-zinc-300 text-[#808080] hover:text-black hover:border-black flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Numbers: 01, 02, 03... */}
            <div className="flex items-center gap-4">
              {images.map((_, idx) => {
                const isActive = idx === selectedImageIndex;
                const formattedNum = String(idx + 1).padStart(2, '0');
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`font-archivo transition-all ${
                      isActive
                        ? 'text-black font-semibold text-lg border-b-2 border-black pb-0.5'
                        : 'text-[#808080] font-normal text-sm hover:text-black'
                    }`}
                  >
                    {formattedNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextImage}
              className="w-11 h-11 rounded-full bg-[#303030] text-white hover:bg-black flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4. HORIZONTAL SPECS RIBBON (Recuadro 1520x126) */}
        <div className="bg-white rounded-[25px] p-6 sm:p-8 shadow-sm border border-zinc-200/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Property Type Title */}
            <div>
              <span className="font-archivo font-light text-xs sm:text-sm uppercase tracking-[0.15em] text-[#808080] block mb-1">
                Tipo de propiedad
              </span>
              <span className="font-archivo font-semibold text-base sm:text-lg text-[#303030] tracking-wide uppercase">
                {categoryLabel} {operationLabel}
              </span>
            </div>

            {/* Right: Technical Specs with Figma Icons */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-10">
              {/* Dormitorios */}
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-2.5">
                  <div className="text-[#808080]">
                    <Bed className="w-6 h-6" />
                  </div>
                  <span className="font-archivo font-semibold text-base sm:text-lg text-[#303030]">
                    {property.bedrooms}
                  </span>
                </div>
              )}

              {/* Baños */}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-2.5">
                  <div className="text-[#808080]">
                    <Bath className="w-6 h-6" />
                  </div>
                  <span className="font-archivo font-semibold text-base sm:text-lg text-[#303030]">
                    {property.bathrooms}
                  </span>
                </div>
              )}

              {/* Living / Ambientes */}
              <div className="flex items-center gap-2.5">
                <div className="text-[#808080]">
                  <Sofa className="w-6 h-6" />
                </div>
                <span className="font-archivo font-semibold text-base sm:text-lg text-[#303030]">
                  {ambientesCount}
                </span>
              </div>

              {/* Cocina */}
              <div className="flex items-center gap-2.5">
                <div className="text-[#808080]">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span className="font-archivo font-semibold text-base sm:text-lg text-[#303030]">
                  1
                </span>
              </div>

              {/* Cochera */}
              {property.garages > 0 && (
                <div className="flex items-center gap-2.5">
                  <div className="text-[#808080]">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="font-archivo font-semibold text-base sm:text-lg text-[#303030]">
                    {property.garages}
                  </span>
                </div>
              )}

              {/* Superficie Cubierta */}
              {property.covered_area_sqm ? (
                <div className="flex items-center gap-2.5">
                  <div className="text-[#808080]">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <span className="font-archivo font-semibold text-base sm:text-lg text-[#303030]">
                    {property.covered_area_sqm}m²
                  </span>
                </div>
              ) : null}

              {/* Superficie Total / Lote */}
              {property.total_area_sqm ? (
                <div className="flex items-center gap-2.5">
                  <div className="text-[#808080]">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="font-archivo font-semibold text-base sm:text-lg text-[#303030]">
                    {property.total_area_sqm} Lote
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* 5. TWO-COLUMN MAIN BODY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Full Description & Amenities (Recuadro 1184x920) */}
          <div className="lg:col-span-8 bg-white rounded-[25px] p-6 sm:p-10 shadow-sm border border-zinc-200/80 space-y-8">
            {/* Header: DESCRIPCIÓN */}
            <div className="border-b border-zinc-200 pb-4">
              <h2 className="font-archivo font-light text-sm sm:text-base uppercase tracking-[0.15em] text-[#808080]">
                Descripción
              </h2>
            </div>

            {/* Description Text */}
            <div className="font-archivo text-base sm:text-lg leading-[1.8] text-[#505050] font-normal whitespace-pre-line space-y-4">
              {property.description}
            </div>

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-zinc-200">
                <h3 className="font-archivo font-light text-sm sm:text-base uppercase tracking-[0.15em] text-[#808080]">
                  Características y Comodidades
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-[#F9F9F9] px-4 py-3 rounded-2xl border border-zinc-200/60 text-sm text-[#303030]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security notice */}
            <div className="p-5 rounded-2xl bg-[#F7F7F7] border border-zinc-200 flex items-start gap-3.5 text-xs sm:text-sm text-zinc-600">
              <Shield className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-zinc-800 block mb-1">
                  Seguridad y Privacidad del Propietario
                </strong>
                La dirección exacta y visita personalizada se coordinan de forma confidencial. Comunicate con Adelina Luján para acordar día y hora de visita.
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar with Action Buttons & Location Card (Figma Style) */}
          <div className="lg:col-span-4 space-y-5">

            {/* Button 1: Programar una visita */}
            <a
              href={whatsappVisitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#404040] hover:bg-[#202020] text-white py-4 px-6 rounded-[20px] font-archivo text-xs sm:text-sm font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Programar una visita</span>
            </a>

            {/* Button 2: Solicitar información */}
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="w-full bg-[#404040] hover:bg-[#202020] text-white py-4 px-6 rounded-[20px] font-archivo text-xs sm:text-sm font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar información</span>
            </button>

            {/* Button 3: Ver en Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#404040] hover:bg-[#202020] text-white py-4 px-6 rounded-[20px] font-archivo text-xs sm:text-sm font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Ver en Instagram</span>
            </a>

            {/* Location Card (Recuadro 288x628) */}
            <div className="bg-white rounded-[25px] p-6 sm:p-7 shadow-sm border border-zinc-200/80 space-y-5">
              {/* Dirección */}
              <div>
                <span className="font-archivo font-light text-xs uppercase tracking-[0.15em] text-[#808080] block mb-1">
                  Dirección
                </span>
                <span className="font-archivo font-medium text-base text-[#303030] block">
                  {property.address_approx || property.location_neighborhood || 'Cortada 8 (Bajada Grande)'}
                </span>
              </div>
              <div className="border-b border-zinc-200" />

              {/* Ciudad */}
              <div>
                <span className="font-archivo font-light text-xs uppercase tracking-[0.15em] text-[#808080] block mb-1">
                  Ciudad
                </span>
                <span className="font-archivo font-medium text-base text-[#303030] block">
                  {property.location_city || 'Paraná'}
                </span>
              </div>
              <div className="border-b border-zinc-200" />

              {/* Provincia */}
              <div>
                <span className="font-archivo font-light text-xs uppercase tracking-[0.15em] text-[#808080] block mb-1">
                  Provincia
                </span>
                <span className="font-archivo font-medium text-base text-[#303030] block">
                  Entre Ríos
                </span>
              </div>
              <div className="border-b border-zinc-200" />

              {/* CP */}
              <div>
                <span className="font-archivo font-light text-xs uppercase tracking-[0.15em] text-[#808080] block mb-1">
                  CP
                </span>
                <span className="font-archivo font-medium text-base text-[#303030] block">
                  3100
                </span>
              </div>
              <div className="border-b border-zinc-200" />

              {/* Button: Ver en Google Maps */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#404040] hover:bg-[#202020] text-white py-3.5 px-4 rounded-[20px] font-archivo text-xs font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <MapPin className="w-4 h-4" />
                <span>Ver en Google Maps</span>
              </a>
            </div>

            {/* Colleague Broker White-Label Card */}
            <div className="bg-[#EAEAEA] rounded-[25px] p-5 border border-zinc-300/80 space-y-3">
              <div className="flex items-center gap-2 text-[#303030]">
                <Share2 className="w-4 h-4 text-[#808080]" />
                <span className="font-archivo font-semibold text-xs tracking-wider uppercase">
                  Venta Compartida / Colegas
                </span>
              </div>
              <p className="font-archivo text-xs text-zinc-600 font-light leading-relaxed">
                Generá una ficha limpia de esta propiedad sin datos de Adelina para enviar a tus clientes interesados.
              </p>
              <button
                onClick={() => setColleagueModalOpen(true)}
                className="w-full bg-white hover:bg-zinc-100 text-[#303030] py-2.5 px-3 rounded-xl font-archivo text-xs font-medium border border-zinc-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Generar Ficha Marca Blanca</span>
              </button>
            </div>

          </div>
        </div>

        {/* Banner: ¿Querés tasar o vender una propiedad similar? */}
        <div className="mt-14 bg-gradient-to-r from-adelina-dark via-zinc-900 to-adelina-dark text-white rounded-[25px] p-8 sm:p-10 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-adelina-accent text-[11px] font-archivo font-bold uppercase tracking-widest block">
              Servicio de Tasación Profesional
            </span>
            <h3 className="font-archivo text-2xl sm:text-3xl font-semibold tracking-tight">
              ¿Querés conocer el valor actual de tu propiedad?
            </h3>
            <p className="font-archivo text-zinc-300 text-xs sm:text-sm font-light max-w-xl">
              Te acompaño con una tasación profesional y una mirada clara para que puedas avanzar con mayor seguridad.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('valuation')}
              className="bg-adelina-accent hover:bg-adelina-gold text-adelina-dark font-archivo font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md active:scale-95"
            >
              <span>Solicitar Tasación</span>
            </button>
            <a
              href={getWhatsAppGeneralUrl('Consulta por Tasación de Inmueble')}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 hover:border-white/40 text-white font-archivo font-medium px-5 py-3 rounded-full text-xs transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* 7. MODAL: LIGHTBOX FULLSCREEN IMAGES */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="max-w-6xl max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={images[selectedImageIndex]}
              alt={`${property.title} grande`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <span className="font-archivo text-white/70 text-sm mt-4">
              Foto {selectedImageIndex + 1} de {images.length}
            </span>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 8. MODAL: SOLICITAR INFORMACIÓN (FORMULARIO DIRECTO) */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[25px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-archivo font-semibold text-xl text-[#303030]">
                Solicitar Información
              </h3>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="text-zinc-400 hover:text-black p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-archivo text-xs sm:text-sm text-zinc-600 font-light">
              Dejanos tus datos de contacto y consulta sobre <strong className="text-zinc-900 font-medium">"{property.title}"</strong>. Adelina te responderá a la brevedad.
            </p>

            {formSent ? (
              <div className="text-center py-8 space-y-3 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-archivo font-bold text-base text-emerald-900">¡Consulta enviada con éxito!</h4>
                <p className="font-archivo text-xs text-emerald-700 font-light">
                  Nos comunicaremos contigo a la mayor brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 343 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Correo Electrónico (opcional)</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Mensaje</label>
                  <textarea
                    rows={3}
                    placeholder="Hola, me interesa saber más detalles sobre esta propiedad..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-800 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-archivo text-xs font-medium uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#303030] hover:bg-black text-white font-archivo text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. MODAL: FICHA COLEGA (MARCA BLANCA) */}
      {colleagueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[25px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-800">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="font-archivo font-semibold text-lg text-[#303030]">
                  Ficha Colega (Marca Blanca)
                </h3>
              </div>
              <button
                onClick={() => setColleagueModalOpen(false)}
                className="text-zinc-400 hover:text-black p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-archivo text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
              Enlace y mensaje especialmente diseñados para <strong>colegas inmobiliarios</strong>: no incluye teléfonos, marcas ni datos de Adelina. Podés enviarlo a tu cliente para coordinar una venta compartida.
            </p>

            <div className="space-y-4">
              {/* Option 1: Clean link */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
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
                    className="bg-[#303030] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Formatted WhatsApp message */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Texto Formateado para WhatsApp
                </span>
                <button
                  onClick={handleCopyColleagueWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{copiedColleagueText ? '¡Texto Copiado!' : 'Copiar Texto para WhatsApp'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={colleagueShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-black font-medium"
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
