import { Droplets, Map, ShieldAlert, Settings, Heart, Hammer } from "lucide-react";

export type Tab = "monitor" | "map" | "emergency" | "resilience" | "guides" | "admin";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "monitor", label: "Nivel", icon: <Droplets size={22} /> },
  { id: "map", label: "Mapa", icon: <Map size={22} /> },
  { id: "emergency", label: "Emergencia", icon: <ShieldAlert size={22} /> },
  { id: "resilience", label: "Comunidad", icon: <Heart size={22} /> },
  { id: "guides", label: "Técnica", icon: <Hammer size={22} /> },
  { id: "admin", label: "Admin", icon: <Settings size={22} /> },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-20 z-50 safe-area-bottom">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors min-w-[60px] ${
            active === tab.id
              ? "text-accent"
              : "text-muted-foreground"
          }`}
        >
          {tab.icon}
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
