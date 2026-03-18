import React from 'react';
import { User, ChevronRight } from 'lucide-react';

export const Paso2Medico = ({ medicos, onSeleccionar }) => {
  return (
    <>
      {(medicos || []).map(doctor => (
        <div key={doctor.id} 
             onClick={() => onSeleccionar(doctor)} 
             className="tarjeta-personalizada bg-white p-3 shadow-sm d-flex align-items-center gap-3 cursor-pointer mb-2">
          <div className="bg-light rounded-circle p-2 text-secondary">
            <User size={24} />
          </div>
          <div className="flex-grow-1">
            <p className="mb-0 fw-bold small text-dark">{doctor.nombres}</p>
            <p className="mb-0 text-primary fw-bold" style={{fontSize: '15px'}}>{doctor.montoFormateado}</p>
          </div>
          <ChevronRight size={18} className="text-light" />
        </div>
      ))}
    </>
  );
};