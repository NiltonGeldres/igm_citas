import { useState,  useEffect, useCallback } from 'react';
import AtencionMedicaService from "../AtencionMedicaService";
import { AtencionMedicaTriajeService } from '../AtencionMedicaTriaje/AtencionMedicaTriajeService';
import { AtencionMedicaMapper } from '../AtencionMedicaMapper';
import { AtencionMedicaSectionsRegistry } from '../AtencionMedicaSectionsRegistry';

export const ESTADOS_ATENCION = {
  EN_EDICION: 'EN_EDICION',
  PDF_BORRADOR: 'PDF_BORRADOR',
  FIRMADO: 'FIRMADO'
};

export const useAtencionMedica = () => {
  const [estadoAtencion, setEstadoAtencion] = useState(ESTADOS_ATENCION.EN_EDICION);
  const [estadoGuardado, setEstadoGuardado] = useState('IDLE'); // 'SAVING' | 'SAVED' | 'ERROR' | 'IDLE'
  const [cargando, setCargando] = useState(false);
  const [pdfBorradorUrl, setPdfBorradorUrl] = useState(null);

  const [atencionCompleta, setAtencionCompleta] = useState(null);
  const [loadingAtencion, setLoadingAtencion] = useState(false);
  const [activeTab, setActiveTab] = useState('triaje');
  const [subTabFirma, setSubTabFirma] = useState('vista-ficha');
  const [modalMessage, setModalMessage] = useState('');
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [modoImpresion, setModoImpresion] = useState('completo');
  //const [cargando, setCargando] = useState(false);
  const [cargandoTriaje, setCargandoTriaje] = useState(false);
//  const estadoGuardado = "";
  const [datosGuardadosExito, setDatosGuardadosExito] = useState(null);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [pacienteActivo, setPacienteActivo] = useState(null);

//  const [estadoAtencion, setEstadoAtencion] = useState('BORRADOR'); // 'BORRADOR' | 'FIRMADO'
  const [urlJsonFirmadoBackend, setUrlJsonFirmadoBackend] = useState(null);

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


const guardarAtencionBorrador = useCallback(async (esAutoSave = false) => {
    try {
      if (esAutoSave) {
        setEstadoGuardado('SAVING');
      } else {
        setCargando(true);
      }

      const contextoUsuario = {
        idMedico: sessionStorage.getItem('idMedico') || 2,
        idEntidad: sessionStorage.getItem('idEntidad') || 2,
        idUsuario: sessionStorage.getItem('idUsuario') || 12,
      };

      // Mapeo UI -> DTO API
      const payload = AtencionMedicaMapper.uiToApiRequest(patientData, sectionsData, contextoUsuario);
      payload.estado = ESTADOS_ATENCION.EN_EDICION;

      let respuesta;
      const idAtencionExistente = patientData?.idAtencion;

      // =========================================================================
      // DECISIÓN: ¿ES CREAR (NUEVO) O ACTUALIZAR?
      // =========================================================================
      if (!idAtencionExistente) {
        // SERVICIO 1: AGREGAR / CREAR NUEVO
        respuesta = await AtencionMedicaService.crearAtencionBorrador(payload);
        
        // Asignamos el idAtencion generado para que las siguientes llamadas sean UPDATE
        if (respuesta?.idAtencion) {
          setPatientData(prev => ({
            ...prev,
            idAtencion: respuesta.idAtencion
          }));
        }
      } else {
        // SERVICIO 2: ACTUALIZAR EXISTENTE
        respuesta = await AtencionMedicaService.actualizarAtencionBorrador(idAtencionExistente, payload);
      }

      if (esAutoSave) {
        setEstadoGuardado('SAVED');
      } else {
        showModalMessage("Borrador guardado correctamente.");
      }

      return respuesta;

    } catch (error) {
      console.error("Error al guardar borrador:", error);
      if (esAutoSave) {
        setEstadoGuardado('ERROR');
      } else {
        showModalMessage(`Error al guardar borrador: ${error.message}`);
      }
    } finally {
      setCargando(false);
    }
  }, [patientData, sectionsData]);

  /**
   * ETAPA 3: GENERAR PDF BORRADOR (Requiere Filtro Estricto)
   */
  const ejecutarGeneracionPdfBorrador = async () => {
    // 1. Paso por Filtro / Validaciones estrictas de campos obligatorios
    const errores = validarCamposObligatoriosClinicos(sectionsData);
    if (errores.length > 0) {
      showModalMessage(`No se puede generar el PDF Borrador. Faltan datos requeridos:\n• ${errores.join('\n• ')}`);
      return;
    }

    try {
      setCargando(true);

      // 2. Aseguramos guardar la última versión antes de solicitar el PDF
      const resGuardar = await guardarAtencionBorrador(false);
      const idAtencion = resGuardar?.idAtencion || patientData.idAtencion;

      // 3. Invocamos la generación del PDF Borrador
      const resPdf = await AtencionMedicaService.generarPdfBorradorAtencion(idAtencion);

      if (resPdf?.exito) {
        setPdfBorradorUrl(resPdf.rutaPdfBorrador);
        setEstadoAtencion(ESTADOS_ATENCION.PDF_BORRADOR);
      }
    } catch (error) {
      showModalMessage(`Error al generar el borrador en PDF: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  /**
   * PERMITE VOLVER A MODO EDICION DESDE LA VISTA PREVIA PDF
   */
  const volverAEdicion = () => {
    setEstadoAtencion(ESTADOS_ATENCION.EN_EDICION);
  };


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
        console.log("DATOS SECCIONES ATENCION:  "+JSON.stringify(seccionesCargadas))
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

  const fullMedicalRecord = {
      patient: patientData, 
      attentionDetails: {
        ...sectionsData,
        PanelDiagnostico: Array.isArray(sectionsData.PanelDiagnostico) ? sectionsData.PanelDiagnostico : []
//        PanelPlanTrabajo: Array.isArray(sectionsData.PanelPlanTrabajo) ? sectionsData.PanelPlanTrabajo : []
      },
      timestamp: new Date().toISOString(),
  };

  
  const validarCamposObligatoriosClinicos = () => {
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
   // Guardar Atencion Medica
/*
   // 🟢 ACTUALIZACIÓN DEL GUARDADO Y FIRMA
  const ejecutarGuardadoYFirmaFinal = async () => {
    if (!patientData?.id) {
      showModalMessage('Por favor, selecciona un paciente antes de procesar.');
      return;
    }
    if (!validarCamposObligatoriosClin()) {
      return;
    }
    try {
      const contextoUsuario = {
        idMedico: sessionStorage.getItem('idMedico') || 2,
        idEntidad: sessionStorage.getItem('idEntidad') || 2,
        idUsuario: sessionStorage.getItem('idUsuario') || 12,
      };

      const payload = AtencionMedicaMapper.uiToApiRequest(patientData, sectionsData, contextoUsuario);
//      const response = await AtencionMedicaService.guardarAtencionCompleta(payload);
      const response = await AtencionMedicaService.generarPdfBorradorAtencion(patientData.idAtencion);

      if (response?.exito) {
        console.log("RESPUESTA DE PDF "+JSON.stringify(response ))        
        setEstadoAtencion('PDF BORRADOR');
        setUrlJsonFirmadoBackend(response?.urlJsonFirmado || response?.rutaJson || null);
        console.log("Atención guardada exitosamente. ID:", response.idAtencion);
      }

    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      const errorMsg = apiErrors ? JSON.stringify(apiErrors) : error.message;
      showModalMessage(`Error al validar el registro: ${errorMsg}`);
    }
  };
*/

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
// 🟢 RETORNAR LOS ESTADOS NUEVOS AQUÍ:
    estadoAtencion,
    urlJsonFirmadoBackend,
        
    handleTriajeChange,
    showModalMessage,
    closeModal,
    handleSectionContentChange,
    handleSelectPaciente,
    guardarAtencionBorrador,
 //   ejecutarGuardadoYFirmaFinal,
    handleFinalizarFlujoYRegresar,
    imprimirFichaCompleta,
    imprimirDocumentosPaciente
    
  };
};


/*   
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
      console.log("JSON A ENVIAR  " +JSON.stringify(patientData));
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
*/


  /*
  const guardarBorrador = async () => {
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
*/
