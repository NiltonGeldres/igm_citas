import { useState, useEffect } from 'react';
import AtencionMedicaService from "../AtencionMedicaService";
import { AtencionMedicaTriajeService } from '../AtencionMedicaTriaje/AtencionMedicaTriajeService';
import { AtencionMedicaMapper } from '../AtencionMedicaMapper';
import { AtencionMedicaSectionsRegistry } from '../AtencionMedicaSectionsRegistry';

export const useAtencionMedica = () => {
  const [atencionCompleta, setAtencionCompleta] = useState(null);
  const [loadingAtencion, setLoadingAtencion] = useState(false);
  const [activeTab, setActiveTab] = useState('triaje');
  const [subTabFirma, setSubTabFirma] = useState('vista-ficha');
  const [modalMessage, setModalMessage] = useState('');
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [modoImpresion, setModoImpresion] = useState('completo');
  const [cargando, setCargando] = useState(false);
  const [cargandoTriaje, setCargandoTriaje] = useState(false);
  const estadoGuardado = "";
  const [datosGuardadosExito, setDatosGuardadosExito] = useState(null);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [pacienteActivo, setPacienteActivo] = useState(null);
  // ENTIDAD DE CABECERA Y CONTEXTO DEL PACIENTE (Sin arreglos clínicos)
  const [patientData, setPatientData] = useState({
    name: '',
    sex: '',
    age: '',
    id: '',
    hc: '',
    idPaciente: null,
    idCita: null,
    idAtencion: null,
    accionAgenda: 'ATENDER'
  });
  // SECCIONES DE FORMULARIO CLÍNICO (El triaje pertenece exclusivamente a esta estructura)
  const [sectionsData, setSectionsData] = useState({
    PanelTriaje: [], 
    PanelAntecedentes: [],
    PanelExamenFisico: [],
    PanelSintomas: [],
    PanelTratamientos: [],
    PanelDiagnostico: [],
    PanelPlanTrabajo: [],
    PanelMedicacion: [],
    PanelAlta: [],
  });

  useEffect(() => {
    if (!patientData.id) {
      setIsAgendaOpen(true);
    }
  }, [patientData.id]);

  const handleTriajeChange = (nuevosSignosVitales) => {
    setSectionsData(prev => ({
      ...prev,
      PanelTriaje: nuevosSignosVitales
    }));
  };

  const showModalMessage = (message) => setModalMessage(message);

  const closeModal = () => setModalMessage('');

  const handleSectionContentChange = (sectionName, newContent) => {
    setSectionsData(prev => ({
      ...prev,
      [sectionName]: newContent,
    }));
  };

  const cargarTriajeDirecto = (accionAgenda, dataAtencionRegistrada = null) => {
    try {
      setCargandoTriaje(true);
      let signosVitalesProcesados = [];

      if (accionAgenda === 'ACTUALIZAR' && dataAtencionRegistrada) {
        // Extrae lo registrado usando tu AtencionMedicaTriajeService
        signosVitalesProcesados = AtencionMedicaTriajeService.obtenerTriajeRegistrado(dataAtencionRegistrada);
        console.log("AtencionMedicaTriajeService "+AtencionMedicaTriajeService)
      } else {
        // Lee plantilla desde catálogo/sessionStorage
        signosVitalesProcesados = AtencionMedicaTriajeService.obtenerTriajeInicial();
      }

      setSectionsData(prev => ({
        ...prev,
        PanelTriaje: signosVitalesProcesados || []
      }));

    } catch (error) {
      console.error("❌ Error al procesar triaje:", error);
      setSectionsData(prev => ({
        ...prev,
        PanelTriaje: []
      }));
    } finally {
      setCargandoTriaje(false);
    }
  };
const handleSelectPaciente = async (pacienteSeleccionado) => {
  if (!pacienteSeleccionado) return;

  const idAtencionValido = Number(pacienteSeleccionado.idAtencion) > 0 
    ? Number(pacienteSeleccionado.idAtencion) 
    : null;

  const accionGatillada = idAtencionValido 
    ? 'ACTUALIZAR' 
    : (pacienteSeleccionado.accionAgenda || 'ATENDER');

  const nuevoPatientData = {
    name: pacienteSeleccionado.nombres || '',
    sex: pacienteSeleccionado.sexo || 'N/A',
    age: pacienteSeleccionado.edad ? `${pacienteSeleccionado.edad} años` : 'N/A',
    id: pacienteSeleccionado.idPaciente,
    idPaciente: pacienteSeleccionado.idPaciente,
    idCuentaAtencion: pacienteSeleccionado.idCuentaAtencion,
    idServicio: pacienteSeleccionado.idServicio,
    idEspecialidad: pacienteSeleccionado.idEspecialidad, 
    idCita: pacienteSeleccionado.idCita,
    hc: pacienteSeleccionado.nroHistoriaClinica,
    idAtencion: idAtencionValido,
    accionAgenda: accionGatillada
  };

  setPacienteActivo(pacienteSeleccionado);
  setPatientData(nuevoPatientData);

  // CASO A: MODIFICACIÓN DE ATENCIÓN (ACTUALIZAR)
  if (idAtencionValido) {
    try {
      setLoadingAtencion(true);
      const dataAtencion = await AtencionMedicaService.obtenerAtencionPorId(idAtencionValido);
      setAtencionCompleta(dataAtencion);

      // Carga unificada de TODOS los paneles mediante el orquestador
      const seccionesCargadas = AtencionMedicaSectionsRegistry.cargarPanelesDesdeApi(dataAtencion);
      setSectionsData(seccionesCargadas);

    } catch (error) {
      console.error("❌ Error al obtener la atención completa:", error);
      setAtencionCompleta(null);
      // Fallback a paneles iniciales si falla la consulta
      setSectionsData(AtencionMedicaSectionsRegistry.cargarPanelesIniciales());
    } finally {
      setLoadingAtencion(false);
    }
  } 
  // CASO B: NUEVA ATENCIÓN (ATENDER)
  else {
    setAtencionCompleta(null);
    // Carga inicial unificada de TODOS los paneles
    setSectionsData(AtencionMedicaSectionsRegistry.cargarPanelesIniciales());
  }

  setIsAgendaOpen(false);
};

  /*
  const handleSelectPaciente = async (pacienteSeleccionado) => {
    if (!pacienteSeleccionado) return;

    const idAtencionValido = Number(pacienteSeleccionado.idAtencion) > 0 
      ? Number(pacienteSeleccionado.idAtencion) 
      : null;

    const accionGatillada = idAtencionValido 
      ? 'ACTUALIZAR' 
      : (pacienteSeleccionado.accionAgenda || 'ATENDER');

    const nuevoPatientData = {
      name: pacienteSeleccionado.nombres || '',
      sex: pacienteSeleccionado.sexo || 'N/A',
      age: pacienteSeleccionado.edad ? `${pacienteSeleccionado.edad} años` : 'N/A',
      id: pacienteSeleccionado.idPaciente,
      idPaciente: pacienteSeleccionado.idPaciente,
      idCuentaAtencion: pacienteSeleccionado.idCuentaAtencion,
      idServicio: pacienteSeleccionado.idServicio,
      idEspecialidad: pacienteSeleccionado.idEspecialidad, 
      idCita: pacienteSeleccionado.idCita,
      hc: pacienteSeleccionado.nroHistoriaClinica,
      idAtencion: idAtencionValido,
      accionAgenda: accionGatillada
    };

    setPacienteActivo(pacienteSeleccionado);
    setPatientData(nuevoPatientData);

    // CASO A: MODIFICACIÓN DE ATENCIÓN (ACTUALIZAR)
    if (idAtencionValido) {
      try {
        setLoadingAtencion(true);
        // 1. Cargar atención registrada
        const dataAtencion = await AtencionMedicaService.obtenerAtencionPorId(idAtencionValido);
        setAtencionCompleta(dataAtencion);
        console.log("DATA PARA ACTUALIZAR   "+JSON.stringify(dataAtencion))
        // 2. Extraer y poblar triaje desde la atención recuperada
        cargarTriajeDirecto('ACTUALIZAR', dataAtencion);

      } catch (error) {
        console.error("❌ Error al obtener la atención completa:", error);
        setAtencionCompleta(null);
        // Fallback a triaje inicial si falla la consulta
        cargarTriajeDirecto('ATENDER');
      } finally {
        setLoadingAtencion(false);
      }
    } 
    // CASO B: NUEVA ATENCIÓN (ATENDER)
    else {
      setAtencionCompleta(null);
      // Cargar triaje inicial basado en catálogo/caché
      cargarTriajeDirecto('ATENDER');
    }

    setIsAgendaOpen(false);
  };  
*/
  const fullMedicalRecord = {
      patient: patientData, 
      attentionDetails: {
        ...sectionsData,
        PanelDiagnostico: Array.isArray(sectionsData.PanelDiagnostico) ? sectionsData.PanelDiagnostico : []
      },
      timestamp: new Date().toISOString(),
  };

  const finalizarAtencionMedicaTotal = async () => {
    if (!patientData.id) {
      showModalMessage('Por favor, selecciona un paciente antes de cerrar la atención.');
      return;
    }

    showModalMessage('Procesando el guardado clínico y aplicando rúbrica...');
    
    try {
      const response = await AtencionMedicaService.guardarYFirmarAtencion(fullMedicalRecord);
      closeModal();
      setDatosGuardadosExito(response.data); 
      setMostrarModalExito(true);
    } catch (error) {
      console.error(error);
      showModalMessage(`Error al cerrar ciclo: ${error.message}`);
    }
  };

  const validarCamposObligatorios = () => {
    const errores = [];

    const tieneTriajeIncompleto = sectionsData.PanelTriaje?.some(
      (item) => !item.valor || String(item.valor).trim() === ""
    );

    if (!sectionsData.PanelTriaje || sectionsData.PanelTriaje.length === 0 || tieneTriajeIncompleto) {
      errores.push("Triaje / Signos Vitales (Todos los campos deben tener un valor ingresado).");
    }

    if (!sectionsData.PanelAntecedentes || sectionsData.PanelAntecedentes.length === 0) {
      errores.push("Antecedentes.");
    }

    if (!sectionsData.PanelSintomas || sectionsData.PanelSintomas.length === 0) {
      errores.push("Síntomas (Anamnesis).");
    }

    if (!sectionsData.PanelExamenFisico || sectionsData.PanelExamenFisico.length === 0) {
      errores.push("Examen Físico.");
    }

    if (!sectionsData.PanelDiagnostico || sectionsData.PanelDiagnostico.length === 0) {
      errores.push("Diagnósticos (CIE-10).");
    }

    if (!sectionsData.PanelPlanTrabajo || sectionsData.PanelPlanTrabajo.length === 0) {
      errores.push("Exámenes Auxiliares / Plan de Trabajo.");
    }

    if (!sectionsData.PanelTratamientos || sectionsData.PanelTratamientos.length === 0) {
      errores.push("Medicación / Tratamientos.");
    }

    const altaDesc = sectionsData.PanelAlta?.[0]?.descripcionAlta?.trim() || sectionsData.PanelAlta?.[0]?.nombreAlta?.trim();
    if (!sectionsData.PanelAlta || sectionsData.PanelAlta.length === 0 || !altaDesc) {
      errores.push("Indicaciones de Alta.");
    }

    if (errores.length > 0) {
      showModalMessage(
        "⚠️ No se puede guardar. Complete los siguientes bloques obligatorios:\n\n• " + errores.join("\n• ")
      );
      return false;
    }

    return true;
  };

  const ejecutarGuardadoYFirmaFinal = async () => {
    if (!patientData?.id) {
      showModalMessage('Por favor, selecciona un paciente antes de procesar.');
      return;
    }

    if (!validarCamposObligatorios()) {
      return;
    }

    try {
      const contextoUsuario = {
        idMedico: sessionStorage.getItem('idMedico') || 2,
        idEntidad: sessionStorage.getItem('idEntidad') || 2,
        idUsuario: sessionStorage.getItem('idUsuario') || 12,
      };

      const payload = AtencionMedicaMapper.uiToApiRequest(patientData, sectionsData, contextoUsuario);

      const response = await AtencionMedicaService.guardarAtencionCompleta(payload);

      if (response?.exito) {
        console.log("Atención guardada exitosamente. ID:", response.idAtencion);
      }

    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const errorMsg = apiErrors ? JSON.stringify(apiErrors) : error.message;
      showModalMessage(`Error al validar el registro: ${errorMsg}`);
    }
  };

  const handleFinalizarFlujoYRegresar = () => {
    setMostrarModalExito(false);
    setDatosGuardadosExito(null);
    setPacienteActivo(null);
    setPatientData({ 
      name: '',
      sex: '',
      age: 'Edad',
      id: '',
      hc: '',
      idPaciente: null,
      idCita: null,
      idAtencion: null,
      accionAgenda: 'ATENDER'
    });
    setSectionsData({
      PanelTriaje: [],
      PanelAntecedentes: [],
      PanelExamenFisico: [],
      PanelSintomas: [],
      PanelTratamientos: [],
      PanelDiagnostico: [],
      PanelPlanTrabajo: [],
      PanelMedicacion: [],
      PanelAlta: []
    });
    setIsAgendaOpen(true);
  };

  const imprimirFichaCompleta = () => {
    setModoImpresion('completo');
    setTimeout(() => { window.print(); }, 150);
  };

  const imprimirDocumentosPaciente = () => {
    setModoImpresion('desglosado');
    setTimeout(() => { window.print(); }, 150);
  };

  return {
    activeTab,
    setActiveTab,
    subTabFirma,
    setSubTabFirma,
    modalMessage,
    isAgendaOpen,
    setIsAgendaOpen,
    modoImpresion,
    cargando,
    cargandoTriaje,
    estadoGuardado,
    datosGuardadosExito,
    mostrarModalExito,
    pacienteActivo,
    patientData,
    sectionsData,
    fullMedicalRecord,
    
    handleTriajeChange,
    showModalMessage,
    closeModal,
    handleSectionContentChange,
    handleSelectPaciente,
    finalizarAtencionMedicaTotal,
    ejecutarGuardadoYFirmaFinal,
    handleFinalizarFlujoYRegresar,
    imprimirFichaCompleta,
    imprimirDocumentosPaciente
  };
};

/*import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AtencionMedicaService from "../AtencionMedicaService";
import { AtencionMedicaTriajeService } from '../AtencionMedicaTriaje/AtencionMedicaTriajeService';
import { AtencionMedicaMapper } from '../AtencionMedicaMapper';

// ... dentro de AtencionMedicaForm o useAtencionMedica hook
export const useAtencionMedica = () => {
  const [atencionCompleta, setAtencionCompleta] = useState(null);
  const [loadingAtencion, setLoadingAtencion] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('triaje');
  const [subTabFirma, setSubTabFirma] = useState('vista-ficha');
  const [modalMessage, setModalMessage] = useState('');
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [modoImpresion, setModoImpresion] = useState('completo');
  const [cargando, setCargando] = useState(false);
  const [cargandoTriaje, setCargandoTriaje] = useState(false);
  const estadoGuardado = "";
  const [datosGuardadosExito, setDatosGuardadosExito] = useState(null);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [pacienteActivo, setPacienteActivo] = useState(null);
  const [patientData, setPatientData] = useState({
    name: '',
    sex: '',
    age: '',
    id: '',
    hc: '',
    idPaciente: null,
    idCita: null,
    idAtencion: null,
    accionAgenda: 'ATENDER',
    triaje: []
  });
  const [sectionsData, setSectionsData] = useState({
    PanelTriaje: [], 
    PanelAntecedentes: [],
    PanelExamenFisico: [],
    PanelSintomas: [],
    PanelTratamientos: [],
    PanelDiagnostico: [],
    PanelPlanTrabajo: [],
    PanelMedicacion: [],
    PanelAlta: [],
  });

  useEffect(() => {
      if (!patientData?.id) return;
      console.log("INGRESO A CARGAR TRIAJES ")
      const cargarDatosTriajeDelPaciente = async () => {
        try {
          setCargandoTriaje(true);
          const signosVitalesProcesados = await AtencionMedicaTriajeService.obtenerTriajePorPaciente(
            patientData.id,
            patientData.accionAgenda
          );
          console.log("SIGNOS VITALES" +signosVitalesProcesados)

          // Actualiza el paciente
          setPatientData(prev => ({
            ...prev,
            triaje: signosVitalesProcesados
          }));

          // 👈 CLAVE: Sincroniza inmediatamente con sectionsData.PanelTriaje
          setSectionsData(prev => ({
            ...prev,
            PanelTriaje: signosVitalesProcesados || []
          }));

          console.log(`📊 [Sincronización Directa] Signos vitales incrustados en sectionsData.PanelTriaje con éxito.`);
        } catch (error) {
          console.error("❌ Falló la sincronización del componente de triajes:", error);
        } finally {
          setCargandoTriaje(false);
        }
      };

      cargarDatosTriajeDelPaciente();
  }, [patientData?.id, patientData?.idCita, patientData?.accionAgenda]);
  
  // Abrir la agenda si no se ha seleccionado paciente
  useEffect(() => {
    if (!patientData.id) {
      setIsAgendaOpen(true);
    }
  }, [patientData.id]);
  // Handler de Triaje estandarizado
  const handleTriajeChange = (nuevosSignosVitales) => {
    setSectionsData(prev => ({
      ...prev,
      PanelTriaje: nuevosSignosVitales
    }));
  };

  const showModalMessage = (message) => setModalMessage(message);

  const closeModal = () => setModalMessage('');

  const handleSectionContentChange = (sectionName, newContent) => {
    setSectionsData(prev => ({
      ...prev,
      [sectionName]: newContent,
    }));
  };

  const handleSelectPaciente = async (pacienteSeleccionado) => {
    if (!pacienteSeleccionado) return;

    const idAtencionValido = Number(pacienteSeleccionado.idAtencion) > 0 ? Number(pacienteSeleccionado.idAtencion) : null;
    
    // 💡 Determinación estricta de la acción
    const accionGatillada = idAtencionValido 
      ? 'ACTUALIZAR' 
      : (pacienteSeleccionado.accionAgenda || 'ATENDER');

    // Mapeo estructurado de los datos de cabecera del paciente
    const nuevoPatientData = {
      name: pacienteSeleccionado.nombres || '',
      sex: pacienteSeleccionado.sexo || 'N/A',
      age: pacienteSeleccionado.edad ? `${pacienteSeleccionado.edad} años` : 'N/A',
      id: pacienteSeleccionado.id,
//      hc: pacienteSeleccionado.idCita || pacienteSeleccionado.numHistoria || pacienteSeleccionado.id,
      idCuentaAtencion: pacienteSeleccionado.idCuentaAtencion,
      idServicio: pacienteSeleccionado.idServicio,
      idEspecialidad: pacienteSeleccionado.idEspecialidad, 
      idPaciente: pacienteSeleccionado.idPaciente,
      idCita: pacienteSeleccionado.idCita,
      hc: pacienteSeleccionado.nroHistoriaClinica,
      idAtencion: idAtencionValido,
      accionAgenda: accionGatillada
    };

    setPacienteActivo(pacienteSeleccionado);
    setPatientData(nuevoPatientData);

    // 🚀 SINGLE FETCH: Carga centralizada solo si el paciente ya tiene un idAtencion registrado
    if (idAtencionValido) {
      try {
        setLoadingAtencion(true);
        console.log(`📡 [AtencionMedicaForm] Solicitando atención completa para idAtencion: ${idAtencionValido}`);
        
        const dataAtencion = await AtencionMedicaService.obtenerAtencionPorId(idAtencionValido);
        // Guardamos la atención completa en el estado padre para distribuirla a los subcomponentes
//        console.log("✅ [AtencionMedicaForm] Registro clínico recuperado:", dataAtencion);
        console.log("✅ [AtencionMedicaForm] Registro clínico recuperado:", JSON.stringify(dataAtencion));
        setAtencionCompleta(dataAtencion);
        
      } catch (error) {
        console.error("❌ Error al obtener la atención completa:", error);
        setAtencionCompleta(null);
      } finally {
        setLoadingAtencion(false);
      }
    } else {
      // Si es una atención nueva, reseteamos el estado para que los subcomponentes usen sus plantillas base/catálogos
      setAtencionCompleta(null);
    }

    setIsAgendaOpen(false);
  };
  // Objeto completo de la historia clínica
  const fullMedicalRecord = {
    patient: patientData, 
    attentionDetails: {
      ...sectionsData,
      PanelDiagnostico: Array.isArray(sectionsData.PanelDiagnostico) ? sectionsData.PanelDiagnostico : []
    },
    timestamp: new Date().toISOString(),
  };

  const finalizarAtencionMedicaTotal = async () => {
    if (!patientData.id) {
      showModalMessage('Por favor, selecciona un paciente antes de cerrar la atención.');
      return;
    }

    showModalMessage('Procesando el guardado clínico y aplicando rúbrica...');
    
    try {
      const response = await AtencionMedicaService.guardarYFirmarAtencion(fullMedicalRecord);
      closeModal();
      setDatosGuardadosExito(response.data); 
      setMostrarModalExito(true);
    } catch (error) {
      console.error(error);
      showModalMessage(`Error al cerrar ciclo: ${error.message}`);
    }
  };

  const validarCamposObligatorios = () => {
    const errores = [];

    // 1. Validar Triaje: Revisa que la lista exista y que NINGÚN campo esté sin valor ("")
    const tieneTriajeIncompleto = sectionsData.PanelTriaje?.some(
      (item) => !item.valor || String(item.valor).trim() === ""
    );

    if (!sectionsData.PanelTriaje || sectionsData.PanelTriaje.length === 0 || tieneTriajeIncompleto) {
      errores.push("Triaje / Signos Vitales (Todos los campos deben tener un valor ingresado).");
    }

    // 2. Validar Antecedentes
    if (!sectionsData.PanelAntecedentes || sectionsData.PanelAntecedentes.length === 0) {
      errores.push("Antecedentes.");
    }

    // 3. Validar Síntomas
    if (!sectionsData.PanelSintomas || sectionsData.PanelSintomas.length === 0) {
      errores.push("Síntomas (Anamnesis).");
    }

    // 4. Validar Examen Físico
    if (!sectionsData.PanelExamenFisico || sectionsData.PanelExamenFisico.length === 0) {
      errores.push("Examen Físico.");
    }

    // 5. Validar Diagnósticos
    if (!sectionsData.PanelDiagnostico || sectionsData.PanelDiagnostico.length === 0) {
      errores.push("Diagnósticos (CIE-10).");
    }

    // 6. Validar Plan de Trabajo / Exámenes Auxiliares
    if (!sectionsData.PanelPlanTrabajo || sectionsData.PanelPlanTrabajo.length === 0) {
      errores.push("Exámenes Auxiliares / Plan de Trabajo.");
    }

    // 7. Validar Tratamientos / Medicación
    if (!sectionsData.PanelTratamientos || sectionsData.PanelTratamientos.length === 0) {
      errores.push("Medicación / Tratamientos.");
    }

    // 8. Validar Indicaciones de Alta
    const altaDesc = sectionsData.PanelAlta?.[0]?.descripcionAlta?.trim() || sectionsData.PanelAlta?.[0]?.nombreAlta?.trim();
    if (!sectionsData.PanelAlta || sectionsData.PanelAlta.length === 0 || !altaDesc) {
      errores.push("Indicaciones de Alta.");
    }

    if (errores.length > 0) {
      showModalMessage(
        "⚠️ No se puede guardar. Complete los siguientes bloques obligatorios:\n\n• " + errores.join("\n• ")
      );
      return false;
    }

    return true;
  };

  const ejecutarGuardadoYFirmaFinal = async () => {
    if (!patientData?.id) {
      showModalMessage('Por favor, selecciona un paciente antes de procesar.');
      return;
    }

    if (!validarCamposObligatorios()) {
      return;
    }

    try {
      const contextoUsuario = {
        idMedico: sessionStorage.getItem('idMedico') || 2,
        idEntidad: sessionStorage.getItem('idEntidad') || 2,
        idUsuario: sessionStorage.getItem('idUsuario') || 12,
      };

      const payload = AtencionMedicaMapper.uiToApiRequest(patientData, sectionsData, contextoUsuario);

      console.log("=== DATA/PAYLOAD VALIDADO QUE SE ENVÍA AL GUARDAR ===");
      console.log(payload);
      console.log("=== JSON STRINGIFY ===");
      console.log(JSON.stringify(payload, null, 2));

      const response = await AtencionMedicaService.guardarAtencionCompleta(payload);

      if (response?.exito) {
        console.log("Atención guardada exitosamente. ID:", response.idAtencion);
      }

    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const errorMsg = apiErrors ? JSON.stringify(apiErrors) : error.message;
      showModalMessage(`Error al validar el registro: ${errorMsg}`);
    }
  };

  // 🎯 3. Reseteo con la propiedad PanelTriaje
  const handleFinalizarFlujoYRegresar = () => {
    setMostrarModalExito(false);
    setDatosGuardadosExito(null);
    setPacienteActivo(null);
    setPatientData({ 
      name: '',
      sex: '',
      age: 'Edad',
      id: '',
      hc: '',
      accionAgenda: 'ATENDER'
    });
    setSectionsData({
      PanelTriaje: [], // 👈 Restablecido a PanelTriaje
      PanelAntecedentes: [],
      PanelExamenFisico: [],
      PanelSintomas: [],
      PanelTratamientos: [],
      PanelDiagnostico: [],
      PanelPlanTrabajo: [],
      PanelMedicacion: [],
      PanelAlta: []
    });
    setIsAgendaOpen(true);
  };

  const imprimirFichaCompleta = () => {
    setModoImpresion('completo');
    setTimeout(() => { window.print(); }, 150);
  };

  const imprimirDocumentosPaciente = () => {
    setModoImpresion('desglosado');
    setTimeout(() => { window.print(); }, 150);
  };

  return {
    activeTab,
    setActiveTab,
    subTabFirma,
    setSubTabFirma,
    modalMessage,
    isAgendaOpen,
    setIsAgendaOpen,
    modoImpresion,
    cargando,
    cargandoTriaje,
    estadoGuardado,
    datosGuardadosExito,
    mostrarModalExito,
    pacienteActivo,
    patientData,
    sectionsData,
    fullMedicalRecord,
    
    handleTriajeChange,
    showModalMessage,
    closeModal,
    handleSectionContentChange,
    handleSelectPaciente,
    finalizarAtencionMedicaTotal,
    ejecutarGuardadoYFirmaFinal,
    handleFinalizarFlujoYRegresar,
    imprimirFichaCompleta,
    imprimirDocumentosPaciente
  };
};
*/
  /*
  // Estado del Paciente
  const [patientData, setPatientData] = useState(() => {
    if (location.state?.paciente) {
      const p = location.state.paciente;
      return {
        name: p.nombres,
        sex: p.sexo,
        age: p.edad ? `${p.edad} años` : 'Edad',
        id: p.idPaciente,
        hc: p.numHistoria ,
        idPaciente: p.idPaciente,
        idCita: p.idCita,
        accionAgenda: location.state.accionAgenda || 'ATENDER'
      };
    }
    return { name: '', sex: '', age: 'Edad', id: '', hc: '', accionAgenda: 'ATENDER', triaje: [] };
  });
*/


  /*
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
      id: pacienteSeleccionado.id,
      hc: pacienteSeleccionado.idCita || pacienteSeleccionado.numHistoria || pacienteSeleccionado.id,
      idCuentaAtencion: pacienteSeleccionado.idCuentaAtencion ,
      idServicio: pacienteSeleccionado.idServicio ,
      idEspecialidad: pacienteSeleccionado.idEspecialidad , 
      idPaciente: pacienteSeleccionado.idPaciente,
      idCita: pacienteSeleccionado.idCita,
      accionAgenda: accionGatillada
    });
console.log("PATIENTDATA   "+JSON.stringify(patientData))
    setIsAgendaOpen(false);
  };
*/
/*
// 🎯 Cargar datos de triaje cada vez que cambie id, idCita o patientData completo
  useEffect(() => {
    if (!patientData?.id) return;

    const cargarDatosTriajeDelPaciente = async () => {
      try {
        setCargandoTriaje(true);
        const signosVitalesProcesados = await AtencionMedicaTriajeService.obtenerTriajePorPaciente(
          patientData.id,
          patientData.accionAgenda
        );

        setPatientData(prev => ({
          ...prev,
          triaje: signosVitalesProcesados
        }));

        setSectionsData(prev => ({
          ...prev,
          PanelTriaje: signosVitalesProcesados || []
        }));

      } catch (error) {
        console.error("❌ Falló la sincronización del componente de triajes:", error);
      } finally {
        setCargandoTriaje(false);
      }
    };

    cargarDatosTriajeDelPaciente();
    // 👈 Agregamos patientData.idCita y patientData para reaccionar a cualquier re-selección
  }, [patientData?.id, patientData?.idCita, patientData?.accionAgenda, patientData]);
  */
  // Efecto para sincronizar el paciente activo desde location.state
/*  useEffect(() => {
    if (location.state?.paciente) {
      setPacienteActivo(location.state.paciente);
    }
  }, [location.state]);*/
  // 🎯 2. Cargar datos de triaje y sincronizarlos DIRECTAMENTE en PanelTriaje
  
/*  const cargarTriajeDirecto = async (idPaciente, accionAgenda) => {
    try {
      setCargandoTriaje(true);
      const signosVitalesProcesados = await AtencionMedicaTriajeService.obtenerTriajeInicial(
        idPaciente,
        accionAgenda
      );

      // Se guarda exclusivamente en la sección clínica correspondiente
      setSectionsData(prev => ({
        ...prev,
        PanelTriaje: signosVitalesProcesados || []
      }));

    } catch (error) {
      console.error("❌ Falló la carga del triaje:", error);
      setSectionsData(prev => ({
        ...prev,
        PanelTriaje: []
      }));
    } finally {
      setCargandoTriaje(false);
    }
  };*/


     //* Handler de selección imperativa de paciente
/*  const handleSelectPaciente = async (pacienteSeleccionado) => {
    if (!pacienteSeleccionado) return;
    const idAtencionValido = Number(pacienteSeleccionado.idAtencion) > 0 
      ? Number(pacienteSeleccionado.idAtencion) 
      : null;
    const accionGatillada = idAtencionValido 
      ? 'ACTUALIZAR' 
      : (pacienteSeleccionado.accionAgenda || 'ATENDER');
    const nuevoPatientData = {
      name: pacienteSeleccionado.nombres || '',
      sex: pacienteSeleccionado.sexo || 'N/A',
      age: pacienteSeleccionado.edad ? `${pacienteSeleccionado.edad} años` : 'N/A',
      id: pacienteSeleccionado.id,
      idCuentaAtencion: pacienteSeleccionado.idCuentaAtencion,
      idServicio: pacienteSeleccionado.idServicio,
      idEspecialidad: pacienteSeleccionado.idEspecialidad, 
      idPaciente: pacienteSeleccionado.idPaciente,
      idCita: pacienteSeleccionado.idCita,
      hc: pacienteSeleccionado.nroHistoriaClinica,
      idAtencion: idAtencionValido,
      accionAgenda: accionGatillada
    };
    setPacienteActivo(pacienteSeleccionado);
    setPatientData(nuevoPatientData);
    // 1. Cargar triaje imperativamente directo a sectionsData.PanelTriaje
    await cargarTriajeDirecto(pacienteSeleccionado.id, accionGatillada);
    // 2. Cargar atención preexistente si aplica
    if (idAtencionValido) {
      try {
        setLoadingAtencion(true);
        const dataAtencion = await AtencionMedicaService.obtenerAtencionPorId(idAtencionValido);
        setAtencionCompleta(dataAtencion);
      } catch (error) {
        console.error("❌ Error al obtener la atención completa:", error);
        setAtencionCompleta(null);
      } finally {
        setLoadingAtencion(false);
      }
    } else {
      setAtencionCompleta(null);
    }

    setIsAgendaOpen(false);
  };
*/