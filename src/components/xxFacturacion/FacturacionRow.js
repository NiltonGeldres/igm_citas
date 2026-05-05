import React, { useState } from 'react';
import { Button, Badge, Card, Collapse } from 'react-bootstrap';
import { ChevronDown, ChevronUp, User, Calendar, Clock, Mail, Phone, ReceiptText, CheckCircle } from "lucide-react";
import FormatDate from '../Maestros/FormatDate';
import FacturacionService from './FacturacionService';

const FacturacionRow = ({ rows }) => {
  const [show, setShow] = useState(false);
  const [procesado, setProcesado] = useState(false);

  const crearBoletaCita = () => {
    FacturacionService.setCitasPagadas(rows)
      .then(() => {
        setProcesado(true);
        // Opcional: podrías refrescar la lista general aquí
      })
      .catch((error) => console.error(error));
  };

  return (
    <Card className={`border-0 shadow-sm mb-2 ${procesado ? 'opacity-50 bg-light' : ''}`} style={{ color: '#333' }}>
      <Card.Body className="p-3">
        <div className="row align-items-center">
          {/* Botón Expansor */}
          <div className="col-auto">
            <Button 
              variant="light" 
              size="sm" 
              className="rounded-circle"
              onClick={() => setShow(!show)}
            >
              {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>

          {/* Info Principal */}
          <div className="col">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-capitalize" style={{ fontSize: '15px' }}>{rows.nombres}</span>
              <Badge bg={rows.entidaddestino === "1" ? "info" : "primary"} className="small px-2">
                {rows.entidaddestino === "1" ? "YAPE" : "PLIN"}
              </Badge>
            </div>
            <div className="text-muted small">
              <ReceiptText size={12} className="me-1" />
              Op: <span className="fw-bold">{rows.nrooperacion}</span> • {FormatDate.format_fecha(rows.fechapago)}
            </div>
          </div>

          {/* Precio y Acción */}
          <div className="col-auto text-end">
            <div className="fw-bold text-success mb-1">S/ {rows.preciounitario}</div>
            <Button 
              size="sm" 
              variant={procesado ? "outline-secondary" : "success"} 
              disabled={procesado}
              className="d-flex align-items-center gap-1"
              onClick={crearBoletaCita}
            >
              {procesado ? <CheckCircle size={14} /> : null}
              {procesado ? "sBoleta Generada" : "Generar Boleta"}
            </Button>
          </div>
        </div>
        {/* Detalles Expandibles */}
        <Collapse in={show}>
          <div className="mt-3 pt-3 border-top">
            <div className="row g-2">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 small mb-1">
                  <Calendar size={14} className="text-muted" />
                  <strong>Fecha de Cita:</strong> {FormatDate.format_fecha(rows.fechacita)}
                </div>
                <div className="d-flex align-items-center gap-2 small mb-1">
                  <Clock size={14} className="text-muted" />
                  <strong>Hora de Cita:</strong> {rows.horainicio}
                </div>
                <div className="d-flex align-items-center gap-2 small">
                  <ReceiptText size={14} className="text-muted" />
                  <strong>Origen:</strong> {rows.origen}
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 small mb-1">
                  <Mail size={14} className="text-muted" />
                  {rows.correo}
                </div>
                <div className="d-flex align-items-center gap-2 small">
                  <Phone size={14} className="text-muted" />
                  {rows.celular}
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default FacturacionRow;
