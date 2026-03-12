import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, Mail, Phone, ReceiptText, CheckCircle } from "lucide-react";
import FacturacionService from './FacturacionService';
import FormatDate from '../../shared/utils/FormatDate';

const FacturacionRow = ({ rows }) => {
  const [show, setShow] = useState(false);
  const [procesado, setProcesado] = useState(false);

  const crearBoletaCita = () => {
    FacturacionService.setCitasPagadas(rows)
      .then(() => setProcesado(true))
      .catch((error) => console.error(error));
  };

  return (
    <div className={`facturacion-card ${procesado ? 'procesado' : ''}`}>
      <div className="card-main">
        <button className="btn-expand" onClick={() => setShow(!show)}>
          {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <div className="info-paciente">
          <div className="nombre-badge">
            <span className="nombre">{rows.nombres}</span>
            <span className={`badge ${rows.entidaddestino === "1" ? 'yape' : 'plin'}`}>
              {rows.entidaddestino === "1" ? "YAPE" : "PLIN"}
            </span>
          </div>
          <div className="operacion">
            <ReceiptText size={12} /> Op: <b>{rows.nrooperacion}</b> • {FormatDate.format_fecha(rows.fechapago)}
          </div>
        </div>

        <div className="accion-pago">
          <div className="monto">S/ {rows.preciounitario}</div>
          <button 
            className={`btn-boleta ${procesado ? 'done' : 'active'}`}
            disabled={procesado}
            onClick={crearBoletaCita}
          >
            {procesado ? <CheckCircle size={14} /> : null}
            {procesado ? "Generado" : "Boleta"}
          </button>
        </div>
      </div>

      {show && (
        <div className="card-details">
          <div className="detail-item"><Calendar size={14} /> <b>Cita:</b> {FormatDate.format_fecha(rows.fechacita)}</div>
          <div className="detail-item"><Clock size={14} /> <b>Hora:</b> {rows.horainicio}</div>
          <div className="detail-item"><Mail size={14} /> {rows.correo}</div>
          <div className="detail-item"><Phone size={14} /> {rows.celular}</div>
        </div>
      )}
    </div>
  );
};

export default FacturacionRow;