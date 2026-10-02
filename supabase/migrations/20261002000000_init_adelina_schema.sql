-- ==============================================================================
-- Schema Initialization for Adelina Inmobiliaria
-- Tables: categories, properties, testimonials, leads + Storage bucket & RLS
-- ==============================================================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  operation_type TEXT NOT NULL DEFAULT 'sale',
  property_type TEXT NOT NULL DEFAULT 'casas',
  price_usd NUMERIC,
  price_ars NUMERIC,
  currency TEXT NOT NULL DEFAULT 'USD',
  location_city TEXT NOT NULL DEFAULT 'Paraná',
  location_neighborhood TEXT,
  address_approx TEXT,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  garages INTEGER DEFAULT 0,
  covered_area_sqm NUMERIC DEFAULT 0,
  total_area_sqm NUMERIC DEFAULT 0,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  google_maps_url TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT DEFAULT 'Cliente',
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  date TEXT,
  platform TEXT DEFAULT 'google',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  property_title TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'web_form',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public / anon full access for dynamic management in web & admin
DO $$
BEGIN
  -- Categories
  DROP POLICY IF EXISTS "Public full access categories" ON public.categories;
  CREATE POLICY "Public full access categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

  -- Properties
  DROP POLICY IF EXISTS "Public full access properties" ON public.properties;
  CREATE POLICY "Public full access properties" ON public.properties FOR ALL USING (true) WITH CHECK (true);

  -- Testimonials
  DROP POLICY IF EXISTS "Public full access testimonials" ON public.testimonials;
  CREATE POLICY "Public full access testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

  -- Leads
  DROP POLICY IF EXISTS "Public full access leads" ON public.leads;
  CREATE POLICY "Public full access leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ==============================================================================
-- Storage Bucket for Property & Testimonial Media
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'adelina-media',
  'adelina-media',
  true,
  20971520, -- 20MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- Storage bucket access policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read adelina-media" ON storage.objects;
  CREATE POLICY "Public read adelina-media" ON storage.objects
    FOR SELECT USING (bucket_id = 'adelina-media');

  DROP POLICY IF EXISTS "Public insert adelina-media" ON storage.objects;
  CREATE POLICY "Public insert adelina-media" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'adelina-media');

  DROP POLICY IF EXISTS "Public update adelina-media" ON storage.objects;
  CREATE POLICY "Public update adelina-media" ON storage.objects
    FOR UPDATE USING (bucket_id = 'adelina-media');

  DROP POLICY IF EXISTS "Public delete adelina-media" ON storage.objects;
  CREATE POLICY "Public delete adelina-media" ON storage.objects
    FOR DELETE USING (bucket_id = 'adelina-media');
END $$;

-- ==============================================================================
-- Initial Seed Data
-- ==============================================================================

-- Categories
INSERT INTO public.categories (id, name, slug, description, "order") VALUES
  ('cat-casas', 'Casas', 'casas', 'Casas y residencias en zonas urbanas y barrios cerrados', 1),
  ('cat-deptos', 'Departamentos', 'departamentos', 'Departamentos de categoría céntricos y residenciales', 2),
  ('cat-lotes', 'Lotes', 'lotes', 'Terrenos, lotes en loteos y desarrollos', 3),
  ('cat-cocheras', 'Cocheras', 'cocheras', 'Cocheras y espacios de guardado cubiertos', 4),
  ('cat-quintas', 'Quintas', 'quintas', 'Casas quintas de fin de semana y chacras con parque', 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  "order" = EXCLUDED."order";

-- Properties
INSERT INTO public.properties (
  id, title, slug, description, operation_type, property_type, price_usd, price_ars,
  currency, location_city, location_neighborhood, address_approx, bedrooms, bathrooms,
  garages, covered_area_sqm, total_area_sqm, amenities, images, featured_image,
  is_featured, status
) VALUES
(
  'prop-1',
  'Casa en Barrio Privado',
  'casa-en-barrio-privado-parana',
  'Excelente propiedad de diseño contemporáneo ubicada en exclusivo barrio privado de Paraná. Cuenta con amplios ambientes integrados, cocina gourmet con isla, galería techada con asador, piscina con solárium y jardín parquizado. Terminaciones de primera categoría con aberturas DVH y calefacción central.',
  'sale',
  'casas',
  185000,
  NULL,
  'USD',
  'Paraná',
  'Barrio Privado',
  'Zona Acceso Norte, Barrio Privado',
  3,
  3,
  2,
  220,
  650,
  ARRAY['Piscina', 'Quincho / Asador', 'Seguridad 24hs', 'Cochera doble', 'Calefacción central', 'Jardín parquizado', 'Vestidor en suite'],
  ARRAY['/assets/property-house-private.jpg', '/assets/chic-living.jpg', '/assets/hero-living.jpg'],
  '/assets/property-house-private.jpg',
  true,
  'available'
),
(
  'prop-2',
  'Departamento Centro con Vista',
  'departamento-centro-parana',
  'Impecable departamento de categoría en pleno microcentro de Paraná. Luminoso living comedor con balcón aterrazado y vistas abiertas a la ciudad. Dos dormitorios (principal en suite con vestidor), cocina independiente equipada y cochera cubierta en subsuelo.',
  'sale',
  'departamentos',
  120000,
  NULL,
  'USD',
  'Paraná',
  'Centro',
  'Zona Casa de Gobierno / Plaza 1° de Mayo',
  2,
  2,
  1,
  88,
  98,
  ARRAY['Balcón aterrazado', 'Cochera cubierta', 'Ascensor', 'Seguridad por cámara', 'SUM con parrilla', 'Placares e interiores completos'],
  ARRAY['/assets/property-dept-center.jpg', '/assets/hero-living.jpg', '/assets/chic-living.jpg'],
  '/assets/property-dept-center.jpg',
  true,
  'available'
),
(
  'prop-3',
  'Terreno / Lote Residencial',
  'terreno-lote-colonia-avellaneda',
  'Gran lote residencial con entorno natural consolidado y excelente orientación solar. Servicios subterráneos de agua corriente, tendido eléctrico y alumbrado público. Ideal para desarrollo familiar o inversión con alto potencial de revalorización.',
  'sale',
  'lotes',
  38000,
  NULL,
  'USD',
  'Colonia Avellaneda',
  'Zona Residencial',
  'A metros de acceso principal, Colonia Avellaneda',
  0,
  0,
  0,
  0,
  540,
  ARRAY['Servicios de agua y luz', 'Alumbrado público', 'Escrituración inmediata', 'Calle pavimentada', 'Entorno consolidado'],
  ARRAY['/assets/property-land-lot.jpg', '/assets/office-sign.jpg'],
  '/assets/property-land-lot.jpg',
  true,
  'available'
),
(
  'prop-4',
  'Casa Quinta con Parque y Piscina',
  'casa-quinta-parque-piscina',
  'Propiedad ideal para descanso o vivienda permanente. Amplia galería perimetral, quincho cerrado para 30 personas con asador, horno a leña y pileta de 10x4 metros. Arboleda añeja y parque totalmente cercado.',
  'sale',
  'quintas',
  145000,
  NULL,
  'USD',
  'Paraná',
  'Acceso Este',
  'Zona Parque Industrial / Acceso Este',
  3,
  2,
  3,
  180,
  1200,
  ARRAY['Gran piscina', 'Quincho cerrado', 'Horno a leña', 'Arboleda añeja', 'Portón automatizado'],
  ARRAY['/assets/chic-living.jpg', '/assets/property-house-private.jpg'],
  '/assets/chic-living.jpg',
  false,
  'available'
),
(
  'prop-5',
  'Cochera Cubierta en Microcentro',
  'cochera-cubierta-microcentro-parana',
  'Cochera fija cubierta con portón automatizado a control remoto y cámaras de seguridad 24 hs en pleno microcentro de Paraná. Excelente maniobrabilidad.',
  'sale',
  'cocheras',
  12000,
  NULL,
  'USD',
  'Paraná',
  'Centro',
  'Zona Microcentro / Peatonal San Martín',
  0,
  0,
  1,
  14,
  14,
  ARRAY['Portón automatizado', 'Seguridad 24hs', 'Fácil acceso'],
  ARRAY['/assets/hero-living.jpg', '/assets/property-dept-center.jpg'],
  '/assets/hero-living.jpg',
  false,
  'available'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  operation_type = EXCLUDED.operation_type,
  property_type = EXCLUDED.property_type,
  price_usd = EXCLUDED.price_usd,
  price_ars = EXCLUDED.price_ars,
  currency = EXCLUDED.currency,
  location_city = EXCLUDED.location_city,
  location_neighborhood = EXCLUDED.location_neighborhood,
  address_approx = EXCLUDED.address_approx,
  bedrooms = EXCLUDED.bedrooms,
  bathrooms = EXCLUDED.bathrooms,
  garages = EXCLUDED.garages,
  covered_area_sqm = EXCLUDED.covered_area_sqm,
  total_area_sqm = EXCLUDED.total_area_sqm,
  amenities = EXCLUDED.amenities,
  images = EXCLUDED.images,
  featured_image = EXCLUDED.featured_image,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status;

-- Testimonials
INSERT INTO public.testimonials (
  id, client_name, client_role, quote, rating, date, platform, is_active, order_index
) VALUES
(
  'test-1',
  'Ero Wals',
  'Operational Leads',
  '“Since using this platform, our team’s productivity has increased significantly. Processes that were previously manual can now be automated”',
  5,
  '12/05/2026',
  'google',
  true,
  1
),
(
  'test-2',
  'María Eugenia R.',
  'Compradora Depto. Centro',
  '“Excelente acompañamiento y transparencia en cada paso de la compra. Encontraron exactamente lo que buscábamos para nuestra familia con total profesionalismo.”',
  5,
  '04/06/2026',
  'google',
  true,
  2
),
(
  'test-3',
  'Martín Sbarbaro',
  'Inversor Residencial',
  '“El asesoramiento inmobiliario fue impecable. La tasación y el análisis del mercado nos permitieron tomar la mejor decisión de inversión con rentabilidad asegurada.”',
  5,
  '18/07/2026',
  'whatsapp',
  true,
  3
),
(
  'test-4',
  'Lucía Fernández',
  'Propietaria - Venta Casa Quinta',
  '“Vendimos nuestra propiedad en tiempo récord y sin contratiempos. La calidad de las fotos y la difusión fue superadora. Muy agradecida con todo el equipo de Adelina.”',
  5,
  '22/08/2026',
  'instagram',
  true,
  4
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_role = EXCLUDED.client_role,
  quote = EXCLUDED.quote,
  rating = EXCLUDED.rating,
  date = EXCLUDED.date,
  platform = EXCLUDED.platform,
  is_active = EXCLUDED.is_active,
  order_index = EXCLUDED.order_index;

-- Leads
INSERT INTO public.leads (
  id, property_id, property_title, full_name, phone, email, message, source, status
) VALUES
(
  'lead-1',
  'prop-1',
  'Casa en Barrio Privado',
  'Mariano Gómez',
  '+54 9 343 456-7890',
  'mariano.gomez@gmail.com',
  'Hola! Estoy muy interesado en la casa en Barrio Privado. Quisiera coordinar una visita y conocer condiciones.',
  'web_form',
  'new'
),
(
  'lead-2',
  'prop-2',
  'Departamento Centro con Vista',
  'Carolina Benítez',
  '+54 9 343 512-3456',
  'caro.benitez@hotmail.com',
  'Buenas tardes! Quisiera coordinar una visita para este viernes por la tarde.',
  'whatsapp_click',
  'contacted'
)
ON CONFLICT (id) DO NOTHING;
