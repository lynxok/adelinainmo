// Supabase Edge Function: xml-feed
// Endpoint público 24/7 para sincronización automática con portales (Zonaprop, Argenprop, Mercado Libre)
// Invocación: GET https://ygqovuczanfmtczjdgtj.supabase.co/functions/v1/xml-feed

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (_req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<inmuebles version="2.0" agencia="Adelina Lujan Inmobiliaria" fecha="${new Date().toISOString()}">\n`;

    const items = (properties || []).map((p: any) => {
      const imagesXml = (p.images || [])
        .filter(Boolean)
        .map((url: string) => `      <foto>${url}</foto>`)
        .join('\n');

      const amenitiesXml = (p.amenities || [])
        .map((a: string) => `      <caracteristica>${a}</caracteristica>`)
        .join('\n');

      return `  <inmueble id="${p.id}" codigo="${p.slug}">
    <titulo><![CDATA[${p.title}]]></titulo>
    <descripcion><![CDATA[${p.description || ''}]]></descripcion>
    <operacion>${p.operation_type}</operacion>
    <tipo_inmueble>${p.property_type}</tipo_inmueble>
    <precio moneda="${p.currency}">${p.currency === 'USD' ? p.price_usd : p.price_ars}</precio>
    <ubicacion>
      <ciudad>${p.location_city || 'Paraná'}</ciudad>
      <barrio>${p.location_neighborhood || ''}</barrio>
      <direccion_aproximada>${p.address_approx || ''}</direccion_aproximada>
    </ubicacion>
    <superficie>
      <cubierta_m2>${p.covered_area_sqm || 0}</cubierta_m2>
      <total_m2>${p.total_area_sqm || 0}</total_m2>
    </superficie>
    <ambientes>
      <dormitorios>${p.bedrooms || 0}</dormitorios>
      <banios>${p.bathrooms || 0}</banios>
      <cocheras>${p.garages || 0}</cocheras>
    </ambientes>
    <fotos>
${imagesXml}
    </fotos>
    <amenities>
${amenitiesXml}
    </amenities>
    <url_publicacion>https://adelinainmo.lnx.com.ar/?p=${p.slug}</url_publicacion>
  </inmueble>`;
    }).join('\n\n');

    const xmlFooter = `\n</inmuebles>`;
    const fullXml = xmlHeader + items + xmlFooter;

    return new Response(fullXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800', // Cache por 30 minutos
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
