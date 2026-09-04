import React, { useEffect } from 'react';
import { NextStepBanner } from '../components/public/NextStepBanner';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { ContactCTA } from '../components/public/ContactCTA';
import { getWhatsAppGeneralUrl } from '../lib/whatsappUtils';
import { MessageCircle, ArrowLeft } from 'lucide-react';

interface AboutAdelinaPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AboutAdelinaPage: React.FC<AboutAdelinaPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#F2F2F2] min-h-screen">
      {/* 1. Cabecera Monumental con Textura Pétrea y Monograma Calado (Figma 1:1) */}
      <section className="relative w-full h-[360px] sm:h-[440px] md:h-[520px] lg:h-[620px] overflow-hidden bg-zinc-900 flex items-center justify-center pt-16 sm:pt-20">
        <img
          src="/assets/stone-texture.jpg"
          alt="Textura mineral de fondo"
          className="absolute inset-0 w-full h-full object-cover object-center select-none"
        />
        <div className="absolute inset-0 bg-black/25" />

        {/* Monograma AL Expandido */}
        <div className="relative z-10 w-full max-w-5xl px-6 flex justify-center items-center">
          <img
            src="/assets/adelina-monogram-expanded.png"
            alt="Adelina Luján - Monograma"
            className="w-full max-w-[480px] sm:max-w-[680px] md:max-w-[850px] lg:max-w-[1020px] h-auto object-contain drop-shadow-2xl animate-fadeIn"
          />
        </div>
      </section>

      {/* 2. Presentación Biográfica & Trayectoria Profesional (Figma 1:1) */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-archivo text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al inicio</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Columna Izquierda: Retrato de Adelina (766x1025) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-[3/4] bg-zinc-300 shadow-xl overflow-hidden">
              <img
                src="/assets/adelina-portrait.jpg"
                alt="Adelina Luján - Corredora Inmobiliaria y Martillera Pública"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Columna Derecha: Tipografía Editorial y Biografía */}
          <div className="lg:col-span-7 space-y-6 lg:pl-4">
            <div className="space-y-2">
              <span className="font-archivo text-xs sm:text-sm font-semibold tracking-[0.25em] text-adelina-accent uppercase block">
                Sobre Mí
              </span>
              <h1 className="font-archivo text-3xl sm:text-5xl lg:text-[56px] font-light text-[#1C1C1C] tracking-tight uppercase leading-[1.1]">
                ADELINA LUJÁN
              </h1>
            </div>

            <div className="py-2 border-y border-zinc-300">
              <p className="font-archivo text-sm sm:text-base font-medium text-zinc-800 tracking-wide">
                Corredora Inmobiliaria y Martillera Pública, Matrícula 1789, en Paraná, Entre Ríos.
              </p>
            </div>

            <div className="space-y-4 font-archivo text-xs sm:text-sm lg:text-[15px] text-zinc-700 font-light leading-relaxed">
              <p>
                Acompaño a personas y familias en procesos de compra, venta y tasación de propiedades, con una forma de trabajar cercana, clara y personalizada. Para mí, cada operación inmobiliaria implica mucho más que una transacción: detrás de cada decisión hay proyectos, expectativas y momentos importantes de la vida.
              </p>
              <p>
                Por eso, mi trabajo parte de la escucha, el asesoramiento y el seguimiento en cada etapa, buscando que cada cliente pueda avanzar con mayor seguridad, confianza y tranquilidad.
              </p>
              <p>
                Mi compromiso es brindar un servicio profesional, transparente y atento a los detalles, para que cada decisión inmobiliaria se sienta bien acompañada.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={getWhatsAppGeneralUrl('Hola Adelina, me gustaría conversar sobre una consulta inmobiliaria')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-adelina-dark hover:bg-black text-white font-archivo text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Conversar por WhatsApp</span>
              </a>

              <button
                onClick={() => onNavigate('buy-sell')}
                className="inline-flex items-center gap-2 border border-zinc-300 hover:border-zinc-800 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 font-archivo text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-full transition-all duration-200"
              >
                <span>Ver Propiedades</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bloque Editorial de Marca (Split 50/50: Cartel Corpóreo + Próximo Paso) */}
      <NextStepBanner />

      {/* 4. Muro de Testimonios sobre Pared de Yeso con Monograma AL */}
      <TestimonialsSection />

      {/* 5. CTA Final & WhatsApp (Tarjeta en tubos metálicos) */}
      <ContactCTA />
    </div>
  );
};
