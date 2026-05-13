import { useState, useCallback, useEffect } from 'react';
import { GeoLocationData } from '@/types/reports';

export interface UseGeolocationReturn {
  location: GeoLocationData | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
  clearLocation: () => void;
}

/**
 * Hook para acceder a geolocalización del navegador
 * Maneja permisos y errores automáticamente
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeoLocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocalización no soportada en este navegador');
      setLoading(false);
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Error desconocido al obtener ubicación';

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              'Permiso denegado. Habilita la geolocalización en configuración.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible. Intenta en otro lugar.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Timeout. Intenta nuevamente.';
            break;
        }

        setError(errorMessage);
        setLocation(null);
        setLoading(false);
      },
      options
    );
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  // Solicitar ubicación al montar componente (opcional)
  useEffect(() => {
    // No auto-solicitar para respetar privacidad del usuario
    // El componente debe llamar a requestLocation() manualmente
  }, []);

  return {
    location,
    error,
    loading,
    requestLocation,
    clearLocation,
  };
};
