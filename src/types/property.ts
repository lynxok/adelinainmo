export type OperationType = 'sale' | 'rent' | 'temporary_rent';
export type KnownPropertyType = 'house' | 'apartment' | 'land' | 'commercial' | 'field' | 'duplex' | 'office' | 'other' | 'casas' | 'departamentos' | 'lotes' | 'cocheras' | 'quintas';
export type PropertyType = KnownPropertyType | (string & {});
export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'hidden';

export interface PropertyCategory {
  id: string;
  name: string; // ej. "Casas", "Departamentos", "Lotes", "Cocheras", "Quintas"
  slug: string; // ej. "casas", "departamentos", "lotes", "cocheras", "quintas"
  description?: string;
  order?: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  operation_type: OperationType;
  property_type: PropertyType;
  price_usd?: number;
  price_ars?: number;
  currency: 'USD' | 'ARS';
  location_city: string;
  location_neighborhood: string;
  address_approx: string; // Ex: "Zona Parque Urquiza" or "Av. Rivadavia al 200"
  bedrooms: number;
  bathrooms: number;
  garages: number;
  covered_area_sqm: number;
  total_area_sqm: number;
  amenities: string[];
  images: string[];
  featured_image?: string;
  is_featured: boolean;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  property_id?: string;
  property_title?: string;
  full_name: string;
  phone: string;
  email?: string;
  message: string;
  source: 'web_form' | 'whatsapp_click' | 'colleague_referral' | 'valuation_request';
  status: 'new' | 'contacted' | 'closed' | 'discarded';
  created_at: string;
}

export interface PropertyFilter {
  operation?: OperationType | 'all';
  type?: PropertyType | 'all';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'all';
  searchQuery?: string;
}
