import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getWhatsAppGeneralUrl } from '../../lib/whatsappUtils';

export const BrandEditorialSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#EFECE6] border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="font-archivo text-[11px] font-normal tracking-[0.25em] text-zinc-500 uppercase block">
              IDENTIDAD & COMPROMISO
            </span>
            <h2 className="font-archivo text-2xl sm:text-4xl font-normal text-zinc-900 tracking-tight uppercase leading-tight">
              Una decisión inmobiliaria <br />
              <span className="font-light text-zinc-600">puede abrir una etapa nueva.</span>
            </h2>
            <p className="font-poppins text-xs sm:text-sm text-zinc-600 font-light leading-relaxed max-w-md">
              Acompañándote en tu próximo paso con dedicación personalizada, transparencia en cada negociación y respaldo profesional.
            </p>

            <div className="pt-4">
              <a
                href={getWhatsAppGeneralUrl('Quiero coordinar una reunión de asesoramiento')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-zinc-800 bg-zinc-900 hover:bg-black text-white font-archivo text-[11px] font-medium tracking-[0.18em] uppercase px-8 py-3.5 rounded-full transition-all shadow-md"
              >
                HABLEMOS DE TU PROYECTO
              </a>
            </div>
          </div>

          {/* Business Card Mockup Column from Figma */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-white border border-zinc-200">
              <img
                src="/assets/business-card.png"
                alt="Tarjeta de presentación Adelina Luján"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
