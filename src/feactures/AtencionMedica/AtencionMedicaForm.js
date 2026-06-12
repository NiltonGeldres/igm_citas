import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Thermometer, Stethoscope, Lightbulb, Microscope, Pill, 
  CheckCircle, PenTool, User, Cloud, RefreshCw, Calendar, Save 
} from 'lucide-react';
import MessageModal from './common/MessageModal';
import AtencionMedicaService from "./AtencionMedicaService";
import { useDebounceSave } from './useDebounceSave'; 

import { AgendaPage } from '../../apps/medicos-app/pages/AgendaPage';

import AtencionMedicaMedicamentoPanel from './AtencionMedicaMedicamento/AtencionMedicaMedicamentoPanel';
import AtencionMedicaAltaPanel from './AtencionMedicaAlta/AtencionMedicaAltaPanel'; 
import AtencionMedicaAntecedentePanel from './AtencionMedicaAntecedente/AtencionMedicaAntecedentePanel';
import AtencionMedicaExamenFisicoPanel from './AtencionMedicaExamenFisico/AtencionMedicaExamenFisicoPanel';
import AtencionMedicaSintomaPanel from './AtencionMedicaSintoma/AtencionMedicaSintomaPanel';
import AtencionMedicaDiagnostico from './AtencionMedicaDiagnostico/AtencionMedicaDiagnostico';
import AtencionMedicaExamen from './AtencionMedicaExamen/AtencionMedicaExamen';
import AtencionMedicaTriaje from './AtencionMedicaTriaje/AtencionMedicaTriajePanel'; 
import FirmaPeruPanel from '../../shared/components/FirmaPeru/FirmaPeruPanel';

import './styles/medico-app-hce.css';
import { formatCapitalize } from './utils/textFormatter';

function AtencionMedicaForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('triaje');
  const [modalMessage, setModalMessage] = useState('');
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);

  const [patientData, setPatientData] = useState(() => {
    if (location.state?.paciente) {
      const p = location.state.paciente;
      return {
        name: p.nombres,
        sex: p.sexo,
        age: p.edad ? `${p.edad} años` : 'Edad',
        id: p.id,
        hc: p.numHistoria || p.id,
      };
    }
    return { name: '', sex: '', age: 'Edad', id: '', hc: '' };
  });

  const [sectionsData, setSectionsData] = useState({
    PanelTriaje: [], 
    PanelAntecedentes: '',
    PanelExamenFisico: '',
    PanelSintomas: '',
    PanelTratamientos: [],
    PanelDiagnostico: [],
    PanelPlanTrabajo: [],
    PanelMedicacion: '',
    PanelAlergias: '',
    Impresion: '',
    PanelAlta: '',
  });

  const fullMedicalRecord = {
    patient: patientData,
    attentionDetails: sectionsData,
    timestamp: new Date().toISOString(),
  };

  const ejecutarPersistenciaAutomatica = async (record) => {
    if (patientData.id) {
      await AtencionMedicaService.guardarRegistro(record);
    }
  };

  const estadoGuardado = useDebounceSave(fullMedicalRecord, ejecutarPersistenciaAutomatica, 2000);

  useEffect(() => {
    if (!patientData.id) {
      setIsAgendaOpen(true);
    }
  }, [patientData.id]);

  const handleSelectPaciente = (pacienteLimpio) => {
    setPatientData({
      name: pacienteLimpio.nombres || `${pacienteLimpio.apellidoPaterno} ${pacienteLimpio.apellidoMaterno || ''}`,
      sex: pacienteLimpio.sexo,
      age: pacienteLimpio.edad ? `${pacienteLimpio.edad} años` : 'Edad',
      id: pacienteLimpio.id,
      hc: pacienteLimpio.numHistoria || pacienteLimpio.id,
    });
    setIsAgendaOpen(false);
  };

  const showModalMessage = (message) => {
    setModalMessage(message);
  };

  const closeModal = () => {
    setModalMessage('');
  };

  const handleSectionContentChange = (sectionName, newContent) => {
    setSectionsData(prev => ({
      ...prev,
      [sectionName]: newContent,
    }));
  };

  const finalizarAtencionMedicaTotal = async () => {
    if (!patientData.id) {
      showModalMessage('Por favor, selecciona un paciente antes de cerrar la atención.');
      return;
    }

    showModalMessage('Procesando el alta y cierre clínico...');
    try {
        await AtencionMedicaService.guardarRegistro(fullMedicalRecord);
        showModalMessage('¡Atención médica finalizada con éxito!');
        
        setPatientData({ name: '', sex: '', age: 'Edad', id: '', hc: '' });
        setSectionsData({
          PanelTriaje: [], PanelAntecedentes: '', PanelExamenFisico: '', PanelSintomas: '',
          PanelTratamientos: [], PanelDiagnostico: [], PanelPlanTrabajo: [], PanelMedicacion: '',
          PanelAlergias: '', Impresion: '', PanelAlta: ''
        });
        
        setIsAgendaOpen(true);
    } catch (error) {
        console.error(error);
        showModalMessage(`Error al cerrar ciclo: ${error.message}`);
    }
  };

  const menuItems = [
    { id: 'triaje', label: 'Triaje', icon: Thermometer },
    { id: 'diseaseAndExam', label: 'Enfermedad', icon: Stethoscope },
    { id: 'diagnosis', label: 'Diagnóstico', icon: Lightbulb },
    { id: 'exams', label: 'Exámenes', icon: Microscope },
    { id: 'medication', label: 'Medicación', icon: Pill },
    { id: 'discharge', label: 'Alta', icon: CheckCircle },
    { id: 'signature', label: 'Firma', icon: PenTool },
  ];

  return (
    <div className="main-layout-hce fullscreen-process-mode">
          
          {/* 1. SECCIÓN FIJA SUPERIOR */}
          <div className="fixed-header-wrapper-hce">
              <div className="patient-summary-card-hce">
                {patientData.id ? (
                  <div className="patient-title-row-hce">
                    <div className="patient-avatar-inline-hce">
                      <User size={20} color="#0070da" strokeWidth={2.5} />
                    </div>
                    <h2 className="patient-summary-name-hce">
                      {formatCapitalize(patientData.name)}
                    </h2>

                    <button 
                      type="button" 
                      className="btn-change-patient-trigger"
                      onClick={() => setIsAgendaOpen(true)}
                    >
                      <Calendar size={14} style={{ marginRight: '4px' }} />
                      Cambiar
                    </button>

                    <div className={`status-cloud-indicator sync-${estadoGuardado}`}>
                      {estadoGuardado === 'saving' && <RefreshCw size={14} className="spinner-sync" />}
                      {estadoGuardado === 'saved' && <Cloud size={14} className="cloud-success" />}
                      {estadoGuardado === 'idle' && <Cloud size={14} className="cloud-idle" />}
                      {estadoGuardado === 'error' && <Cloud size={14} className="cloud-error" />}
                      <span className="sync-text-label">
                        {estadoGuardado === 'saving' && 'Guardando...'}
                        {estadoGuardado === 'saved' && 'Sincronizado'}
                        {estadoGuardado === 'idle' && 'HCE Sincronizada'}
                        {estadoGuardado === 'error' && 'Error de red'}
                      </span>
                    </div>                  
                  </div>
                ) : (
                  <div className="patient-title-row-hce empty-patient-header-state">
                    <h2 className="patient-summary-name-hce" style={{ color: '#64748b' }}>
                      Ningún paciente seleccionado
                    </h2>
                    <button 
                      type="button" 
                      className="btn-open-agenda-main"
                      onClick={() => setIsAgendaOpen(true)}
                    >
                      Cargar Lista de Citas
                    </button>
                  </div>
                )}
                
                <div className="patient-metrics-row-hce">
                  <div className="patient-metric-block-hce">
                    <span className="patient-metric-label-hce">Sexo</span>
                    <span className="patient-metric-value-hce">
                      {patientData.sex ? formatCapitalize(patientData.sex) : 'N/A'}
                    </span>
                  </div>
                  <div className="patient-metric-block-hce">
                    <span className="patient-metric-label-hce">Edad</span>
                    <span className="patient-metric-value-hce">
                      {patientData.age ? patientData.age : 'Edad'}
                    </span>
                  </div>
                  <div className="patient-metric-block-hce">
                    <span className="patient-metric-label-hce">N° Historia</span>
                    <span className="patient-metric-value-hce hc-highlight">
                      {patientData.hc || '---'}
                    </span>
                  </div>
                </div>
              </div>

            {/* 💡 REDISEÑO: Contenedor con estructura estilo Tabs Médicos tradicionales */}
            <div className="hce-tabs-navigation-container">
              <div className="hce-tabs-track">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      disabled={!patientData.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`hce-tab-item ${isActive ? 'is-active' : ''}`}
                      style={{ opacity: patientData.id ? 1 : 0.5 }}
                    >
                      <IconComponent size={16} className="hce-tab-icon" />
                      <span className="hce-tab-text">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
          </div>

          {/* 2. ÁREA CENTRAL CON SCROLL INDEPENDIENTE */}
          <div className="scrollable-content-container-hce">
              {patientData.id ? (
                <>
                  {activeTab === 'triaje' && (
                    <AtencionMedicaTriaje
                      content={sectionsData.PanelTriaje}
                      onContentChange={(newList) => handleSectionContentChange('PanelTriaje', newList)}
                      onModalMessage={showModalMessage}
                    />
                  )}

                  {activeTab === 'diseaseAndExam' && (
                    <>
                      <AtencionMedicaAntecedentePanel
                        content={sectionsData.PanelAntecedentes}
                        onContentChange={(newContent) => handleSectionContentChange('PanelAntecedentes', newContent)}
                        onModalMessage={showModalMessage}
                      />
                      <AtencionMedicaExamenFisicoPanel
                        content={sectionsData.PanelExamenFisico}
                        onContentChange={(newContent) => handleSectionContentChange('PanelExamenFisico', newContent)}
                        onModalMessage={showModalMessage}
                      />
                      <AtencionMedicaSintomaPanel
                        content={sectionsData.PanelSintomas}
                        onContentChange={(newContent) => handleSectionContentChange('PanelSintomas', newContent)}
                        onModalMessage={showModalMessage}
                      />
                    </>
                  )}

                  {activeTab === 'diagnosis' && (
                    <AtencionMedicaDiagnostico
                      content={sectionsData.PanelDiagnostico}
                      onContentChange={(newList) => handleSectionContentChange('PanelDiagnostico', newList)}
                      onModalMessage={showModalMessage}
                    />
                  )}

                  {activeTab === 'exams' && (
                    <AtencionMedicaExamen
                      content={sectionsData.PanelPlanTrabajo}
                      onContentChange={(newList) => handleSectionContentChange('PanelPlanTrabajo', newList)}
                      onModalMessage={showModalMessage}
                      diagnosticosDisponibles={sectionsData.PanelDiagnostico}
                    />
                  )}

                  {activeTab === 'medication' && (
                    <AtencionMedicaMedicamentoPanel
                      content={sectionsData.PanelTratamientos}
                      onContentChange={(newList) => handleSectionContentChange('PanelTratamientos', newList)}
                      onModalMessage={showModalMessage}
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
                    <FirmaPeruPanel
                      medicalRecordData={{ patient: patientData, attentionDetails: sectionsData }}
                      onModalMessage={showModalMessage}
                    />
                  )}
                </>
              ) : (
                <div className="hce-waiting-placeholder">
                  <p>Por favor, despliegue la agenda para cargar la atención del paciente asignado.</p>
                </div>
              )}
          </div>

          {/* 💡 SOLUCIÓN: Botón Guardar Flotante Fijo estilo FAB (Siempre visible) */}
          {activeTab !== 'signature' && patientData.id && (
            <button 
              type="button"
              onClick={finalizarAtencionMedicaTotal}
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

        <MessageModal message={modalMessage} onClose={closeModal} />
    </div>
  );
}

export default AtencionMedicaForm;