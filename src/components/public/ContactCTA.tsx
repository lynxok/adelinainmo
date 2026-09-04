import React from 'react';
import { getWhatsAppGeneralUrl } from '../../lib/whatsappUtils';

export const ContactCTA: React.FC = () => {
  return (
    <section id="proximo-paso" className="w-full bg-[#DAD3C8] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px] lg:min-h-[480px]">
        {/* Left Half: Editorial Call to Action */}
        <div className="md:col-span-6 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-16 space-y-6">
          <h2 className="font-archivo text-2xl sm:text-4xl lg:text-[42px] font-normal text-zinc-900 tracking-tight uppercase leading-[1.15]">
            ¿ESTÁS PENSANDO <br />
            EN TU PRÓXIMO PASO?
          </h2>

          <p className="font-archivo text-xs sm:text-sm text-zinc-700 font-light leading-relaxed max-w-sm">
            Contame qué necesitás y vemos juntos cuál es la mejor manera de avanzar.
          </p>

          <div className="pt-4">
            <a
              href={getWhatsAppGeneralUrl('Hola Adelina, me comunico desde la web para consultar por un próximo paso')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-zinc-400 hover:border-zinc-800 bg-transparent hover:bg-white/40 text-zinc-600 hover:text-zinc-900 font-archivo text-[11px] font-medium tracking-[0.18em] uppercase px-8 py-3.5 rounded-full transition-all duration-200"
            >
              ESCRIBIME POR WHATSAPP
            </a>
          </div>
        </div>

        {/* Right Half: Business Card on Chrome Tubes Photo from Figma */}
        <div className="md:col-span-6 relative min-h-[320px] md:min-h-full">
          <img
            src="/assets/business-card-tubes.png"
            alt="Adelina Luján Tarjeta de Presentación"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};
