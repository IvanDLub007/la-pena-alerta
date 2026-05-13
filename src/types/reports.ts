// Tipos para el módulo de Crowdsourcing/Reports

export type EventType = 'inundacion' | 'deslizamiento' | 'estructura_dañada' | 'falta_agua' | 'otro';

export type HousingType = 'casa' | 'apartamento' | 'precario' | 'comercio' | 'otro';

export type ReportStatus = 'pendiente' | 'en_progreso' | 'resuelto';

export interface Report {
  id: string;
  event_type: EventType;
  description: string;
  latitude: number;
  longitude: number;
  affected_count: number;
  housing_type: HousingType;
  status: ReportStatus;
  image_url: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateReportInput {
  event_type: EventType;
  description: string;
  latitude: number;
  longitude: number;
  affected_count: number;
  housing_type: HousingType;
  image_file?: File;
}

export interface ReportFormData {
  eventType: EventType;
  description: string;
  affectedCount: number;
  housingType: HousingType;
  imageFile: File | null;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  eventType: EventType;
  affectedCount: number;
  description: string;
  createdAt: string;
}

export interface GeoLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface ReportError {
  code: string;
  message: string;
  isRateLimit?: boolean;
  isDuplicate?: boolean;
}
