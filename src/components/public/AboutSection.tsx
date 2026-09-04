import React from 'react';
import { getWhatsAppGeneralUrl } from '../../lib/whatsappUtils';

interface AboutSectionProps {
  onNavigate?: (view: string, param?: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <section id="sobre-adelina" className="bg-[#F5F5F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-12 border-b border-zinc-200/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Sharp Image of Adelina (Matching Figma 1:1) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="w-full max-w-md aspect-[4/5] bg-zinc-200 overflow-hidden shadow-sm">
              <img
                src="/assets/adelina-portrait.jpg"
                alt="Adelina Luján Corredora Inmobiliaria"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Editorial Typography & Pill Button (Matching Figma 1:1) */}
          <div className="lg:col-span-7 space-y-8 lg:pl-4">
            {/* Tag / Category */}
            <span className="font-archivo text-[11px] sm:text-xs font-normal tracking-[0.25em] text-zinc-400 uppercase block">
              SOBRE MÍ
            </span>

            {/* Title in Uppercase */}
            <h2 className="font-archivo text-2xl sm:text-4xl lg:text-[42px] font-normal text-zinc-900 tracking-tight uppercase leading-[1.15]">
              UNA FORMA MÁS <br />
              CERCANA DE VIVIR EL <br />
              PROCESO INMOBILIARIO
            </h2>

            {/* Paragraph Text */}
            <p className="font-archivo text-xs sm:text-sm lg:text-[15px] text-zinc-700 font-light leading-relaxed max-w-lg">
              Soy Adelina Luján corredora inmobiliaria y acompaño decisiones de compra, venta e inversión con una forma de trabajar personal, clara y profesional. Mi objetivo es que cada cliente pueda avanzar entendiendo el proceso, evaluando sus opciones y sintiéndose acompañado de principio a fin.
            </p>

            {/* Designer Outline Pill Button from Figma */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('about') : undefined}
                className="inline-block border border-zinc-300 hover:border-zinc-800 bg-transparent hover:bg-white text-zinc-500 hover:text-zinc-900 font-archivo text-[11px] font-medium tracking-[0.18em] uppercase px-8 py-3.5 rounded-full transition-all duration-200 cursor-pointer"
              >
                CONOCER MÁS SOBRE MÍ
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
