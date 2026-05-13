import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useReports } from '@/hooks/useReports';
import { Report } from '@/types/reports';
import { AlertCircle, Loader, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Colores por tipo de evento
const EVENT_COLORS: Record<string, string> = {
  inundacion: '#ef4444',
  deslizamiento: '#f59e0b',
  estructura_dañada: '#f97316',
  falta_agua: '#3b82f6',
  otro: '#8b5cf6',
};

const createCustomIcon = (eventType: string) => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3"/>
          </filter>
        </defs>
        <path d="M15 0 C8.4 0 3 5.4 3 12 C3 20 15 35 15 35 C15 35 27 20 27 12 C27 5.4 21.6 0 15 0" fill="${EVENT_COLORS[eventType] || '#999'}" filter="url(#shadow)"/>
        <circle cx="15" cy="12" r="5" fill="white"/>
      </svg>
    `)}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
    shadowSize: [0, 0],
  });
};

const getEventLabel = (eventType: string): string => {
  const labels: Record<string, string> = {
    inundacion: '🌊 Inundación',
    deslizamiento: '⛰️ Deslizamiento',
    estructura_dañada: '🏚️ Estructura Dañada',
    falta_agua: '💧 Falta de Agua',
    otro: '⚠️ Otro',
  };
  return labels[eventType] || eventType;
};

const getStatusColor = (status: string): { bg: string; text: string } => {
  switch (status) {
    case 'resuelto':
      return { bg: '#dcfce7', text: '#15803d' };
    case 'en_progreso':
      return { bg: '#fef3c7', text: '#92400e' };
    default:
      return { bg: '#fee2e2', text: '#991b1b' };
  }
};

export const CrowdsourcingMap = () => {
  const { reports, loading, error, refreshReports } = useReports();
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter] = useState<[number, number]>([10.77, -74.78]);
  const [mapZoom] = useState(11);

  useEffect(() => {
    // Auto-zoom cuando hay reportes
    if (mapRef.current && reports.length > 0) {
      const bounds = L.latLngBounds(
        reports.map((r) => [r.latitude, r.longitude] as [number, number])
      );
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [reports]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 shadow-sm flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          Mapa de Reportes en Tiempo Real
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Situación actual en La Peña - {reports.length} reportes
        </p>
      </div>

      {/* Estado de Carga/Error */}
      {loading && (
        <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border-b border-blue-200 flex-shrink-0">
          <Loader className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-xs text-blue-700">Cargando reportes...</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border-b border-red-200 flex-shrink-0">
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

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Markers */}
          {reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={createCustomIcon(report.event_type)}
            >
              <Popup maxWidth={280} className="leaflet-popup">
                <div className="p-2 bg-white">
                  <h3 className="font-bold text-sm mb-2 text-gray-900">
                    {getEventLabel(report.event_type)}
                  </h3>
                  <div className="space-y-1 text-xs text-gray-700">
                    <p>
                      <strong>Afectados:</strong> {report.affected_count}
                    </p>
                    <p>
                      <strong>Vivienda:</strong> {report.housing_type}
                    </p>
                    <p>
                      <strong>Estado:</strong>{' '}
                      <span
                        style={{
                          padding: '2px 6px',
                          borderRadius: '3px',
                          backgroundColor: getStatusColor(report.status).bg,
                          color: getStatusColor(report.status).text,
                        }}
                      >
                        {report.status}
                      </span>
                    </p>
                    <p className="mt-2">{report.description}</p>
                    {report.image_url && (
                      <img
                        src={report.image_url}
                        alt="Evidencia"
                        className="w-full rounded mt-2 max-h-40 object-cover"
                      />
                    )}
                    <p className="text-gray-500 mt-2">
                      {new Date(report.created_at).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Leyenda */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-40">
          <p className="text-xs font-semibold text-gray-900 mb-2">Tipos de Evento:</p>
          <div className="space-y-1 text-xs">
            {Object.entries(EVENT_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-700">
                  {key === 'inundacion'
                    ? 'Inundación'
                    : key === 'deslizamiento'
                      ? 'Deslizamiento'
                      : key === 'estructura_dañada'
                        ? 'Estructura Dañada'
                        : key === 'falta_agua'
                          ? 'Falta de Agua'
                          : 'Otro'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón Actualizar */}
        <button
          onClick={refreshReports}
          className="absolute top-4 right-4 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg z-40 transition-colors"
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

        {/* Sin Reportes */}
        {!loading && reports.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-lg">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-700 font-semibold">No hay reportes aún</p>
              <p className="text-sm text-gray-600">
                Sé el primero en reportar una situación
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 p-2 text-xs text-gray-600 flex-shrink-0">
        <p>
          💡 Haz zoom para explorar la zona y ver detalles de los reportes.
        </p>
      </div>
    </div>
  );
};

export default CrowdsourcingMap;
