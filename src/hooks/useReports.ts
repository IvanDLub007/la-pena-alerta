import { useState, useEffect, useCallback } from 'react';
import { Report } from '@/types/reports';
import { reportService } from '@/services/reportService';

export interface UseReportsReturn {
  reports: Report[];
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
  addReport: (report: Report) => void;
}

/**
 * Hook para obtener y suscribirse a reportes en tiempo real
 */
export const useReports = (): UseReportsReturn => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getReports();
      setReports(data);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  }, []);

  const addReport = useCallback((report: Report) => {
    setReports((prev) => {
      // Evitar duplicados
      const exists = prev.some((r) => r.id === report.id);
      if (exists) {
        // Actualizar si ya existe
        return prev.map((r) => (r.id === report.id ? report : r));
      }
      // Agregar nuevo reporte al inicio
      return [report, ...prev];
    });
  }, []);

  // Cargar reportes iniciales
  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    const subscription = reportService.subscribeToReports(
      (report) => {
        addReport(report);
      },
      (err) => {
        console.error('Realtime subscription error:', err);
        setError('Conexión en tiempo real perdida');
      }
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [addReport]);

  return {
    reports,
    loading,
    error,
    refreshReports,
    addReport,
  };
};
