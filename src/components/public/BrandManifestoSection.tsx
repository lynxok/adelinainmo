import React from 'react';

export const BrandManifestoSection: React.FC = () => {
  return (
    <section className="bg-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-zinc-100">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
        {/* Centered Vector AL Monogram with textured fill from Links/monograma con fondo.svg */}
        <div className="flex justify-center">
          <img
            src="/assets/al-monogram-eye.svg"
            alt="Adelina Luján Monograma AL"
            className="h-24 sm:h-32 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Uppercase Headline from Figma */}
        <h2 className="font-archivo text-2xl sm:text-4xl lg:text-5xl font-light text-zinc-900 tracking-tight uppercase leading-[1.2]">
          MÁS QUE UNA OPERACIÓN, UNA <br className="hidden sm:block" />
          <span className="font-normal text-zinc-900">DECISIÓN BIEN ACOMPAÑADA</span>
        </h2>

        {/* Explanatory paragraph from Figma */}
        <p className="font-poppins text-xs sm:text-sm lg:text-base text-zinc-600 font-light leading-relaxed max-w-2xl mx-auto">
          Comprar, vender o invertir implica patrimonio, expectativas y proyectos personales. 
          Mi forma de trabajar combina escucha activa, respuesta ágil, transparencia y seguimiento para que cada etapa resulte más clara y segura.
        </p>
      </div>
    </section>
  );
};
