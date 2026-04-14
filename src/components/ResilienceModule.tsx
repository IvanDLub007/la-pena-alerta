import { AlertCircle, Heart, MapPin, Phone } from 'lucide-react';
import { Card } from './ui/card';

// Contenido offline - datos permanentes para cada sección
const RESILIENCE_CONTENT = {
  essentialCare: {
    title: 'Cuidados Esenciales',
    icon: Heart,
    guidelines: [
      {
        subtitle: 'Atención de Menores',
        tips: [
          'Mantener horarios regulares de sueño',
          'Proporcionar alimento cada 3-4 horas',
          'Cambiar pañales regularmente',
          'Mantener la zona limpia y seca',
          'Hablar calmadamente para tranquilizar',
        ],
      },
      {
        subtitle: 'Alimentación',
        tips: [
          'Agua potable: 1-2 litros por persona/día',
          'Hervir agua estancada o de lluvia mínimo 5 minutos',
          'Lavar la parte superior de las latas antes de abrirlas',
          'Alimentos no perecederos: galletas, conservas',
          'Frutas y verduras deshidratadas',
          'Leche en polvo para menores',
        ],
      },
    ],
  },
  healthCare: {
    title: 'Atención Sanitaria',
    icon: AlertCircle,
    protocols: [
      {
        subtitle: 'Primeros Auxilios Básicos',
        guidelines: [
          'Heridas: limpiar con agua y desinfectar',
          '⚠️ PREVENCIÓN: Evitar contacto de heridas con agua estancada',
          'Riesgo: Prevenir leptospirosis por exposición prolongada',
          'Quemaduras: enfriar con agua fría (15 min)',
          'Insolación: trasladar a sombra, hidratación',
          'Dolor: paracetamol o ibuprofeno según edad',
          'Botiquín: gasas, vendajes, antiséptico',
        ],
      },
      {
        subtitle: 'Contactos Emergencia - La Peña',
        contacts: [
          { label: 'Bomberos Sabanalarga', phone: '3106551886' },
          { label: 'Defensa Civil Atlántico', phone: '3118084403' },
        ],
        notes: [
          'Hospital más cercano: 15 minutos a pie',
          'Coordinador médico: está presente 24/7',
        ],
      },
    ],
  },
  shelterOrganization: {
    title: 'Organización del Refugio',
    icon: MapPin,
    sections: [
      {
        subtitle: 'Zonas Seguras en La Peña',
        items: [
          'Identificar iglesias en zonas altas como zonas seguras',
          'Colegios ubicados en terrenos elevados son refugios alternativos',
          'Punto de encuentro principal: Iglesia central de La Peña',
          'Zona de menores: Colegio municipal (primer piso)',
          'Centro de coordinación: Salón comunal (zona alta)',
        ],
      },
      {
        subtitle: 'Acciones Inmediatas',
        items: [
          'Realizar censo inmediato al llegar al refugio',
          'Priorizar registro: menores y adultos mayores primero',
          'Asignar puntos de control para menores dispersos',
          'Establecer sistema de comunicación local',
          'Documentar personas con necesidades especiales',
        ],
      },
      {
        subtitle: 'Roles y Responsabilidades',
        items: [
          'Coordinador general: gestión global',
          'Responsable de menores: cuidado infantil',
          'Responsable médico: atención sanitaria',
          'Responsable de alimentos: distribución',
          'Coordinador de seguridad: orden y protección',
        ],
      },
    ],
  },
};

type CardType = 'essentialCare' | 'healthCare' | 'shelterOrganization';

interface CardContentProps {
  type: CardType;
}

const CardContent = ({ type }: CardContentProps) => {
  const content = RESILIENCE_CONTENT[type];
  const Icon = content.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
      </div>

      {type === 'essentialCare' && (
        <div className="space-y-4">
          {content.guidelines.map((section, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                {section.subtitle}
              </h3>
              <ul className="space-y-1">
                {section.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {type === 'healthCare' && (
        <div className="space-y-4">
          {content.protocols.map((protocol, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                {protocol.subtitle}
              </h3>
              
              {protocol.guidelines && (
                <ul className="space-y-1">
                  {protocol.guidelines.map((guideline, guideIdx) => (
                    <li
                      key={guideIdx}
                      className="text-sm text-gray-700 flex gap-2"
                    >
                      <span className="text-red-600 font-bold">•</span>
                      {guideline}
                    </li>
                  ))}
                </ul>
              )}

              {protocol.contacts && (
                <div className="space-y-2 mt-2">
                  {protocol.contacts.map((contact, contactIdx) => (
                    <a
                      key={contactIdx}
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-semibold"
                    >
                      <Phone size={16} />
                      {contact.label}: {contact.phone}
                    </a>
                  ))}
                </div>
              )}

              {protocol.notes && (
                <ul className="space-y-1 mt-2">
                  {protocol.notes.map((note, noteIdx) => (
                    <li
                      key={noteIdx}
                      className="text-sm text-gray-700 flex gap-2"
                    >
                      <span className="text-red-600 font-bold">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {type === 'shelterOrganization' && (
        <div className="space-y-4">
          {content.sections.map((section, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                {section.subtitle}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ResilienceModule = () => {
  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Resiliencia Comunitaria
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Información esencial para mantener la seguridad y el bienestar
        </p>
      </div>

      {/* Grid de 3 tarjetas - Mobile First */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Tarjeta 1: Cuidados Esenciales */}
        <Card className="p-6 border-2 border-gray-200 hover:border-red-600 transition-colors cursor-pointer hover:shadow-lg">
          <CardContent type="essentialCare" />
        </Card>

        {/* Tarjeta 2: Atención Sanitaria */}
        <Card className="p-6 border-2 border-gray-200 hover:border-red-600 transition-colors cursor-pointer hover:shadow-lg">
          <CardContent type="healthCare" />
        </Card>

        {/* Tarjeta 3: Organización del Refugio */}
        <Card className="p-6 border-2 border-gray-200 hover:border-red-600 transition-colors cursor-pointer hover:shadow-lg">
          <CardContent type="shelterOrganization" />
        </Card>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Nota:</strong> Esta información está disponible sin conexión a
          internet. Todos los datos son locales y no requieren conexión de datos.
        </p>
        <p className="text-xs text-gray-400">
          <strong>Fuente de protocolos:</strong> UNGRD, Cruz Roja Colombiana y SEM Atlántico
        </p>
      </div>
    </div>
  );
};

export default ResilienceModule;
