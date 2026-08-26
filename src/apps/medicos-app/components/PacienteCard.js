import React from 'react';
import { CheckCircle, Clock } from "lucide-react";

export const PacienteCard = ({ paciente, onAtender }) => {
  // 💡 El paciente se considera atendido si ya tiene un idAtencion asignado o su estado de cita es mayor a 1
  const esAtendido = Number(paciente.idAtencion) > 0 || paciente.estadoCita > 1;

  return (
    <div className="patient-card">
      <div className="time-col">
        <div className="time-val">{paciente.horainicio}</div>
        <div className="time-label">HORA</div>
      </div>
      <div className="divider" />
      <div className="info-col">
        <div className="name-row">
          <span>{paciente.nombres} {paciente.apellidos || ''}</span>
          {paciente.pagado && <CheckCircle size={14} color="#198754" />}
        </div>
        <div className="service-row">
          <Clock size={12} />
          <span>{paciente.servicioNombre || 'Cons. Externa'}</span>
        </div>
      </div>

      <button 
        className={`btn-atender ${esAtendido ? 'is-actualizar' : 'is-atender'}`} 
        onClick={onAtender}
        disabled={!onAtender}        
      >
        {esAtendido ? 'ACTUALIZAR' : 'ATENDER'}
      </button>
    </div>
  );
};