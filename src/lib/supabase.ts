import { createClient } from '@supabase/supabase-js';
import { Property, Lead, PropertyCategory } from '../types/property';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase-adelina.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const isLiveSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://mock-supabase-adelina.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// SEED DATA DIRECTLY FROM FIGMA ASSETS
// ==========================================
const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Casa en Barrio Privado',
    slug: 'casa-en-barrio-privado-parana',
    description: 'Excelente propiedad de diseño contemporáneo ubicada en exclusivo barrio privado de Paraná. Cuenta con amplios ambientes integrados, cocina gourmet con isla, galería techada con asador, piscina con solárium y jardín parquizado. Terminaciones de primera categoría con aberturas DVH y calefacción central.',
    operation_type: 'sale',
    property_type: 'casas',
    price_usd: 185000,
    currency: 'USD',
    location_city: 'Paraná',
    location_neighborhood: 'Barrio Privado',
    address_approx: 'Zona Acceso Norte, Barrio Privado',
    bedrooms: 3,
    bathrooms: 3,
    garages: 2,
    covered_area_sqm: 220,
    total_area_sqm: 650,
    amenities: ['Piscina', 'Quincho / Asador', 'Seguridad 24hs', 'Cochera doble', 'Calefacción central', 'Jardín parquizado', 'Vestidor en suite'],
    images: [
      '/assets/property-house-private.jpg',
      '/assets/chic-living.jpg',
      '/assets/hero-living.jpg'
    ],
    featured_image: '/assets/property-house-private.jpg',
    is_featured: true,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prop-2',
    title: 'Departamento Centro con Vista',
    slug: 'departamento-centro-parana',
    description: 'Impecable departamento de categoría en pleno microcentro de Paraná. Luminoso living comedor con balcón aterrazado y vistas abiertas a la ciudad. Dos dormitorios (principal en suite con vestidor), cocina independiente equipada y cochera cubierta en subsuelo.',
    operation_type: 'sale',
    property_type: 'departamentos',
    price_usd: 120000,
    currency: 'USD',
    location_city: 'Paraná',
    location_neighborhood: 'Centro',
    address_approx: 'Zona Casa de Gobierno / Plaza 1° de Mayo',
    bedrooms: 2,
    bathrooms: 2,
    garages: 1,
    covered_area_sqm: 88,
    total_area_sqm: 98,
    amenities: ['Balcón aterrazado', 'Cochera cubierta', 'Ascensor', 'Seguridad por cámara', 'SUM con parrilla', 'Placares e interiores completos'],
    images: [
      '/assets/property-dept-center.jpg',
      '/assets/hero-living.jpg',
      '/assets/chic-living.jpg'
    ],
    featured_image: '/assets/property-dept-center.jpg',
    is_featured: true,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prop-3',
    title: 'Terreno / Lote Residencial',
    slug: 'terreno-lote-colonia-avellaneda',
    description: 'Gran lote residencial con entorno natural consolidado y excelente orientación solar. Servicios subterráneos de agua corriente, tendido eléctrico y alumbrado público. Ideal para desarrollo familiar o inversión con alto potencial de revalorización.',
    operation_type: 'sale',
    property_type: 'lotes',
    price_usd: 38000,
    currency: 'USD',
    location_city: 'Colonia Avellaneda',
    location_neighborhood: 'Zona Residencial',
    address_approx: 'A metros de acceso principal, Colonia Avellaneda',
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    covered_area_sqm: 0,
    total_area_sqm: 540,
    amenities: ['Servicios de agua y luz', 'Alumbrado público', 'Escrituración inmediata', 'Calle pavimentada', 'Entorno consolidado'],
    images: [
      '/assets/property-land-lot.jpg',
      '/assets/office-sign.jpg'
    ],
    featured_image: '/assets/property-land-lot.jpg',
    is_featured: true,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prop-4',
    title: 'Casa Quinta con Parque y Piscina',
    slug: 'casa-quinta-parque-piscina',
    description: 'Propiedad ideal para descanso o vivienda permanente. Amplia galería perimetral, quincho cerrado para 30 personas con asador, horno a leña y pileta de 10x4 metros. Arboleda añeja y parque totalmente cercado.',
    operation_type: 'sale',
    property_type: 'quintas',
    price_usd: 145000,
    currency: 'USD',
    location_city: 'Paraná',
    location_neighborhood: 'Acceso Este',
    address_approx: 'Zona Parque Industrial / Acceso Este',
    bedrooms: 3,
    bathrooms: 2,
    garages: 3,
    covered_area_sqm: 180,
    total_area_sqm: 1200,
    amenities: ['Gran piscina', 'Quincho cerrado', 'Horno a leña', 'Arboleda añeja', 'Portón automatizado'],
    images: [
      '/assets/chic-living.jpg',
      '/assets/property-house-private.jpg'
    ],
    featured_image: '/assets/chic-living.jpg',
    is_featured: false,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prop-5',
    title: 'Cochera Cubierta en Microcentro',
    slug: 'cochera-cubierta-microcentro-parana',
    description: 'Cochera fija cubierta con portón automatizado a control remoto y cámaras de seguridad 24 hs en pleno microcentro de Paraná. Excelente maniobrabilidad.',
    operation_type: 'sale',
    property_type: 'cocheras',
    price_usd: 12000,
    currency: 'USD',
    location_city: 'Paraná',
    location_neighborhood: 'Centro',
    address_approx: 'Zona Microcentro / Peatonal San Martín',
    bedrooms: 0,
    bathrooms: 0,
    garages: 1,
    covered_area_sqm: 14,
    total_area_sqm: 14,
    amenities: ['Portón automatizado', 'Seguridad 24hs', 'Fácil acceso'],
    images: [
      '/assets/hero-living.jpg',
      '/assets/property-dept-center.jpg'
    ],
    featured_image: '/assets/hero-living.jpg',
    is_featured: false,
    status: 'available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const STORAGE_PROPERTIES_KEY = 'adelina_properties_data_v1';
const STORAGE_LEADS_KEY = 'adelina_leads_data_v1';

// Service layer for Properties (syncs with local storage and Supabase)
export const propertyService = {
  getProperties(): Property[] {
    const raw = localStorage.getItem(STORAGE_PROPERTIES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(INITIAL_PROPERTIES));
      return INITIAL_PROPERTIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROPERTIES;
    }
  },

  getPropertyBySlug(slug: string): Property | undefined {
    const properties = this.getProperties();
    return properties.find(p => p.slug === slug || p.id === slug);
  },

  saveProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Property {
    const properties = this.getProperties();
    const now = new Date().toISOString();

    if (property.id) {
      // Update
      const index = properties.findIndex(p => p.id === property.id);
      if (index >= 0) {
        const updated: Property = {
          ...properties[index],
          ...property,
          id: property.id,
          updated_at: now,
        };
        properties[index] = updated;
        localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
        return updated;
      }
    }

    // Create New
    const newProperty: Property = {
      ...property,
      id: 'prop-' + Date.now(),
      slug: property.slug || property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000),
      created_at: now,
      updated_at: now,
    };

    properties.unshift(newProperty);
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
    return newProperty;
  },

  deleteProperty(id: string): boolean {
    const properties = this.getProperties();
    const filtered = properties.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(filtered));
    return true;
  },

  toggleFeatured(id: string): boolean {
    const properties = this.getProperties();
    const p = properties.find(item => item.id === id);
    if (p) {
      p.is_featured = !p.is_featured;
      p.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
      return true;
    }
    return false;
  },

  updateStatus(id: string, status: Property['status']): boolean {
    const properties = this.getProperties();
    const p = properties.find(item => item.id === id);
    if (p) {
      p.status = status;
      p.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
      return true;
    }
    return false;
  }
};

// Service layer for Leads
export const leadService = {
  getLeads(): Lead[] {
    const raw = localStorage.getItem(STORAGE_LEADS_KEY);
    if (!raw) {
      const initialLeads: Lead[] = [
        {
          id: 'lead-1',
          property_id: 'prop-1',
          property_title: 'Casa en Barrio Privado',
          full_name: 'Martín Almada',
          phone: '+54 9 343 456-7890',
          email: 'martin.almada@gmail.com',
          message: 'Hola Adelina, me interesa conocer las expensas aproximadas del barrio y si aceptan propiedad de menor valor en parte de pago.',
          source: 'web_form',
          status: 'new',
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 'lead-2',
          property_id: 'prop-2',
          property_title: 'Departamento Centro con Vista',
          full_name: 'Carolina Benítez',
          phone: '+54 9 343 512-3456',
          email: 'caro.benitez@hotmail.com',
          message: 'Buenas tardes! Quisiera coordinar una visita para este viernes por la tarde.',
          source: 'whatsapp_click',
          status: 'contacted',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        }
      ];
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(initialLeads));
      return initialLeads;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  createLead(lead: Omit<Lead, 'id' | 'created_at' | 'status'>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: 'lead-' + Date.now(),
      status: 'new',
      created_at: new Date().toISOString(),
    };
    leads.unshift(newLead);
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    return newLead;
  },

  updateLeadStatus(id: string, status: Lead['status']): void {
    const leads = this.getLeads();
    const l = leads.find(item => item.id === id);
    if (l) {
      l.status = status;
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    }
  }
};

// ==========================================
// CATEGORIES SERVICE & HELPERS
// ==========================================
const STORAGE_CATEGORIES_KEY = 'adelina_categories_data_v1';

export const INITIAL_CATEGORIES: PropertyCategory[] = [
  { id: 'cat-casas', name: 'Casas', slug: 'casas', description: 'Casas y residencias en zonas urbanas y barrios cerrados', order: 1 },
  { id: 'cat-deptos', name: 'Departamentos', slug: 'departamentos', description: 'Departamentos de categoría céntricos y residenciales', order: 2 },
  { id: 'cat-lotes', name: 'Lotes', slug: 'lotes', description: 'Terrenos, lotes en loteos y desarrollos', order: 3 },
  { id: 'cat-cocheras', name: 'Cocheras', slug: 'cocheras', description: 'Cocheras y espacios de guardado cubiertos', order: 4 },
  { id: 'cat-quintas', name: 'Quintas', slug: 'quintas', description: 'Casas quintas de fin de semana y chacras con parque', order: 5 },
];

export const notifyCategoriesChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adelina-categories-changed'));
  }
};

export const categoryService = {
  getCategories(): PropertyCategory[] {
    const raw = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategory(cat: Omit<PropertyCategory, 'id' | 'slug'> & { id?: string; slug?: string }): PropertyCategory {
    const categories = this.getCategories();
    const slug = (cat.slug || cat.name)
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (cat.id) {
      const index = categories.findIndex(c => c.id === cat.id);
      if (index >= 0) {
        const updated: PropertyCategory = {
          ...categories[index],
          name: cat.name.trim(),
          slug,
          description: cat.description,
        };
        categories[index] = updated;
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
        notifyCategoriesChanged();
        return updated;
      }
    }

    const newCategory: PropertyCategory = {
      id: 'cat-' + Date.now(),
      name: cat.name.trim(),
      slug,
      description: cat.description,
      order: categories.length + 1,
    };
    categories.push(newCategory);
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    notifyCategoriesChanged();
    return newCategory;
  },

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(filtered));
    notifyCategoriesChanged();
    return true;
  },

  resetToDefaults(): PropertyCategory[] {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    notifyCategoriesChanged();
    return INITIAL_CATEGORIES;
  }
};

/**
 * Matches a property's type against a selected category filter slug,
 * supporting legacy English keys and normalized slugs.
 */
export const matchesPropertyCategory = (propertyType: string, categoryFilter: string): boolean => {
  if (!categoryFilter || categoryFilter === 'all') return true;

  const propNorm = (propertyType || '').toLowerCase().trim();
  const filterNorm = categoryFilter.toLowerCase().trim();

  if (propNorm === filterNorm) return true;

  // Legacy mappings for backwards compatibility
  const legacyAliases: Record<string, string[]> = {
    casas: ['casas', 'house', 'casa'],
    departamentos: ['departamentos', 'apartment', 'depto', 'departamento'],
    lotes: ['lotes', 'land', 'lote', 'terreno', 'terrenos'],
    cocheras: ['cocheras', 'cochera', 'garage'],
    quintas: ['quintas', 'quinta', 'field', 'casa quinta', 'campo'],
  };

  const allowed = legacyAliases[filterNorm];
  if (allowed && allowed.includes(propNorm)) {
    return true;
  }

  // Reverse check: if filter is legacy english and prop is spanish
  for (const [canonical, aliases] of Object.entries(legacyAliases)) {
    if (canonical === filterNorm || aliases.includes(filterNorm)) {
      if (aliases.includes(propNorm) || canonical === propNorm) return true;
    }
  }

  return false;
};

/**
 * Returns a human-friendly display label for any property type.
 */
export const getPropertyTypeLabel = (type: string, categories: PropertyCategory[] = []): string => {
  if (!type) return 'Inmueble';

  const cat = categories.find(
    c => c.slug.toLowerCase() === type.toLowerCase() || c.name.toLowerCase() === type.toLowerCase()
  );
  if (cat) return cat.name;

  const legacyLabels: Record<string, string> = {
    casas: 'Casa',
    house: 'Casa',
    departamentos: 'Departamento',
    apartment: 'Departamento',
    lotes: 'Lote / Terreno',
    land: 'Lote / Terreno',
    cocheras: 'Cochera',
    quintas: 'Quinta',
    field: 'Campo / Quinta',
    commercial: 'Local Comercial',
    duplex: 'Duplex',
    office: 'Oficina',
    other: 'Inmueble',
  };

  return legacyLabels[type.toLowerCase()] || type;
};
