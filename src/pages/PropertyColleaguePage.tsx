import React, { useState } from 'react';
import { Property } from '../types/property';
import { Bed, Bath, Maximize2, Car, MapPin, Building, CheckCircle2, Shield, Info } from 'lucide-react';

interface PropertyColleaguePageProps {
  property: Property;
}

export const PropertyColleaguePage: React.FC<PropertyColleaguePageProps> = ({ property }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = property.images.length > 0 ? property.images : ['/assets/chic-living.jpg'];

  const displayPrice = property.currency === 'USD'
    ? `USD $${(property.price_usd || 0).toLocaleString('es-AR')}`
    : `$${(property.price_ars || 0).toLocaleString('es-AR')}`;

  const operationLabel = property.operation_type === 'sale'
    ? 'En Venta'
    : property.operation_type === 'rent'
    ? 'En Alquiler'
    : 'Alquiler Temporario';

  const typeLabels: Record<string, string> = {
    house: 'Casa Residencial',
    apartment: 'Departamento',
    land: 'Terreno / Lote',
    commercial: 'Local Comercial',
    field: 'Campo / Quinta',
    duplex: 'Duplex',
    office: 'Oficina',
    other: 'Inmueble',
  };

  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-900 pb-20">
      {/* Neutral Minimal Top Header */}
      <header className="bg-white border-b border-zinc-200 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              DOC
            </div>
            <div>
              <span className="font-archivo font-bold text-sm text-zinc-900 block leading-tight">
                Ficha Técnica de Inmueble
              </span>
              <span className="text-[10px] text-zinc-500 font-light block">
                Ref. #{property.slug} • Información Verificada
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Disponible
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Main Photo Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-900 shadow-md border border-zinc-200">
            <img
              src={images[selectedImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-zinc-900/90 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                {operationLabel}
              </span>
              <span className="bg-white/95 text-zinc-900 text-xs font-medium px-3 py-1 rounded-full">
                {typeLabels[property.property_type] || property.property_type}
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-zinc-900 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Specs Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mb-1">
                <MapPin className="w-4 h-4 text-zinc-700" />
                <span>{property.location_neighborhood}, {property.location_city}</span>
              </div>
              <h1 className="font-archivo text-2xl sm:text-3xl font-bold text-zinc-900">
                {property.title}
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-zinc-400 block uppercase font-medium">Valor Solicitado</span>
              <span className="font-archivo text-3xl sm:text-4xl font-bold text-zinc-900">
                {displayPrice}
              </span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {property.property_type !== 'land' ? (
              <>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center space-y-1">
                  <Bed className="w-5 h-5 text-zinc-700 mx-auto" />
                  <span className="text-xs text-zinc-500 font-light block">Dormitorios</span>
                  <span className="font-archivo font-bold text-base text-zinc-900">{property.bedrooms}</span>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center space-y-1">
                  <Bath className="w-5 h-5 text-zinc-700 mx-auto" />
                  <span className="text-xs text-zinc-500 font-light block">Baños</span>
                  <span className="font-archivo font-bold text-base text-zinc-900">{property.bathrooms}</span>
                </div>
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center space-y-1">
                  <Car className="w-5 h-5 text-zinc-700 mx-auto" />
                  <span className="text-xs text-zinc-500 font-light block">Cocheras</span>
                  <span className="font-archivo font-bold text-base text-zinc-900">{property.garages}</span>
                </div>
              </>
            ) : (
              <div className="col-span-2 sm:col-span-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex items-center gap-3">
                <Building className="w-6 h-6 text-zinc-700" />
                <div>
                  <span className="font-archivo font-bold text-sm text-zinc-900 block">Lote Residencial</span>
                  <span className="text-xs text-zinc-500 font-light">Listo para escrituración inmediata</span>
                </div>
              </div>
            )}

            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center space-y-1">
              <Maximize2 className="w-5 h-5 text-zinc-700 mx-auto" />
              <span className="text-xs text-zinc-500 font-light block">Superficie Total</span>
              <span className="font-archivo font-bold text-base text-zinc-900">
                {property.total_area_sqm || property.covered_area_sqm} m²
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pt-4 border-t border-zinc-100">
            <h3 className="font-archivo text-lg font-bold text-zinc-900">Detalles y Memoria Descriptiva</h3>
            <p className="font-poppins text-zinc-600 text-sm leading-relaxed whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <h3 className="font-archivo text-lg font-bold text-zinc-900">Equipamiento e Instalaciones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-700 bg-zinc-50 px-3.5 py-2.5 rounded-xl border border-zinc-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center gap-3 text-xs text-zinc-600">
            <Info className="w-5 h-5 text-zinc-500 shrink-0" />
            <span>
              Para coordinar visitas, consultar disponibilidad horaria o solicitar documentación adicional, por favor contactá a tu asesor inmobiliario de referencia.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
