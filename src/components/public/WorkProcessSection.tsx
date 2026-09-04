import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const WorkProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01.',
      text: 'Escucho tu necesidad',
    },
    {
      number: '02.',
      text: 'Defino criterios y estrategia',
    },
    {
      number: '03.',
      text: 'Selecciono / posiciono oportunidades',
    },
    {
      number: '04.',
      text: 'Acompaño visitas, negociación y cierre.',
    },
  ];

  const [activeMobileStep, setActiveMobileStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToStep = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft - 16,
        behavior: 'smooth',
      });
      setActiveMobileStep(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = activeMobileStep > 0 ? activeMobileStep - 1 : steps.length - 1;
    scrollToStep(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = activeMobileStep < steps.length - 1 ? activeMobileStep + 1 : 0;
    scrollToStep(nextIdx);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.76;
    if (cardWidth > 0) {
      const activeIdx = Math.min(
        steps.length - 1,
        Math.max(0, Math.round(scrollLeft / cardWidth))
      );
      setActiveMobileStep(activeIdx);
    }
  };

  return (
    <section className="bg-white py-16 sm:py-28 px-4 sm:px-6 lg:px-12 border-b border-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          {/* Left Column: Heading and description from Figma */}
          <div className="lg:col-span-4 space-y-3 pr-0 lg:pr-8">
            <h2 className="font-archivo text-xl sm:text-2xl lg:text-[26px] font-normal text-zinc-900 tracking-tight leading-snug">
              Un proceso claro, de principio a fin.
            </h2>
            <p className="font-archivo text-xs sm:text-[13px] text-zinc-600 font-light leading-relaxed max-w-sm">
              Cada búsqueda u operación es diferente, pero el acompañamiento mantiene una misma lógica: entender, analizar, avanzar y acompañar hasta el cierre.
            </p>
          </div>

          {/* Right Area: Desktop 4 Step Columns with Vertical Dividers from Figma */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-0 lg:col-span-8 pt-2 lg:pt-0">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`space-y-4 ${
                  idx !== 0 ? 'border-l border-zinc-200 pl-6 lg:pl-8' : ''
                }`}
              >
                <div className="font-archivo text-3xl sm:text-4xl lg:text-[44px] font-bold text-zinc-900 tracking-tighter leading-none">
                  {step.number}
                </div>
                <p className="font-archivo text-xs sm:text-[12px] text-zinc-600 font-normal leading-snug max-w-[150px]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Swipeable Carousel */}
          <div className="block sm:hidden lg:col-span-8 space-y-4 pt-1">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3.5 -mx-4 px-4 pb-2 scroll-smooth"
            >
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="w-[76vw] max-w-[280px] shrink-0 snap-center bg-[#FBFBFA] border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-archivo font-semibold tracking-widest text-zinc-400 uppercase">
                      Paso 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-archivo text-zinc-400">
                      {idx + 1} de {steps.length}
                    </span>
                  </div>

                  <div className="font-archivo text-3xl font-bold text-zinc-900 tracking-tighter leading-none pt-1">
                    {step.number}
                  </div>

                  <p className="font-archivo text-xs text-zinc-700 font-medium leading-snug">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile Carousel Indicator & Arrow Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToStep(idx)}
                    aria-label={`Ir al paso ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full h-1.5 ${
                      activeMobileStep === idx
                        ? 'w-5 bg-zinc-900'
                        : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Paso anterior"
                  className="w-8 h-8 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-700 flex items-center justify-center transition-colors shadow-xs active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Siguiente paso"
                  className="w-8 h-8 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center transition-colors shadow-xs active:scale-95"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
