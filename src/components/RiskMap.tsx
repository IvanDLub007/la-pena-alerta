import { useEffect, useRef, useState } from "react";
import { AlertTriangle, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const STATION_CENTER: [number, number] = [10.57, -75.02];

const safeZones = [
  {
    name: "Cerro de La Peña",
    position: [10.5879, -75.0226] as [number, number],
    type: "Elevación natural más alta, refugio seguro ante inundaciones.",
    emoji: "⛰️",
  },
  {
    name: "Parque Central de La Peña",
    position: [10.5846, -75.0254] as [number, number],
    type: "Área de coordinación comunitaria durante emergencias.",
    emoji: "🏛️",
  },
  {
    name: "Cancha de Fútbol de La Peña",
    position: [10.5852, -75.0268] as [number, number],
    type: "Área abierta para evacuación masiva y logística.",
    emoji: "⚽",
  },
  {
    name: "Iglesia Principal de La Peña",
    position: [10.5841, -75.0249] as [number, number],
    type: "Punto de referencia comunitario central.",
    emoji: "⛪",
  },
  {
    name: "Puesto de Salud de La Peña",
    position: [10.5837, -75.0240] as [number, number],
    type: "Centro de triaje y apoyo médico de emergencia.",
    emoji: "🏥",
  },
];

const riskZones = [
  {
    name: "Calle 3 – Zona de Inundación",
    position: [10.5832, -75.0261] as [number, number],
    type: "Calle de baja elevación históricamente afectada por inundaciones.",
    emoji: "⚠️",
  },
  {
    name: "Calle 4 – Zona Crítica de Inundación",
    position: [10.5827, -75.0264] as [number, number],
    type: "Una de las áreas más vulnerables durante desbordamientos del embalse.",
    emoji: "🚨",
  },
  {
    name: "Malecón / Borde del Embalse",
    position: [10.5848, -75.0286] as [number, number],
    type: "Zona ribereña expuesta directamente al aumento del nivel del Embalse del Guájaro.",
    emoji: "🌊",
  },
];

export default function RiskMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [offline, setOffline] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        if (cancelled || !mapRef.current) return;

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current, {
          center: STATION_CENTER,
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
        tileLayer.on("tileerror", () => setOffline(true));
        tileLayer.addTo(map);

        // Estación hidrológica
        L.marker(STATION_CENTER)
          .addTo(map)
          .bindPopup("<strong>Estación PENA LA [29037050]</strong><br/>Lat: 10.57, Lon: -75.02");

        // Zonas seguras (verde)
        safeZones.forEach((zone) => {
          const icon = L.divIcon({
            html: `<div style="background:#22c55e;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${zone.emoji}</div>`,
            iconSize: [32, 32],
            className: "",
          });
          L.marker(zone.position, { icon })
            .addTo(map)
            .bindPopup(`<strong>${zone.name}</strong><br/>${zone.type}`);
        });

        // Zonas de riesgo (rojo)
        riskZones.forEach((zone) => {
          const icon = L.divIcon({
            html: `<div style="background:#ef4444;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${zone.emoji}</div>`,
            iconSize: [32, 32],
            className: "",
          });
          L.marker(zone.position, { icon })
            .addTo(map)
            .bindPopup(`<strong>${zone.name}</strong><br/>${zone.type}`);
        });

        setLoaded(true);
      } catch {
        setOffline(true);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="p-4 bg-card space-y-2">
        <h2 className="text-lg font-bold text-foreground">Mapa de Riesgo</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-primary" /> Estación hidrológica
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: "#22c55e" }} /> Zona segura
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: "#ef4444" }} /> Zona de riesgo
          </span>
        </div>
      </div>

      {offline && !loaded && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted">
          <AlertTriangle size={48} className="text-destructive mb-4" />
          <p className="text-lg font-semibold text-foreground">Mapa no disponible sin conexión</p>
          <p className="text-muted-foreground mt-2">
            Consulte los protocolos de emergencia en la pestaña "Emergencia".
          </p>
        </div>
      )}

      <div
        ref={mapRef}
        className="flex-1"
        style={{ minHeight: "400px", display: offline && !loaded ? "none" : "block" }}
      />
    </div>
  );
}