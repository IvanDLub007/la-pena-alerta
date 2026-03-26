export interface WaterLevelData {
  level: number;
  timestamp: string;
  updatedBy?: string;
}

export type AlertLevel = "safe" | "warning" | "alert" | "danger";

export function getAlertLevel(level: number): AlertLevel {
  if (level < 4.80) return "safe";
  if (level <= 5.10) return "warning";
  if (level <= 5.20) return "alert";
  return "danger";
}

export function getAlertLabel(alert: AlertLevel): string {
  const labels: Record<AlertLevel, string> = {
    safe: "Normal",
    warning: "Vigilancia",
    alert: "Alerta",
    danger: "Emergencia",
  };
  return labels[alert];
}

export function getAlertDescription(alert: AlertLevel): string {
  const desc: Record<AlertLevel, string> = {
    safe: "Nivel del embalse dentro de parámetros normales.",
    warning: "Nivel elevado. Manténgase informado.",
    alert: "Nivel crítico. Prepárese para posible evacuación.",
    danger: "¡EVACÚE INMEDIATAMENTE! Diríjase a la I.E. Técnica de La Peña.",
  };
  return desc[alert];
}

const STORAGE_KEY = "alerta-lapena-water-level";

export function saveWaterLevel(data: WaterLevelData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getWaterLevel(): WaterLevelData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return { level: 4.50, timestamp: new Date().toISOString() };
}
