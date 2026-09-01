import React from 'react';
import { Property } from '../types/property';
import { HeroSection } from '../components/public/HeroSection';
import { BrandManifestoSection } from '../components/public/BrandManifestoSection';
import { AboutSection } from '../components/public/AboutSection';
import { ServicesGrid } from '../components/public/ServicesGrid';
import { FeaturedProperties } from '../components/public/FeaturedProperties';
import { WorkProcessSection } from '../components/public/WorkProcessSection';
import { NextStepBanner } from '../components/public/NextStepBanner';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { ContactCTA } from '../components/public/ContactCTA';

interface HomePageProps {
  properties: Property[];
  onSelectProperty: (slug: string) => void;
  onNavigate: (view: string, param?: string) => void;
  onSearch: (filters: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
  onSearch,
}) => {
  return (
    <div className="w-full">
      {/* 1. Hero Principal */}
      <HeroSection onSearch={onSearch} onNavigate={onNavigate} />

      {/* 2. Manifiesto de Marca (Monograma AL + MÁS QUE UNA OPERACIÓN...) */}
      <BrandManifestoSection />

      {/* 3. Sobre Mí (Foto Adelina + UNA FORMA MÁS CERCANA DE VIVIR EL PROCESO INMOBILIARIO) */}
      <AboutSection />

      {/* 4. Servicios (¿EN QUÉ PUEDO ACOMPAÑARTE? + Foto Living + 3 Columnas) */}
      <ServicesGrid onNavigate={onNavigate} />

      {/* 5. Propiedades Destacadas */}
      <FeaturedProperties
        properties={properties}
        onSelectProperty={onSelectProperty}
        onViewAll={() => onNavigate('catalog')}
      />

      {/* 6. Metodología / Proceso (Un proceso claro, de principio a fin. + Pasos 01, 02, 03, 04) */}
      <WorkProcessSection />

      {/* 7. Banner Acompañándote en tu Próximo Paso (Foto Cartel Oficina + Texto en fondo arena) */}
      <NextStepBanner />

      {/* 8. Sección de Testimonios sobre Pared de Yeso con Monograma AL */}
      <TestimonialsSection />

      {/* 9. CTA de Contacto & WhatsApp (50/50: Texto a la izquierda, Tarjeta a la derecha) */}
      <ContactCTA />
    </div>
  );
};
