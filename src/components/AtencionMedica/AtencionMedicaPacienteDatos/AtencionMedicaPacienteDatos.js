// src/components/AtencionMedica/PatientHeader.js
import React from 'react';
import styles from '../../../Styles'; // Importar los estilos globales


/**
 * Componente para mostrar la cabecera con los datos del paciente.
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.patientData - Objeto con los datos del paciente (name, id, age, sex).
 * @param {function} props.onEditClick - Función a llamar cuando se hace clic en el botón de editar.
 */
const AtencionMedicaPacienteDatos = ({ patientData, onEditClick }) => {
  return (
    <div style={styles.patientHeader}>
      <div style={styles.patientHeaderContent}>
        <h2 style={styles.patientHeaderTitle}>Datos del Paciente</h2>
        <div style={styles.patientInfo}>
          <p><strong>Nombre:</strong> {patientData.name}</p>
          <p><strong>ID:</strong> {patientData.id}</p>
          <p><strong>Edad:</strong> {patientData.age} años</p>
          <p><strong>Sexo:</strong> {patientData.sex}</p>
        </div>
      </div>
      <button style={styles.editButton} onClick={onEditClick}>
        ✏️ {/* Icono de lápiz para editar */}
      </button>
    </div>
  );
};

export default AtencionMedicaPacienteDatos;
