import React from 'react';
import { Calendar, Plus } from 'lucide-react';

export const ListaMisCitas = ({ misCitas, onNuevaCita }) => {
  return (
    <div className="d-flex flex-column gap-3">
      <h5 className="fw-bold">Mis Citas</h5>
      {misCitas.length > 0 ? (
        misCitas.map(cita => (
          <div key={cita.id} className="tarjeta-personalizada bg-white p-4 shadow-sm border-start border-primary border-4">
            <div className="d-flex justify-content-between mb-2">
              <div>
                <p className="fw-bold mb-0">{cita.servicioNombre}</p>
                <p className="text-secondary small mb-0">{cita.nombres}</p>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 h-fit">
                <Calendar size={18} />
              </div>
            </div>
            <div className="pt-3 border-top d-flex justify-content-between align-items-center">
              <div>
                <span className="text-uppercase text-secondary fw-bold d-block" style={{fontSize: '10px'}}>{cita.fechaLabel || cita.fecha}</span>
                <span className="fw-bold text-dark" style={{fontSize: '12px'}}>{cita.horainicio}</span>
              </div>
              <span className="etiqueta-pago bg-success bg-opacity-10 text-success">Confirmado</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-5 text-secondary opacity-50">
          <Calendar size={48} className="mb-3" />
          <p>No tienes citas programadas</p>
        </div>
      )}
      <button onClick={onNuevaCita} className="btn btn-primary p-3 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2">
        <Plus size={20} /> Nueva Cita
      </button>
    </div>
  );
};