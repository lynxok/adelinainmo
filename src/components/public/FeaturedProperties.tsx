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
  // Prioritize active featured properties from DB, followed by other active properties
  const displayProperties = React.useMemo(() => {
    const valid = properties.filter((p) => p.status !== 'hidden');
    if (valid.length === 0) return [];

    // Prioritize featured properties first, followed by newest
    const sorted = [...valid].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return sorted.map((p) => {
      const specsParts: string[] = [];
      const area = p.total_area_sqm || p.covered_area_sqm;
      if (area) specsParts.push(`${area}m²`);
      if (p.bedrooms > 0) specsParts.push(`${p.bedrooms} Dormi.`);
      if (p.bathrooms > 0) specsParts.push(`${p.bathrooms} Baños`);

      const formattedPrice =
        p.currency === 'USD'
          ? `USD ${(p.price_usd || 0).toLocaleString('es-AR')}`
          : `$ ${(p.price_ars || 0).toLocaleString('es-AR')}`;

      const locationParts = [p.location_neighborhood, p.location_city].filter(Boolean);
      const locationStr = locationParts.length > 0 ? `${locationParts.join(', ')}.` : 'Paraná, Entre Ríos.';

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        location: locationStr,
        specs: specsParts.join('  |  ') || 'Consultar detalles',
        priceFormatted: formattedPrice,
        image: p.featured_image || p.images?.[0] || '/assets/property-house-private.jpg',
        status: p.status,
      };
    });
  }, [properties]);

  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const visibleCards = Math.min(3, Math.max(1, displayProperties.length));

  const handlePrevDesktop = () => {
    setDesktopIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, displayProperties.length - visibleCards)));
  };

  const handleNextDesktop = () => {
    setDesktopIndex((prev) => (prev + visibleCards < displayProperties.length ? prev + 1 : 0));
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
    const nextIdx = mobileIndex > 0 ? mobileIndex - 1 : displayProperties.length - 1;
    scrollToMobileCard(nextIdx);
  };

  const handleNextMobile = () => {
    const nextIdx = mobileIndex < displayProperties.length - 1 ? mobileIndex + 1 : 0;
    scrollToMobileCard(nextIdx);
  };

  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.82;
    if (cardWidth > 0) {
      const activeIdx = Math.min(
        displayProperties.length - 1,
        Math.max(0, Math.round(scrollLeft / cardWidth))
      );
      setMobileIndex(activeIdx);
    }
  };

  // Slice cards for desktop carousel window
  const currentDesktopItems = displayProperties.slice(desktopIndex, desktopIndex + visibleCards);

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
        {displayProperties.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-[28px] p-5 shadow-sm space-y-4 animate-pulse">
                <div className="rounded-2xl aspect-[4/3] bg-zinc-200" />
                <div className="space-y-2 px-1">
                  <div className="h-5 bg-zinc-200 rounded-md w-3/4" />
                  <div className="h-3 bg-zinc-100 rounded-md w-1/2" />
                  <div className="h-3 bg-zinc-100 rounded-md w-2/3" />
                  <div className="h-6 bg-zinc-200 rounded-md w-2/5 pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`hidden md:grid gap-6 lg:gap-8 ${displayProperties.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : displayProperties.length === 2 ? 'grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-3'}`}>
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
                  {prop.status === 'reserved' && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Reservada
                    </span>
                  )}
                  {prop.status === 'sold' && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Vendida
                    </span>
                  )}
                </div>

                {/* Text Info */}
                <div className="space-y-1.5 px-1 pb-2">
                  <h3 className="font-archivo text-base sm:text-lg font-bold text-zinc-900">
                    {prop.title}
                  </h3>
                  <p className="font-archivo text-xs text-zinc-400 font-light">
                    {prop.location}
                  </p>
                  <p className="font-archivo text-xs text-zinc-500 font-light pt-0.5">
                    {prop.specs}
                  </p>
                  <div className="pt-3 font-archivo text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
                    {prop.priceFormatted}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Swipeable Carousel Track */}
        {displayProperties.length > 0 && (
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex md:hidden overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 -mx-4 px-4 pb-2 scroll-smooth"
          >
            {displayProperties.map((prop) => (
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
                  {prop.status === 'reserved' && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Reservada
                    </span>
                  )}
                  {prop.status === 'sold' && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      Vendida
                    </span>
                  )}
                </div>

                {/* Text Info */}
                <div className="space-y-1.5 px-1 pb-1">
                  <h3 className="font-archivo text-base font-bold text-zinc-900">
                    {prop.title}
                  </h3>
                  <p className="font-archivo text-xs text-zinc-400 font-light">
                    {prop.location}
                  </p>
                  <p className="font-archivo text-xs text-zinc-500 font-light pt-0.5">
                    {prop.specs}
                  </p>
                  <div className="pt-2 font-archivo text-lg font-bold text-zinc-900 tracking-tight">
                    {prop.priceFormatted}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carousel Controls: Mobile with Dots + Desktop with Arrows */}
        {displayProperties.length > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 sm:pt-4">
            {/* Mobile Dots */}
            <div className="flex md:hidden items-center gap-1.5">
              {displayProperties.map((_, idx) => (
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
            {displayProperties.length > visibleCards && (
              <div className="hidden md:flex items-center justify-center gap-3">
                <button
                  onClick={handlePrevDesktop}
                  aria-label="Propiedad anterior"
                  className="w-10 h-10 rounded-full bg-zinc-400 hover:bg-zinc-600 text-white flex items-center justify-center transition-colors shadow-sm focus:outline-none active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextDesktop}
                  aria-label="Siguiente propiedad"
                  className="w-10 h-10 rounded-full border border-zinc-400 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center transition-colors shadow-sm focus:outline-none active:scale-95"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
