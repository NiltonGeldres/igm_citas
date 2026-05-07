import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, CreditCard, ArrowRight, X } from "lucide-react";
//import PagoVirtual from './PagoVirtual';
//import PagoVirtual from '../../../../feactures/PagoVirtual/PagoVirtual';
import PagoVirtual from './PagoVirtual';
import AuthService from '../../../../master-data/services/auth.service';

export const Paso4Confirmacion = ({ datosReserva, onFinalizar, onPagarTarde }) => {
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [usuarioData, setUsuarioData] = useState(null);
  //const user = await AuthService.leerUsuarioUsername();
  //setUsuarioData(user.data);

  console.log("datosReserva  Paso4Confirmacion "+JSON.stringify(datosReserva))

  const { 
    doctor, 
    especialidad, 
    fechaYYYYMMDD, 
    hora, 
    idCitaSeparada, 
    email, 
    usuarioCelular, 
    nombreDestino 
  } = datosReserva;


  const handlePagoExitoso = (success) => {
    if (success) {
      setShowPagoModal(false);
      onFinalizar(); 
    }
  };

  return (
    <div className="fade-in">
      {/* Encabezado de Éxito Temporal */}
      <div className="text-center mb-4">
        <div className="bg-success-light d-inline-block p-3 rounded-circle mb-3" style={{ color: 'var(--success)' }}>
          <CheckCircle size={40} />
        </div>
        <h4 className="fw-bold text-dark">¡Cita Separada!</h4>
        <p className="text-muted small">Tu cupo está reservado temporalmente.</p>
      </div>

      {/* Ticket de Detalles */}
      <div className="tarjeta-reserva">
        <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ color: 'var(--primary)' }}>
          <Clock size={18} />
          <span className="fw-bold">Resumen del Turno</span>
        </div>
        
        <div className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <span className="text-muted small">Especialista:</span>
            <span className="fw-bold small">{doctor?.nombres || doctor?.nombre}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted small">Servicio:</span>
            <span className="fw-bold small">{especialidad?.descripcionEspecialidad}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted small">Fecha y Hora:</span>
            <span className="fw-bold small text-primary">{fechaYYYYMMDD} - {hora}</span>
          </div>
          <div className="mt-3 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
            <span className="fw-bold text-secondary">Total a pagar:</span>
            <span className="h4 mb-0 fw-bold text-primary">S/ {doctor?.monto || '77.00'}</span>
          </div>
        </div>
      </div>

      {/* Alerta de tiempo límite */}
      <div className="alerta-warning mb-4">
        <AlertTriangle size={20} className="text-warning flex-shrink-0" />
        <div>
          <p className="small mb-0 fw-bold text-dark">Acción requerida</p>
          <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
            Para confirmar, registre su pago en las próximas <strong>2 horas</strong>. De lo contrario, la reserva se anulará.
          </p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="d-flex flex-column gap-2">
        <button onClick={() => setShowPagoModal(true)} className="btn-p-main">
          <CreditCard size={20} /> Registrar Pago Ahora
        </button>

        <button onClick={onPagarTarde} className="btn-p-secondary">
          Pagar más tarde <ArrowRight size={18} />
        </button>
      </div>

      {/* Modal de Pago (Custom Overlay) */}
      {showPagoModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content slide-up">
            <div className="custom-modal-header">
              <h5 className="fw-bold m-0 text-dark">Registro de Pago</h5>
              <button onClick={() => setShowPagoModal(false)} className="btn-close-custom border-0 bg-transparent">
                <X size={24} className="text-muted" />
              </button>
            </div>
            <div className="custom-modal-body">
              <PagoVirtual
                idCitaSeparada={idCitaSeparada}
                precioUnitario={doctor?.monto || 77}
                nombreDestino={nombreDestino}
                email={email}
                celular={usuarioCelular}
                modalClose={handlePagoExitoso}
              />
            </div>     
          </div>
        </div>
      )}
    </div>
  );
};