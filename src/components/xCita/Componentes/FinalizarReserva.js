import React, { useState, useEffect } from "react";
import { CheckCircle, CreditCard, Clock, AlertTriangle } from "lucide-react";
import { Modal, Button } from "react-bootstrap";

import PagoVirtual from "../../PagoVirtual/PagoVirtual";

// Añadimos la prop onPagarTarde
const FinalizarReserva = ({ datosReserva, onFinalizar, onPagarTarde }) => {
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [reservaInfo, setReservaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setReservaInfo(datosReserva);
    setLoading(false);
  }, [datosReserva]);

  const handlePagoExitoso = (success) => {
    if (success) {
      setShowPagoModal(false);
      onFinalizar(); 
    }
  };

  if (loading) return <div className="text-center p-5">Procesando separación de cita...</div>;

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="bg-success-subtle d-inline-block p-3 rounded-circle mb-3">
              <CheckCircle size={48} className="text-success" />
            </div>
            <h2 className="fw-bold text-dark">¡Cita Separada Exitosamente!</h2>
            <p className="text-muted">Su espacio ha sido reservado temporalmente.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 bg-light rounded-4 h-100">
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                  <Clock size={20} className="me-2 text-primary" /> Detalle del Turno
                </h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2"><strong>Médico:</strong> {reservaInfo.doctor?.nombres || reservaInfo.doctor?.nombre}</li>
                  <li className="mb-2"><strong>Especialidad:</strong> {reservaInfo.especialidad?.descripcionEspecialidad || reservaInfo.especialidad?.nombre}</li>
                  <li className="mb-2"><strong>Fecha:</strong> {reservaInfo.fechaYYYYMMDD}</li>
                  <li className="mb-2"><strong>Hora:</strong> {reservaInfo.hora}</li>
                  <li className="mt-3 fs-5 text-primary">
                    <strong>Total a pagar:</strong> S/ {reservaInfo.doctor?.monto || '77.00'}
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-4 border border-warning rounded-4 h-100 bg-warning-subtle">
                <h5 className="fw-bold text-warning-emphasis d-flex align-items-center">
                  <AlertTriangle size={20} className="me-2" /> Aviso Importante
                </h5>
                <p className="small text-warning-emphasis">
                  Para confirmar su cita definitivamente, debe registrar su pago. 
                  Si no se registra en las próximas <strong>2 horas</strong>, la separación se anulará automáticamente.
                </p>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="fw-bold d-flex align-items-center justify-content-center"
                    onClick={() => setShowPagoModal(true)}
                  >
                    <CreditCard size={20} className="me-2" /> Pagar Ahora
                  </Button>
                  
                  {/* BOTÓN CORREGIDO: Ejecuta la función que viene por props */}
                  <Button 
                    variant="outline-secondary" 
                    onClick={onPagarTarde}
                  >
                    Pagar más tarde (En "Mis Pagos")
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showPagoModal} onHide={() => setShowPagoModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Registrar Pago Virtual</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <PagoVirtual
            idProgramacion={reservaInfo.idProgramacion}
            horaInicio={reservaInfo.hora}
            idCitaSeparada={reservaInfo.idCitaSeparada}
            precioUnitario={reservaInfo.doctor?.monto || 77}
            nombreDestino={reservaInfo?.nombreEntidad}
            email={reservaInfo.usuarioEmail}
            celular={reservaInfo.usuarioCelular}
            modalClose={handlePagoExitoso}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FinalizarReserva;