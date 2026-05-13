import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReportsMapLegendProps {
  eventCounts: Record<string, number>;
}

const EVENT_COLORS: Record<string, string> = {
  inundacion: '#ef4444',
  deslizamiento: '#f59e0b',
  estructura_dañada: '#f97316',
  falta_agua: '#3b82f6',
  otro: '#8b5cf6',
};

const EVENT_LABELS: Record<string, string> = {
  inundacion: '🌊 Inundación',
  deslizamiento: '⛰️ Deslizamiento',
  estructura_dañada: '🏚️ Estructura Dañada',
  falta_agua: '💧 Falta de Agua',
  otro: '⚠️ Otro',
};

export const ReportsMapLegend = ({ eventCounts }: ReportsMapLegendProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur border border-gray-300 rounded-lg shadow-xl overflow-hidden max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Eventos</span>
          <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
            {Object.values(eventCounts).reduce((a, b) => a + b, 0)}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="p-4 space-y-3 w-64 bg-white overflow-y-auto">
          {Object.entries(EVENT_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-700 flex-1 text-sm font-medium">{EVENT_LABELS[key]}</span>
              <span className="text-gray-600 font-bold bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {eventCounts[key] || 0}
              </span>
            </div>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-200 pt-3 mt-3">
            <p className="text-xs text-gray-600 leading-relaxed">
              💡 <strong>Toca un marker</strong> en el mapa para ver detalles del reporte
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsMapLegend;
