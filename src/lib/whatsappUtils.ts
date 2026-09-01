import { Property } from '../types/property';

export const ADELINA_PHONE = '5493433001534'; // +54 9 343 300 1 534 from Figma
export const ADELINA_PHONE_FORMATTED = '+54 9 343 300-1534';

/**
 * Generate a direct WhatsApp link for a specific property inquiry from an end user
 */
export function getWhatsAppInquiryUrl(property: Property): string {
  const price = property.currency === 'USD' 
    ? `USD $${(property.price_usd || 0).toLocaleString('es-AR')}`
    : `$${(property.price_ars || 0).toLocaleString('es-AR')}`;
    
  const op = property.operation_type === 'sale' ? 'Venta' : property.operation_type === 'rent' ? 'Alquiler' : 'Alquiler Temporario';

  const message = `¡Hola Adelina! Vi en tu web la propiedad *"${property.title}"* (${op} - ${price} en ${property.location_neighborhood}, ${property.location_city}) y me gustaría recibir más información o coordinar una visita. Código/Ref: ${property.slug}`;

  return `https://wa.me/${ADELINA_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a generic WhatsApp link for contact / general inquiry / valuation
 */
export function getWhatsAppGeneralUrl(topic = 'Asesoramiento inmobiliario'): string {
  const message = `¡Hola Adelina! Me comunico desde tu web para consultar sobre: *${topic}*.`;
  return `https://wa.me/${ADELINA_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate formatted text for real estate agents / WhatsApp groups (Ficha Colega / Venta Compartida)
 */
export function generateColleagueWhatsAppText(property: Property, colleagueShareUrl: string): string {
  const price = property.currency === 'USD' 
    ? `USD $${(property.price_usd || 0).toLocaleString('es-AR')}`
    : `$${(property.price_ars || 0).toLocaleString('es-AR')}`;

  const op = property.operation_type === 'sale' ? 'VENTA' : 'ALQUILER';
  const typeMap: Record<string, string> = {
    house: 'CASA',
    apartment: 'DEPARTAMENTO',
    land: 'TERRENO / LOTE',
    commercial: 'LOCAL COMERCIAL',
    field: 'CAMPO',
    duplex: 'DUPLEX',
    office: 'OFICINA',
    other: 'INMUEBLE'
  };

  const pType = typeMap[property.property_type] || 'PROPIEDAD';

  return `🏡 *NUEVA OPORTUNIDAD EN ${op} | ${pType}*
📍 *Ubicación:* ${property.location_neighborhood}, ${property.location_city}
💰 *Valor:* ${price}

📐 *Superficie:* ${property.total_area_sqm} m² totales (${property.covered_area_sqm} m² cubiertos)
🛏️ *Ambientes:* ${property.bedrooms} Dormitorios | 🚿 ${property.bathrooms} Baños | 🚗 ${property.garages} Cochera(s)

✨ *Detalles:*
${property.amenities.slice(0, 5).map(a => `• ${a}`).join('\n')}

🔗 *Ficha para compartir con tu cliente (Sin datos de contacto / Marca Blanca):*
${colleagueShareUrl}

🤝 *Venta Compartida 50/50 disponible.* Consultas directas al privado para coordinar visitas.`;
}
