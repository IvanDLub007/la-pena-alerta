import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { School } from "lucide-react";

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LA_PENA_CENTER: [number, number] = [10.5436, -75.0625];

// Approximate critical zone polygons
const zones = [
  {
    name: "Barrio Puerto Bello",
    color: "#ef4444",
    positions: [
      [10.5455, -75.0645],
      [10.5465, -75.0630],
      [10.5450, -75.0620],
      [10.5440, -75.0635],
    ] as [number, number][],
  },
  {
    name: "Malecón",
    color: "#ef4444",
    positions: [
      [10.5430, -75.0640],
      [10.5440, -75.0625],
      [10.5425, -75.0615],
      [10.5415, -75.0630],
    ] as [number, number][],
  },
  {
    name: "Plaza Principal",
    color: "#f97316",
    positions: [
      [10.5438, -75.0628],
      [10.5445, -75.0620],
      [10.5438, -75.0612],
      [10.5431, -75.0620],
    ] as [number, number][],
  },
];

// Shelter location
const SHELTER: [number, number] = [10.5420, -75.0610];

const shelterIcon = L.divIcon({
  html: `<div style="background:#22c55e;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">🏫</div>`,
  iconSize: [32, 32],
  className: "",
});

export default function RiskMap() {
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="p-4 bg-card space-y-2">
        <h2 className="text-lg font-bold text-foreground">Mapa de Riesgo</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-destructive inline-block" /> Zona crítica
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded inline-block" style={{ background: "#f97316" }} /> Zona de riesgo
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded inline-block" style={{ background: "#22c55e" }} /> Albergue
          </span>
        </div>
      </div>

      <div className="flex-1">
        <MapContainer
          center={LA_PENA_CENTER}
          zoom={16}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {zones.map((zone) => (
            <Polygon
              key={zone.name}
              positions={zone.positions}
              pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.35, weight: 2 }}
            >
              <Popup>
                <strong>{zone.name}</strong>
                <br />
                Zona de riesgo por inundación
              </Popup>
            </Polygon>
          ))}

          <Marker position={SHELTER} icon={shelterIcon}>
            <Popup>
              <strong>I.E. Técnica de La Peña</strong>
              <br />
              Albergue temporal / Punto de encuentro
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
