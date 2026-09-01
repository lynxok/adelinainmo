import React, { useState, useRef } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Ero Wals',
      role: 'Operational Leads',
      quote: '“Since using this platform, our team’s productivity has increased significantly. Processes that were previously manual can now be automated”',
      date: '12/05/2026',
    },
    {
      name: 'Ero Wals',
      role: 'Operational Leads',
      quote: '“Since using this platform, our team’s productivity has increased significantly. Processes that were previously manual can now be automated”',
      date: '12/05/2026',
    },
    {
      name: 'Ero Wals',
      role: 'Operational Leads',
      quote: '“Since using this platform, our team’s productivity has increased significantly. Processes that were previously manual can now be automated”',
      date: '12/05/2026',
    },
    {
      name: 'Ero Wals',
      role: 'Operational Leads',
      quote: '“Since using this platform, our team’s productivity has increased significantly. Processes that were previously manual can now be automated”',
      date: '12/05/2026',
    },
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTestimonial = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft - 24,
        behavior: 'smooth',
      });
      setActiveTestimonial(index);
    }
  };

  const handlePrev = () => {
    const nextIdx = activeTestimonial > 0 ? activeTestimonial - 1 : testimonials.length - 1;
    scrollToTestimonial(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = activeTestimonial < testimonials.length - 1 ? activeTestimonial + 1 : 0;
    scrollToTestimonial(nextIdx);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.8;
    if (cardWidth > 0) {
      const activeIdx = Math.min(
        testimonials.length - 1,
        Math.max(0, Math.round(scrollLeft / cardWidth))
      );
      setActiveTestimonial(activeIdx);
    }
  };

  return (
    <section className="relative min-h-[540px] lg:min-h-[640px] flex items-center justify-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#E5E5E5] overflow-hidden border-b border-zinc-300/40">
      {/* Background Image: Embossed AL Monogram Wall with Exact Framing from Figma */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/embossed-wall-al.png"
          alt="Monograma AL en bajo relieve"
          className="w-full h-full object-cover object-[center_48%]"
        />
        {/* Very subtle ambient overlay to preserve sharp contrast */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </div>

      {/* Foreground Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Desktop 4 Compact Cards */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-5 pt-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 pt-8 shadow-sm border border-white/90 text-center relative flex flex-col justify-between space-y-3 hover:translate-y-[-2px] transition-all duration-200"
            >
              {/* Circular Neutral Avatar from Figma */}
              <div className="w-12 h-12 rounded-full bg-[#CCCCCC] border-[3px] border-white shadow-sm absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden">
                <svg
                  className="w-7 h-7 text-white/80 fill-current mt-1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <div>
                  <h4 className="font-archivo text-[11px] font-bold text-zinc-900 uppercase tracking-wider">
                    {item.name}
                  </h4>
                  <span className="text-[9.5px] text-zinc-400 font-light block">
                    {item.role}
                  </span>
                </div>

                {/* 5 Golden Stars from Figma */}
                <div className="flex items-center justify-center gap-0.5 text-[#F59E0B] py-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="font-poppins text-[10.5px] text-zinc-600 font-light leading-relaxed px-1">
                  {item.quote}
                </p>
              </div>

              {/* Date at the bottom */}
              <div className="pt-2 border-t border-zinc-100 text-[9px] text-zinc-400 font-mono">
                {item.date}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet Swipeable Carousel Track */}
        <div className="block lg:hidden space-y-4">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 -mx-4 px-6 pt-10 pb-4 scroll-smooth"
          >
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="w-[80vw] max-w-[320px] shrink-0 snap-center bg-white/95 backdrop-blur-sm rounded-2xl p-5 pt-8 shadow-md border border-white/90 text-center relative flex flex-col justify-between space-y-3"
              >
                {/* Circular Neutral Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#CCCCCC] border-[3px] border-white shadow-sm absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden">
                  <svg
                    className="w-7 h-7 text-white/80 fill-current mt-1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <h4 className="font-archivo text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-light block">
                      {item.role}
                    </span>
                  </div>

                  {/* 5 Golden Stars */}
                  <div className="flex items-center justify-center gap-0.5 text-[#F59E0B] py-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="font-poppins text-xs text-zinc-600 font-light leading-relaxed px-1">
                    {item.quote}
                  </p>
                </div>

                {/* Date at the bottom */}
                <div className="pt-2 border-t border-zinc-100 text-[9.5px] text-zinc-400 font-mono">
                  {item.date}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel Indicators & Navigation */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={handlePrev}
              aria-label="Testimonio anterior"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 flex items-center justify-center transition-colors shadow-sm focus:outline-none active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToTestimonial(idx)}
                  aria-label={`Ir al testimonio ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full h-1.5 ${
                    activeTestimonial === idx
                      ? 'w-5 bg-zinc-900'
                      : 'w-1.5 bg-zinc-400 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Siguiente testimonio"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 flex items-center justify-center transition-colors shadow-sm focus:outline-none active:scale-95"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
