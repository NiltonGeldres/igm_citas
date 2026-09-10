
import { useState } from 'react';
import {  RefreshCw, Save} from 'lucide-react';

import MessageModal from './common/MessageModal';
import { AgendaPage } from '../../apps/medicos-app/pages/AgendaPage';
import AtencionMedicaMedicamentoPanel from './AtencionMedicaMedicamento/AtencionMedicaMedicamentoPanel';
import AtencionMedicaAltaPanel from './AtencionMedicaAlta/AtencionMedicaAltaPanel'; 
import AtencionMedicaAntecedentePanel from './AtencionMedicaAntecedente/AtencionMedicaAntecedentePanel';
import AtencionMedicaExamenFisicoPanel from './AtencionMedicaExamenFisico/AtencionMedicaExamenFisicoPanel';
import AtencionMedicaSintomaPanel from './AtencionMedicaSintoma/AtencionMedicaSintomaPanel';
import AtencionMedicaDiagnosticoPanel from './AtencionMedicaDiagnostico/AtencionMedicaDiagnosticoPanel';
import AtencionMedicaExamenPanel from './AtencionMedicaExamen/AtencionMedicaExamenPanel';
import AtencionMedicaTriajePanel from './AtencionMedicaTriaje/AtencionMedicaTriajePanel'; 
import ModalExitoFirma  from './AtencionMedicaFirma/ModalExitoFirma';
import './styles/medico-app-hce.css';
import { useAtencionMedica } from './hooks/useAtencionMedica';
import AtencionMedicaHeader from './components/AtencionMedicaHeader';
import AtencionMedicaFirmaPanelV1 from './AtencionMedicaFirma/AtencionMedicaFirmaPanelV1';

function AtencionMedicaForm() {
// 1. Estados para controlar el flujo de firma y JSON del backend

const {
  activeTab,
  setActiveTab,
  subTabFirma,
  setSubTabFirma,
  modalMessage,
  isAgendaOpen,
  setIsAgendaOpen,
  modoImpresion,
  datosGuardadosExito,
  mostrarModalExito,
  patientData,
  sectionsData,
  fullMedicalRecord,
  estadoGuardado,
  cargandoTriaje,
  estadoFirma,
  urlJsonFirmadoBackend,
  rutaPdfFirmado,
   documentosPdf, 
  handleTriajeChange,
  guardarAtencionBorrador,
  // --------------------------------------------------------
  closeModal,
  handleSectionContentChange,
  handleSelectPaciente,
  crearPdfBorrador , 
//  ejecutarGuardadoYFirmaFinal,
  handleFinalizarFlujoYRegresar,
  imprimirFichaCompleta,
  imprimirDocumentosPaciente,
  showModalMessage
} = useAtencionMedica();
  return (
    <div className="main-layout-hce fullscreen-process-mode">
          
          {/* 1. SECCIÓN FIJA SUPERIOR */}

          <AtencionMedicaHeader 
            patientData={patientData}
            estadoGuardado={estadoGuardado}
            onOpenAgenda={() => setIsAgendaOpen(true)}

            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />          

          {/* 2. ÁREA CENTRAL CON SCROLL INDEPENDIENTE */}
          <div className="scrollable-content-container-hce">
              {patientData.id ? (
                <>
                  {activeTab === 'triaje' && (
                      cargandoTriaje ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: '#64748b', fontSize: '13px', fontWeight: '500' }}>
                          <RefreshCw size={16} className="spinner-sync" style={{ marginRight: '8px' }} />
                          <span>Cargando Signos Vitales...</span>
                        </div>
                      ) : (
                        <AtencionMedicaTriajePanel 
                          key={`triaje-${patientData.id}-${patientData.idCita || 'nuevo'}`}
                          content={sectionsData.PanelTriaje || []}
                          onContentChange={handleTriajeChange}
                          onModalMessage={showModalMessage}
                          idPacienteSeleccionado={patientData.id} 
                        /> 
                      )               
                    )}

                  

                  {activeTab === 'diseaseAndExam' && (
                    <>
                      <AtencionMedicaAntecedentePanel
                        content={sectionsData.PanelAntecedentes}
                        onContentChange={(newContent) => handleSectionContentChange('PanelAntecedentes', newContent)}
                        onModalMessage={showModalMessage}
                      />
                      <AtencionMedicaSintomaPanel
                        content={sectionsData.PanelSintomas}
                        onContentChange={(newContent) => handleSectionContentChange('PanelSintomas', newContent)}
                        onModalMessage={showModalMessage}
                      />
                      <AtencionMedicaExamenFisicoPanel
                        content={sectionsData.PanelExamenFisico}
                        onContentChange={(newContent) => handleSectionContentChange('PanelExamenFisico', newContent)}
                        onModalMessage={showModalMessage}
                      />
                    </>
                  )}

                  {activeTab === 'diagnosis' && (
                    <AtencionMedicaDiagnosticoPanel
                      content={sectionsData.PanelDiagnostico}
                      onContentChange={(newList) => handleSectionContentChange('PanelDiagnostico', newList)}
                      onModalMessage={showModalMessage}
                    />
                  )}

                  {activeTab === 'exams' && (
                    <AtencionMedicaExamenPanel
                      content={sectionsData.PanelPlanTrabajo}
                      onContentChange={(newList) => handleSectionContentChange('PanelPlanTrabajo', newList)}
                      onModalMessage={showModalMessage}
                      diagnosticosDisponibles={sectionsData.PanelDiagnostico}
                    />
                  )}

                  {activeTab === 'medication' && (
                    <AtencionMedicaMedicamentoPanel
                      content={sectionsData.PanelMedicacion}
                      onContentChange={(newList) => {
//                          handleSectionContentChange('PanelTratamientos', newList);
                          handleSectionContentChange('PanelMedicacion', newList);
                        }}
                      onModalMessage={showModalMessage}
                      diagnosticosDisponibles={sectionsData.PanelDiagnostico}

                    />
                  )}

                  {activeTab === 'discharge' && (
                    <AtencionMedicaAltaPanel
                      title="Panel Alta"
                      content={sectionsData.PanelAlta}
                      onContentChange={(newContent) => handleSectionContentChange('PanelAlta', newContent)}
                      onModalMessage={showModalMessage}
                    />
                  )}

{activeTab === 'signature' && (
  <AtencionMedicaFirmaPanelV1
    sectionsData={sectionsData}
    crearPdfBorrador={crearPdfBorrador}
    imprimirDocumentosPaciente={imprimirDocumentosPaciente}
    showModalMessage={showModalMessage}
    estadoFirma={estadoFirma}
    jsonFirmadoUrl={urlJsonFirmadoBackend}
    rutaPdfFirmado={rutaPdfFirmado}
    documentosPdf={documentosPdf} // 🟢 ENLACE CON EL HOOK
  />
)}
                </>
              ) : (
                <div className="hce-waiting-placeholder">
                  <p>Por favor, despliegue la agenda para cargar la atención del paciente asignado.</p>
                </div>
              )}
          </div>


          

          {/* 3. BOTÓN GUARDAR FLOTANTE FIJO ESTILO FAB (Oculto en firma porque ya tiene su botón de acción arriba) */}
          {activeTab !== 'signature' && patientData.id && (
            <button 
              type="button"
              onClick={guardarAtencionBorrador}
              className="hce-floating-action-button"
              title="Finalizar y Guardar Atención"
              aria-label="Finalizar y Guardar Atención"
            >
              <Save size={28} color="#ffffff" strokeWidth={2} />
              <span className="fab-tooltip">Finalizar Atención</span>
            </button>
          )}

          {/* 4. PANEL LATERAL DESPLEGABLE */}
          {isAgendaOpen && (
            <div className="agenda-offcanvas-overlay">
              <div className="agenda-offcanvas-content">
                <div className="agenda-offcanvas-header">
                  <h3>Lista de Citas Médicas</h3>
                  <button 
                    type="button" 
                    className="close-offcanvas-btn" 
                    onClick={() => {
                      if (patientData.id) setIsAgendaOpen(false);
                      else showModalMessage("Debe seleccionar un paciente para comenzar.");
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="agenda-offcanvas-scroll-zone">
                  <AgendaPage onSelectPaciente={handleSelectPaciente} />
                </div>
              </div>
            </div>
          )}

        {/* CSS Reactivo Estricto para Impresión Física en Papel */}
        <style>{`
          .print-hidden { display: block; }
          @media print {
            body * { visibility: hidden !important; }
            
            /* Impresión - Ficha Médica Completa */
            #documento-clinico-pdf, #documento-clinico-pdf * {
              visibility: ${modoImpresion === 'completo' ? 'visible' : 'hidden'} !important;
            }
            #documento-clinico-pdf {
              position: absolute; left: 0; top: 0; width: 100%; display: ${modoImpresion === 'completo' ? 'block' : 'none'} !important;
            }

            /* Impresión - Cupones Desglosados */
            #documentos-desglosados-paciente, #documentos-desglosados-paciente * {
              visibility: ${modoImpresion === 'desglosado' ? 'visible' : 'hidden'} !important;
            }
            #documentos-desglosados-paciente {
              position: absolute; left: 0; top: 0; width: 100%; display: ${modoImpresion === 'desglosado' ? 'block' : 'none'} !important;
            }

            .no-print { display: none !important; }
            .print-hidden { display: none !important; }
            @page { size: A4 portrait; margin: 10mm 15mm; }
          }
        `}</style>

        <MessageModal message={modalMessage} onClose={closeModal} />

        <ModalExitoFirma 
          isOpen={mostrarModalExito} 
          documentos={datosGuardadosExito?.documentos} 
          onCerrar={handleFinalizarFlujoYRegresar} 
        />

    </div>
  );
}

export default AtencionMedicaForm;

//                patientData={patientData}
                //ejecutarGuardadoYFirmaFinal={ejecutarGuardadoYFirmaFinal}
//                fullMedicalRecord={fullMedicalRecord}
