import React from 'react';

interface HeroSectionProps {
  onSearch?: (filters: any) => void;
  onNavigate?: (view: string, param?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-[75vh] sm:min-h-[80vh] flex flex-col justify-center sm:justify-end pb-16 pt-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image from Figma */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-living.jpg"
          alt="Interior Inmobiliario"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="font-archivo text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight max-w-3xl mx-auto leading-snug sm:leading-tight">
            Propiedades que conectan con tu manera de vivir
          </h1>
        </div>

        {/* Action Buttons (Figma 1:1) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2">
          <button
            type="button"
            onClick={() => onNavigate?.('buy-sell', 'operation:sale')}
            className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 rounded-full border border-white/60 bg-black/30 hover:bg-black/50 hover:border-white backdrop-blur-sm text-white font-archivo text-xs sm:text-sm font-light tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            QUIERO COMPRAR
          </button>

          <button
            type="button"
            onClick={() => onNavigate?.('valuation')}
            className="w-full sm:w-auto px-8 py-3.5 sm:px-10 sm:py-4 rounded-full border border-white/60 bg-black/30 hover:bg-black/50 hover:border-white backdrop-blur-sm text-white font-archivo text-xs sm:text-sm font-light tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            QUIERO VENDER
          </button>
        </div>
      </div>
    </section>
  );
};

