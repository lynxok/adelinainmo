import React from 'react';
import { Property } from '../../types/property';
import { getWhatsAppGeneralUrl, getWhatsAppInquiryUrl } from '../../lib/whatsappUtils';

interface FloatingWhatsAppButtonProps {
  currentView?: string;
  activeProperty?: Property;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  currentView,
  activeProperty,
}) => {
  const whatsappUrl =
    currentView === 'detail' && activeProperty
      ? getWhatsAppInquiryUrl(activeProperty)
      : getWhatsAppGeneralUrl();

  return (
    <aside
      aria-label="Contacto por WhatsApp"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center group pointer-events-auto"
    >
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-3 px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-zinc-800 text-xs font-archivo font-medium rounded-full shadow-lg border border-zinc-200/80 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
        {currentView === 'detail' ? 'Consultar por este inmueble' : 'Conversá con Adelina'}
      </span>

      {/* WhatsApp Button with exact Figma SVG asset */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 active:scale-95 drop-shadow-[0_8px_16px_rgba(50,217,81,0.35)] hover:drop-shadow-[0_12px_24px_rgba(50,217,81,0.5)] focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
        aria-label="Abrir WhatsApp de Adelina Luján"
        title="Consultar por WhatsApp"
      >
        <img
          src="/assets/whatsapp-figma.svg"
          alt="WhatsApp"
          className="w-full h-full object-contain"
          width={68}
          height={68}
        />
      </a>
    </aside>
  );
};
