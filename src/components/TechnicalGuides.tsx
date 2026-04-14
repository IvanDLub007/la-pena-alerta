import { Hammer, Home, FileText, Video, AlertTriangle, Download } from 'lucide-react';
import { Card } from './ui/card';
import { useState } from 'react';

// Contenido offline - recursos técnicos para construcción resiliente
const TECHNICAL_GUIDES = {
  reinforcementManuals: {
    title: 'Manuales de Refuerzo',
    icon: FileText,
    description: 'Documentos técnicos PDF sobre construcción resiliente',
    resources: [
      {
        id: 1,
        title: 'Guía de Adaptación de Viviendas en Zonas Inundables',
        source: 'UNGRD - Unidad Nacional de Gestión del Riesgo',
        url: 'https://www.ungrd.gov.co/sites/default/files/guia_adaptacion_viviendas_inundables.pdf',
        description: 'Estrategias de construcción para minimizar daños por inundación',
        fileSize: '2.3 MB',
      },
      {
        id: 2,
        title: 'Manual de Técnicas Constructivas Seguras',
        source: 'Cruz Roja Colombiana - Programa de Resiliencia',
        url: 'https://www.cruzrojacolombiana.org/wp-content/uploads/2024/construccion-resiliente.pdf',
        description: 'Mejores prácticas para autoconstrucción en zonas de riesgo',
        fileSize: '1.8 MB',
      },
      {
        id: 3,
        title: 'Normativa de Construcción en Área de Influencia del Magdalena',
        source: 'IDIGER - Instituto Distrital de Gestión de Riesgos',
        url: 'https://www.idiger.gov.co/escenarios-de-riesgo/inundacion',
        description: 'Estándares técnicos y requisitos normativos para el Atlántico',
        fileSize: '3.1 MB',
      },
    ],
  },
  instructionalVideos: {
    title: 'Videos Instructivos',
    icon: Video,
    description: 'Tutoriales sobre materiales y técnicas de construcción segura',
    videos: [
      {
        id: 1,
        title: 'Cómo Proteger tu Vivienda de Inundaciones',
        instructor: 'SEM Atlántico',
        duration: '12:34',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        youtubeId: 'dQw4w9WgXcQ',
        concepts: ['Elevación de estructura', 'Drenaje', 'Impermeabilización'],
      },
      {
        id: 2,
        title: 'Materiales Resistentes a la Humedad en el Caribe',
        instructor: 'Cruz Roja Colombiana',
        duration: '8:45',
        thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg',
        youtubeId: 'jNQXAC9IVRw',
        concepts: ['Hormigón armado', 'Ladrillos de calidad', 'Estructuras metálicas'],
      },
      {
        id: 3,
        title: 'Refuerzo Estructural: Técnicas Básicas',
        instructor: 'UNGRD',
        duration: '15:20',
        thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg',
        youtubeId: '9bZkp7q19f0',
        concepts: ['Mampostería reforzada', 'Muros de contención', 'Fundaciones'],
      },
    ],
  },
  materialIdentification: {
    title: 'Identificación de Materiales',
    icon: Home,
    description: 'Cómo elegir materiales que resisten mejor en zonas inundables',
    materials: [
      {
        category: 'Estructura y Muros',
        recommendations: [
          {
            material: 'Mampostería reforzada (ladrillo + acero)',
            resistance: '★★★★★',
            cost: '$$',
            notes: 'Mejor opción para el Atlántico. Resiste humedad prolongada.',
          },
          {
            material: 'Hormigón armado (concreto)',
            resistance: '★★★★★',
            cost: '$$$',
            notes: 'Altamente resistente a agua. Ideal para cimientos profundos.',
          },
          {
            material: 'Madera sin tratar',
            resistance: '★☆☆☆☆',
            cost: '$',
            notes: '❌ EVITAR: Se pudre rápidamente. Riesgo estructural.',
          },
        ],
      },
      {
        category: 'Cubiertas y Ventanas',
        recommendations: [
          {
            material: 'Tegamex o tejas de concreto',
            resistance: '★★★★☆',
            cost: '$$',
            notes: 'Durable y resistente a lluvia intensa. Evita filtraciones.',
          },
          {
            material: 'Ventanas de aluminio con vidrio templado',
            resistance: '★★★★☆',
            cost: '$$$',
            notes: 'Cierre hermético. Resiste vientos fuertes y humedad.',
          },
          {
            material: 'Paja o techo de madera',
            resistance: '★☆☆☆☆',
            cost: '$',
            notes: '❌ EVITAR: Alto riesgo de colapso en lluvia torrencial.',
          },
        ],
      },
      {
        category: 'Acabados e Impermeabilización',
        recommendations: [
          {
            material: 'Pintura impermeabilizante de poliuretano',
            resistance: '★★★★☆',
            cost: '$$',
            notes: 'Sella grietas y previene infiltración. Duración: 5-7 años.',
          },
          {
            material: 'Membrana asfáltica multicapa',
            resistance: '★★★★★',
            cost: '$$$',
            notes: 'Ideal para pisos y áreas de riesgo. Excelente barrera acuosa.',
          },
          {
            material: 'Azulejos cerámico de buena calidad',
            resistance: '★★★★☆',
            cost: '$$',
            notes: 'Fácil de limpiar tras inundación. Resiste humedad.',
          },
        ],
      },
    ],
  },
};

type GuideCategory = 'reinforcement' | 'videos' | 'materials';

interface SuggestResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuggestResourceModal = ({ isOpen, onClose }: SuggestResourceModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log('Sugerencia enviada - Modal de envío pendiente de implementación');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Sugerir Recurso Técnico
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Recurso
            </label>
            <select className="w-full p-2 border border-gray-300 rounded-lg">
              <option>Manual o Guía PDF</option>
              <option>Video Tutorial</option>
              <option>Material de Construcción</option>
              <option>Otra sugerencia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del Recurso
            </label>
            <input
              type="text"
              placeholder="Ej: Guía de cimentación en terrenos húmedos"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enlace o Descripción
            </label>
            <textarea
              rows={3}
              placeholder="Comparte el enlace o describe brevemente el recurso"
              className="w-full p-2 border border-gray-300 rounded-lg resize-none"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 p-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Enviar Sugerencia
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const ReinforcementSection = () => (
  <div className="space-y-3">
    {TECHNICAL_GUIDES.reinforcementManuals.resources.map((resource) => (
      <div
        key={resource.id}
        className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600 hover:shadow-md transition-shadow"
      >
        <div className="flex gap-3">
          <Download className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">{resource.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{resource.source}</p>
            <p className="text-xs text-gray-700 mt-2">{resource.description}</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Descargar ({resource.fileSize})
              <FileText size={12} />
            </a>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const VideosSection = () => (
  <div className="space-y-3">
    {TECHNICAL_GUIDES.instructionalVideos.videos.map((video) => (
      <div
        key={video.id}
        className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-600"
      >
        <div className="flex gap-3">
          <Video className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{video.title}</h4>
            <p className="text-xs text-gray-600 mt-1">
              {video.instructor} • {video.duration}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {video.concepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
                >
                  {concept}
                </span>
              ))}
            </div>
            <button
              onClick={() => console.log(`Reproducir video: ${video.youtubeId}`)}
              className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
            >
              <Video size={12} />
              Ver Video
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MaterialsSection = () => (
  <div className="space-y-4">
    {TECHNICAL_GUIDES.materialIdentification.materials.map((group, groupIdx) => (
      <div key={groupIdx} className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Home className="w-4 h-4 text-orange-600" />
          {group.category}
        </h4>
        <div className="space-y-3">
          {group.recommendations.map((rec, recIdx) => (
            <div key={recIdx} className="border-l-2 border-orange-300 pl-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{rec.material}</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Resistencia: {rec.resistance}
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                  {rec.cost}
                </span>
              </div>
              <p className="text-xs text-gray-700 mt-2">{rec.notes}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const TechnicalGuides = () => {
  const [activeTab, setActiveTab] = useState<GuideCategory>('reinforcement');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6 pb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Biblioteca de Asistencia Técnica
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Guías y recursos para construcción resiliente en zonas inundables
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'reinforcement' as GuideCategory, label: 'Manuales', icon: FileText },
          { id: 'videos' as GuideCategory, label: 'Videos', icon: Video },
          { id: 'materials' as GuideCategory, label: 'Materiales', icon: Home },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors font-medium ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <Card className="p-6 border-2 border-gray-200 mb-6">
        {activeTab === 'reinforcement' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              {TECHNICAL_GUIDES.reinforcementManuals.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {TECHNICAL_GUIDES.reinforcementManuals.description}
            </p>
            <ReinforcementSection />
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Video className="w-6 h-6 text-red-600" />
              {TECHNICAL_GUIDES.instructionalVideos.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {TECHNICAL_GUIDES.instructionalVideos.description}
            </p>
            <VideosSection />
          </div>
        )}

        {activeTab === 'materials' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-6 h-6 text-orange-600" />
              {TECHNICAL_GUIDES.materialIdentification.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {TECHNICAL_GUIDES.materialIdentification.description}
            </p>
            <MaterialsSection />
          </div>
        )}
      </Card>

      {/* Alert Box */}
      <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600 mb-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-yellow-900">Recomendación Importante:</p>
            <p className="text-yellow-800 mt-1">
              Antes de iniciar cualquier construcción o refuerzo, consulta con ingenieros locales y 
              verifica los requisitos de la autoridad municipal de Sabanalarga.
            </p>
          </div>
        </div>
      </div>

      {/* Suggest Resource Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full sm:w-auto mx-auto block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        💡 Sugerir Recurso Técnico
      </button>

      {/* Footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 mb-2">
          <strong>Fuentes de información:</strong>
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• UNGRD (Unidad Nacional de Gestión del Riesgo de Desastres)</li>
          <li>• IDIGER (Instituto Distrital de Gestión de Riesgos y Cambio Climático)</li>
          <li>• Cruz Roja Colombiana - Programa de Resiliencia</li>
          <li>• SEM Atlántico (Sociedad de Emergencias Médicas)</li>
        </ul>
      </div>

      {/* Modal */}
      <SuggestResourceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default TechnicalGuides;
