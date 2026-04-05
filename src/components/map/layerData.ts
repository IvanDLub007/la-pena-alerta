// ── Datos de capas analíticas para el mapa de La Peña ──

export interface MapZone {
  name: string;
  positions: [number, number][];
  level: string;
  color: string;
  opacity: number;
}

export interface MapPoint {
  name: string;
  position: [number, number];
  type: string;
  emoji: string;
  color: string;
}

// ── Capa 1: Elevación del terreno (isolíneas aproximadas basadas en topografía local) ──
export const elevationContours: {
  label: string;
  color: string;
  positions: [number, number][];
}[] = [
  {
    label: "< 3 m.s.n.m. (Muy bajo)",
    color: "#1e3a5f",
    positions: [
      [10.5855, -75.0295],
      [10.5840, -75.0290],
      [10.5825, -75.0280],
      [10.5820, -75.0270],
      [10.5825, -75.0260],
    ],
  },
  {
    label: "3–5 m.s.n.m. (Bajo)",
    color: "#2563eb",
    positions: [
      [10.5860, -75.0285],
      [10.5845, -75.0275],
      [10.5830, -75.0265],
      [10.5828, -75.0255],
      [10.5835, -75.0245],
    ],
  },
  {
    label: "5–8 m.s.n.m. (Medio)",
    color: "#f59e0b",
    positions: [
      [10.5865, -75.0270],
      [10.5850, -75.0260],
      [10.5840, -75.0250],
      [10.5842, -75.0240],
      [10.5850, -75.0230],
    ],
  },
  {
    label: "8–15 m.s.n.m. (Alto)",
    color: "#16a34a",
    positions: [
      [10.5875, -75.0250],
      [10.5865, -75.0240],
      [10.5855, -75.0230],
      [10.5860, -75.0220],
      [10.5870, -75.0215],
    ],
  },
  {
    label: "> 15 m.s.n.m. (Cerro)",
    color: "#7c3aed",
    positions: [
      [10.5882, -75.0235],
      [10.5878, -75.0225],
      [10.5880, -75.0218],
      [10.5885, -75.0222],
      [10.5884, -75.0230],
    ],
  },
];

// ── Capa 2: Zonas inundables por nivel de riesgo ──
export const floodZones: MapZone[] = [
  {
    name: "Zona de riesgo ALTO",
    level: "alto",
    color: "#dc2626",
    opacity: 0.35,
    positions: [
      [10.5855, -75.0295],
      [10.5842, -75.0290],
      [10.5825, -75.0280],
      [10.5820, -75.0268],
      [10.5825, -75.0258],
      [10.5835, -75.0265],
      [10.5848, -75.0278],
    ],
  },
  {
    name: "Zona de riesgo MEDIO",
    level: "medio",
    color: "#f97316",
    opacity: 0.3,
    positions: [
      [10.5835, -75.0265],
      [10.5825, -75.0258],
      [10.5822, -75.0248],
      [10.5830, -75.0240],
      [10.5840, -75.0245],
      [10.5845, -75.0255],
    ],
  },
  {
    name: "Zona de riesgo BAJO",
    level: "bajo",
    color: "#eab308",
    opacity: 0.25,
    positions: [
      [10.5845, -75.0255],
      [10.5840, -75.0245],
      [10.5830, -75.0240],
      [10.5835, -75.0230],
      [10.5845, -75.0225],
      [10.5855, -75.0235],
      [10.5855, -75.0248],
    ],
  },
];

// ── Capa 3: Puntos estratégicos (refugios, evacuación, atención) ──
export const strategicPoints: MapPoint[] = [
  {
    name: "I.E. Técnica de La Peña",
    position: [10.5860, -75.0235],
    type: "Albergue temporal principal con capacidad para 200+ personas.",
    emoji: "🏫",
    color: "#0ea5e9",
  },
  {
    name: "Puesto de Salud",
    position: [10.5837, -75.0240],
    type: "Centro de triaje y atención médica de emergencia.",
    emoji: "🏥",
    color: "#0ea5e9",
  },
  {
    name: "Ruta de Evacuación Norte",
    position: [10.5870, -75.0210],
    type: "Vía principal hacia Sabanalarga (terreno alto).",
    emoji: "🚗",
    color: "#0ea5e9",
  },
  {
    name: "Ruta de Evacuación Sur",
    position: [10.5820, -75.0235],
    type: "Vía alterna hacia Repelón.",
    emoji: "🛣️",
    color: "#0ea5e9",
  },
  {
    name: "Centro de Acopio - Iglesia",
    position: [10.5841, -75.0249],
    type: "Punto de distribución de ayuda humanitaria.",
    emoji: "📦",
    color: "#0ea5e9",
  },
];

// ── Capa 4: Vulnerabilidad arquitectónica ──
export const architecturalZones: {
  name: string;
  position: [number, number];
  vulnerability: "alta" | "media" | "baja";
  material: string;
  type: string;
  color: string;
  emoji: string;
}[] = [
  {
    name: "Sector Malecón",
    position: [10.5845, -75.0280],
    vulnerability: "alta",
    material: "Bahareque / madera",
    type: "Viviendas precarias en zona ribereña, alto riesgo de colapso.",
    color: "#dc2626",
    emoji: "🏚️",
  },
  {
    name: "Sector Calle 3-4",
    position: [10.5830, -75.0262],
    vulnerability: "alta",
    material: "Bloque sin refuerzo",
    type: "Construcciones sin cimentación adecuada en zona baja.",
    color: "#dc2626",
    emoji: "🧱",
  },
  {
    name: "Sector Centro",
    position: [10.5843, -75.0250],
    vulnerability: "media",
    material: "Bloque con columnas",
    type: "Viviendas con estructura parcial, vulnerables a inundación prolongada.",
    color: "#f97316",
    emoji: "🏠",
  },
  {
    name: "Sector Cerro",
    position: [10.5870, -75.0225],
    vulnerability: "baja",
    material: "Concreto reforzado",
    type: "Construcciones en terreno elevado con estructura sólida.",
    color: "#16a34a",
    emoji: "🏗️",
  },
  {
    name: "Sector Escolar",
    position: [10.5858, -75.0238],
    vulnerability: "baja",
    material: "Concreto reforzado",
    type: "Infraestructura institucional en buen estado.",
    color: "#16a34a",
    emoji: "🏢",
  },
];
