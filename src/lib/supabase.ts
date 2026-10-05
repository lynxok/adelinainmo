import { createClient } from '@supabase/supabase-js';
import { Property, Lead, PropertyCategory, UserProfile, UserRole } from '../types/property';
import { Testimonial } from '../types/testimonial';
import { compressImageToWebP } from './imageCompressor';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase-adelina.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const isLiveSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://mock-supabase-adelina.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const safeExecute = async (operation: PromiseLike<any>) => {
  try {
    const res = await operation;
    if (res && typeof res === 'object' && 'error' in res && res.error) {
      console.error('Supabase query error:', res.error);
    }
    return res;
  } catch (err) {
    console.error('Supabase execution error:', err);
  }
};

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

const STORAGE_PROPERTIES_KEY = 'adelina_properties_data_v2';
const STORAGE_LEADS_KEY = 'adelina_leads_data_v1';
const STORAGE_CATEGORIES_KEY = 'adelina_categories_data_v1';
const STORAGE_TESTIMONIALS_KEY = 'adelina_testimonials_data';

// Custom Event dispatchers for reactive synchronization
export const notifyPropertiesChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adelina-properties-changed'));
  }
};

export const notifyCategoriesChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adelina-categories-changed'));
  }
};

export const notifyTestimonialsChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adelina-testimonials-changed'));
  }
};

export const notifyLeadsChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('adelina-leads-changed'));
  }
};

// ==========================================
// STORAGE SERVICE: SUPABASE STORAGE UPLOADER
// ==========================================
export const uploadImageToSupabase = async (
  file: File,
  folder = 'properties'
): Promise<string> => {
  try {
    const { file: webpFile, dataUrl } = await compressImageToWebP(file);

    if (!isLiveSupabase) {
      return dataUrl;
    }

    const sanitizedName = file.name
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const path = `${folder}/${Date.now()}-${sanitizedName}.webp`;

    const { data, error } = await supabase.storage
      .from('adelina-media')
      .upload(path, webpFile, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });

    if (error) {
      console.warn('Storage upload error, falling back to WebP dataUrl:', error);
      return dataUrl;
    }

    const { data: publicUrlData } = supabase.storage
      .from('adelina-media')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Error in uploadImageToSupabase:', err);
    const { dataUrl } = await compressImageToWebP(file);
    return dataUrl;
  }
};

// ==========================================
// PROPERTIES SERVICE (Supabase + Local Cache)
// ==========================================
export const propertyService = {
  getProperties(): Property[] {
    const raw = localStorage.getItem(STORAGE_PROPERTIES_KEY);
    if (!raw) {
      if (isLiveSupabase) {
        this.fetchProperties();
      }
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Discard any legacy demo mock items (prop-1, prop-2, etc.)
        const realItems = parsed.filter(p => !['prop-1', 'prop-2', 'prop-3', 'prop-4', 'prop-5'].includes(p.id));
        return realItems;
      }
      return [];
    } catch {
      return [];
    }
  },

  async fetchProperties(): Promise<Property[]> {
    if (!isLiveSupabase) return this.getProperties();
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties from Supabase:', error);
        return this.getProperties();
      }

      if (data && data.length > 0) {
        localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(data));
        notifyPropertiesChanged();
        return data as Property[];
      }
      return this.getProperties();
    } catch (err) {
      console.error('Unexpected error fetching properties:', err);
      return this.getProperties();
    }
  },

  getPropertyBySlug(slug: string): Property | undefined {
    const properties = this.getProperties();
    return properties.find(p => p.slug === slug || p.id === slug);
  },

  async saveProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<Property> {
    const properties = this.getProperties();
    const now = new Date().toISOString();

    let targetProperty: Property;

    if (property.id) {
      // Update
      const index = properties.findIndex(p => p.id === property.id);
      if (index >= 0) {
        targetProperty = {
          ...properties[index],
          ...property,
          id: property.id,
          updated_at: now,
        };
        properties[index] = targetProperty;
      } else {
        targetProperty = {
          ...property,
          id: property.id,
          created_at: now,
          updated_at: now,
        } as Property;
        properties.unshift(targetProperty);
      }
    } else {
      // Create New
      const generatedSlug = property.slug || property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);
      targetProperty = {
        ...property,
        id: 'prop-' + Date.now(),
        slug: generatedSlug,
        created_at: now,
        updated_at: now,
      } as Property;
      properties.unshift(targetProperty);
    }

    // Sync with Supabase first if online
    if (isLiveSupabase) {
      const { error } = await supabase.from('properties').upsert(targetProperty);
      if (error) {
        console.error('Error saving property to Supabase:', error);
        throw new Error(error.message || 'Error al guardar la propiedad en la base de datos');
      }
    }

    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
    notifyPropertiesChanged();

    return targetProperty;
  },

  deleteProperty(id: string): boolean {
    const properties = this.getProperties();
    const filtered = properties.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(filtered));
    notifyPropertiesChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('properties').delete().eq('id', id));
    }

    return true;
  },

  toggleFeatured(id: string): boolean {
    const properties = this.getProperties();
    const p = properties.find(item => item.id === id);
    if (p) {
      p.is_featured = !p.is_featured;
      p.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
      notifyPropertiesChanged();

      if (isLiveSupabase) {
        safeExecute(
          supabase
            .from('properties')
            .update({ is_featured: p.is_featured, updated_at: p.updated_at })
            .eq('id', id)
        );
      }
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
      notifyPropertiesChanged();

      if (isLiveSupabase) {
        safeExecute(
          supabase
            .from('properties')
            .update({ status: p.status, updated_at: p.updated_at })
            .eq('id', id)
        );
      }
      return true;
    }
    return false;
  }
};

// ==========================================
// LEADS SERVICE (Supabase + Local Cache)
// ==========================================
export const leadService = {
  getLeads(): Lead[] {
    const raw = localStorage.getItem(STORAGE_LEADS_KEY);
    if (!raw) {
      if (isLiveSupabase) {
        localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify([]));
        this.fetchLeads();
        return [];
      }
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async fetchLeads(): Promise<Lead[]> {
    if (!isLiveSupabase) return this.getLeads();
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads from Supabase:', error);
        return this.getLeads();
      }

      if (data) {
        localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(data));
        return data as Lead[];
      }
      return this.getLeads();
    } catch (err) {
      console.error('Unexpected error fetching leads:', err);
      return this.getLeads();
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
    notifyLeadsChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('leads').insert(newLead));
    }

    return newLead;
  },

  updateLeadStatus(id: string, status: Lead['status']): void {
    const leads = this.getLeads();
    const l = leads.find(item => item.id === id);
    if (l) {
      l.status = status;
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
      notifyLeadsChanged();

      if (isLiveSupabase) {
        safeExecute(supabase.from('leads').update({ status }).eq('id', id));
      }
    }
  },

  deleteLead(id: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(filtered));
    notifyLeadsChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('leads').delete().eq('id', id));
    }

    return true;
  }
};

// ==========================================
// CATEGORIES SERVICE & HELPERS
// ==========================================
export const INITIAL_CATEGORIES: PropertyCategory[] = [
  { id: 'cat-casas', name: 'Casas', slug: 'casas', description: 'Casas y residencias en zonas urbanas y barrios cerrados', order: 1 },
  { id: 'cat-deptos', name: 'Departamentos', slug: 'departamentos', description: 'Departamentos de categoría céntricos y residenciales', order: 2 },
  { id: 'cat-lotes', name: 'Lotes', slug: 'lotes', description: 'Terrenos, lotes en loteos y desarrollos', order: 3 },
  { id: 'cat-cocheras', name: 'Cocheras', slug: 'cocheras', description: 'Cocheras y espacios de guardado cubiertos', order: 4 },
  { id: 'cat-quintas', name: 'Quintas', slug: 'quintas', description: 'Casas quintas de fin de semana y chacras con parque', order: 5 },
];

export const categoryService = {
  getCategories(): PropertyCategory[] {
    const raw = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      if (isLiveSupabase) {
        this.fetchCategories();
      }
      return INITIAL_CATEGORIES;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  async fetchCategories(): Promise<PropertyCategory[]> {
    if (!isLiveSupabase) return this.getCategories();
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching categories from Supabase:', error);
        return this.getCategories();
      }

      if (data && data.length > 0) {
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(data));
        return data as PropertyCategory[];
      }
      return this.getCategories();
    } catch (err) {
      console.error('Unexpected error fetching categories:', err);
      return this.getCategories();
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

    let savedCat: PropertyCategory;

    if (cat.id) {
      const index = categories.findIndex(c => c.id === cat.id);
      if (index >= 0) {
        savedCat = {
          ...categories[index],
          name: cat.name.trim(),
          slug,
          description: cat.description,
        };
        categories[index] = savedCat;
      } else {
        savedCat = {
          id: cat.id,
          name: cat.name.trim(),
          slug,
          description: cat.description,
          order: categories.length + 1,
        };
        categories.push(savedCat);
      }
    } else {
      savedCat = {
        id: 'cat-' + Date.now(),
        name: cat.name.trim(),
        slug,
        description: cat.description,
        order: categories.length + 1,
      };
      categories.push(savedCat);
    }

    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    notifyCategoriesChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('categories').upsert(savedCat));
    }

    return savedCat;
  },

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(filtered));
    notifyCategoriesChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('categories').delete().eq('id', id));
    }

    return true;
  },

  resetToDefaults(): PropertyCategory[] {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    notifyCategoriesChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('categories').upsert(INITIAL_CATEGORIES));
    }

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

// ==========================================
// TESTIMONIALS SERVICE & PERSISTENCE
// ==========================================
const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    client_name: 'Ero Wals',
    client_role: 'Operational Leads',
    quote: '“Since using this platform, our team’s productivity has increased significantly. Processes that were previously manual can now be automated”',
    rating: 5,
    date: '12/05/2026',
    platform: 'google',
    is_active: true,
    order_index: 1,
    created_at: new Date('2026-05-12').toISOString(),
  },
  {
    id: 'test-2',
    client_name: 'María Eugenia R.',
    client_role: 'Compradora Depto. Centro',
    quote: '“Excelente acompañamiento y transparencia en cada paso de la compra. Encontraron exactamente lo que buscábamos para nuestra familia con total profesionalismo.”',
    rating: 5,
    date: '04/06/2026',
    platform: 'google',
    is_active: true,
    order_index: 2,
    created_at: new Date('2026-06-04').toISOString(),
  },
  {
    id: 'test-3',
    client_name: 'Martín Sbarbaro',
    client_role: 'Inversor Residencial',
    quote: '“El asesoramiento inmobiliario fue impecable. La tasación y el análisis del mercado nos permitieron tomar la mejor decisión de inversión con rentabilidad asegurada.”',
    rating: 5,
    date: '18/07/2026',
    platform: 'whatsapp',
    is_active: true,
    order_index: 3,
    created_at: new Date('2026-07-18').toISOString(),
  },
  {
    id: 'test-4',
    client_name: 'Lucía Fernández',
    client_role: 'Propietaria - Venta Casa Quinta',
    quote: '“Vendimos nuestra propiedad en tiempo récord y sin contratiempos. La calidad de las fotos y la difusión fue superadora. Muy agradecida con todo el equipo de Adelina.”',
    rating: 5,
    date: '22/08/2026',
    platform: 'instagram',
    is_active: true,
    order_index: 4,
    created_at: new Date('2026-08-22').toISOString(),
  },
];

export const testimonialService = {
  getTestimonials(): Testimonial[] {
    const raw = localStorage.getItem(STORAGE_TESTIMONIALS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
      if (isLiveSupabase) {
        this.fetchTestimonials();
      }
      return INITIAL_TESTIMONIALS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
      return INITIAL_TESTIMONIALS;
    } catch (e) {
      console.error('Error parsing testimonials:', e);
      return INITIAL_TESTIMONIALS;
    }
  },

  getActiveTestimonials(): Testimonial[] {
    const all = this.getTestimonials();
    return all.filter(t => t.is_active !== false);
  },

  async fetchTestimonials(): Promise<Testimonial[]> {
    if (!isLiveSupabase) return this.getTestimonials();
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching testimonials from Supabase:', error);
        return this.getTestimonials();
      }

      if (data && data.length > 0) {
        localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(data));
        return data as Testimonial[];
      }
      return this.getTestimonials();
    } catch (err) {
      console.error('Unexpected error fetching testimonials:', err);
      return this.getTestimonials();
    }
  },

  saveTestimonial(testData: Partial<Testimonial> & { client_name: string; quote: string }): Testimonial {
    const testimonials = this.getTestimonials();
    const nowIso = new Date().toISOString();

    let target: Testimonial;

    if (testData.id) {
      const index = testimonials.findIndex(t => t.id === testData.id);
      if (index >= 0) {
        target = {
          ...testimonials[index],
          client_name: testData.client_name.trim(),
          client_role: (testData.client_role || 'Cliente').trim(),
          quote: testData.quote.trim(),
          rating: typeof testData.rating === 'number' ? Math.min(5, Math.max(1, testData.rating)) : 5,
          date: testData.date || testimonials[index].date || new Date().toLocaleDateString('es-AR'),
          platform: testData.platform || testimonials[index].platform || 'google',
          avatar_url: testData.avatar_url || '',
          is_active: testData.is_active !== undefined ? testData.is_active : testimonials[index].is_active,
          order_index: testData.order_index ?? testimonials[index].order_index ?? (index + 1),
        };
        testimonials[index] = target;
      } else {
        target = {
          id: testData.id,
          client_name: testData.client_name.trim(),
          client_role: (testData.client_role || 'Cliente').trim(),
          quote: testData.quote.trim(),
          rating: typeof testData.rating === 'number' ? Math.min(5, Math.max(1, testData.rating)) : 5,
          date: testData.date || new Date().toLocaleDateString('es-AR'),
          platform: testData.platform || 'google',
          avatar_url: testData.avatar_url || '',
          is_active: testData.is_active !== undefined ? testData.is_active : true,
          order_index: testimonials.length + 1,
          created_at: nowIso,
        };
        testimonials.unshift(target);
      }
    } else {
      target = {
        id: 'test-' + Date.now(),
        client_name: testData.client_name.trim(),
        client_role: (testData.client_role || 'Cliente').trim(),
        quote: testData.quote.trim(),
        rating: typeof testData.rating === 'number' ? Math.min(5, Math.max(1, testData.rating)) : 5,
        date: testData.date || new Date().toLocaleDateString('es-AR'),
        platform: testData.platform || 'google',
        avatar_url: testData.avatar_url || '',
        is_active: testData.is_active !== undefined ? testData.is_active : true,
        order_index: testimonials.length + 1,
        created_at: nowIso,
      };
      testimonials.unshift(target);
    }

    localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonials));
    notifyTestimonialsChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('testimonials').upsert(target));
    }

    return target;
  },

  toggleActive(id: string): boolean {
    const testimonials = this.getTestimonials();
    const index = testimonials.findIndex(t => t.id === id);
    if (index >= 0) {
      testimonials[index].is_active = !testimonials[index].is_active;
      const updatedActive = testimonials[index].is_active;
      localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonials));
      notifyTestimonialsChanged();

      if (isLiveSupabase) {
        safeExecute(
          supabase
            .from('testimonials')
            .update({ is_active: updatedActive })
            .eq('id', id)
        );
      }

      return updatedActive;
    }
    return false;
  },

  deleteTestimonial(id: string): boolean {
    const testimonials = this.getTestimonials();
    const filtered = testimonials.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(filtered));
    notifyTestimonialsChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('testimonials').delete().eq('id', id));
    }

    return true;
  },

  resetToDefaults(): Testimonial[] {
    localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
    notifyTestimonialsChanged();

    if (isLiveSupabase) {
      safeExecute(supabase.from('testimonials').upsert(INITIAL_TESTIMONIALS));
    }

    return INITIAL_TESTIMONIALS;
  }
};

// ==========================================
// AUTHENTICATION & PROFILES SERVICE
// ==========================================
export const authService = {
  async login(email: string, password: string): Promise<{ user: any; profile: UserProfile | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (error) throw error;

    let profile: UserProfile | null = null;
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileData) {
      profile = profileData as UserProfile;
    } else {
      profile = {
        id: data.user.id,
        email: data.user.email || '',
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
        role: (data.user.user_metadata?.role as UserRole) || 'corredor',
      };
    }

    localStorage.setItem('adelina_admin_auth', 'true');
    localStorage.setItem('adelina_user_profile', JSON.stringify(profile));
    return { user: data.user, profile };
  },

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out from Supabase:', err);
    }
    localStorage.removeItem('adelina_admin_auth');
    localStorage.removeItem('adelina_user_profile');
  },

  getCurrentProfile(): UserProfile | null {
    const raw = localStorage.getItem('adelina_user_profile');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async fetchCurrentProfile(): Promise<UserProfile | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) return this.getCurrentProfile();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();

    if (profile) {
      localStorage.setItem('adelina_user_profile', JSON.stringify(profile));
      return profile as UserProfile;
    }
    return this.getCurrentProfile();
  },

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  getStoredProfiles(): UserProfile[] {
    const raw = localStorage.getItem('adelina_cached_profiles');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async getProfiles(): Promise<UserProfile[]> {
    if (isLiveSupabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data) {
        localStorage.setItem('adelina_cached_profiles', JSON.stringify(data));
        return data as UserProfile[];
      }
    }
    return this.getStoredProfiles();
  },

  async createUser({
    email,
    password,
    fullName,
    role,
  }: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }): Promise<UserProfile> {
    const currentProfile = this.getCurrentProfile();
    if (currentProfile?.role !== 'superadmin') {
      throw new Error('Solo los usuarios con rol Superadmin tienen permisos para crear nuevos usuarios.');
    }

    if (!email || !password || !fullName) {
      throw new Error('Por favor completá todos los campos obligatorios.');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    if (isLiveSupabase) {
      // Cliente aislado sin persistencia de sesión para no alterar la sesión del superadmin logueado
      const isolatedClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data, error } = await isolatedClient.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName.trim(),
            role: role,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('No se pudo registrar el usuario en Supabase Auth.');
      }

      const newProfile: UserProfile = {
        id: data.user.id,
        email: email.trim(),
        full_name: fullName.trim(),
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Asegurar sincronización en public.profiles
      await supabase.from('profiles').upsert(newProfile);

      const existing = this.getStoredProfiles();
      localStorage.setItem('adelina_cached_profiles', JSON.stringify([...existing.filter(p => p.id !== newProfile.id), newProfile]));

      return newProfile;
    } else {
      const mockProfile: UserProfile = {
        id: `mock-user-${Date.now()}`,
        email: email.trim(),
        full_name: fullName.trim(),
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const existing = this.getStoredProfiles();
      localStorage.setItem('adelina_cached_profiles', JSON.stringify([...existing, mockProfile]));
      return mockProfile;
    }
  },

  async deleteProfile(userId: string): Promise<void> {
    const currentProfile = this.getCurrentProfile();
    if (currentProfile?.role !== 'superadmin') {
      throw new Error('Solo los usuarios Superadmin pueden eliminar usuarios.');
    }
    if (currentProfile.id === userId) {
      throw new Error('No podés eliminar tu propia cuenta activa de Superadmin.');
    }

    if (isLiveSupabase) {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
    }

    const existing = this.getStoredProfiles();
    const updated = existing.filter((p) => p.id !== userId);
    localStorage.setItem('adelina_cached_profiles', JSON.stringify(updated));
  },

  async updateRole(userId: string, role: UserRole): Promise<void> {
    const currentProfile = this.getCurrentProfile();
    if (currentProfile?.role !== 'superadmin') {
      throw new Error('Solo los usuarios Superadmin pueden modificar roles.');
    }
    if (currentProfile.id === userId && role !== 'superadmin') {
      throw new Error('No podés revocar tus propios privilegios de Superadmin.');
    }

    if (isLiveSupabase) {
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      if (error) throw error;
    }

    const existing = this.getStoredProfiles();
    const updated = existing.map((p) => (p.id === userId ? { ...p, role } : p));
    localStorage.setItem('adelina_cached_profiles', JSON.stringify(updated));
  }
};

// Initial background sync
if (typeof window !== 'undefined' && isLiveSupabase) {
  setTimeout(() => {
    propertyService.fetchProperties();
    categoryService.fetchCategories();
    testimonialService.fetchTestimonials();
    leadService.fetchLeads();
  }, 100);
}

