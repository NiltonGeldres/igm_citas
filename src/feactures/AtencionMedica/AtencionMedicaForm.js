

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
  // 📍 Variables agregadas para resolver los errores de ESLint:
  estadoGuardado,
  cargandoTriaje,
  handleTriajeChange,
  finalizarAtencionMedicaTotal,
  // --------------------------------------------------------
  closeModal,
  handleSectionContentChange,
  handleSelectPaciente,
  ejecutarGuardadoYFirmaFinal,
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
                      subTabFirma={subTabFirma}
                      setSubTabFirma={setSubTabFirma}
                      sectionsData={sectionsData}
                      ejecutarGuardadoYFirmaFinal={ejecutarGuardadoYFirmaFinal}
                      imprimirFichaCompleta={imprimirFichaCompleta}
                      imprimirDocumentosPaciente={imprimirDocumentosPaciente}
                      modoImpresion={modoImpresion}
                      fullMedicalRecord={fullMedicalRecord}
                      showModalMessage={showModalMessage}
                      patientData={patientData}
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


/*
  const perfil = JSON.parse(sessionStorage.getItem('user_profile'));
  const [datosGuardadosExito, setDatosGuardadosExito] = useState(null); 
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('triaje');
  const [modalMessage, setModalMessage] = useState('');
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [modoImpresion, setModoImpresion] = useState('completo'); 
  const [subTabFirma, setSubTabFirma] = useState('vista-ficha'); 
  const [pacienteActivo, setPacienteActivo] = useState(null); 
  const [cargandoTriaje, setCargandoTriaje] = useState(false);

  const [patientData, setPatientData] = useState(() => {
    if (location.state?.paciente) {
      const p = location.state.paciente;
      return {
        name: p.nombres,
        sex: p.sexo,
        age: p.edad ? `${p.edad} años` : 'Edad',
        id: p.id,
        hc: p.numHistoria || p.id,
        accionAgenda: location.state.accionAgenda || 'ATENDER'
      };
    }
    return { name: '', sex: '', age: 'Edad', id: '', hc: '', accionAgenda: 'ATENDER', triaje: [] };
  });
  const [sectionsData, setSectionsData] = useState({
  triaje: [],
  PanelAntecedentes: [], // 👈 Cambiado a arreglo
  PanelExamenFisico: [],  // 👈 Cambiado a arreglo
  PanelSintomas: [],      // 👈 Cambiado a arreglo
  PanelTratamientos: [],
  PanelDiagnostico: [],
  PanelPlanTrabajo: [],
  PanelMedicacion: [],   // 👈 Cambiado a arreglo
  PanelAlta: [],         // 👈 Cambiado a arreglo
  });
  const [cargando, setCargando] = useState(false);



  useEffect(() => {
    if (location.state?.paciente) {
      setPacienteActivo(location.state.paciente);
    }
  }, [location.state]);

  useEffect(() => {
    if (!patientData?.id) return;

    const cargarDatosTriajeDelPaciente = async () => {
      console.log(JSON.stringify(patientData))
      try {
        setCargandoTriaje(true);
        console.log(`📡 Consumiendo Triaje para Paciente ID: ${patientData.id} - Acción: ${patientData.accionAgenda}`);
        
        const signosVitalesProcesados = await AtencionMedicaTriajeService.obtenerTriajePorPaciente(
          patientData.id,
          patientData.accionAgenda
        );

        setPatientData(prev => ({
          ...prev,
          triaje: signosVitalesProcesados
        }));

        console.log(`📊 [Sincronización Directa] Signos vitales incrustados en patientData con éxito.`);
      } catch (error) {
        console.error("❌ Falló la sincronización del componente de triajes:", error);
      } finally {
        setCargandoTriaje(false);
      }
    };

    cargarDatosTriajeDelPaciente();
  }, [patientData?.id, patientData?.accionAgenda]);

  const handleTriajeChange = (nuevosSignos) => {
    if (!patientData.id) return;
    
    setPatientData(prev => ({
      ...prev,
      triaje: nuevosSignos
    }));
  };

  const fullMedicalRecord = {
    patient: patientData, 
    attentionDetails: {
      ...sectionsData,
      PanelDiagnostico: Array.isArray(sectionsData.PanelDiagnostico) ? sectionsData.PanelDiagnostico : []
    },
    timestamp: new Date().toISOString(),
  };

  const ejecutarPersistenciaAutomatica = async (record) => {
    if (patientData.id) {
      await AtencionMedicaService.guardarRegistro(record);
    }
  };
 // const estadoGuardado = useDebounceSave(fullMedicalRecord, ejecutarPersistenciaAutomatica, 2000);
  const estadoGuardado = "";

  useEffect(() => {
    if (!patientData.id) {
      setIsAgendaOpen(true);
    }
  }, [patientData.id]);

// AtencionMedicaContext.jsx o AtencionMedicaPage.jsx
  const handleSelectPaciente = (pacienteSeleccionado) => {
    if (!pacienteSeleccionado) return;

   const accionGatillada = 
      pacienteSeleccionado.accionAgenda || 
      (pacienteSeleccionado.atendido === true ? 'ACTUALIZAR' : 'ATENDER');    

      setPacienteActivo(pacienteSeleccionado);

      setPatientData({
        name: pacienteSeleccionado.nombres || '',
        sex: pacienteSeleccionado.sexo || 'N/A',
        age: pacienteSeleccionado.edad ? `${pacienteSeleccionado.edad} años` : 'N/A',
        id: pacienteSeleccionado.id, // idPaciente
        hc: pacienteSeleccionado.idCita || pacienteSeleccionado.numHistoria || pacienteSeleccionado.id,
        
        // 📍 Captura de Identificadores
        idCuentaAtencion: pacienteSeleccionado.idCuentaAtencion || pacienteSeleccionado.idCita,
        idServicio: pacienteSeleccionado.idServicio || 1,
        
        // 👈 idEspecialidad capturado directamente desde la API de Citas
        idEspecialidad: pacienteSeleccionado.idEspecialidad || null, 
        idPaciente: pacienteSeleccionado.idPaciente, // 36
        idCuentaAtencion: pacienteSeleccionado.idCuentaAtencion , 
        idServicio: pacienteSeleccionado.idServicio || 1, // 1
        idCita: pacienteSeleccionado.idCita, // 35

        accionAgenda: accionGatillada
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

    showModalMessage('Procesando el guardado clínico y aplicando rúbrica...');
    
    try {
      // 1. Enviamos el registro completo al Backend
      // El backend interceptará el ID del médico logueado, guardará en BD y estampará la rúbrica en el PDF
      const response = await AtencionMedicaService.guardarYFirmarAtencion(fullMedicalRecord);
      
      // 2. Cerramos el modal de carga inicial
      closeModal();

      // 3. Almacenamos la respuesta del backend (que contiene las URLs de los PDFs oficiales)
      setDatosGuardadosExito(response.data); 
      setMostrarModalExito(true); // Abrimos la ventana/modal de éxito controlada

    } catch (error) {
      console.error(error);
      showModalMessage(`Error al cerrar ciclo: ${error.message}`);
    }
  };

 const ejecutarGuardadoYFirmaFinal = async () => {
  if (!patientData.id) {
    showModalMessage('Por favor, selecciona un paciente antes de procesar.');
    return;
  }
    console.log("PAYLOAD   "+JSON.stringify(patientData));

  try {
    // 1. Obtener el contexto del usuario en sesión
    console.log("PAYLOAD   Ingreso  TRY ");
    const contextoUsuario = {
      idMedico: sessionStorage.getItem('idMedico') || 2,
      idEntidad: sessionStorage.getItem('idEntidad') || 2,
      idUsuario: sessionStorage.getItem('idUsuario') || 12,
    };

    console.log("PAYLOAD   Antes de Mapper "+JSON.stringify(sectionsData));
    // 2. Mapear datos hacia la estructura que espera Spring Boot
    const payload = AtencionMedicaMapper.uiToApiRequest(patientData, sectionsData, contextoUsuario);
    console.log("PAYLOAD   "+JSON.stringify(payload))
    // 3. Invocar al backend
    const response = await AtencionMedicaService.guardarAtencionCompleta(payload);

    if (response.exito) {
      console.log("Atención guardada exitosamente. ID:", response.idAtencion);
      // Actualizar estados o abrir modal de éxito
    }

  } catch (error) {
    const apiErrors = error.response?.data?.errors;
    const errorMsg = apiErrors ? JSON.stringify(apiErrors) : error.message;
    showModalMessage(`Error al validar el registro: ${errorMsg}`);
  }
 };
  // Función para limpiar el formulario y regresar a la agenda cuando el médico termine de imprimir
  const handleFinalizarFlujoYRegresar = () => {
    setMostrarModalExito(false);
    setDatosGuardadosExito(null);
    setPacienteActivo(null);
    setPatientData({ 
            name: ''
          , sex: ''
          , age: 'Edad'
          , id: ''
          , hc: ''
          , accionAgenda: 'ATENDER'
    });
  setSectionsData({
    triaje: [],
    PanelAntecedentes: [],
    PanelExamenFisico: [],
    PanelSintomas: [],
    PanelTratamientos: [],
    PanelDiagnostico: [],
    PanelPlanTrabajo: [],
    PanelMedicacion: [],
    PanelAlta: []
  });
    setIsAgendaOpen(true); // Reabre la agenda para el siguiente paciente
  };

  const imprimirFichaCompleta = () => {
    setModoImpresion('completo');
    setTimeout(() => { window.print(); }, 150);
  };

  const imprimirDocumentosPaciente = () => {
    setModoImpresion('desglosado');
    setTimeout(() => { window.print(); }, 150);
  };
*/



/*
  const finalizarAtencionMedicaTotal = async () => {
    if (!patientData.id) {
      showModalMessage('Por favor, selecciona un paciente antes de cerrar la atención.');
      return;
    }

    showModalMessage('Procesando el alta y cierre clínico...');
    try {
      await AtencionMedicaService.guardarRegistro(fullMedicalRecord);
      showModalMessage('¡Atención médica finalizada y guardada con éxito!');
      
      setPacienteActivo(null);
      setPatientData({ name: '', sex: '', age: 'Edad', id: '', hc: '', accionAgenda: 'ATENDER', triaje: [] });
      
      setSectionsData({
        PanelAntecedentes: '', 
        PanelExamenFisico: '', 
        PanelSintomas: '',
        PanelTratamientos: [], 
        PanelDiagnostico: [], 
        PanelPlanTrabajo: [], 
        PanelMedicacion: '',
        PanelAlergias: '', 
        Impresion: '', 
        PanelAlta: ''
      });
      
      setIsAgendaOpen(true);
    } catch (error) {
      console.error(error);
      showModalMessage(`Error al cerrar ciclo: ${error.message}`);
    }
  };

*/


/*
  useEffect(() => {
    const precargarCatalogo = async () => {
      try {
        setCargando(true);
        // Al montar el formulario, se descarga y almacena en memoria RAM una sola vez
        await getCatalogoInit(perfil?.idEntidad);
      } catch (error) {
        console.error("Fallo al precargar el catálogo de atención médica", error);
      } finally {
        setCargando(false);
      }
    };

    precargarCatalogo();
  }, []);
*/


  /*
// --- Reemplazar o actualizar esta función ---
  const ejecutarGuardadoYFirmaFinal = async () => {
    if (!patientData.id) {
      showModalMessage('Por favor, selecciona un paciente antes de cerrar la atención.');
      return;
    }
    showModalMessage('Guardando historial clínico y aplicando rúbrica médica...');
    try {
    console.log("ENVIO "+JSON.stringify(fullMedicalRecord))
      // Invocamos al nuevo endpoint unificado del Service
      const response = await AtencionMedicaService.guardarYFirmarAtencion(fullMedicalRecord);
      
      closeModal(); // Cierra el mensaje de carga "Guardando..."
      
      // Guardamos la respuesta (URLs de los PDFs) y abrimos el modal de éxito directo
      setDatosGuardadosExito(response.data); 
      setMostrarModalExito(true); 

    } catch (error) {
      console.error("Error al firmar y guardar:", error);
      showModalMessage(`No se pudo procesar la firma: ${error.message}`);
    }
  };
  */


  /*
  const handleSelectPaciente = (pacienteSeleccionado) => {
//    alert(JSON.stringify(pacienteSeleccionado))
    if (!pacienteSeleccionado) return;

    setPacienteActivo(pacienteSeleccionado);
    const accionGatillada = 
      pacienteSeleccionado.accionAgenda || 
      (pacienteSeleccionado.atendido === true ? 'ACTUALIZAR' : 'ATENDER');

    console.log(`📥 [Formulario] Capturando estado del paciente: ${pacienteSeleccionado.nombres} -> Estado: ${accionGatillada}`);

    setPatientData({
      name: pacienteSeleccionado.nombres || 
            `${pacienteSeleccionado.apellidoPaterno || ''} ${pacienteSeleccionado.apellidoMaterno || ''}`.trim(),
      sex: pacienteSeleccionado.sexo || 'N/A',
      age: pacienteSeleccionado.edad ? `${pacienteSeleccionado.edad} años` : 'Edad',
      id: pacienteSeleccionado.id,
      hc: pacienteSeleccionado.idCita || pacienteSeleccionado.numHistoria || pacienteSeleccionado.id,
      accionAgenda: accionGatillada,
      triaje: [] 
    });

    setIsAgendaOpen(false);
  };
*/

{/* 
                  {activeTab === 'signature' && (
                    <div className="sub-window-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      
                      {// Sub-Botonera Superior: Conmutador de ventanas en Pantalla /}
                      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setSubTabFirma('vista-ficha')}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: subTabFirma === 'vista-ficha' ? '#e0f2fe' : 'transparent', color: subTabFirma === 'vista-ficha' ? '#0369a1' : '#64748b', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            <Layout size={15} />
                            <span>Historia</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSubTabFirma('vista-documentos')}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: subTabFirma === 'vista-documentos' ? '#dcfce7' : 'transparent', color: subTabFirma === 'vista-documentos' ? '#15803d' : '#64748b', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            <Pill size={15} />
                            <span>Órden y Receta ({sectionsData.PanelTratamientos?.length + sectionsData.PanelPlanTrabajo?.length})</span>
                          </button>
                        </div>

                        {// Botón de Acción Principal unificado para Guardar/Firmar todo el acto /}
                          <button
                            type="button"
                            onClick={ejecutarGuardadoYFirmaFinal}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '10px 18px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 4px rgba(220,38,38,0.2)' }}
                          >
                          <Save size={16} />
                          <span>Guardar </span>
                        </button>
                      </div>

                      {// SUBVENTANA 1: PANEL DE LA FICHA CLÍNICA COMPLETA /}
                      {subTabFirma === 'vista-ficha' && (
                        <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="no-print" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={imprimirFichaCompleta}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0066ff', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                            >
                              <FileText size={14} /> Imprimir HC
                            </button>
                          </div>
                          
                          <div id="documento-clinico-pdf" className={modoImpresion === 'completo' ? '' : 'print-hidden'}>
                            <AtencionMedicaFirmaPanel
                              medicalRecordData={fullMedicalRecord}
                              onModalMessage={showModalMessage}
                            />
                          </div>
                        </div>
                      )}

                      {// SUBVENTANA 2: CUPONES DE ATENCIÓN AL PACIENTE /}
                      {subTabFirma === 'vista-documentos' && (
                        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div className="no-print" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Estos documentos se imprimen desglosados en hojas independientes para el paciente.</span>
                            <button
                              type="button"
                              onClick={imprimirDocumentosPaciente}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                            >
                              <Pill size={14} /> Imprimir
                            </button>
                          </div>

                          {// Renderizado exclusivo en pantalla dentro de su propia subventana /}
                          <div id="documentos-desglosados-paciente" className={modoImpresion === 'desglosado' ? '' : 'print-hidden'} style={{ fontFamily: 'sans-serif' }}>
                            
                            {// RECETA FARMACIA /}
                            {sectionsData.PanelTratamientos?.length > 0 && (
                              <div style={{ backgroundColor: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '20px', pageBreakInside: 'avoid', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
                                  <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>📋 RECETA MÉDICA (FARMACIA)</h3>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
                                </div>
                                <div style={{ backgroundColor: '#f8fafc', padding: '8px', fontSize: '12px', borderRadius: '4px', marginBottom: '10px', color: '#334155' }}>
                                  <strong>Paciente:</strong> {patientData.name} &nbsp;|&nbsp; <strong>H.C.:</strong> {patientData.hc || 'N/A'}
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Medicamento / Presentación</th>
                                      <th style={{ padding: '6px', textAlign: 'center', color: '#475569', width: '80px' }}>Cant.</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sectionsData.PanelTratamientos.map((item, idx) => (
                                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '6px', color: '#1e293b' }}>💊 <strong>{item.descripcion}</strong></td>
                                        <td style={{ padding: '6px', textAlign: 'center', fontWeight: '700', color: '#16a34a', fontSize: '14px' }}>{item.cantidad} u.</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                                  <div style={{ width: '200px', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '11px', paddingTop: '4px', color: '#475569' }}>Firma y Sello Médico</div>
                                </div>
                                <div className="no-print" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '10px', marginTop: '15px', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>✂️ CORTAR AQUÍ ✂️</div>
                              </div>
                            )}

                            {// INDICACIONES PACIENTE /}
                            {sectionsData.PanelTratamientos?.length > 0 && (
                              <div style={{ backgroundColor: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '20px', pageBreakInside: 'avoid', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
                                  <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>📌 INDICACIONES DE USO (PACIENTE)</h3>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
                                </div>
                                <div style={{ backgroundColor: '#f8fafc', padding: '8px', fontSize: '12px', borderRadius: '4px', marginBottom: '10px', color: '#334155' }}>
                                  <strong>Paciente:</strong> {patientData.name} &nbsp;|&nbsp; <strong>H.C.:</strong> {patientData.hc || 'N/A'}
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Medicamento</th>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Vía</th>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Dosis</th>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Frecuencia</th>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Duración</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sectionsData.PanelTratamientos.map((item, idx) => (
                                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '6px', fontWeight: '600', color: '#1e293b' }}>{item.descripcion}</td>
                                        <td style={{ padding: '6px', color: '#334155' }}>{item.via || 'Oral'}</td>
                                        <td style={{ padding: '6px', color: '#334155' }}>{item.dosis}</td>
                                        <td style={{ padding: '6px', color: '#334155' }}>Cada {item.frecuencia} hrs</td>
                                        <td style={{ padding: '6px', fontWeight: '700', color: '#2563eb' }}>{item.periodo} días</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                {sectionsData.PanelAlta && (
                                  <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#fff7ed', borderRadius: '4px', border: '1px solid #ffedd5', fontSize: '11px', color: '#c2410c' }}>
                                    <strong>⚠️ Indicación Especial:</strong> {sectionsData.PanelAlta}
                                  </div>
                                )}
                                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                                  <div style={{ width: '200px', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '11px', paddingTop: '4px', color: '#475569' }}>Indicaciones Médicas</div>
                                </div>
                                <div className="no-print" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '10px', marginTop: '15px', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>✂️ CORTAR AQUÍ ✂️</div>
                              </div>
                            )}

                            {// ORDEN DE EXÁMENES /}
                            {sectionsData.PanelPlanTrabajo?.length > 0 && (
                              <div style={{ backgroundColor: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '20px', pageBreakInside: 'avoid', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
                                  <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>🔬 ORDEN DE EXÁMENES AUXILIARES</h3>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
                                </div>
                                <div style={{ backgroundColor: '#f8fafc', padding: '8px', fontSize: '12px', borderRadius: '4px', marginBottom: '10px', color: '#334155' }}>
                                  <strong>Paciente:</strong> {patientData.name} &nbsp;|&nbsp; <strong>H.C.:</strong> {patientData.hc || 'N/A'}
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                  <thead>
                                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569', width: '120px' }}>Código</th>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Examen / Procedimiento</th>
                                      <th style={{ padding: '6px', textAlign: 'left', color: '#475569', width: '120px' }}>Área</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sectionsData.PanelPlanTrabajo.map((item, idx) => (
                                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '6px', fontFamily: 'monospace', color: '#64748b' }}>{item.codigoProcedimiento || 'N/A'}</td>
                                        <td style={{ padding: '6px', fontWeight: '600', color: '#1e293b' }}>🔬 {item.examen}</td>
                                        <td style={{ padding: '6px' }}><span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' }}>{item.tipoExamen || 'Laboratorio'}</span></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                                  <div style={{ width: '200px', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '11px', paddingTop: '4px', color: '#475569' }}>Médico Solicitante</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
 */}
{/*          <div className="fixed-header-wrapper-hce">
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
                      <Calendar size={14} style={{ marginRight: '4px' }} />
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
*/}