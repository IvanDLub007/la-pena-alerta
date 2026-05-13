import { useState } from 'react';
import { ReportForm } from './ReportForm';
import { ReportsMap } from './ReportsMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Map, FileText } from 'lucide-react';

export const CrowdsourcingModule = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReportSuccess = () => {
    // Cambiar a tab de mapa y actualizar
    setActiveTab('map');
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 sm:p-6 flex-shrink-0">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Crowdsourcing de Emergencias
        </h1>
        <p className="text-red-100">
          Reporta situaciones en tiempo real y ayuda a las autoridades a responder
        </p>
      </div>

      {/* Alert Info */}
      <div className="bg-blue-50 border-b border-blue-200 p-4 flex-shrink-0">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-semibold">
              Tu información salva vidas
            </p>
            <p className="text-sm text-blue-800 mt-1">
              Cada reporte con ubicación GPS y fotos ayuda a las autoridades a entender mejor
              la situación y responder más rápidamente. Tu privacidad está protegida.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full overflow-hidden">
          <TabsList className="sticky top-0 z-[100] w-full rounded-none border-b border-gray-200 bg-gray-50 flex-shrink-0 shadow-md">
            <TabsTrigger
              value="map"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-600"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa de Reportes</span>
              <span className="sm:hidden">Mapa</span>
            </TabsTrigger>
            <TabsTrigger
              value="form"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-600"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Reporte</span>
              <span className="sm:hidden">Reportar</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Mapa */}
          <TabsContent value="map" className="flex-1 p-0 border-0 overflow-visible">
            <ReportsMap key={refreshTrigger} />
          </TabsContent>

          {/* Tab: Formulario */}
          <TabsContent value="form" className="flex-1 p-4 sm:p-6 border-0 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <ReportForm onSuccess={handleReportSuccess} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 text-center flex-shrink-0">
        <p className="text-xs text-gray-600 max-w-2xl mx-auto">
          <strong>Fuente de protocolos:</strong> UNGRD, Cruz Roja Colombiana, IDIGER y SEM
          Atlántico. Los datos se almacenan de forma segura y solo autoridades verificadas pueden
          verlos.
        </p>
      </div>
    </div>
  );
};

export default CrowdsourcingModule;
