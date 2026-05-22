import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, Mail, Phone, ReceiptText, CheckCircle, AlertCircle, FilePlus } from "lucide-react";
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

  const tienePagoRegistrado = rows.nrooperacion && rows.nrooperacion.toString().trim() !== "";

  return (
    <div className={`facturacion-card ${procesado ? 'procesado' : ''}`} style={{ fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
      <div className="card-main d-flex align-items-center py-3 px-4">
        
        {/* BOTÓN EXPANDIR */}
        <button className="btn-expand me-3" onClick={() => setShow(!show)}>
          {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {/* CONTENEDOR DE INFORMACIÓN PRINCIPAL */}
        <div className="info-paciente flex-grow-1">
          
          {/* 1. FILA SUPERIOR: NOMBRE DEL PACIENTE Y BADGE */}
          <div className="nombre-badge d-flex align-items-center mb-2">
            <span className="nombre fw-bold text-dark" style={{ fontSize: '16px', letterSpacing: '-0.3px' }}>
              {rows.nombres}
            </span>
            {tienePagoRegistrado ? (
              <span className={`badge ms-2 ${rows.entidaddestino === "1" ? 'yape' : 'plin'}`} style={{ fontSize: '11px', padding: '4px 10px' }}>
                {rows.entidaddestino === "1" ? "YAPE" : "PLIN"}
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle ms-2 fw-semibold" style={{ fontSize: '11px', padding: '4px 10px' }}>
                PENDIENTE DE PAGO
              </span>
            )}
          </div>
          
          {/* 💡 2. RESTRUCTURACIÓN CRONOLÓGICA: COLUMNADO INTELIGENTE PARA DESKTOP (PC) */}
          <div className="row g-2 my-2 text-secondary w-100 container-cronologia" style={{ fontSize: '13px', maxWidt: '850px' }}>
            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <div className="p-1 bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                <FilePlus size={14} className="text-muted" />
              </div>
              <span><span className="text-muted fw-normal">Solicitado:</span> <b className="text-dark fw-semibold">{FormatDate.format_fecha(rows.fechasolicitud)}</b></span>
            </div>

            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <div className="p-1 rounded d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', backgroundColor: '#e0f2fe' }}>
                <Calendar size={14} className="text-primary" />
              </div>
              <span><span className="text-muted fw-normal">Fecha Cita:</span> <b className="text-dark fw-semibold">{FormatDate.format_fecha(rows.fechacita)}</b></span>
            </div>

            <div className="col-12 col-md-4 d-flex align-items-center gap-2">
              <div className="p-1 rounded d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', backgroundColor: '#f0fdf4' }}>
                <Clock size={14} className="text-success" />
              </div>
              <span><span className="text-muted fw-normal">Hora Inicio:</span> <b className="text-dark fw-semibold">{rows.horainicio}</b></span>
            </div>
          </div>

          {/* 3. FILA INFERIOR: ESTADO DEL COMPROBANTE / OPERACIÓN */}
          <div className="operacion d-flex align-items-center gap-2 mt-2 pt-1" style={{ fontSize: '12.5px', borderTop: '1px dashed #f1f5f9' }}>
            <ReceiptText size={14} className="text-muted" /> 
            {tienePagoRegistrado ? (
              <span className="text-muted">
                Código de Operación: <strong className="text-dark fw-semibold">{rows.nrooperacion}</strong> • Emitido el {FormatDate.format_fecha(rows.fechapago)}
              </span>
            ) : (
              <span className="text-danger fw-medium d-flex align-items-center gap-1">
                ⚠️ Sin comprobante de pago subido en el portal
              </span>
            )}
          </div>
        </div>

        {/* CONTENEDOR DE ACCIÓN INMEDIATA (DERECHA) */}
        <div className="accion-pago text-end d-flex flex-column align-items-end justify-content-center ms-3" style={{ minWidth: '110px' }}>
          <div className="monto fw-bold text-dark mb-2" style={{ fontSize: '18px', letterSpacing: '-0.5px' }}>
            S/ {rows.preciounitario}
          </div>
          
          {tienePagoRegistrado ? (
            <button 
              className={`btn-boleta w-100 ${procesado ? 'done' : 'active'}`}
              disabled={procesado}
              onClick={crearBoletaCita}
              style={{ padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}
            >
              {procesado ? <CheckCircle size={14} className="me-1 d-inline" /> : null}
              {procesado ? "Generado" : "Boleta"}
            </button>
          ) : (
            <div className="badge bg-light text-muted border d-flex align-items-center gap-1 justify-content-center w-100 py-2" style={{ fontSize: '12px', fontWeight: '500' }}>
              <AlertCircle size={13} className="text-warning" />
              <span>Sólo Lectura</span>
            </div>
          )}
        </div>
      </div>

      {/* DETALLES DESPLEGABLES */}
      {show && (
        <div className="card-details px-4 py-3 bg-light border-top" style={{ fontSize: '13px' }}>
          <div className="row">
            <div className="col-12 col-sm-6 mb-2 mb-sm-0 d-flex align-items-center gap-2">
              <Mail size={14} className="text-muted" /> 
              <span><b>Correo del paciente:</b> {rows.correo || "No registrado"}</span>
            </div>
            <div className="col-12 col-sm-6 d-flex align-items-center gap-2">
              <Phone size={14} className="text-muted" /> 
              <span><b>Celular de contacto:</b> {rows.celular || "No registrado"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturacionRow;

/*
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

*/