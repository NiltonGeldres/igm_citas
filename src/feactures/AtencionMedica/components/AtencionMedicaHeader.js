// src/feactures/AtencionMedica/components/AtencionMedicaHeader.js
import React from 'react';
import AtencionMedicaPacienteDatos from '../AtencionMedicaPacienteDatos/AtencionMedicaPacienteDatos';

export const AtencionMedicaHeader = ({ paciente, onEditClick }) => {
  // Validación de seguridad para evitar errores de renderizado
  if (!paciente) return null;

  // Normalización para que coincida con lo que espera AtencionMedicaPacienteDatos (name, id, age, sex)
  const normalizedPatientData = {
    name: paciente.name || paciente.nombres || paciente.nombre || 'Paciente Sin Nombre',
    id: paciente.id || paciente.numHistoria || paciente.hc || 'N/A',
    age: paciente.age || paciente.edad || 'N/A',
    sex: paciente.sex || paciente.sexo || 'N/A'
  };

  return (
    <div className="hce-header-wrapper">
      <AtencionMedicaPacienteDatos 
        patientData={normalizedPatientData} 
        onEditClick={onEditClick} 
      />
      
      <div className="hce-badge-accion" style={{ marginTop: '0.5rem' }}>
        <span className={`badge ${paciente.accionAgenda === 'ACTUALIZAR' ? 'badge-warning' : 'badge-primary'}`}>
          {paciente.accionAgenda === 'ACTUALIZAR' ? 'Modo: Edición de Atención' : 'Modo: Nueva Atención'}
        </span>
      </div>
    </div>
  );
};