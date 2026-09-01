import React, { useState } from 'react';
import { Property } from '../../types/property';
import { Rss, Copy, CheckCircle2, ExternalLink, Code2, ShieldCheck } from 'lucide-react';

interface XmlFeedPageProps {
  properties: Property[];
}

export const XmlFeedPage: React.FC<XmlFeedPageProps> = ({ properties }) => {
  const [copied, setCopied] = useState(false);
  const feedUrl = `${window.location.origin}/api/feed/zonaprop.xml`;

  const availableProperties = properties.filter((p) => p.status === 'available');

  // Generate XML string representation matching standard portal format
  const generateXml = () => {
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<inmuebles version="2.0" agencia="Adelina Lujan Inmobiliaria" fecha="${new Date().toISOString()}">\n`;
    
    const items = availableProperties.map((p) => {
      const imagesXml = p.images.map((img) => `      <foto>${window.location.origin}${img}</foto>`).join('\n');
      const amenitiesXml = p.amenities.map((a) => `      <caracteristica>${a}</caracteristica>`).join('\n');

      return `  <inmueble id="${p.id}" codigo="${p.slug}">
    <titulo><![CDATA[${p.title}]]></titulo>
    <descripcion><![CDATA[${p.description}]]></descripcion>
    <operacion>${p.operation_type}</operacion>
    <tipo_inmueble>${p.property_type}</tipo_inmueble>
    <precio moneda="${p.currency}">${p.currency === 'USD' ? p.price_usd : p.price_ars}</precio>
    <ubicacion>
      <ciudad>${p.location_city}</ciudad>
      <barrio>${p.location_neighborhood}</barrio>
      <direccion_aproximada>${p.address_approx}</direccion_aproximada>
    </ubicacion>
    <superficie>
      <cubierta_m2>${p.covered_area_sqm}</cubierta_m2>
      <total_m2>${p.total_area_sqm}</total_m2>
    </superficie>
    <ambientes>
      <dormitorios>${p.bedrooms}</dormitorios>
      <banios>${p.bathrooms}</banios>
      <cocheras>${p.garages}</cocheras>
    </ambientes>
    <fotos>
${imagesXml}
    </fotos>
    <amenities>
${amenitiesXml}
    </amenities>
    <url_publicacion>${window.location.origin}/?p=${p.slug}</url_publicacion>
  </inmueble>`;
    }).join('\n\n');

    const xmlFooter = `\n</inmuebles>`;
    return xmlHeader + items + xmlFooter;
  };

  const xmlContent = generateXml();

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-archivo text-2xl sm:text-3xl font-bold text-zinc-900">
            Sincronización & Feeds XML (Portales)
          </h1>
          <p className="text-xs text-zinc-500 font-light">
            Exportador automático de inventario compatible con Zonaprop, Argenprop y Mercado Libre.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-purple-200">
          <Rss className="w-4 h-4" />
          <span>{availableProperties.length} Inmuebles en el Feed</span>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <h3 className="font-archivo font-bold text-base text-zinc-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-adelina-accent" />
          <span>¿Cómo sincronizar con Zonaprop o Argenprop?</span>
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
          Para que tus propiedades se publiquen automáticamente en los portales donde tengas un paquete contratado, solo debés enviarle la siguiente URL a tu ejecutivo de cuentas de Zonaprop o Argenprop:
        </p>

        {/* Copy Feed URL Box */}
        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-300 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            readOnly
            value={feedUrl}
            className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-800"
          />
          <button
            onClick={handleCopyFeed}
            className="w-full sm:w-auto bg-adelina-dark hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 shrink-0 transition-all shadow active:scale-95"
          >
            <Copy className="w-4 h-4 text-adelina-accent" />
            <span>{copied ? '¡URL Copiada!' : 'Copiar URL del Feed'}</span>
          </button>
        </div>
      </div>

      {/* Live XML Code Viewer */}
      <div className="bg-zinc-900 rounded-3xl p-6 text-zinc-200 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Code2 className="w-4 h-4 text-adelina-accent" />
            <span>feed_properties.xml (Previsualización en tiempo real)</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">UTF-8 • XML 2.0</span>
        </div>

        <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto max-h-96 p-2 text-emerald-400/90 selection:bg-zinc-700">
          {xmlContent}
        </pre>
      </div>
    </div>
  );
};
