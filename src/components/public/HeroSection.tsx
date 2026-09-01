import React from 'react';
import { SearchFilterBar } from './SearchFilterBar';
import { OperationType, PropertyType } from '../../types/property';

interface HeroSectionProps {
  onSearch: (filters: {
    operation?: OperationType | 'all';
    type?: PropertyType | 'all';
    location?: string;
  }) => void;
  onNavigate?: (view: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  return (
    <section className="relative min-h-[75vh] flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image from Figma */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-living.jpg"
          alt="Interior Inmobiliario"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark gradient overlay for navbar and search bar contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-6">
        <div className="space-y-3">
          <span className="inline-block text-[11px] sm:text-xs text-zinc-300 font-light tracking-widest uppercase bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
            Adelina Luján • Asesoramiento Inmobiliario
          </span>
          <h1 className="font-archivo text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Propiedades que conectan con tu manera de vivir
          </h1>
        </div>

        {/* Integrated Search Bar */}
        <div className="pt-2">
          <SearchFilterBar onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
};
