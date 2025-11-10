// src/components/pages/MedicalRecordForm.js
// Este es el componente que contiene todo el formulario de atención médica.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importa los iconos de Lucide React
import { Thermometer, Stethoscope, Lightbulb, Microscope, Pill, CheckCircle, PenTool } from 'lucide-react';
// Asegúrate de que estas rutas sean correctas según tu estructura de carpetas
import MessageModal from './common/MessageModal';
import AtencionMedicaMedicamentoPanel from './AtencionMedicaMedicamento/AtencionMedicaMedicamentoPanel';
import AtencionMedicaAltaPanel from './AtencionMedicaAlta/AtencionMedicaAltaPanel'; // Usado para Alta y Alergias
import AtencionMedicaAntecedentePanel from './AtencionMedicaAntecedente/AtencionMedicaAntecedentePanel';
import AtencionMedicaExamenFisicoPanel from './AtencionMedicaExamenFisico/AtencionMedicaExamenFisicoPanel';
import AtencionMedicaSintomaPanel from './AtencionMedicaSintoma/AtencionMedicaSintomaPanel';
// import StructuredListMedicalSection from './common/StructuredListMedicalSection'; // REMOVIDO: Ya no se usa directamente para Triaje
import AtencionMedicaDiagnostico from './AtencionMedicaDiagnostico/AtencionMedicaDiagnostico';
import AtencionMedicaExamen from './AtencionMedicaExamen/AtencionMedicaExamen';
import AtencionMedicaPacienteCitadoSeleccionar from '../AtencionMedica/AtencionMedicaPacienteDatos/AtencionMedicaPacienteCitadoSeleccionar';
import AtencionMedicaTriaje from './AtencionMedicaTriaje/AtencionMedicaTriajePanel'; // NUEVO: Importa el componente de Triaje
import Styles from '../../Styles';
import { v4 as uuidv4 } from 'uuid';


// Asegúrate de que estas rutas sean correctas según tu estructura de carpetas
import FirmaPeruPanel from '../FirmaPeru/FirmaPeruPanel'; // NUEVO: Importa el componente de Firma Perú

/**
 * Componente principal del formulario de Registro de Atención Médica.
 * Contiene todos los paneles y la lógica para guardar la atención.
 */
function AtencionMedicaForm() {
  const navigate = useNavigate();

  // Estado para la pestaña activa en la barra inferior
  const [activeTab, setActiveTab] = useState('triaje');

  // Estado para los datos del paciente
  const [patientData, setPatientData] = useState({
    name: 'Paciente No Seleccionado',
    sex: '',
    age: '',
    id: '',
  });

  // Estado para cada sección de la atención médica
  const [sectionsData, setSectionsData] = useState({
    PanelTriaje: [], // Ahora manejará una lista de objetos de triaje
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

  // Estado para el modal de mensajes general
  const [modalMessage, setModalMessage] = useState('');
  // Estado para controlar la visibilidad del modal de selección de paciente
  const [mostrarSeleccionarPacienteModal, setMostrarSeleccionarPacienteModal] = useState(false);


  /**
   * Muestra un mensaje en el modal.
   * @param {string} message - El mensaje a mostrar.
   */
  const showModalMessage = (message) => {
    setModalMessage(message);
  };

  /**
   * Cierra el modal de mensajes.
   */
  const closeModal = () => {
    setModalMessage('');
  };

  /**
   * Actualiza el contenido de una sección médica específica.
   * @param {string} sectionName - El nombre de la sección a actualizar.
   * @param {string|Array<object>} newContent - El nuevo contenido para la sección (puede ser texto o una lista).
   */
  const handleSectionContentChange = (sectionName, newContent) => {
    setSectionsData(prev => ({
      ...prev,
      [sectionName]: newContent,
    }));
  };

  /**
   * Maneja la selección de un paciente desde el modal.
   * @param {Object} selectedPatient - Los datos del paciente seleccionado.
   */
  const handleSelectPatient = (selectedPatient) => {
    setPatientData({
      name: selectedPatient.nombre,
      sex: selectedPatient.sexo,
      age: selectedPatient.edad,
      id: selectedPatient.id,
    });
    showModalMessage(`Paciente "${selectedPatient.nombre}" seleccionado.`);
    // Opcional: Limpiar secciones al seleccionar un nuevo paciente si es un nuevo registro
    // setSectionsData({ ...valores iniciales... });
  };

  /**
   * Envía los datos completos de la atención médica a un web service.
   */
  const guardarAtencionMedica = async () => {
    // Validar que se haya seleccionado un paciente
    if (patientData.id === '') {
      showModalMessage('Por favor, selecciona un paciente antes de guardar la atención médica.');
      return;
    }

    const fullMedicalRecord = {
      patient: patientData,
      attentionDetails: sectionsData,
      timestamp: new Date().toISOString(),
    };

    console.log('Datos a enviar al web service:', fullMedicalRecord);
    showModalMessage('Guardando atención médica...');

    try {
      // Por ahora, seguimos usando jsonplaceholder.typicode.com
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullMedicalRecord),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}. Detalles: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('Atención médica guardada con éxito:', result);
      showModalMessage('¡Atención médica guardada con éxito!');

      // Limpiar los campos después de guardar exitosamente
      setSectionsData({
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
      // Limpiar los datos del paciente para forzar una nueva selección
      setPatientData({
        name: 'Paciente No Seleccionado',
        sex: '',
        age: '',
        id: '',
      });

    } catch (error) {
      console.error('Error al guardar la atención médica:', error);
      showModalMessage(`Error al guardar la atención médica: ${error.message}. Por favor, inténtalo de nuevo.`);
    }
  };

  // Prepara los datos completos del registro médico para el panel de firma
  // Esto asegura que el panel de firma tenga acceso a toda la información.
  const fullMedicalRecordForSignature = {
    patient: patientData,
    attentionDetails: sectionsData,
  };

  return (
    // El contenedor principal de la aplicación que permite el scroll interno
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      {/* CABECERA DE LA PÁGINA Y RESUMEN DEL PACIENTE - FIJOS */}
      <div style={Styles.pageHeaderContainer}>
        <div style={Styles.pageHeader}>
          <button style={Styles.pageHeaderBackButton} onClick={() => navigate(-1)}>
            &larr; {/* Flecha hacia atrás */}
          </button>
          <h1 style={Styles.pageHeaderTitle}>REGISTRO MÉDICO</h1>
        </div>
        {/* RESUMEN DEL PACIENTE */}
        <div
          style={Styles.patientSummaryCard}
          onClick={() => setMostrarSeleccionarPacienteModal(true)} // Abre el modal al hacer clic en la tarjeta
          title="Haz clic para seleccionar un paciente"
        >
          <h2 style={Styles.patientSummaryName}>{patientData.name}</h2>
          {/* Renderizado condicional para los detalles del paciente */}
          {patientData.id ? (
            <p style={patientData.sex === 'Femenino' ? Styles.patientSummaryDetails : Styles.patientSummaryDetails}>
              {patientData.sex}{patientData.age ? `, ${patientData.age} años` : ''} | ID: {patientData.id}
            </p>
          ) : (
            // Usamos Styles.patientSummaryAlertColor para el mensaje, consistente con el diseño iOS-inspired
            <p style={{ ...Styles.patientSummaryDetails, color: Styles.patientSummaryAlertColor, fontWeight: 'bold', marginTop: '5px' }}>
              (Haz clic aquí para seleccionar un paciente)
            </p>
          )}
        </div>
      </div>

      {/* CONTENIDO CENTRAL - CON SCROLL */}
      <div style={Styles.container}>
        <div style={Styles.sectionsContainer}>

          {/* === SECCIÓN DE TRIAJE === */}
          {activeTab === 'triaje' && (
            <AtencionMedicaTriaje // Usando el nuevo componente de Triaje
              content={sectionsData.PanelTriaje}
              onContentChange={(newList) => handleSectionContentChange('PanelTriaje', newList)}
              onModalMessage={showModalMessage}
            />
          )}

          {/* === SECCIONES DE ENFERMEDAD Y EXAMEN FÍSICO === */}
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

          {/* === SECCIONES DE DIAGNÓSTICO === */}
          {activeTab === 'diagnosis' && (
            <AtencionMedicaDiagnostico
              content={sectionsData.PanelDiagnostico}
              onContentChange={(newList) => handleSectionContentChange('PanelDiagnostico', newList)}
              onModalMessage={showModalMessage}
            />
          )}

          {/* === SECCIONES DE EXÁMENES === */}
          {activeTab === 'exams' && (
            <AtencionMedicaExamen
              content={sectionsData.PanelPlanTrabajo}
              onContentChange={(newList) => handleSectionContentChange('PanelPlanTrabajo', newList)}
              onModalMessage={showModalMessage}
              diagnosticosDisponibles={sectionsData.PanelDiagnostico}
            />
          )}

          {/* === SECCIONES DE MEDICACIÓN === */}
          {activeTab === 'medication' && (
            <AtencionMedicaMedicamentoPanel
              content={sectionsData.PanelTratamientos}
              onContentChange={(newList) => handleSectionContentChange('PanelTratamientos', newList)}
              onModalMessage={showModalMessage}
            />
          )}

          {/* Panel de Alergias (notas generales) */}
          {sectionsData.PanelAlergias && (
            <AtencionMedicaAltaPanel
              title="Panel Alergias (Notas Generales)"
              content={sectionsData.PanelAlergias}
              onContentChange={(newContent) => handleSectionContentChange('PanelAlergias', newContent)}
              onModalMessage={showModalMessage}
            />
          )}

          {/* === SECCIONES DE ALTA === */}
          {activeTab === 'discharge' && (
            <>
              <AtencionMedicaAltaPanel
                title="Panel Alta"
                content={sectionsData.PanelAlta}
                onContentChange={(newContent) => handleSectionContentChange('PanelAlta', newContent)}
                onModalMessage={showModalMessage}
              />
            </>
          )}

          {/* === SECCIÓN DE FIRMA DIGITAL CON FIRMA PERÚ === */}
          {activeTab === 'signature' && (
            <FirmaPeruPanel // Usamos el nuevo componente aquí para la firma con Firma Perú
              medicalRecordData={fullMedicalRecordForSignature}
              onModalMessage={showModalMessage}
            />
          )}

          {/* Botón para guardar la atención médica (oculto en la pestaña de firma) */}
          {activeTab !== 'signature' && (
            <button
              onClick={guardarAtencionMedica}
              style={Styles.saveButton}
            >
              Guardar
            </button>
          )}
        </div>
      </div>

      {/* BARRA INFERIOR FIJA - CON ICONOS LUCIDE REACT */}
      <div style={Styles.fixedBottomBar}>
        <button
          style={activeTab === 'triaje' ? Styles.fixedBottomBarButtonActive : Styles.fixedBottomBarButton}
          onClick={() => setActiveTab('triaje')}
        >
          <Thermometer size={Styles.fixedBottomBarButtonIcon.fontSize} style={activeTab === 'triaje' ? Styles.fixedBottomBarButtonIconActive : Styles.fixedBottomBarButtonIcon} />
          <span style={activeTab === 'triaje' ? Styles.fixedBottomBarTextActive : Styles.fixedBottomBarText}>Triaje</span>
        </button>
        <button
          style={activeTab === 'diseaseAndExam' ? Styles.fixedBottomBarButtonActive : Styles.fixedBottomBarButton}
          onClick={() => setActiveTab('diseaseAndExam')}
        >
          <Stethoscope size={Styles.fixedBottomBarButtonIcon.fontSize} style={activeTab === 'diseaseAndExam' ? Styles.fixedBottomBarButtonIconActive : Styles.fixedBottomBarButtonIcon} />
          <span style={activeTab === 'diseaseAndExam' ? Styles.fixedBottomBarTextActive : Styles.fixedBottomBarText}>Enfermedad</span>
        </button>
        <button
          style={activeTab === 'diagnosis' ? Styles.fixedBottomBarButtonActive : Styles.fixedBottomBarButton}
          onClick={() => setActiveTab('diagnosis')}
        >
          <Lightbulb size={Styles.fixedBottomBarButtonIcon.fontSize} style={activeTab === 'diagnosis' ? Styles.fixedBottomBarButtonIconActive : Styles.fixedBottomBarButtonIcon} />
          <span style={activeTab === 'diagnosis' ? Styles.fixedBottomBarTextActive : Styles.fixedBottomBarText}>Diagnóstico</span>
        </button>
        <button
          style={activeTab === 'exams' ? Styles.fixedBottomBarButtonActive : Styles.fixedBottomBarButton}
          onClick={() => setActiveTab('exams')}
        >
          <Microscope size={Styles.fixedBottomBarButtonIcon.fontSize} style={activeTab === 'exams' ? Styles.fixedBottomBarButtonIconActive : Styles.fixedBottomBarButtonIcon} />
          <span style={activeTab === 'exams' ? Styles.fixedBottomBarTextActive : Styles.fixedBottomBarText}>Exámenes</span>
        </button>
        <button
          style={activeTab === 'medication' ? Styles.fixedBottomBarButtonActive : Styles.fixedBottomBarButton}
          onClick={() => setActiveTab('medication')}
        >
          <Pill size={Styles.fixedBottomBarButtonIcon.fontSize} style={activeTab === 'medication' ? Styles.fixedBottomBarButtonIconActive : Styles.fixedBottomBarButtonIcon} />
          <span style={activeTab === 'medication' ? Styles.fixedBottomBarTextActive : Styles.fixedBottomBarText}>Medicacion</span>
        </button>
        <button
          style={activeTab === 'discharge' ? Styles.fixedBottomBarButtonActive : Styles.fixedBottomBarButton}
          onClick={() => setActiveTab('discharge')}
        >
          <CheckCircle size={Styles.fixedBottomBarButtonIcon.fontSize} style={activeTab === 'discharge' ? Styles.fixedBottomBarButtonIconActive : Styles.fixedBottomBarButtonIcon} />
          <span style={activeTab === 'discharge' ? Styles.fixedBottomBarTextActive : Styles.fixedBottomBarText}>Alta</span>
        </button>
        <button
          style={activeTab === 'signature' ? Styles.fixedBottomBarButtonActive : Styles.fixedBottomBarButton}
          onClick={() => setActiveTab('signature')}
        >
          <PenTool size={Styles.fixedBottomBarButtonIcon.fontSize} style={activeTab === 'signature' ? Styles.fixedBottomBarButtonIconActive : Styles.fixedBottomBarButtonIcon} />
          <span style={activeTab === 'signature' ? Styles.fixedBottomBarTextActive : Styles.fixedBottomBarText}>Firma</span>
        </button>
      </div>

      {/* Uso del componente MessageModal (para mensajes generales) */}
      <MessageModal message={modalMessage} onClose={closeModal} />

      {/* Modal de selección de paciente */}
      <AtencionMedicaPacienteCitadoSeleccionar
        isOpen={mostrarSeleccionarPacienteModal}
        onClose={() => setMostrarSeleccionarPacienteModal(false)}
        onSelectPatient={handleSelectPatient}
      />
    </div>
  );
}

export default AtencionMedicaForm;
