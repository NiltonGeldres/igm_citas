// src/components/AtencionMedica/MedicalSection.js
import React from 'react';
import useVoiceRecognition from '../../../hooks/useVoiceRecognition'; // <-- Importa el hook extraído
import styles from '../../../Styles'; // Importar los estilos globales
import Cita from '../../Cita/Cita';

/**
 * Componente para una sección individual de atención médica con dictado por voz.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.title - El título de la sección (ej. "Panel Triaje").
 * @param {string} props.content - El contenido actual del área de texto de la sección.
 * @param {function} props.onContentChange - Función para actualizar el contenido de la sección.
 * @param {function} props.onModalMessage - Función para mostrar mensajes en un modal.
 */
const AtencionMedicaAltaPanel = ({ title, content, onContentChange, onModalMessage }) => {
  const { startListening, stopListening, isListening, error } = useVoiceRecognition(
    (transcript) => onContentChange(transcript),
    onModalMessage
  );

  return (
    <div style={styles.medicalSection}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {error && <p style={styles.errorText}>{error}</p>}
      <Cita modoCita='medico'  medicoIdPreseleccionado={1} especialidadIdPreseleccionada={0}></Cita>
      <div style={styles.inputContainer}>
        <textarea
          style={styles.textArea}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={`Dicta o escribe la información de ${title}...`}
          rows="4"
        />
        <button
          onClick={isListening ? stopListening : startListening}
          style={isListening ? styles.micButtonActive : styles.micButton}
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>

    </div>
  );
};

export default AtencionMedicaAltaPanel;

