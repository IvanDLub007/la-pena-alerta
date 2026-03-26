import { Droplets, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { getAlertLevel, getAlertLabel, getAlertDescription, getWaterLevel, type AlertLevel } from "@/lib/water-level";

const alertIcons: Record<AlertLevel, React.ReactNode> = {
  safe: <ShieldCheck size={64} />,
  warning: <AlertTriangle size={64} />,
  alert: <AlertTriangle size={64} />,
  danger: <ShieldAlert size={64} />,
};

export default function WaterMonitor() {
  const data = getWaterLevel();
  const alert = getAlertLevel(data.level);

  const screenClass = `level-${alert}-screen`;
  const badgeClass = `level-${alert}`;

  return (
    <div className={`min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6 transition-colors duration-500 ${screenClass}`}>
      <div className="text-center space-y-6 max-w-sm w-full">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold ${badgeClass}`}>
          {alertIcons[alert]}
          <span>{getAlertLabel(alert).toUpperCase()}</span>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-base">Embalse del Guájaro</p>
          <div className="flex items-end justify-center gap-2">
            <Droplets size={40} className="text-accent" />
            <span className="text-7xl font-bold tracking-tight text-foreground">
              {data.level.toFixed(2)}
            </span>
          </div>
          <p className="text-xl text-muted-foreground">m.s.n.m.</p>
        </div>

        <p className="text-lg leading-relaxed text-foreground/80 px-4">
          {getAlertDescription(alert)}
        </p>

        <div className="pt-4 space-y-1">
          <p className="text-sm text-muted-foreground">Última actualización</p>
          <p className="text-base text-foreground">
            {new Date(data.timestamp).toLocaleString("es-CO")}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Est. [29037050] — Ingreso manual
          </p>
        </div>

        {/* Threshold reference */}
        <div className="bg-card/50 rounded-xl p-4 text-left space-y-2 mt-6">
          <p className="font-semibold text-sm text-foreground">Umbrales de referencia:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="level-safe px-2 py-1 rounded text-center font-medium">&lt; 4.80m</span>
            <span className="level-warning px-2 py-1 rounded text-center font-medium">4.80 - 5.10m</span>
            <span className="level-alert px-2 py-1 rounded text-center font-medium">5.10 - 5.20m</span>
            <span className="level-danger px-2 py-1 rounded text-center font-medium">&gt; 5.20m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
