import React from 'react';

export const NextStepBanner: React.FC = () => {
  return (
    <section className="w-full bg-[#DAD3C8] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px] lg:min-h-[420px]">
        {/* Left Half: Office Facade Sign Photo from Figma */}
        <div className="md:col-span-6 relative min-h-[280px] md:min-h-full">
          <img
            src="/assets/office-facade-sign.png"
            alt="Adelina Luján Estudio Inmobiliario"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Half: Editorial Text Container */}
        <div className="md:col-span-6 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 space-y-4">
          <h2 className="font-archivo text-2xl sm:text-3xl lg:text-[40px] font-normal text-zinc-900 tracking-tight uppercase leading-[1.15]">
            ACOMPAÑÁNDOTE EN <br />
            TU PRÓXIMO PASO
          </h2>
          <p className="font-poppins text-xs sm:text-sm text-zinc-700 font-light max-w-md">
            Una decisión inmobiliaria puede abrir una etapa nueva.
          </p>
        </div>
      </div>
    </section>
  );
};
