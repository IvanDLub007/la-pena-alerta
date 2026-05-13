import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { reportService } from '@/services/reportService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertCircle,
  MapPin,
  Loader,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { EventType, HousingType, ReportFormData } from '@/types/reports';

const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: 'inundacion', label: '🌊 Inundación', icon: '🌊' },
  { value: 'deslizamiento', label: '⛰️ Deslizamiento', icon: '⛰️' },
  { value: 'estructura_dañada', label: '🏚️ Estructura Dañada', icon: '🏚️' },
  { value: 'falta_agua', label: '💧 Falta de Agua', icon: '💧' },
  { value: 'otro', label: '⚠️ Otro', icon: '⚠️' },
];

const HOUSING_TYPES: { value: HousingType; label: string }[] = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'precario', label: 'Estructura Precaria' },
  { value: 'comercio', label: 'Local Comercial' },
  { value: 'otro', label: 'Otro' },
];

interface ReportFormProps {
  onSuccess?: () => void;
}

export const ReportForm = ({ onSuccess }: ReportFormProps) => {
  const { location, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
  const [formData, setFormData] = useState<ReportFormData>({
    eventType: 'inundacion',
    description: '',
    affectedCount: 1,
    housingType: 'casa',
    imageFile: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleLocationRequest = () => {
    setSubmitStatus({ type: null, message: '' });
    requestLocation();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    if (!location) {
      setSubmitStatus({
        type: 'error',
        message: 'Debes obtener tu ubicación primero',
      });
      return;
    }

    if (!formData.description.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Describe lo que observas en detalle',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Generar userId simple (en producción usar autenticación real)
      const userId = `user_${Date.now()}`;

      const result = await reportService.createReport(
        {
          event_type: formData.eventType,
          description: formData.description,
          latitude: location.latitude,
          longitude: location.longitude,
          affected_count: formData.affectedCount,
          housing_type: formData.housingType,
          image_file: formData.imageFile || undefined,
        },
        userId
      );

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: '✅ Reporte enviado exitosamente. ¡Gracias por tu ayuda!',
        });

        // Limpiar formulario
        setFormData({
          eventType: 'inundacion',
          description: '',
          affectedCount: 1,
          housingType: 'casa',
          imageFile: null,
        });
        setImagePreview(null);

        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error?.message || 'Error al enviar reporte',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Error inesperado. Intenta nuevamente.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reportar Situación</h2>
        <p className="text-sm text-gray-600">
          Tu información ayuda a las autoridades a responder rápidamente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ubicación */}
        <Card className="p-4 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Ubicación</h3>
              {location ? (
                <div className="text-sm">
                  <p className="text-green-700 font-medium mb-1">
                    ✓ Ubicación obtenida
                  </p>
                  <p className="text-gray-600">
                    Lat: {location.latitude.toFixed(6)}, Lon:{' '}
                    {location.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Precisión: ±{Math.round(location.accuracy)}m
                  </p>
                </div>
              ) : (
                <div>
                  {geoError && (
                    <p className="text-red-600 text-sm mb-2">{geoError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleLocationRequest}
                    disabled={geoLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 inline-flex items-center gap-2"
                  >
                    {geoLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Obteniendo...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" />
                        Obtener Ubicación
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Tipo de Evento */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            ¿Qué está pasando?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EVENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, eventType: type.value }))
                }
                className={`p-3 rounded-lg font-medium text-sm transition-all ${
                  formData.eventType === type.value
                    ? 'bg-red-600 text-white border-2 border-red-700'
                    : 'bg-gray-100 text-gray-900 border-2 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad Afectados */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Personas Afectadas: {formData.affectedCount}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={formData.affectedCount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                affectedCount: parseInt(e.target.value),
              }))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Tipo de Vivienda */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Tipo de Vivienda
          </label>
          <select
            value={formData.housingType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                housingType: e.target.value as HousingType,
              }))
            }
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
          >
            {HOUSING_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Describe la Situación
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Ej: Agua llegando a las casas, hay personas atrapadas..."
            rows={4}
            maxLength={500}
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500
          </p>
        </div>

        {/* Foto Opcional */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Foto (Opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={submitting}
            className="w-full p-2 border-2 border-gray-300 rounded-lg"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-full max-h-40 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Estado del Envío */}
        {submitStatus.type && (
          <div
            className={`p-3 rounded-lg flex items-start gap-2 ${
              submitStatus.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{submitStatus.message}</p>
          </div>
        )}

        {/* Botón Enviar */}
        <Button
          type="submit"
          disabled={!location || submitting}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-400"
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            '📤 Enviar Reporte'
          )}
        </Button>
      </form>

      {/* Alert Info */}
      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-600 rounded text-sm text-yellow-800">
        <p className="font-semibold mb-1">⚠️ Información importante:</p>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li>Sé honesto y detallado en tu reporte</li>
          <li>Incluye fotos si es posible</li>
          <li>Tu ubicación es crítica para las autoridades</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportForm;
