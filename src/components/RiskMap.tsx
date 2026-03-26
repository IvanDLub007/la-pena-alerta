import { useEffect, useRef, useState } from "react";
import { AlertTriangle, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const STATION_CENTER: [number, number] = [10.57, -75.02];

const zones = [
  {
    name: "Barrio Puerto Bello",
    positions: [
      [10.5455, -75.0645],
      [10.5465, -75.0630],
      [10.5450, -75.0620],
      [10.5440, -75.0635],
    ] as [number, number][],
  },
  {
    name: "Malecón",
    positions: [
      [10.5430, -75.0640],
      [10.5440, -75.0625],
      [10.5425, -75.0615],
      [10.5415, -75.0630],
    ] as [number, number][],
  },
  {
    name: "Plaza Principal",
    positions: [
      [10.5438, -75.0628],
      [10.5445, -75.0620],
      [10.5438, -75.0612],
      [10.5431, -75.0620],
    ] as [number, number][],
  },
];

const SHELTER: [number, number] = [10.5420, -75.0610];

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

        // Fix default icons
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

        tileLayer.on("tileerror", () => {
          setOffline(true);
        });

        tileLayer.addTo(map);

        // Station marker
        L.marker(STATION_CENTER)
          .addTo(map)
          .bindPopup("<strong>Estación PENA LA [29037050]</strong><br/>Lat: 10.57, Lon: -75.02");

        // Risk zones
        zones.forEach((zone) => {
          L.polygon(zone.positions, {
            color: "#ef4444",
            fillColor: "#ef4444",
            fillOpacity: 0.35,
            weight: 2,
          })
            .addTo(map)
            .bindPopup(`<strong>${zone.name}</strong><br/>Zona de riesgo por inundación`);
        });

        // Shelter marker
        const shelterIcon = L.divIcon({
          html: `<div style="background:#22c55e;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🏫</div>`,
          iconSize: [32, 32],
          className: "",
        });

        L.marker(SHELTER, { icon: shelterIcon })
          .addTo(map)
          .bindPopup("<strong>I.E. Técnica de La Peña</strong><br/>Albergue temporal / Punto de encuentro");

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
            <span className="w-4 h-4 rounded bg-destructive inline-block" /> Zona crítica
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded inline-block" style={{ background: "#22c55e" }} /> Albergue
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-primary" /> Estación hidrológica
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
