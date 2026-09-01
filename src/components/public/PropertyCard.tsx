import React from 'react';
import { Property } from '../../types/property';
import { Bed, Bath, Maximize2, MapPin, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { getWhatsAppInquiryUrl } from '../../lib/whatsappUtils';

interface PropertyCardProps {
  property: Property;
  onSelect: (slug: string) => void;
  isColleagueView?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isColleagueView = false,
}) => {
  const displayPrice = property.currency === 'USD'
    ? `USD $${(property.price_usd || 0).toLocaleString('es-AR')}`
    : `$${(property.price_ars || 0).toLocaleString('es-AR')}`;

  const operationLabel = property.operation_type === 'sale'
    ? 'Venta'
    : property.operation_type === 'rent'
    ? 'Alquiler'
    : 'Alquiler Temporario';

  const typeLabels: Record<string, string> = {
    house: 'Casa',
    apartment: 'Departamento',
    land: 'Terreno / Lote',
    commercial: 'Local Comercial',
    field: 'Campo / Quinta',
    duplex: 'Duplex',
    office: 'Oficina',
    other: 'Inmueble',
  };

  const mainImage = property.featured_image || property.images[0] || '/assets/chic-living.jpg';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-adelina-border/60 hover:border-adelina-accent/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 cursor-pointer" onClick={() => onSelect(property.slug)}>
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-adelina-dark/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
            {operationLabel}
          </span>
          <span className="bg-white/90 backdrop-blur-md text-zinc-800 text-[11px] font-medium px-2.5 py-1 rounded-full">
            {typeLabels[property.property_type] || property.property_type}
          </span>
        </div>

        {/* Status / Featured Badge */}
        <div className="absolute top-3 right-3">
          {property.status === 'reserved' && (
            <span className="bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
              Reservada
            </span>
          )}
          {property.status === 'sold' && (
            <span className="bg-rose-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
              Vendida
            </span>
          )}
          {property.status === 'rented' && (
            <span className="bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
              Alquilada
            </span>
          )}
          {property.is_featured && property.status === 'available' && (
            <span className="bg-adelina-accent text-adelina-dark text-[10px] font-bold px-2 py-0.5 rounded-full shadow uppercase tracking-wider">
              Destacada
            </span>
          )}
        </div>

        {/* Bottom Price in Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="font-archivo text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            {displayPrice}
          </div>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location approx */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-adelina-accent shrink-0" />
            <span className="truncate">{property.location_neighborhood}, {property.location_city}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(property.slug)}
            className="font-archivo text-base sm:text-lg font-semibold text-zinc-900 line-clamp-1 group-hover:text-adelina-gold transition-colors cursor-pointer"
          >
            {property.title}
          </h3>

          <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 font-light">
            {property.description}
          </p>
        </div>

        {/* Specs Pill List */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-zinc-100 text-zinc-600 text-xs font-medium text-center">
          {property.property_type !== 'land' ? (
            <>
              <div className="flex items-center justify-center gap-1">
                <Bed className="w-3.5 h-3.5 text-zinc-400" />
                <span>{property.bedrooms} Dorms</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Bath className="w-3.5 h-3.5 text-zinc-400" />
                <span>{property.bathrooms} Baños</span>
              </div>
            </>
          ) : (
            <div className="col-span-2 flex items-center justify-center gap-1 text-zinc-500">
              <span>Lote listo para escriturar</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>{property.total_area_sqm || property.covered_area_sqm} m²</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSelect(property.slug)}
            className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Ver Ficha</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {!isColleagueView && (
            <a
              href={getWhatsAppInquiryUrl(property)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs flex items-center justify-center transition-colors shadow-sm"
              title="Consultar por WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
