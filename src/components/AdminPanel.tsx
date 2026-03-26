import { useState } from "react";
import { Lock, Save, LogOut } from "lucide-react";
import { saveWaterLevel, getWaterLevel } from "@/lib/water-level";

const ADMIN_PIN = "2741";

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [level, setLevel] = useState(() => getWaterLevel().level.toString());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("PIN incorrecto");
    }
  };

  const handleSave = () => {
    const num = parseFloat(level);
    if (isNaN(num) || num < 0 || num > 10) {
      setError("Ingrese un valor entre 0 y 10 metros");
      return;
    }
    saveWaterLevel({
      level: num,
      timestamp: new Date().toISOString(),
      updatedBy: "admin",
    });
    setSaved(true);
    setError("");
    setTimeout(() => setSaved(false), 3000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6">
        <div className="bg-card rounded-2xl p-8 w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <Lock size={48} className="mx-auto text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Panel Administrativo</h2>
            <p className="text-muted-foreground">Ingrese el PIN de acceso</p>
          </div>

          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="••••"
            className="w-full text-center text-3xl tracking-[0.5em] py-4 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-accent"
          />

          {error && <p className="text-destructive text-center font-medium">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-accent text-accent-foreground rounded-xl text-lg font-bold active:scale-95 transition-transform"
          >
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6">
      <div className="bg-card rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Actualizar Nivel</h2>
          <button
            onClick={() => setAuthenticated(false)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut size={24} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Nivel del Embalse (m.s.n.m.)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full text-center text-4xl py-4 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && <p className="text-destructive text-center font-medium">{error}</p>}

        {saved && (
          <p className="text-center font-medium" style={{ color: "hsl(142, 71%, 45%)" }}>
            ✓ Nivel actualizado correctamente
          </p>
        )}

        <button
          onClick={handleSave}
          className="w-full py-4 bg-accent text-accent-foreground rounded-xl text-lg font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Save size={24} />
          Guardar Nivel
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Est. [29037050] suspendida — Ingreso manual autorizado
        </p>
      </div>
    </div>
  );
}
