import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getWhatsAppGeneralUrl } from '../../lib/whatsappUtils';

interface ServicesGridProps {
  onNavigate: (view: string, param?: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onNavigate }) => {
  return (
    <section className="bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-zinc-100">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="font-archivo text-2xl sm:text-4xl lg:text-[42px] font-normal text-zinc-900 tracking-tight uppercase">
            ¿EN QUÉ PUEDO ACOMPAÑARTE?
          </h2>
          <div className="space-y-1">
            <p className="font-archivo text-sm sm:text-base font-normal text-zinc-800">
              Cada operación parte de una necesidad distinta.
            </p>
            <p className="font-archivo text-xs sm:text-sm text-zinc-500 font-light">
              Por eso el asesoramiento se adapta a tu momento, tus objetivos y la decisión que necesitás tomar.
            </p>
          </div>
        </div>

        {/* Central Wide Modern Living Room Image with Rounded Corners */}
        <div className="rounded-3xl sm:rounded-[32px] overflow-hidden shadow-sm bg-zinc-100 aspect-[16/9] max-w-4xl mx-auto">
          <img
            src="/assets/services-living.jpg"
            alt="Espacio contemporáneo y asesoramiento inmobiliario"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Three Columns Layout with Vertical Borders matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto pt-6">
          {/* 1. COMPRAR */}
          <div className="text-center p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h3 className="font-archivo text-base sm:text-lg font-normal tracking-[0.25em] text-zinc-900 uppercase">
                COMPRAR
              </h3>
              <p className="font-archivo text-xs sm:text-[13px] text-zinc-600 font-light leading-relaxed max-w-xs mx-auto">
                Te acompaño a encontrar la propiedad que se adapta a tu estilo de vida y a tus objetivos, analizando cada opción con criterio y detalle.
              </p>
            </div>

            <div>
              <button
                onClick={() => onNavigate('catalog', 'operation:sale')}
                className="inline-flex items-center gap-1 font-archivo text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <span>QUIERO COMPRAR</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 2. VENDER (Con bordes verticales laterales) */}
          <div className="text-center p-6 sm:p-8 flex flex-col justify-between space-y-6 md:border-x md:border-zinc-200 border-y md:border-y-0 border-zinc-100">
            <div className="space-y-3">
              <h3 className="font-archivo text-base sm:text-lg font-normal tracking-[0.25em] text-zinc-900 uppercase">
                VENDER
              </h3>
              <p className="font-archivo text-xs sm:text-[13px] text-zinc-600 font-light leading-relaxed max-w-xs mx-auto">
                Te asesoro para posicionar y vender tu propiedad de la mejor manera, cuidando cada paso del proceso para lograr el mejor resultado.
              </p>
            </div>

            <div>
              <button
                onClick={() => onNavigate('valuation')}
                className="inline-flex items-center gap-1 font-archivo text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <span>QUIERO VENDER</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3. INVERTIR */}
          <div className="text-center p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h3 className="font-archivo text-base sm:text-lg font-normal tracking-[0.25em] text-zinc-900 uppercase">
                INVERTIR
              </h3>
              <p className="font-archivo text-xs sm:text-[13px] text-zinc-600 font-light leading-relaxed max-w-xs mx-auto">
                Te ayudo a identificar oportunidades inmobiliarias y a tomar decisiones estratégicas con mayor seguridad y proyección.
              </p>
            </div>

            <div>
              <a
                href={getWhatsAppGeneralUrl('Asesoramiento para Inversiones')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-archivo text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <span>QUIERO INVERTIR</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
