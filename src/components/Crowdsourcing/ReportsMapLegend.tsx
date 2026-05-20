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
    <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur border border-gray-300 rounded-lg shadow-xl overflow-hidden max-h-[calc(100vh-8rem)] max-w-[85vw] sm:max-w-none">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-semibold text-gray-900">Eventos</span>
          <span className="text-xs sm:text-sm bg-red-600 text-white rounded-full px-1.5 py-0.5">
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
        <div className="p-2 space-y-2 w-full sm:w-64 bg-white overflow-y-auto">
          {Object.entries(EVENT_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 transition-colors">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 border-1.5 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-700 flex-1 text-xs sm:text-sm font-medium">{EVENT_LABELS[key]}</span>
              <span className="text-gray-600 font-bold bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {eventCounts[key] || 0}
              </span>
            </div>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <p className="text-xs text-gray-600 leading-tight">
              💡 <strong>Toca un marker</strong> en el mapa para ver detalles del reporte
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsMapLegend;
