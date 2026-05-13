import { supabase } from './supabaseClient';
import { storageService } from './storageService';
import {
  Report,
  CreateReportInput,
  ReportError,
  ReportStatus,
} from '@/types/reports';

export const reportService = {
  /**
   * Crea un nuevo reporte con imagen opcional
   * Maneja automáticamente la carga de imagen
   */
  async createReport(
    input: CreateReportInput,
    userId: string
  ): Promise<{ success: boolean; report?: Report; error?: ReportError }> {
    try {
      let imageUrl: string | null = null;

      // Subir imagen si existe
      if (input.image_file) {
        const uploadResult = await storageService.uploadImage(
          input.image_file,
          userId
        );
        if (uploadResult) {
          imageUrl = uploadResult.url;
        }
      }

      // Preparar datos del reporte
      const reportData = {
        event_type: input.event_type,
        description: input.description,
        latitude: input.latitude,
        longitude: input.longitude,
        affected_count: input.affected_count,
        housing_type: input.housing_type,
        image_url: imageUrl,
        status: 'pendiente' as ReportStatus,
      };

      // Insertar en tabla reports
      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) {
        // Analizar tipo de error
        let reportError: ReportError = {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'Error desconocido al crear reporte',
          isRateLimit: false,
          isDuplicate: false,
        };

        // Trigger antispam devuelve violación de constraint
        if (error.code === '23505' || error.message.includes('duplicate')) {
          reportError.isDuplicate = true;
          reportError.message =
            'Ya existe un reporte en esta ubicación. Intenta en otra zona o espera 1 hora.';
        }

        if (error.code === '42501') {
          reportError.isRateLimit = true;
          reportError.message = 'Límite de reportes alcanzado. Intenta más tarde.';
        }

        return { success: false, error: reportError };
      }

      return {
        success: true,
        report: {
          ...data,
          created_at: data.created_at || new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error creating report:', error);
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Error al crear reporte. Intenta nuevamente.',
        },
      };
    }
  },

  /**
   * Obtiene todos los reportes con paginación opcional
   */
  async getReports(
    limit: number = 100,
    offset: number = 0
  ): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching reports:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  },

  /**
   * Obtiene reportes en un radio específico (para detectar duplicados)
   */
  async getReportsNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 0.1
  ): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .gte('latitude', latitude - radiusKm)
        .lte('latitude', latitude + radiusKm)
        .gte('longitude', longitude - radiusKm)
        .lte('longitude', longitude + radiusKm)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching nearby reports:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching nearby reports:', error);
      return [];
    }
  },

  /**
   * Actualiza el estado de un reporte (solo para admin)
   */
  async updateReportStatus(
    reportId: string,
    status: ReportStatus
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', reportId);

      if (error) {
        console.error('Error updating report status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating report status:', error);
      return { success: false, error: 'Error al actualizar estado' };
    }
  },

  /**
   * Obtiene un reporte por ID
   */
  async getReportById(reportId: string): Promise<Report | null> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) {
        console.error('Error fetching report:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching report:', error);
      return null;
    }
  },

  /**
   * Suscribirse a cambios en tiempo real de reportes
   */
  subscribeToReports(
    callback: (report: Report) => void,
    errorCallback?: (error: Error) => void
  ) {
    const channel = supabase
      .channel('public:reports')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            callback(payload.new as Report);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          if (errorCallback) {
            errorCallback(new Error(`Realtime subscription: ${status}`));
          }
        }
      });

    return channel;
  },
};
