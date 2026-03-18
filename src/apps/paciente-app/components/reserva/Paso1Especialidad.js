import React from 'react';
import { ChevronRight } from 'lucide-react';

export const Paso1Especialidad = ({ especialidades, onSeleccionar }) => {
  return (
    <>
      {especialidades.map(espec => (
        <div key={espec.idEspecialidad} 
             onClick={() => onSeleccionar(espec)} 
             className="tarjeta-personalizada bg-white p-4 shadow-sm d-flex align-items-center gap-3 cursor-pointer mb-2">
          <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4">
            {espec.icono}
          </div>
          <div className="flex-grow-1">
            <p className="mb-0 fw-bold small text-dark">
              {espec.descripcionEspecialidad}
            </p>
          </div>
          <ChevronRight size={18} className="text-light" />
        </div>
      ))}
    </>
  );
}