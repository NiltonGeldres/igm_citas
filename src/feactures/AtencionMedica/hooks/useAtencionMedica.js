import { useState, useEffect, useCallback } from 'react';
import AtencionMedicaService from "../AtencionMedicaService";
//import { AtencionMedicaTriajeService } from '../AtencionMedicaTriaje/AtencionMedicaTriajeService';
import { AtencionMedicaMapper } from '../AtencionMedicaMapper';
import { AtencionMedicaSectionsRegistry } from '../AtencionMedicaSectionsRegistry';
import { useAuth } from '../../../shared/context/AuthContext';

export const ESTADOS_ATENCION = {
  BORRADOR: 'BORRADOR',
  PDF_BORRADOR: 'PENDIENTE_FIRMA',
  FIRMADO: 'FIRMADO'
};

export const useAtencionMedica = () => {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(false);

 // const [hashIntegridad, setHashIntegridad] = useState(null);
  const [rutaPdfFirmado, setRutaPdfFirmado] = useState(null);
  const [urlJsonFirmadoBackend, setUrlJsonFirmadoBackend] = useState(null);

  // 🟢 ESTADO PARA ALMACENAR LAS 4 RUTAS DE PDFs
  const [documentosPdf, setDocumentosPdf] = useState({
    hc: null,
    ordenes: null,
    receta: null,
    indicaciones: null
  });

  const [estadoFirma, setEstadoFirma] = useState(ESTADOS_ATENCION.BORRADOR);
  const [estadoGuardado, setEstadoGuardado] = useState('IDLE');
  
//  const [atencionCompleta, setAtencionCompleta] = useState(null);
 // const [loadingAtencion, setLoadingAtencion] = useState(false);
  const [activeTab, setActiveTab] = useState('triaje');
  const [subTabFirma, setSubTabFirma] = useState('vista-ficha');
  const [modalMessage, setModalMessage] = useState('');
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [modoImpresion, setModoImpresion] = useState('completo');
 // const [cargandoTriaje, setCargandoTriaje] = useState(false);
  const [pacienteActivo, setPacienteActivo] = useState(null);

  const [datosGuardadosExito, setDatosGuardadosExito] = useState(null);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  
  const showModalMessage = (message) => setModalMessage(message);
  const closeModal = () => setModalMessage('');  

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

  const contextoUsuario = {
    idUsuario: user.idUsuario || 0,
    idMedico: user.idMedico || 0,
    idEntidad: user.idEntidad || 0,
  };

const extraerDocumentosPdf = (data) => {
  // Mapa indexado por 'tipoDocumento' desde el arreglo 'documentos'
  const mapaDocs = (data?.documentos || []).reduce((acc, doc) => {
    if (doc?.tipoDocumento) {
      acc[doc.tipoDocumento.toLowerCase()] = doc;
    }
    return acc;
  }, {});

    const extraerInfoDoc = (claveMapa, nombreFallback, rutaFallback) => {
      const doc = mapaDocs[claveMapa] || {};
      
      // Evaluamos la URL de lectura priorizando el firmado sobre el borrador
      const urlLecturaCalculada = doc.urlLecturaFirmado 
        || doc.urlLecturaBorrador 
        || doc.urlLectura 
        || rutaFallback 
        || null;

      return {
        nombreArchivo: nombreFallback || null,
        urlLectura: urlLecturaCalculada,
        urlLecturaFirmado: doc.urlLecturaFirmado || null,
        urlLecturaBorrador: doc.urlLecturaBorrador || rutaFallback || null,
        urlSubidaFirmado: doc.urlSubidaFirmado || null
      };
    };

    return {
      hc: extraerInfoDoc('historia', data?.nombreArchivoHistoria, data?.pdfRutaHistoria),
      receta: extraerInfoDoc('receta', data?.nombreArchivoReceta, data?.pdfRutaReceta),
      ordenes: extraerInfoDoc('orden', data?.nombreArchivoOrdenes, data?.pdfRutaOrdenes),
      indicaciones: extraerInfoDoc('indicaciones', data?.nombreArchivoIndicaciones, data?.pdfRutaIndicaciones)
    };
  };  
/*
  const extraerDocumentosPdf = (data) => {
    // Mapa indexado por 'tipoDocumento' desde el arreglo 'documentos'
    const mapaDocs = (data?.documentos || []).reduce((acc, doc) => {
      if (doc?.tipoDocumento) {
        acc[doc.tipoDocumento.toLowerCase()] = doc;
      }
      return acc;
    }, {});

    return {
      hc: {
        nombreArchivo: data?.nombreArchivoHistoria || null,
        urlLectura: mapaDocs['historia']?.urlLecturaBorrador || data?.pdfRutaHistoria || null,
        urlSubidaFirmado: mapaDocs['historia']?.urlSubidaFirmado || null
      },
      receta: {
        nombreArchivo: data?.nombreArchivoReceta || null,
        urlLectura: mapaDocs['receta']?.urlLecturaBorrador || data?.pdfRutaReceta || null,
        urlSubidaFirmado: mapaDocs['receta']?.urlSubidaFirmado || null
      },
      ordenes: {
        nombreArchivo: data?.nombreArchivoOrdenes || null,
        urlLectura: mapaDocs['orden']?.urlLecturaBorrador || data?.pdfRutaOrdenes || null,
        urlSubidaFirmado: mapaDocs['orden']?.urlSubidaFirmado || null
      },
      indicaciones: {
        nombreArchivo: data?.nombreArchivoIndicaciones || null,
        urlLectura: mapaDocs['indicaciones']?.urlLecturaBorrador || data?.pdfRutaIndicaciones || null,
        urlSubidaFirmado: mapaDocs['indicaciones']?.urlSubidaFirmado || null
      }
    };
  };
*/
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

      const payload = AtencionMedicaMapper.uiToApiRequest(patientData, sectionsData, contextoUsuario);
      payload.estado = ESTADOS_ATENCION.BORRADOR;
      let respuesta;
      const idAtencionExistente = patientData?.idAtencion;

      if (!idAtencionExistente) {
        respuesta = await AtencionMedicaService.crearAtencionBorrador(payload);
        if (respuesta?.idAtencion) {
          setPatientData(prev => ({ ...prev, idAtencion: respuesta.idAtencion }));
        }
      } else {
        respuesta = await AtencionMedicaService.actualizarAtencionBorrador(idAtencionExistente, payload);
      }

      setEstadoFirma(respuesta.estadoFirma);
      setDocumentosPdf(extraerDocumentosPdf(respuesta));

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

  const crearPdfBorrador = async () => {
    const errores = validarCamposObligatoriosClinicos(sectionsData);
    if (errores.length > 0) {
      showModalMessage(`No se puede generar el PDF Borrador. Faltan datos requeridos:\n• ${errores.join('\n• ')}`);
      return;
    }

    try {
      setCargando(true);
      const payload = AtencionMedicaMapper.uiToApiRequest(patientData, sectionsData, contextoUsuario);
      const resPdf = await AtencionMedicaService.prepararPdfAtencion(payload);
      if (resPdf && resPdf.idAtencion) {
        setPatientData(prev => ({ ...prev, idAtencion: resPdf.idAtencion }));
       // setHashIntegridad(resPdf.hashIntegridad);
        setRutaPdfFirmado(resPdf.rutaPdfFirmado);
        setEstadoFirma(resPdf.estadoFirma);
        setDocumentosPdf(extraerDocumentosPdf(resPdf));

        showModalMessage("Atención guardada y PDF borrador generado exitosamente.");
        return resPdf;
      }
    } catch (error) {
      console.error("Error al preparar el PDF borrador:", error);
      const msg = error?.response?.data?.message || error.message;
      showModalMessage(`Error al guardar y preparar el PDF borrador: ${msg}`);
    } finally {
      setCargando(false);
    }
  };

  const handleTriajeChange = (nuevosSignosVitales) => {
    setSectionsData(prev => ({ ...prev, PanelTriaje: nuevosSignosVitales }));
  };

  const handleSectionContentChange = (sectionName, newContent) => {
    setSectionsData(prev => ({ ...prev, [sectionName]: newContent }));
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

    if (idAtencionValido) {
      try {
       // setLoadingAtencion(true);
        const dataAtencion = await AtencionMedicaService.obtenerAtencionPorId(idAtencionValido);
        console.log("BUSQUEDA POR ID ATENCION "+JSON.stringify(dataAtencion))
      //  setAtencionCompleta(dataAtencion.estadoFirma);
        setRutaPdfFirmado(dataAtencion.rutaPdfFirmado);
        setEstadoFirma(dataAtencion.estadoFirma);

        // 🟢 CARGA LAS 4 RUTAS AL RECONSULTAR ATENCIÓN
        setDocumentosPdf(extraerDocumentosPdf(dataAtencion));

        const seccionesCargadas = AtencionMedicaSectionsRegistry.cargarPanelesDesdeApi(dataAtencion);
        setSectionsData(seccionesCargadas);

      } catch (error) {
        console.error("❌ Error al obtener la atención completa:", error);
       // setAtencionCompleta(null);
        setSectionsData(AtencionMedicaSectionsRegistry.cargarPanelesIniciales());
      } finally {
      //  setLoadingAtencion(false);
      }
    } else {
     // setAtencionCompleta(null);
      setDocumentosPdf({ hc: null, ordenes: null, receta: null, indicaciones: null });
      setSectionsData(AtencionMedicaSectionsRegistry.cargarPanelesIniciales());
    }

    setIsAgendaOpen(false);
  };

  const fullMedicalRecord = {
    patient: patientData, 
    attentionDetails: {
      ...sectionsData,
      PanelDiagnostico: Array.isArray(sectionsData.PanelDiagnostico) ? sectionsData.PanelDiagnostico : []
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

    const altaDesc = sectionsData.PanelAlta?.[0]?.descripcionAlta?.trim() || sectionsData.PanelAlta?.[0]?.nombreAlta?.trim();
    if (!sectionsData.PanelAlta || sectionsData.PanelAlta.length === 0 || !altaDesc) {
      errores.push("Indicaciones de Alta.");
    }

    if (errores.length > 0) {
      showModalMessage("⚠️ No se puede guardar. Complete los siguientes bloques obligatorios:\n\n• " + errores.join("\n• "));
      return false;
    }

    return true;
  };

  const handleFinalizarFlujoYRegresar = () => {
    setMostrarModalExito(false);
    setDatosGuardadosExito(null);
    setPacienteActivo(null);
    setDocumentosPdf({ hc: null, ordenes: null, receta: null, indicaciones: null });
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

/*  const refrescarEstadoFirma = useCallback(async () => {
      const idAtencion = patientData?.idAtencion;
      if (!idAtencion) return;

      try {
        setCargando(true);
        const dataAtencion = await AtencionMedicaService.obtenerAtencionPorId(idAtencion);

        setAtencionCompleta(dataAtencion.estadoFirma);
        setRutaPdfFirmado(dataAtencion.rutaPdfFirmado || null);
        setEstadoFirma(dataAtencion.estadoFirma);
        setDocumentosPdf(extraerDocumentosPdf(dataAtencion));

        const seccionesCargadas = AtencionMedicaSectionsRegistry.cargarPanelesDesdeApi(dataAtencion);
        setSectionsData(seccionesCargadas);

        return dataAtencion;
      } catch (error) {
        console.error("Error al refrescar estado de la firma:", error);
      } finally {
        setCargando(false);
      }
    }, [patientData?.idAtencion]);  
*/

  // Permite recibir el JSON ya actualizado desde la confirmación
    const refrescarEstadoFirma = useCallback(async (dataActualizada = null) => {
      try {
        setCargando(true);

        // 🟢 Si NO vienen datos directos, los pide al backend. Si YA vienen, los usa.
        let dataAtencion = dataActualizada;

        if (!dataAtencion) {
          const idAtencion = patientData?.idAtencion;
          if (!idAtencion) return;
          dataAtencion = await AtencionMedicaService.obtenerAtencionPorId(idAtencion);
        }

        // Parámetro anti-caché para forzar al visor PDF a descargar la versión firmada de R2
        const timestamp = Date.now();

        setEstadoFirma(dataAtencion.estadoFirma);
       // setAtencionCompleta?.(dataAtencion);

        if (dataAtencion.rutaPdfFirmado) {
          setRutaPdfFirmado(`${dataAtencion.rutaPdfFirmado}?t=${timestamp}`);
        }

        const docs = extraerDocumentosPdf(dataAtencion);
        // Aplicar anti-caché a las URLs de los PDFs
        if (docs?.hc?.urlDescargaFirmado) {
          docs.hc.urlDescargaFirmado = `${docs.hc.urlDescargaFirmado}?t=${timestamp}`;
        }
        setDocumentosPdf(docs);

        const seccionesCargadas = AtencionMedicaSectionsRegistry.cargarPanelesDesdeApi(dataAtencion);
        setSectionsData(seccionesCargadas);

        return dataAtencion;
      } catch (error) {
        console.error("Error al refrescar estado de la atención:", error);
      } finally {
        setCargando(false);
      }
    }, [patientData?.idAtencion]);
    
  return {
    setActiveTab,
    setSubTabFirma,
    setIsAgendaOpen,
    activeTab,
    subTabFirma,
    modalMessage,
    isAgendaOpen,
    modoImpresion,
    cargando,
   // cargandoTriaje,
    estadoGuardado,
    datosGuardadosExito,
    mostrarModalExito,
    pacienteActivo,
    patientData,
    sectionsData,
    fullMedicalRecord,
    estadoFirma,
    urlJsonFirmadoBackend,
    rutaPdfFirmado,
    documentosPdf, // 🟢 EXPORTADO PARA LA VISTA
    
    handleTriajeChange,
    showModalMessage,
    closeModal,
    handleSectionContentChange,
    handleSelectPaciente,
    guardarAtencionBorrador,
    crearPdfBorrador,
    handleFinalizarFlujoYRegresar,
    imprimirFichaCompleta,
    imprimirDocumentosPaciente,
    refrescarEstadoFirma
  };
};