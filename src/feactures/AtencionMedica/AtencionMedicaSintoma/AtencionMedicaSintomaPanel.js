// src/components/AtencionMedica/SintomasPanel.js
import React from 'react';
import useVoiceRecognition from '../../../hooks/useVoiceRecognition'; // Importa el hook de voz
import styles from '../../../Styles'; // Importa los estilos globales

/**
 * Componente específico para el Panel de Síntomas con dictado por voz.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.content - El contenido actual del área de texto.
 * @param {function} props.onContentChange - Función para actualizar el contenido.
 * @param {function} props.onModalMessage - Función para mostrar mensajes en un modal.
 */
const AtencionMedicaaSintomasPanel = ({ content, onContentChange, onModalMessage }) => {
  const title = "Panel Síntomas"; // Título hardcodeado para este componente específico

  const { startListening, stopListening, isListening, error } = useVoiceRecognition(
    (transcript) => onContentChange(transcript),
    onModalMessage
  );

  return (
    <div style={styles.medicalSection}>
      <h3 style={styles.sectionTitle}>{title}</h3>
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
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

export default AtencionMedicaaSintomasPanel;

