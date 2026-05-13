import { supabase } from './supabaseClient';
import { ReportError } from '@/types/reports';

const BUCKET_NAME = import.meta.env.VITE_STORAGE_BUCKET || 'report-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const storageService = {
  /**
   * Valida si el archivo de imagen es apto para subida
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No se seleccionó archivo' };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Solo se permiten JPG, PNG y WebP',
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Archivo muy grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    return { valid: true };
  },

  /**
   * Sube una imagen al bucket public report-images
   * Retorna URL pública del archivo
   */
  async uploadImage(
    file: File,
    userId: string
  ): Promise<{ url: string; path: string } | null> {
    try {
      const validation = this.validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generar nombre único con timestamp
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 9);
      const fileName = `${userId}_${timestamp}_${randomString}_${file.name}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(`reports/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Storage error:', error);
        throw error;
      }

      // Construir URL pública
      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        url: publicData.publicUrl,
        path: data.path,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  },

  /**
   * Elimina una imagen del storage
   */
  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([imagePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },
};
