import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AtencionMedicaService from '../AtencionMedicaService';
import AtencionMedicaMapper from '../AtencionMedicaMapper';
import { useDebounceSave } from '../utils/useDebounceSave';

export const useAtencionMedica = (pacienteProp) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Datos de Sesión
  const perfil = JSON.parse(sessionStorage.getItem('user_profile') || '{}');

  // 2. Estados de UI y Navegación
  const [activeTab, setActiveTab] = useState('triaje');
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
  const [cargando, setCargando] = useState(false);
  
  // Modales y Feedback
  const [modalMessage, setModalMessage] = useState('');
  const [datosGuardadosExito, setDatosGuardadosExito] = useState(null);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  // 3. Estados de la Atención Médica
  const [patientData, setPatientData] = useState(() => {
    return pacienteProp || location.state?.paciente || null;
  });

  const [sectionsData, setSectionsData] = useState({
    triaje: {},
    sintomas: [],
    diagnosticos: [],
    examenes: [],
    medicamentos: [],
    alta: {},
    firma: {}
  });

  // ---------------------------------------------------------------------------
  // EFECTOS DE CICLO DE VIDA
  // ---------------------------------------------------------------------------

  // A. Detectar paciente entrante por React Router (Navegación desde Agenda)
  useEffect(() => {
    if (location.state?.paciente) {
      setPatientData(location.state.paciente);
    }
  }, [location.state]);

  // B. Abrir agenda lateral automáticamente si no hay un paciente seleccionado
  useEffect(() => {
    if (!patientData?.id) {
      setIsAgendaOpen(true);
    }
  }, [patientData?.id]);

  // C. Cargar datos existentes si la cita está en estado 'ACTUALIZAR'
  useEffect(() => {
    const cargarAtencionExistente = async () => {
      if (!patientData?.id || patientData.accionAgenda !== 'ACTUALIZAR') return;

      setCargando(true);
      try {
        const response = await AtencionMedicaService.obtenerAtencionPorCita(patientData.id);
        if (response) {
          const datosMapeados = AtencionMedicaMapper.toFormState(response);
          setSectionsData(datosMapeados);
        }
      } catch (error) {
        console.error("Error al cargar la atención médica:", error);
        setModalMessage("No se pudieron cargar los datos previos de la atención.");
      } finally {
        setCargando(false);
      }
    };

    cargarAtencionExistente();
  }, [patientData?.id, patientData?.accionAgenda]);

  // ---------------------------------------------------------------------------
  // MANEJADORES DE ESTADO Y EVENTOS
  // ---------------------------------------------------------------------------

  // Selección de paciente desde el Drawer/Offcanvas lateral
  const handleSelectPaciente = useCallback((pacienteSeleccionado) => {
    setPatientData(pacienteSeleccionado);
    setIsAgendaOpen(false);
  }, []);

  // Modificación genérica de subsecciones (Triaje, Síntomas, etc.)
  const handleSectionContentChange = useCallback((sectionName, newContent) => {
    setSectionsData((prev) => ({
      ...prev,
      [sectionName]: newContent
    }));
  }, []);

  // Lógica de Autoguardado (Persistencia Automática)
  const fullMedicalRecord = {
    paciente: patientData,
    atencion: sectionsData,
    medicoId: perfil?.idMedico
  };

  const ejecutarPersistenciaAutomatica = async (record) => {
    if (!record.paciente?.id) return;
    try {
      await AtencionMedicaService.guardarBorrador(record);
    } catch (error) {
      console.warn("Error en autoguardado de borrador:", error);
    }
  };

  // Se activa el debounce save con la estructura compilada
  const estadoGuardado = useDebounceSave(fullMedicalRecord, ejecutarPersistenciaAutomatica);

  // ---------------------------------------------------------------------------
  // ACCIONES FINALES (GUARDADO Y FIRMA)
  // ---------------------------------------------------------------------------

  const ejecutarGuardadoYFirmaFinal = async () => {
    if (!patientData?.id) return;

    setCargando(true);
    try {
      const payload = AtencionMedicaMapper.toApiPayload(fullMedicalRecord);
      const res = await AtencionMedicaService.finalizarAtencion(payload);

      setDatosGuardadosExito(res);
      setMostrarModalExito(true);
    } catch (error) {
      console.error("Error al finalizar atención:", error);
      setModalMessage("Ocurrió un error al intentar registrar y firmar la atención.");
    } finally {
      setCargando(false);
    }
  };

  const handleFinalizarFlujoYRegresar = () => {
    setMostrarModalExito(false);
    setPatientData(null);
    navigate('/med/agenda');
  };

  return {
    // Estados
    patientData,
    sectionsData,
    activeTab,
    isAgendaOpen,
    cargando,
    modalMessage,
    datosGuardadosExito,
    mostrarModalExito,
    estadoGuardado,
    
    // Setters / Modificadores
    setActiveTab,
    setIsAgendaOpen,
    setModalMessage,
    setMostrarModalExito,
    
    // Acciones y Handlers
    handleSelectPaciente,
    handleSectionContentChange,
    ejecutarGuardadoYFirmaFinal,
    handleFinalizarFlujoYRegresar
  };
};