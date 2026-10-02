import { useState, useEffect } from 'react';
import { RefreshCw, Calendar, ArrowRight, ArrowLeft, X, Save } from 'lucide-react';

import MessageModal from './common/MessageModal';
import { AgendaPage } from '../../apps/medicos-app/pages/AgendaPage';
import AtencionMedicaTriajePanel from './AtencionMedicaTriaje/AtencionMedicaTriajePanel';
import AtencionMedicaAntecedentePanel from './AtencionMedicaAntecedente/AtencionMedicaAntecedentePanel';
import AtencionMedicaSintomaPanel from './AtencionMedicaSintoma/AtencionMedicaSintomaPanel';
import AtencionMedicaExamenFisicoPanel from './AtencionMedicaExamenFisico/AtencionMedicaExamenFisicoPanel';
import AtencionMedicaDiagnosticoPanel from './AtencionMedicaDiagnostico/AtencionMedicaDiagnosticoPanel';
import AtencionMedicaExamenPanel from './AtencionMedicaExamen/AtencionMedicaExamenPanel';
import AtencionMedicaMedicamentoPanel from './AtencionMedicaMedicamento/AtencionMedicaMedicamentoPanel';
import AtencionMedicaAltaPanel from './AtencionMedicaAlta/AtencionMedicaAltaPanel';
import AtencionMedicaFirmaPanelV1 from './AtencionMedicaFirma/AtencionMedicaFirmaPanelV1';
import ModalExitoFirma from './AtencionMedicaFirma/ModalExitoFirma';

import { useAtencionContext } from '../../apps/medicos-app/context/AtencionProvider';
import AtencionMedicaHeader from './components/AtencionMedicaHeader';
import './styles/medico-app-hce.css';

// Secuencia de pestañas para navegación paso a paso
const TABS_ORDER = [
  'triaje',
  'diseaseAndExam',
  'diagnosis',
  'exams',
  'medication',
  'discharge',
  'signature'
];
const cardStylePCFixed = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  display: 'flex',
  flexDirection: 'column',
  height: '350px' // Altura fija uniforme para las 6 tarjetas en PC
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const pkiBadgeStyle = {
  backgroundColor: '#f0fdf4',
  color: '#166534',
  fontSize: '11px',
  fontWeight: '600',
  padding: '2px 8px',
  borderRadius: '12px',
  border: '1px solid #bbf7d0'
};

// Hook auxiliar para detectar si la pantalla es móvil (< 768px)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

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

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!patientData?.id) {
      setIsAgendaOpen(true);
    } else {
      setIsAgendaOpen(false);
    }
  }, [patientData?.id, setIsAgendaOpen]);

  const handleSelectPacienteAndClose = (paciente) => {
    handleSelectPaciente(paciente);
    setIsAgendaOpen(false);
  };

  // Funciones de navegación para móvil
  const currentIndex = TABS_ORDER.indexOf(activeTab);
  const handlePrevTab = () => {
    if (currentIndex > 0) {
      setActiveTab(TABS_ORDER[currentIndex - 1]);
    }
  };
  const handleNextTab = () => {
    if (currentIndex < TABS_ORDER.length - 1) {
      setActiveTab(TABS_ORDER[currentIndex + 1]);
    }
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

      {/* 2. ÁREA CENTRAL */}
      <div className="scrollable-content-container-hce" style={{ padding: '16px', backgroundColor: '#f1f5f9' }}>
        {patientData.id ? (
          isMobile ? (
            /* ================= VISTA MÓVIL (Pestañas / Tabs) ================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTab === 'triaje' && (
                <div style={cardStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 1. TRIAJE & SIGNOS VITALES</h3>
                  {cargandoTriaje ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', color: '#64748b' }}>
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
                  )}
                </div>
              )}

              {activeTab === 'diseaseAndExam' && (
                <div style={cardStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 2. ANAMNESIS / EXAMEN FÍSICO</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <AtencionMedicaSintomaPanel
                      content={sectionsData.PanelSintomas}
                      onContentChange={(newList) => handleSectionContentChange('PanelSintomas', newList)}
                      onModalMessage={showModalMessage}
                    />
                    <AtencionMedicaAntecedentePanel
                      content={sectionsData.PanelAntecedentes}
                      onContentChange={(newList) => handleSectionContentChange('PanelAntecedentes', newList)}
                      onModalMessage={showModalMessage}
                    />
                    <AtencionMedicaExamenFisicoPanel
                      content={sectionsData.PanelExamenFisico}
                      onContentChange={(newList) => handleSectionContentChange('PanelExamenFisico', newList)}
                      onModalMessage={showModalMessage}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'diagnosis' && (
                <div style={cardStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 3. DIAGNÓSTICOS (CIE-10)</h3>
                  <AtencionMedicaDiagnosticoPanel
                    content={sectionsData.PanelDiagnostico}
                    onContentChange={(newList) => handleSectionContentChange('PanelDiagnostico', newList)}
                    onModalMessage={showModalMessage}
                  />
                </div>
              )}

              {activeTab === 'exams' && (
                <div style={cardStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 4. ÓRDENES MÉDICAS / PLAN DE TRABAJO</h3>
                  <AtencionMedicaExamenPanel
                    content={sectionsData.PanelPlanTrabajo}
                    onContentChange={(newList) => handleSectionContentChange('PanelPlanTrabajo', newList)}
                    onModalMessage={showModalMessage}
                    diagnosticosDisponibles={sectionsData.PanelDiagnostico}
                  />
                </div>
              )}

              {activeTab === 'medication' && (
                <div style={cardStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 5. RECETA MÉDICA</h3>
                  <AtencionMedicaMedicamentoPanel
                    content={sectionsData.PanelMedicacion}
                    onContentChange={(newList) => handleSectionContentChange('PanelMedicacion', newList)}
                    onModalMessage={showModalMessage}
                    diagnosticosDisponibles={sectionsData.PanelDiagnostico}
                  />
                </div>
              )}

              {activeTab === 'discharge' && (
                <div style={cardStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 6. ALTA Y DESTINO</h3>
                  <AtencionMedicaAltaPanel
                    title="Panel Alta"
                    content={sectionsData.PanelAlta}
                    onContentChange={(newList) => handleSectionContentChange('PanelAlta', newList)}
                    onModalMessage={showModalMessage}
                  />
                </div>
              )}

              {activeTab === 'signature' && (
                <div style={cardStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 7. FIRMA DIGITAL Y CIERRE</h3>
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
                </div>
              )}

              {/* BARRA INFERIOR DE NAVEGACIÓN EN MÓVIL */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handlePrevTab}
                  disabled={currentIndex === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: currentIndex === 0 ? '#f8fafc' : '#ffffff',
                    color: currentIndex === 0 ? '#94a3b8' : '#334155',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  <ArrowLeft size={16} /> Anterior
                </button>

                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
                  Paso {currentIndex + 1} de {TABS_ORDER.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextTab}
                  disabled={currentIndex === TABS_ORDER.length - 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: currentIndex === TABS_ORDER.length - 1 ? '#e2e8f0' : '#0284c7',
                    color: currentIndex === TABS_ORDER.length - 1 ? '#94a3b8' : '#ffffff',
                    cursor: currentIndex === TABS_ORDER.length - 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  Siguiente <ArrowRight size={16} />
                </button>
              </div>
            </div>
) : (
            /* ================= VISTA ESCRITORIO / PC (Grid Simétrico de 3 Columnas x 2 Filas + Firma) ================= */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              alignItems: 'stretch'
            }}>

              {/* 1. TRIAJE & SIGNOS VITALES */}
              <div style={cardStylePCFixed}>
                <div style={cardHeaderStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 1. TRIAJE & SIGNOS VITALES</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {cargandoTriaje ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', color: '#64748b' }}>
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
                  )}
                </div>
              </div>

              {/* 2. ANAMNESIS / EXAMEN FÍSICO */}
              <div style={cardStylePCFixed}>
                <div style={cardHeaderStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 2. ANAMNESIS / EXAMEN FÍSICO</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                  <AtencionMedicaSintomaPanel
                    content={sectionsData.PanelSintomas}
                    onContentChange={(newList) => handleSectionContentChange('PanelSintomas', newList)}
                    onModalMessage={showModalMessage}
                  />
                  <AtencionMedicaAntecedentePanel
                    content={sectionsData.PanelAntecedentes}
                    onContentChange={(newList) => handleSectionContentChange('PanelAntecedentes', newList)}
                    onModalMessage={showModalMessage}
                  />
                  <AtencionMedicaExamenFisicoPanel
                    content={sectionsData.PanelExamenFisico}
                    onContentChange={(newList) => handleSectionContentChange('PanelExamenFisico', newList)}
                    onModalMessage={showModalMessage}
                  />
                </div>
              </div>

              {/* 3. DIAGNÓSTICOS (CIE-10) */}
              <div style={cardStylePCFixed}>
                <div style={cardHeaderStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 3. DIAGNÓSTICOS (CIE-10)</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <AtencionMedicaDiagnosticoPanel
                    content={sectionsData.PanelDiagnostico}
                    onContentChange={(newList) => handleSectionContentChange('PanelDiagnostico', newList)}
                    onModalMessage={showModalMessage}
                  />
                </div>
              </div>

              {/* 4. ÓRDENES MÉDICAS / PLAN DE TRABAJO */}
              <div style={cardStylePCFixed}>
                <div style={cardHeaderStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 4. ÓRDENES MÉDICAS / PLAN DE TRABAJO</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <AtencionMedicaExamenPanel
                    content={sectionsData.PanelPlanTrabajo}
                    onContentChange={(newList) => handleSectionContentChange('PanelPlanTrabajo', newList)}
                    onModalMessage={showModalMessage}
                    diagnosticosDisponibles={sectionsData.PanelDiagnostico}
                  />
                </div>
              </div>

              {/* 5. RECETA MÉDICA */}
              <div style={cardStylePCFixed}>
                <div style={cardHeaderStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 5. RECETA MÉDICA</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <AtencionMedicaMedicamentoPanel
                    content={sectionsData.PanelMedicacion}
                    onContentChange={(newList) => handleSectionContentChange('PanelMedicacion', newList)}
                    onModalMessage={showModalMessage}
                    diagnosticosDisponibles={sectionsData.PanelDiagnostico}
                  />
                </div>
              </div>

              {/* 6. ALTA Y DESTINO */}
              <div style={cardStylePCFixed}>
                <div style={cardHeaderStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 6. ALTA Y DESTINO</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <AtencionMedicaAltaPanel
                    title="Panel Alta"
                    content={sectionsData.PanelAlta}
                    onContentChange={(newList) => handleSectionContentChange('PanelAlta', newList)}
                    onModalMessage={showModalMessage}
                  />
                </div>
              </div>

              {/* 7. CIERRE Y FIRMA DIGITAL (ANCHO COMPLETO INFERIOR) */}
              <div style={{ gridColumn: '1 / -1', ...cardStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={cardHeaderStyle}>
                  <h3 style={titleStyle}><span style={dotStyle} /> 7. CIERRE Y FIRMA DIGITAL</h3>
                  <span style={pkiBadgeStyle}>Refirma PKI</span>
                </div>
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
              </div>

            </div>
          )
        ) : (
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
      {patientData.estadoFirma === "BORRADOR" && patientData.id && (
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
        <div style={{
          position: 'fixed',
          top: '58px', left: 0, right: 0, bottom: '60px',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px'
        }}>
          <div style={{
            width: '100%', maxWidth: '460px', maxHeight: '100%',
            backgroundColor: '#FFFFFF', borderRadius: '16px',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.18)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            border: '1px solid #E2E8F0', animation: 'fadeInUp 0.2s ease-out'
          }}>
            <div style={{
              padding: '14px 18px', borderBottom: '1px solid #F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#FFFFFF'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#0066FF" />
                <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: '700', color: '#0F172A' }}>
                  Lista de Citas Médicas
                </h3>
              </div>
              {patientData.id && (
                <button 
                  type="button" 
                  onClick={() => setIsAgendaOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
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

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const titleStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#0f172a',
  margin: '0 0 4px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textTransform: 'uppercase'
};

const dotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#0284c7',
  display: 'inline-block'
};

export default AtencionMedicaForm;