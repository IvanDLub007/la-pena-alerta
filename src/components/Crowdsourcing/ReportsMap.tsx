import { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle, Loader, MapPin, Layers, Navigation } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { Report } from '@/types/reports';
import ReportsMapLegend from './ReportsMapLegend';
import 'leaflet/dist/leaflet.css';

const EVENT_COLORS: Record<string, string> = {
  inundacion: '#ef4444',
  deslizamiento: '#f59e0b',
  estructura_dañada: '#f97316',
  falta_agua: '#3b82f6',
  otro: '#8b5cf6',
};

const LA_PEÑA_CENTER: [number, number] = [10.6, -75.0167];

export const ReportsMap = () => {
  const { reports, loading, error, refreshReports } = useReports();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [baseLayer, setBaseLayer] = useState<'osm' | 'satellite'>('osm');
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [offline, setOffline] = useState(false);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let cancelled = false;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        if (cancelled || !mapRef.current) return;

        leafletRef.current = L;

        // Configurar iconos por defecto
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Crear mapa
        const map = L.map(mapRef.current, {
          center: LA_PEÑA_CENTER,
          zoom: 13,
          zoomControl: false,
          attributionControl: false,
        });
        mapInstanceRef.current = map;

        // Tile layer OSM
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        });
        tileLayer.on('tileerror', () => setOffline(true));
        tileLayer.addTo(map);

        setMapReady(true);
      } catch (err) {
        console.error('Error inicializando mapa:', err);
        setOffline(true);
      }
    };

    initMap();
    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Actualizar markers cuando cambian reportes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L || !mapReady) return;

    // Limpiar markers antiguos
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Contar eventos
    const counts: Record<string, number> = {
      inundacion: 0,
      deslizamiento: 0,
      estructura_dañada: 0,
      falta_agua: 0,
      otro: 0,
    };

    // Crear nuevos markers
    reports.forEach((report) => {
      counts[report.event_type] = (counts[report.event_type] || 0) + 1;

      // Crear icono custom
      const icon = L.divIcon({
        html: `<div style="background:${EVENT_COLORS[report.event_type] || '#999'};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: '',
      });

      const marker = L.marker([report.latitude, report.longitude], {
        icon,
      });

      // ✅ MODIFICACIÓN 1: Detectar si es móvil
      const isMobile = window.innerWidth < 768;
      const isSmallMobile = window.innerWidth < 600;

      // Popup con información del reporte
      const eventLabels: Record<string, string> = {
        inundacion: '🌊 Inundación',
        deslizamiento: '⛰️ Deslizamiento',
        estructura_dañada: '🏚️ Estructura Dañada',
        falta_agua: '💧 Falta de Agua',
        otro: '⚠️ Otro',
      };

      // ✅ MODIFICACIÓN 2: Reemplazar statusColor
      const statusColors: Record<string, { bg: string; text: string }> = {
        resuelto: { bg: '#dcfce7', text: '#15803d' },
        en_progreso: { bg: '#fef3c7', text: '#92400e' },
        pendiente: { bg: '#fee2e2', text: '#991b1b' },
      };
      const statusColor = statusColors[report.status] || statusColors['pendiente'];

      // ✅ MODIFICACIÓN 3: Reemplazar popupContent completo
      const popupContent = `
        <div style="
          max-width: ${isSmallMobile ? '140px' : isMobile ? '200px' : '280px'};
          font-family: system-ui;
          padding: ${isSmallMobile ? '4px' : isMobile ? '5px' : '8px'};
        ">
          <h3 style="
            margin: 0 0 ${isSmallMobile ? '3px' : isMobile ? '4px' : '8px'} 0;
            font-weight: bold;
            color: #333;
            font-size: ${isSmallMobile ? '11px' : isMobile ? '12px' : '14px'};
            line-height: 1.2;
          ">
            ${eventLabels[report.event_type] || report.event_type}
          </h3>
          
          <div style="
            font-size: ${isSmallMobile ? '9px' : isMobile ? '10px' : '12px'};
            color: #666;
            line-height: 1.3;
          ">
            <p style="margin: 1px 0;"><strong>Afectados:</strong> ${report.affected_count}</p>
            <p style="margin: 1px 0;"><strong>Vivienda:</strong> ${report.housing_type}</p>
            <p style="margin: 1px 0;">
              <strong>Estado:</strong> 
              <span style="
                padding: 1px 3px;
                border-radius: 2px;
                background-color: ${statusColor.bg};
                color: ${statusColor.text};
                font-size: ${isSmallMobile ? '8px' : isMobile ? '9px' : '11px'};
              ">
                ${report.status}
              </span>
            </p>
            
            <p style="
              margin: ${isSmallMobile ? '2px 0 1px 0' : isMobile ? '3px 0 2px 0' : '6px 0 4px 0'};
              font-size: ${isSmallMobile ? '9px' : isMobile ? '10px' : '12px'};
              word-wrap: break-word;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: ${isSmallMobile ? '1' : '2'};
              -webkit-box-orient: vertical;
            ">
              ${report.description}
            </p>
            
            ${
              report.image_url
                ? `<img 
                    src="${report.image_url}" 
                    style="
                      width: 100%;
                      border-radius: 3px;
                      max-height: ${isSmallMobile ? '50px' : isMobile ? '70px' : '150px'};
                      object-fit: cover;
                      margin-top: ${isSmallMobile ? '2px' : '3px'};
                    " 
                    alt="Evidencia" 
                  />`
                : ''
            }
            
            <p style="
              margin: ${isSmallMobile ? '2px 0 0 0' : isMobile ? '3px 0 0 0' : '6px 0 0 0'};
              font-size: ${isSmallMobile ? '8px' : isMobile ? '9px' : '11px'};
              color: #999;
            ">
              ${new Date(report.created_at).toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: isSmallMobile ? 160 : isMobile ? 220 : 300 }).addTo(map);
      markersRef.current.push(marker);
    });

    setEventCounts(counts);

    // Auto-zoom si hay reportes
    if (reports.length > 0) {
      const bounds = L.latLngBounds(
        reports.map((r) => [r.latitude, r.longitude])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      }
    }
  }, [reports, mapReady]);

  // Cambiar capa de mapa
  const handleChangeLayer = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    // Remover tile layer anterior
    map.eachLayer((layer: any) => {
      if (layer._url) map.removeLayer(layer);
    });

    const newLayer = baseLayer === 'osm' ? 'satellite' : 'osm';
    setBaseLayer(newLayer);

    if (newLayer === 'osm') {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    } else {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri',
        }
      ).addTo(map);
    }
  }, [baseLayer]);

  // Centrar en La Peña
  const handleCenterLaPeña = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView(LA_PEÑA_CENTER, 13);
  }, []);

  // Mi ubicación
  const handleMyLocation = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);

        // Marker de usuario
        const userIcon = L.divIcon({
          html: `<div style="background:#3b82f6;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2)">📍</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          className: '',
        });

        L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('Tu ubicación');
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="p-4 bg-white space-y-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          Mapa de Reportes en Tiempo Real
        </h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: EVENT_COLORS.inundacion }} />
            <span className="text-xs text-gray-700">🌊 Inundación</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: EVENT_COLORS.deslizamiento }} />
            <span className="text-xs text-gray-700">⛰️ Deslizamiento</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: EVENT_COLORS.estructura_dañada }} />
            <span className="text-xs text-gray-700">🏚️ Estructura Dañada</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: EVENT_COLORS.falta_agua }} />
            <span className="text-xs text-gray-700">💧 Falta de Agua</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: EVENT_COLORS.otro }} />
            <span className="text-xs text-gray-700">⚠️ Otro</span>
          </span>
        </div>
      </div>

      {/* Estado de Carga/Error */}
      {loading && (
        <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border-b border-blue-200">
          <Loader className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-xs text-blue-700">Cargando reportes...</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border-b border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-red-700 font-semibold">Error al cargar</p>
            <p className="text-xs text-red-600">{error}</p>
            <button
              onClick={refreshReports}
              className="text-xs text-red-700 underline mt-1 hover:text-red-800"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Mapa Container */}
      {offline && !mapReady && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
          <AlertCircle size={48} className="text-red-600 mb-4" />
          <p className="text-lg font-semibold text-gray-900">Mapa no disponible sin conexión</p>
          <p className="text-gray-600 mt-2">
            Consulte los protocolos de emergencia en la pestaña "Emergencia".
          </p>
        </div>
      )}

      <div className="flex-1 relative overflow-visible" style={{ minHeight: '400px', display: offline && !mapReady ? 'none' : 'block' }}>
        <div ref={mapRef} className="absolute inset-0" />

        {/* Leyenda Colapsable */}
        {mapReady && <ReportsMapLegend eventCounts={eventCounts} />}

        {/* Controles Flotantes (FABs) - Top Right */}
        {mapReady && (
          <div className="absolute top-4 right-4 flex flex-col gap-3 z-[1000]">
            {/* Actualizar */}
            <button
              onClick={refreshReports}
              className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-3 shadow-lg transition-colors"
              title="Actualizar reportes"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Centrar en La Peña */}
            <button
              onClick={handleCenterLaPeña}
              className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-3 shadow-lg transition-colors"
              title="Centrar en La Peña"
            >
              <MapPin className="w-5 h-5 text-red-600" />
            </button>

            {/* Mi Ubicación */}
            <button
              onClick={handleMyLocation}
              className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-3 shadow-lg transition-colors"
              title="Mi ubicación"
            >
              <Navigation className="w-5 h-5 text-blue-600" />
            </button>

            {/* Cambiar Capas */}
            <button
              onClick={handleChangeLayer}
              className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-3 shadow-lg transition-colors"
              title="Cambiar mapa"
            >
              <Layers className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}

        {/* Sin reportes */}
        {mapReady && !loading && reports.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 pointer-events-none">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg pointer-events-auto">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-700 font-semibold">No hay reportes aún</p>
              <p className="text-sm text-gray-600">
                Sé el primero en reportar una situación
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsMap;