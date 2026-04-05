import { Layers, Mountain, Droplets, Shield, Building2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export interface LayerState {
  elevation: boolean;
  flood: boolean;
  strategic: boolean;
  architectural: boolean;
}

interface Props {
  layers: LayerState;
  onToggle: (key: keyof LayerState) => void;
}

const LAYER_CONFIG = [
  { key: "elevation" as const, label: "Elevación", icon: Mountain, desc: "Curvas de nivel del terreno" },
  { key: "flood" as const, label: "Zonas inundables", icon: Droplets, desc: "Riesgo alto / medio / bajo" },
  { key: "strategic" as const, label: "Puntos estratégicos", icon: Shield, desc: "Refugios, rutas, centros" },
  { key: "architectural" as const, label: "Vulnerabilidad", icon: Building2, desc: "Tipología constructiva" },
];

export default function MapLayerControls({ layers, onToggle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-2 right-2 z-[1000]">
      <button
        onClick={() => setOpen(!open)}
        className="bg-card text-foreground p-2 rounded-lg shadow-lg border border-border"
        aria-label="Capas del mapa"
      >
        <Layers size={22} />
      </button>

      {open && (
        <div className="mt-2 bg-card border border-border rounded-lg shadow-xl p-3 w-64 space-y-3">
          <p className="text-sm font-bold text-foreground">Capas analíticas</p>
          {LAYER_CONFIG.map((l) => (
            <div key={l.key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <l.icon size={16} className="text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">{l.label}</p>
                  <p className="text-xs text-muted-foreground leading-tight truncate">{l.desc}</p>
                </div>
              </div>
              <Switch
                checked={layers[l.key]}
                onCheckedChange={() => onToggle(l.key)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
