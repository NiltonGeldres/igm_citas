// src/components/AtencionMedica/MessageModal.js
import React from 'react';
import styles from '../../../Styles'; // Importar los estilos globales

/**
 * Componente de modal genérico para mostrar mensajes al usuario.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.message - El mensaje a mostrar en el modal.
 * @param {function} props.onClose - Función para cerrar el modal.
 */
const MessageModal = ({ message, onClose }) => {
  if (!message) return null; // No renderizar si no hay mensaje

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <p style={styles.modalMessage}>{message}</p>
        <button style={styles.modalButton} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default MessageModal;

