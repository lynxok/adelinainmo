import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Property } from '../../types/property';

interface FeaturedPropertiesProps {
  properties: Property[];
  onSelectProperty: (slug: string) => void;
  onViewAll: () => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  onSelectProperty,
  onViewAll,
}) => {
  // Designer properties list matching Figma screenshot
  const figmaProperties = [
    {
      id: 'prop-1',
      slug: 'casa-barrio-privado-parana',
      title: 'Casa en Barrio Privado',
      location: 'Paraná, Entre Ríos.',
      specs: '200m²  |  3 Dormi.  |  2 Baños',
      priceFormatted: 'USD 185.000',
      image: '/assets/property-house-private.jpg',
    },
    {
      id: 'prop-2',
      slug: 'departamento-centro-parana',
      title: 'Departamento Centro',
      location: 'Paraná, Entre Ríos.',
      specs: '95m²  |  2 Dormi.  |  1 Baños',
      priceFormatted: 'USD 120.000',
      image: '/assets/property-dept-curved.jpg',
    },
    {
      id: 'prop-3',
      slug: 'terreno-colonia-avellaneda',
      title: 'Terreno - Lote',
      location: 'Colonia Avellaneda, Entre Ríos.',
      specs: '1.000m²',
      priceFormatted: 'USD 28.000',
      image: '/assets/property-land-lot.jpg',
    },
    // Extra card for carousel navigation
    {
      id: 'prop-4',
      slug: 'casa-estilo-minimalista-parana',
      title: 'Casa Moderna Parque',
      location: 'Paraná, Entre Ríos.',
      specs: '240m²  |  3 Dormi.  |  3 Baños',
      priceFormatted: 'USD 215.000',
      image: '/assets/hero-living.jpg',
    },
  ];

  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const visibleCards = 3;

  const handlePrevDesktop = () => {
    setDesktopIndex((prev) => (prev > 0 ? prev - 1 : figmaProperties.length - visibleCards));
  };

  const handleNextDesktop = () => {
    setDesktopIndex((prev) => (prev + visibleCards < figmaProperties.length ? prev + 1 : 0));
  };

  const scrollToMobileCard = (index: number) => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft - 16,
        behavior: 'smooth',
      });
      setMobileIndex(index);
    }
  };

  const handlePrevMobile = () => {
    const nextIdx = mobileIndex > 0 ? mobileIndex - 1 : figmaProperties.length - 1;
    scrollToMobileCard(nextIdx);
  };

  const handleNextMobile = () => {
    const nextIdx = mobileIndex < figmaProperties.length - 1 ? mobileIndex + 1 : 0;
    scrollToMobileCard(nextIdx);
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.82;
    if (cardWidth > 0) {
      const activeIdx = Math.min(
        figmaProperties.length - 1,
        Math.max(0, Math.round(scrollLeft / cardWidth))
      );
      setMobileIndex(activeIdx);
    }
  };

  // Slice cards for desktop carousel window
  const currentDesktopItems = figmaProperties.slice(desktopIndex, desktopIndex + visibleCards);

  return (
    <section className="bg-[#F5F5F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-12 border-b border-zinc-200/60 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        {/* Top Header Bar with Outline Pill Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <h2 className="font-archivo text-2xl sm:text-3xl lg:text-[32px] font-normal text-zinc-900 tracking-tight uppercase">
            PROPIEDADES DESTACADAS
          </h2>

          <button
            onClick={onViewAll}
            className="self-start sm:self-auto border border-zinc-400 hover:border-zinc-800 bg-transparent hover:bg-white text-zinc-600 hover:text-zinc-900 font-archivo text-[11px] font-medium tracking-[0.18em] uppercase px-6 sm:px-7 py-2.5 sm:py-3 rounded-full transition-all duration-200"
          >
            VER TODAS LAS PROPIEDADES
          </button>
        </div>

        {/* Desktop Carousel Grid (3 cards in view) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {currentDesktopItems.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop.slug)}
              className="bg-white rounded-[28px] p-5 shadow-sm space-y-4 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              {/* Image Container with Rounded Corners */}
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-100 relative">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-1.5 px-1 pb-2">
                <h3 className="font-archivo text-base sm:text-lg font-bold text-zinc-900">
                  {prop.title}
                </h3>
                <p className="font-poppins text-xs text-zinc-400 font-light">
                  {prop.location}
                </p>
                <p className="font-poppins text-xs text-zinc-500 font-light pt-0.5">
                  {prop.specs}
                </p>
                <div className="pt-3 font-archivo text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
                  {prop.priceFormatted}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipeable Carousel Track */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 -mx-4 px-4 pb-2 scroll-smooth"
        >
          {figmaProperties.map((prop, idx) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop.slug)}
              className="w-[82vw] max-w-[340px] shrink-0 snap-center bg-white rounded-[28px] p-5 shadow-sm space-y-4 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-100 relative">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-1.5 px-1 pb-1">
                <h3 className="font-archivo text-base font-bold text-zinc-900">
                  {prop.title}
                </h3>
                <p className="font-poppins text-xs text-zinc-400 font-light">
                  {prop.location}
                </p>
                <p className="font-poppins text-xs text-zinc-500 font-light pt-0.5">
                  {prop.specs}
                </p>
                <div className="pt-2 font-archivo text-lg font-bold text-zinc-900 tracking-tight">
                  {prop.priceFormatted}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls: Mobile with Dots + Desktop with Arrows */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 sm:pt-4">
          {/* Mobile Dots */}
          <div className="flex md:hidden items-center gap-1.5">
            {figmaProperties.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToMobileCard(idx)}
                aria-label={`Ir a propiedad ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  mobileIndex === idx
                    ? 'w-6 bg-zinc-900'
                    : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                handlePrevDesktop();
                handlePrevMobile();
              }}
              aria-label="Propiedad anterior"
              className="w-10 h-10 rounded-full bg-zinc-400 hover:bg-zinc-600 text-white flex items-center justify-center transition-colors shadow-sm focus:outline-none active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                handleNextDesktop();
                handleNextMobile();
              }}
              aria-label="Siguiente propiedad"
              className="w-10 h-10 rounded-full border border-zinc-400 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center transition-colors shadow-sm focus:outline-none active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
