import React from 'react';
import { Calendar, CreditCard, Star, User } from 'lucide-react';

export const InicioDashboard = ({ 
  perfil, 
  nombreEntidad, 
  misCitas, 
  misMedicosEntidad,
  direccionClinica, 
  onNuevaCita, 
  onIrAPagos 
}) => {
  return (
    <div className="fade-in px-3 pt-4">
      {/* CARD DE BIENVENIDA */}
      <div className="card border-0 bg-primary text-white p-4 shadow-lg mb-4" style={{ borderRadius: '28px' }}>
        <h5 className="fw-bold mb-1">¡Hola, {perfil?.usuarioNombres}</h5>
        <p className="opacity-75 small mb-4">Bienvenido a {nombreEntidad}. Tu salud es prioridad.</p>
        
        <div className="row g-2">
          <div className="col-6">
            <div className="bg-white bg-opacity-10 p-2 rounded-4 text-center">
              <p className="small mb-0 opacity-75" style={{ fontSize: '10px' }}>PRÓXIMA CITA</p>
              <p className="small fw-bold mb-0 text-truncate">
                {misCitas && misCitas.length > 0 ? `${misCitas[0].fecha +' - '+misCitas[0].horainicio}` : 'Sin citas'}
              </p>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-white bg-opacity-10 p-2 rounded-4 text-center">
              <p className="small mb-0 opacity-75" style={{ fontSize: '10px' }}>UBICACIÓN</p>
              <p className="small fw-bold mb-0 text-truncate">{direccionClinica}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACCIONES RÁPIDAS */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <div onClick={onNuevaCita} className="tarjeta-personalizada bg-white shadow-sm p-4 text-center d-block cursor-pointer">
            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4 d-inline-block mb-2">
              <Calendar size={24} />
            </div>
            <div className="fw-bold small text-dark">Nueva Cita</div>
          </div>
        </div>
        <div className="col-6">
          <div onClick={onIrAPagos} className="tarjeta-personalizada bg-white shadow-sm p-4 text-center d-block cursor-pointer">
            <div className="bg-success bg-opacity-10 text-success p-3 rounded-4 d-inline-block mb-2">
              <CreditCard size={24} />
            </div>
            <div className="fw-bold small text-dark">Pago Citas</div>
          </div>
        </div>
      </div>

      {/* ESPECIALISTAS RECOMENDADOS */}
      <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center px-1">
        Especialistas Recomendados
        <span className="text-primary small" style={{ fontSize: '11px', cursor: 'pointer' }}>Ver todos</span>
      </h6>
      
      <div className="d-flex flex-column gap-3">

                  {misMedicosEntidad.length === 0 ? (
                    <tr><td className="text-center py-3 text-muted">No hay pagos en verificación.</td></tr>
                  ) : (
                    misMedicosEntidad.map((doctor) => (
                      <div key={doctor.id} className="tarjeta-personalizada bg-white p-3 shadow-sm d-flex align-items-center gap-3">
                        <div className="bg-light rounded-circle p-2 text-secondary"><User size={24} /></div>
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-bold small text-dark">{doctor.nombre}</p>
                          <p className="mb-0 text-secondary" style={{ fontSize: '11px' }}>{doctor.nombreEspecialidad}</p>
                        </div>
                        <div className="text-warning fw-bold small d-flex align-items-center gap-1">
                          <Star size={12} fill="currentColor" /> {4.9}
                        </div>
                      </div>
                    ))
                  )}


      </div>
    </div>
  );
};

/**
 [
          { id: 'd1', nombre: 'Dr. Roberto Gómez', calificacion: 4.8 },
          { id: 'd2', nombre: 'Dra. Elena Martínez', calificacion: 4.9 }
        ]
*/