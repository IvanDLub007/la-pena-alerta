import { AlertTriangle, Phone, MapPin, Package, Radio, Users, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <Radio size={28} />,
    title: "Manténgase informado",
    desc: "Escuche las alertas de la comunidad y revise esta aplicación frecuentemente.",
  },
  {
    icon: <Package size={28} />,
    title: "Prepare su kit de emergencia",
    desc: "Agua, alimentos no perecederos, documentos en bolsa plástica, linterna, radio, medicamentos.",
  },
  {
    icon: <MapPin size={28} />,
    title: "Conozca la ruta de evacuación",
    desc: "Diríjase a la Institución Educativa Técnica de La Peña (albergue temporal).",
  },
  {
    icon: <Users size={28} />,
    title: "Ayude a los más vulnerables",
    desc: "Niños, adultos mayores y personas con discapacidad necesitan apoyo especial.",
  },
  {
    icon: <AlertTriangle size={28} />,
    title: "Durante la inundación",
    desc: "No cruce corrientes de agua. Desconecte electricidad y gas. Suba a pisos altos si no puede evacuar.",
  },
  {
    icon: <Phone size={28} />,
    title: "Números de emergencia",
    desc: "Bomberos: 119 | Cruz Roja: 132 | Defensa Civil: 144 | Línea de emergencia: 123",
  },
];

export default function EmergencyGuide() {
  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 pb-8 space-y-4">
      <div className="bg-destructive/20 border border-destructive/40 rounded-xl p-4 text-center">
        <h2 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
          <AlertTriangle size={24} />
          Qué Hacer en Caso de Emergencia
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Protocolo basado en guías UNGRD
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="bg-card rounded-xl p-4 flex gap-4 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-accent">
              {step.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-base">{step.title}</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-foreground">Punto de encuentro y albergue</h3>
        <div className="flex items-center gap-3 text-sm">
          <MapPin size={20} className="text-accent flex-shrink-0" />
          <span className="text-foreground">
            I.E. Técnica de La Peña — Albergue temporal autorizado
          </span>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground pt-2">
        Esta información se guarda automáticamente para consulta sin internet.
      </p>
    </div>
  );
}
