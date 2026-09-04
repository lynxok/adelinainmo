import React, { useState, useEffect, useRef } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { Testimonial } from '../../types/testimonial';
import { testimonialService } from '../../lib/supabase';
import { ReviewAvatar } from './ReviewAvatar';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => testimonialService.getActiveTestimonials());
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    const active = testimonialService.getActiveTestimonials();
    setTestimonials(active);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('adelina-testimonials-changed', loadData);
    return () => window.removeEventListener('adelina-testimonials-changed', loadData);
  }, []);

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
    if (testimonials.length === 0) return;
    const nextIdx = activeTestimonial > 0 ? activeTestimonial - 1 : testimonials.length - 1;
    scrollToTestimonial(nextIdx);
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    const nextIdx = activeTestimonial < testimonials.length - 1 ? activeTestimonial + 1 : 0;
    scrollToTestimonial(nextIdx);
  };

  const handleScroll = () => {
    if (!scrollRef.current || testimonials.length === 0) return;
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

  if (testimonials.length === 0) {
    return null; // Ocultar sección si el administrador desactiva todos los testimonios
  }

  // Determine grid columns dynamically based on number of active testimonials
  const gridColsClass =
    testimonials.length === 1
      ? 'lg:grid-cols-1 max-w-md'
      : testimonials.length === 2
      ? 'lg:grid-cols-2 max-w-2xl'
      : testimonials.length === 3
      ? 'lg:grid-cols-3 max-w-4xl'
      : 'lg:grid-cols-4 max-w-5xl';

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
      <div className={`relative z-10 mx-auto w-full ${gridColsClass}`}>
        {/* Desktop Compact Cards */}
        <div className={`hidden lg:grid ${gridColsClass} gap-5 pt-6 w-full`}>
          {testimonials.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 pt-8 shadow-sm border border-white/90 text-center relative flex flex-col justify-between space-y-3 hover:translate-y-[-2px] transition-all duration-200"
            >
              {/* Platform Avatar / Badge */}
              <ReviewAvatar
                platform={item.platform}
                avatarUrl={item.avatar_url}
                clientName={item.client_name}
                size="md"
                className="absolute -top-6 left-1/2 -translate-x-1/2"
              />

              <div className="space-y-1.5">
                <div>
                  <h4 className="font-archivo text-[11px] font-bold text-zinc-900 uppercase tracking-wider line-clamp-1">
                    {item.client_name}
                  </h4>
                  <span className="text-[9.5px] text-zinc-400 font-light block line-clamp-1">
                    {item.client_role}
                  </span>
                </div>

                {/* Golden Stars */}
                <div className="flex items-center justify-center gap-0.5 text-[#F59E0B] py-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < (item.rating || 5) ? 'fill-current text-[#F59E0B]' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="font-archivo text-[10.5px] text-zinc-600 font-light leading-relaxed px-1">
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
                key={item.id || idx}
                className="w-[80vw] max-w-[320px] shrink-0 snap-center bg-white/95 backdrop-blur-sm rounded-2xl p-5 pt-8 shadow-md border border-white/90 text-center relative flex flex-col justify-between space-y-3"
              >
                {/* Platform Avatar / Badge */}
                <ReviewAvatar
                  platform={item.platform}
                  avatarUrl={item.avatar_url}
                  clientName={item.client_name}
                  size="md"
                  className="absolute -top-6 left-1/2 -translate-x-1/2"
                />

                <div className="space-y-1.5">
                  <div>
                    <h4 className="font-archivo text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      {item.client_name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-light block">
                      {item.client_role}
                    </span>
                  </div>

                  {/* Golden Stars */}
                  <div className="flex items-center justify-center gap-0.5 text-[#F59E0B] py-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (item.rating || 5) ? 'fill-current text-[#F59E0B]' : 'text-zinc-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="font-archivo text-xs text-zinc-600 font-light leading-relaxed px-1">
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
          {testimonials.length > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
};
