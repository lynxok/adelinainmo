import { Property, Lead, PropertyCategory, UserProfile, UserRole } from '../types/property';
import { Testimonial } from '../types/testimonial';
import { compressImageToWebP } from './imageCompressor';
import seedDbRaw from './seed_db.json';

// =========================================================================
// HOSTINGER NATIVE DATABASE & STORAGE CONFIG (0% SUPABASE DEPENDENCY)
// =========================================================================
const HOSTINGER_ORIGIN = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? window.location.origin
  : 'https://adelinainmo.lnx.com.ar';

const HOSTINGER_UPLOAD_URL = `${HOSTINGER_ORIGIN}/upload.php`;
const HOSTINGER_API_URL = `${HOSTINGER_ORIGIN}/api.php`;

const SESSION_TOKEN_KEY = 'adelina_admin_token';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function setAdminToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
  }
}

export const isLiveSupabase = true;
export const supabase = null as any;

const SEED_PROPERTIES: Property[] = (seedDbRaw.properties || []) as Property[];
const SEED_CATEGORIES: PropertyCategory[] = (seedDbRaw.categories || []) as PropertyCategory[];
const SEED_TESTIMONIALS: Testimonial[] = (seedDbRaw.testimonials || []) as Testimonial[];
const SEED_PROFILES: UserProfile[] = [];

const STORAGE_PROPERTIES_KEY = 'adelina_properties_data_v2';
const STORAGE_LEADS_KEY = 'adelina_leads_data_v1';
const STORAGE_CATEGORIES_KEY = 'adelina_categories_data_v1';
const STORAGE_TESTIMONIALS_KEY = 'adelina_testimonials_data';

// Helper for Hostinger JSON API calls with Bearer Token Auth
async function callHostingerApi(
  method: 'GET' | 'POST',
  paramsOrBody: Record<string, any> = {},
  requiresAuth = false
): Promise<any> {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (method === 'GET') {
    const qs = new URLSearchParams(paramsOrBody as Record<string, string>).toString();
    const url = qs ? `${HOSTINGER_API_URL}?${qs}` : HOSTINGER_API_URL;
    const res = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API GET error: ${res.status}`);
    return res.json();
  } else {
    headers['Content-Type'] = 'application/json';
    const res = await fetch(HOSTINGER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(paramsOrBody),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `API POST error: ${res.status}`);
    }
    return data;
  }
}

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
// STORAGE SERVICE: HOSTINGER DIRECT UPLOADER
// ==========================================
export const uploadImageToSupabase = async (
  file: File,
  folder = 'properties'
): Promise<string> => {
  try {
    const { file: webpFile, dataUrl } = await compressImageToWebP(file);

    try {
      const formData = new FormData();
      formData.append('file', webpFile);
      formData.append('folder', folder);

      const token = getAdminToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(HOSTINGER_UPLOAD_URL, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.url) {
          return json.url;
        }
      }
    } catch (hostingerErr) {
      console.warn('Hostinger image upload fallback to compressed WebP dataUrl:', hostingerErr);
    }

    return dataUrl;
  } catch (err) {
    console.error('Error in uploadImageToSupabase:', err);
    const { dataUrl } = await compressImageToWebP(file);
    return dataUrl;
  }
};

// ==========================================
// PROPERTIES SERVICE (Hostinger API + Local Cache)
// ==========================================
const LEGACY_DEMO_IDS = ['prop-1', 'prop-2', 'prop-3', 'prop-4', 'prop-5'];

export const propertyService = {
  getProperties(): Property[] {
    const raw = localStorage.getItem(STORAGE_PROPERTIES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(SEED_PROPERTIES));
      return SEED_PROPERTIES;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const realItems = parsed.filter(p => p && p.id && !LEGACY_DEMO_IDS.includes(p.id));
        if (realItems.length > 0) {
          return realItems;
        }
      }
      localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(SEED_PROPERTIES));
      return SEED_PROPERTIES;
    } catch {
      return SEED_PROPERTIES;
    }
  },

  async fetchProperties(): Promise<Property[]> {
    try {
      const localItems = this.getProperties();
      const json = await callHostingerApi('GET', { table: 'properties' });
      const serverData: Property[] = Array.isArray(json?.data) ? json.data : [];

      if (serverData.length > 0) {
        const serverIds = new Set(serverData.map(p => p.id));
        // Auto-rescue any property saved locally in the browser that wasn't on the server yet
        const unsyncedLocal = localItems.filter(
          p => p.id && !LEGACY_DEMO_IDS.includes(p.id) && !serverIds.has(p.id)
        );

        if (unsyncedLocal.length > 0) {
          try {
            await callHostingerApi('POST', {
              action: 'bulk_upsert',
              table: 'properties',
              items: unsyncedLocal,
            });
          } catch (syncErr) {
            console.warn('Could not bulk sync local properties:', syncErr);
          }
        }

        const merged = [...unsyncedLocal, ...serverData].sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );

        localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(merged));
        // notifyPropertiesChanged(); // removido: lecturas no deben emitir eventos (evita bucle infinito, ver bugfix_infinite_refetch_loop)
        return merged;
      }

      return localItems;
    } catch (err) {
      console.warn('Using cached/seed properties (API unreachable):', err);
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
      const generatedSlug =
        property.slug ||
        property.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
          '-' +
          Math.floor(Math.random() * 1000);
      targetProperty = {
        ...property,
        id: 'prop-' + Date.now(),
        slug: generatedSlug,
        created_at: now,
        updated_at: now,
      } as Property;
      properties.unshift(targetProperty);
    }

    // Always persist in localStorage immediately so work is never lost
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
    notifyPropertiesChanged();

    // Persist on Hostinger API
    try {
      await callHostingerApi('POST', {
        action: 'upsert',
        table: 'properties',
        item: targetProperty,
      });
    } catch (err) {
      console.error('Error syncing property to Hostinger API (saved locally):', err);
    }

    return targetProperty;
  },

  deleteProperty(id: string): boolean {
    const properties = this.getProperties();
    const filtered = properties.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(filtered));
    notifyPropertiesChanged();

    callHostingerApi('POST', {
      action: 'delete',
      table: 'properties',
      id,
    }).catch(err => console.error('Error deleting property on Hostinger API:', err));

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

      callHostingerApi('POST', {
        action: 'upsert',
        table: 'properties',
        item: p,
      }).catch(err => console.error('Error toggling featured on Hostinger API:', err));

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

      callHostingerApi('POST', {
        action: 'upsert',
        table: 'properties',
        item: p,
      }).catch(err => console.error('Error updating status on Hostinger API:', err));

      return true;
    }
    return false;
  }
};

// ==========================================
// LEADS SERVICE (Hostinger API + Local Cache)
// ==========================================
export const leadService = {
  getLeads(): Lead[] {
    const raw = localStorage.getItem(STORAGE_LEADS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify([]));
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async fetchLeads(): Promise<Lead[]> {
    try {
      const json = await callHostingerApi('GET', { table: 'leads' }, true);
      if (Array.isArray(json?.data)) {
        localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(json.data));
        // notifyLeadsChanged(); // removido: lecturas no deben emitir eventos (evita bucle infinito, ver bugfix_infinite_refetch_loop)
        return json.data as Lead[];
      }
      return this.getLeads();
    } catch {
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

    callHostingerApi('POST', {
      action: 'create_lead',
      item: newLead,
    }).catch(err => console.error('Error saving lead on Hostinger API:', err));

    return newLead;
  },

  updateLeadStatus(id: string, status: Lead['status']): void {
    const leads = this.getLeads();
    const l = leads.find(item => item.id === id);
    if (l) {
      l.status = status;
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
      notifyLeadsChanged();

      callHostingerApi('POST', {
        action: 'upsert',
        table: 'leads',
        item: l,
      }).catch(err => console.error('Error updating lead on Hostinger API:', err));
    }
  },

  deleteLead(id: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(filtered));
    notifyLeadsChanged();

    callHostingerApi('POST', {
      action: 'delete',
      table: 'leads',
      id,
    }).catch(err => console.error('Error deleting lead on Hostinger API:', err));

    return true;
  }
};

// ==========================================
// CATEGORIES SERVICE & HELPERS
// ==========================================
export const INITIAL_CATEGORIES: PropertyCategory[] =
  SEED_CATEGORIES.length > 0
    ? SEED_CATEGORIES
    : [
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
    try {
      const json = await callHostingerApi('GET', { table: 'categories' });
      if (Array.isArray(json?.data) && json.data.length > 0) {
        const sorted = [...json.data].sort((a, b) => (a.order || 0) - (b.order || 0));
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(sorted));
        notifyCategoriesChanged(); // OK: sus listeners solo leen localStorage, no vuelven a pedir al servidor
        return sorted as PropertyCategory[];
      }
      return this.getCategories();
    } catch {
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

    callHostingerApi('POST', {
      action: 'upsert',
      table: 'categories',
      item: savedCat,
    }).catch(err => console.error('Error saving category on Hostinger API:', err));

    return savedCat;
  },

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(filtered));
    notifyCategoriesChanged();

    callHostingerApi('POST', {
      action: 'delete',
      table: 'categories',
      id,
    }).catch(err => console.error('Error deleting category on Hostinger API:', err));

    return true;
  },

  resetToDefaults(): PropertyCategory[] {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    notifyCategoriesChanged();

    callHostingerApi('POST', {
      action: 'bulk_upsert',
      table: 'categories',
      items: INITIAL_CATEGORIES,
    }).catch(err => console.error('Error resetting categories on Hostinger API:', err));

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
const INITIAL_TESTIMONIALS: Testimonial[] =
  SEED_TESTIMONIALS.length > 0
    ? SEED_TESTIMONIALS
    : [
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
      return INITIAL_TESTIMONIALS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
      return INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  },

  getActiveTestimonials(): Testimonial[] {
    const all = this.getTestimonials();
    return all.filter(t => t.is_active !== false);
  },

  async fetchTestimonials(): Promise<Testimonial[]> {
    try {
      const json = await callHostingerApi('GET', { table: 'testimonials' });
      if (Array.isArray(json?.data) && json.data.length > 0) {
        const sorted = [...json.data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(sorted));
        notifyTestimonialsChanged(); // OK: sus listeners solo leen localStorage, no vuelven a pedir al servidor
        return sorted as Testimonial[];
      }
      return this.getTestimonials();
    } catch {
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

    callHostingerApi('POST', {
      action: 'upsert',
      table: 'testimonials',
      item: target,
    }).catch(err => console.error('Error saving testimonial on Hostinger API:', err));

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

      callHostingerApi('POST', {
        action: 'upsert',
        table: 'testimonials',
        item: testimonials[index],
      }).catch(err => console.error('Error toggling testimonial on Hostinger API:', err));

      return updatedActive;
    }
    return false;
  },

  deleteTestimonial(id: string): boolean {
    const testimonials = this.getTestimonials();
    const filtered = testimonials.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(filtered));
    notifyTestimonialsChanged();

    callHostingerApi('POST', {
      action: 'delete',
      table: 'testimonials',
      id,
    }).catch(err => console.error('Error deleting testimonial on Hostinger API:', err));

    return true;
  },

  resetToDefaults(): Testimonial[] {
    localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
    notifyTestimonialsChanged();

    callHostingerApi('POST', {
      action: 'bulk_upsert',
      table: 'testimonials',
      items: INITIAL_TESTIMONIALS,
    }).catch(err => console.error('Error resetting testimonials on Hostinger API:', err));

    return INITIAL_TESTIMONIALS;
  }
};

// ==========================================
// AUTHENTICATION & PROFILES SERVICE (Hostinger API)
// ==========================================
export const authService = {
  async login(email: string, password: string): Promise<{ user: any; profile: UserProfile | null }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const res = await callHostingerApi('POST', {
      action: 'login',
      email: cleanEmail,
      password: cleanPassword,
    });

    const userObj = res?.user;
    const token = res?.token;
    if (!userObj || !token) {
      throw new Error('Credenciales inválidas.');
    }

    setAdminToken(token);

    const profile: UserProfile = {
      id: userObj.id,
      email: userObj.email,
      full_name: userObj.full_name || cleanEmail.split('@')[0],
      role: (userObj.role as UserRole) || 'superadmin',
    };

    localStorage.setItem('adelina_admin_auth', 'true');
    localStorage.setItem('adelina_user_profile', JSON.stringify(profile));
    return { user: userObj, profile };
  },

  async logout(): Promise<void> {
    try {
      await callHostingerApi('POST', { action: 'logout' });
    } catch {
      // Ignorar errores de red al cerrar sesión
    }
    setAdminToken(null);
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
    return this.getCurrentProfile();
  },

  async updatePassword(newPassword: string): Promise<void> {
    const current = this.getCurrentProfile();
    if (!current?.email) {
      throw new Error('No hay sesión activa.');
    }
    await callHostingerApi('POST', {
      action: 'update_password',
      email: current.email,
      password: newPassword,
    });
  },

  getStoredProfiles(): UserProfile[] {
    const raw = localStorage.getItem('adelina_cached_profiles');
    if (!raw) {
      localStorage.setItem('adelina_cached_profiles', JSON.stringify(SEED_PROFILES));
      return SEED_PROFILES;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_PROFILES;
    } catch {
      return SEED_PROFILES;
    }
  },

  async getProfiles(): Promise<UserProfile[]> {
    try {
      const json = await callHostingerApi('GET', { table: 'profiles' }, true);
      if (Array.isArray(json?.data) && json.data.length > 0) {
        localStorage.setItem('adelina_cached_profiles', JSON.stringify(json.data));
        return json.data as UserProfile[];
      }
    } catch (err) {
      console.warn('Using cached profiles:', err);
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

    const res = await callHostingerApi('POST', {
      action: 'create_user',
      email: email.trim(),
      password: password.trim(),
      full_name: fullName.trim(),
      role,
    });

    const newProfile: UserProfile = res?.profile || {
      id: `usr-${Date.now()}`,
      email: email.trim(),
      full_name: fullName.trim(),
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existing = this.getStoredProfiles();
    localStorage.setItem(
      'adelina_cached_profiles',
      JSON.stringify([...existing.filter(p => p.id !== newProfile.id), newProfile])
    );

    return newProfile;
  },

  async deleteProfile(userId: string): Promise<void> {
    const currentProfile = this.getCurrentProfile();
    if (currentProfile?.role !== 'superadmin') {
      throw new Error('Solo los usuarios Superadmin pueden eliminar usuarios.');
    }
    if (currentProfile.id === userId) {
      throw new Error('No podés eliminar tu propia cuenta activa de Superadmin.');
    }

    await callHostingerApi('POST', {
      action: 'delete',
      table: 'profiles',
      id: userId,
    });

    const existing = this.getStoredProfiles();
    const updated = existing.filter(p => p.id !== userId);
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

    await callHostingerApi('POST', {
      action: 'update_role',
      id: userId,
      role,
    });

    const existing = this.getStoredProfiles();
    const updated = existing.map(p => (p.id === userId ? { ...p, role } : p));
    localStorage.setItem('adelina_cached_profiles', JSON.stringify(updated));
  }
};

// Initial background sync with Hostinger API
if (typeof window !== 'undefined') {
  setTimeout(() => {
    // propiedades y leads los pide App.tsx (refreshData); no duplicar la descarga
    categoryService.fetchCategories();
    testimonialService.fetchTestimonials();
  }, 100);
}
