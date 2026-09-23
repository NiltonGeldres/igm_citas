import React, { useEffect } from 'react';
import { RefreshCw, Save, Calendar, ArrowRight, X } from 'lucide-react';

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
import ModalExitoFirma from './AtencionMedicaFirma/ModalExitoFirma';
import './styles/medico-app-hce.css';
//import { useAtencionMedica } from './hooks/useAtencionMedica';
import { useAtencionContext } from '../../apps/medicos-app/context/AtencionProvider';
import AtencionMedicaHeader from './components/AtencionMedicaHeader';
import AtencionMedicaFirmaPanelV1 from './AtencionMedicaFirma/AtencionMedicaFirmaPanelV1';

function AtencionMedicaForm() {
  const {
    activeTab,
    setActiveTab,
    modalMessage,
    isAgendaOpen,
    setIsAgendaOpen,
    modoImpresion,
    datosGuardadosExito,
    mostrarModalExito,
    patientData,
    sectionsData,
    estadoGuardado,
    cargandoTriaje,
    estadoFirma,
    urlJsonFirmadoBackend,
    rutaPdfFirmado,
    documentosPdf, 
    handleTriajeChange,
    guardarAtencionBorrador,
    closeModal,
    handleSectionContentChange,
    handleSelectPaciente,
    crearPdfBorrador, 
    handleFinalizarFlujoYRegresar,
    showModalMessage,
    refrescarEstadoFirma
  } = useAtencionContext();
//  } = useAtencionMedica();

  // CONTROL DE APERTURA INICIAL/ESTADO DE AGENDA
  // Si no hay paciente, se exige la agenda. Si ya hay paciente seleccionado, el modal permanece cerrado.
  useEffect(() => {
    if (!patientData?.id) {
      setIsAgendaOpen(true);
    } else {
      setIsAgendaOpen(false);
    }
  }, [patientData?.id, setIsAgendaOpen]);

  // Manejador que selecciona paciente y cierra inmediatamente el modal
  const handleSelectPacienteAndClose = (paciente) => {
    handleSelectPaciente(paciente);
    setIsAgendaOpen(false);
  };

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
                patientData={patientData}
                crearPdfBorrador={crearPdfBorrador}
                showModalMessage={showModalMessage}
                estadoFirma={estadoFirma}
                jsonFirmadoUrl={urlJsonFirmadoBackend}
                rutaPdfFirmado={rutaPdfFirmado}
                documentosPdf={documentosPdf}
                refrescarEstadoFirma={refrescarEstadoFirma}
              />                  
            )}
          </>
        ) : (
          /* MENSAJE INICIAL EN LUGAR DEL TEXTO SIMPLE */
          <div className="hce-waiting-placeholder" style={{ padding: '24px 16px', margin: '0' }}>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569' }}>
              Por favor, seleccione un paciente de la lista de citas para cargar su atención.
            </p>
            <button
              type="button"
              onClick={() => setIsAgendaOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0066FF',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: '600',
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 102, 255, 0.2)'
              }}
            >
              <Calendar size={16} />
              <span>Ver Lista de Citas</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* 3. BOTÓN GUARDAR FLOTANTE */}
      {activeTab !== 'signature' && patientData.estadoFirma === "BORRADOR" && patientData.id && (
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

      {/* 4. MODAL FLOTANTE DE CITAS */}
      {isAgendaOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '58px',
            left: 0,
            right: 0,
            bottom: '60px',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '460px',
              maxHeight: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 10px 28px rgba(0, 0, 0, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              animation: 'fadeInUp 0.2s ease-out'
            }}
          >
            <div 
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#0066FF" />
                <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '700', color: '#0F172A' }}>
                  Lista de Citas Médicas
                </h3>
              </div>

              {/* Botón de cierre activo únicamente cuando existe un paciente seleccionado */}
              {patientData.id && (
                <button 
                  type="button" 
                  onClick={() => setIsAgendaOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Cerrar Citas"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              <AgendaPage onSelectPaciente={handleSelectPacienteAndClose} />
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS DE IMPRESIÓN Y ANIMACIONES */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .print-hidden { display: block; }
        @media print {
          body * { visibility: hidden !important; }
          #documento-clinico-pdf, #documento-clinico-pdf * {
            visibility: ${modoImpresion === 'completo' ? 'visible' : 'hidden'} !important;
          }
          #documento-clinico-pdf {
            position: absolute; left: 0; top: 0; width: 100%; display: ${modoImpresion === 'completo' ? 'block' : 'none'} !important;
          }
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