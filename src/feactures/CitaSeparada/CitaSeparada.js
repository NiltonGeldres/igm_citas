import  { useEffect, useState } from "react";
import { Table, Button, Modal, Badge, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {  FaSync, FaClock, FaCheckCircle } from 'react-icons/fa';
//import AuthService from "../Login/services/auth.service";
//import CitaSeparadaService from "./CitaSeparadaService";

import AuthService from "../../master-data/services/auth.service";
import CitaSeparadaService from "../CitaSeparada/CitaSeparadaService"
import PagoVirtual from "../PagoVirtual/PagoVirtual";
import FormatDate from "../../shared/utils/FormatDate";

const CitaSeparada = ({}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [citasEnVerificacion, setCitasEnVerificacion] = useState([]);
  const [actualizar, setActualizar] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [usuarioData, setUsuarioData] = useState(null);

  
useEffect(() => {
    if (actualizar) {
      cargarDatos();
      setActualizar(false);
    }
  }, [actualizar]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const user = await AuthService.leerUsuarioUsername();
      setUsuarioData(user.data);

      const resPendientes = await CitaSeparadaService.getCitasSeparadaLeer();
      console.log("API res  "+JSON.stringify(resPendientes.data))
      setCitasPendientes(resPendientes.data.citaSeparada || []);

      const resVerificacion = await CitaSeparadaService.getCitasSeparadaConPagoVirtualLeer();
      setCitasEnVerificacion(resVerificacion.data.citaSeparada || []);
    } catch (error) {
      console.error("Error cargando pagos:", error);
      if (error.response?.status === 403) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const abrirPago = (cita) => {
    console.log("abrirPago cita "+JSON.stringify(cita))
    setPagoSeleccionado({
      idProgramacion: cita.idProgramacion, 
      horaInicio: cita.horaInicio, 
      idCitaSeparada: cita.idCitaSeparada, 
      precioUnitario: cita.precioUnitario, //Precio
      nombreDestino: cita.destino_cuenta, //Nombre Entidad destino
      email: usuarioData?.email, //correo confirmacion
      celular: usuarioData?.numero_celular //celular de origen
    });
    setShowModal(true);
  };

  return (
    // Quitamos el minHeight: 100vh y el background gris para que herede del padre
    <div className="animate__animated animate__fadeIn px-2">
      
      {/* Cabecera simplificada y acoplada */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <div>
          <h3 className="fw-bold mb-0 text-dark">Mis Pagos</h3>
          <p className="text-muted small mb-0">Gestiona tus citas reservadas</p>
        </div>
        <Button 
          variant="light" 
          className="shadow-sm border-0 rounded-circle p-2" 
          onClick={() => setActualizar(true)} 
          disabled={loading}
        >
          <FaSync className={loading ? 'fa-spin text-primary' : 'text-primary'} size={20} />
        </Button>
      </div>

      <div className="container-fluid p-0">
        
        {/* SECCIÓN 1: CITAS POR PAGAR */}
        <h6 className="fw-bold text-danger mb-3 d-flex align-items-center">
          <span className="bg-danger p-1 rounded-circle me-2" style={{width: '10px', height: '10px', display: 'inline-block'}}></span>
          Pendientes de Pago (Próximas 2h)
        </h6>
        
        <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0" style={{ fontSize: '14px' }}>
                <thead className="bg-light">
                  <tr>
                    <th className="ps-3">Detalle de Cita</th>
                    <th className="text-center">Monto</th>
                    <th className="text-center pe-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && citasPendientes.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4"><Spinner animation="border" size="sm" variant="primary" /></td></tr>
                  ) : citasPendientes.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 text-muted">No hay citas pendientes.</td></tr>
                  ) : (
                    citasPendientes.map((cita) => (
                      <tr key={cita.idCitaSeparada}>
                        <td className="ps-3">
                          <div className="fw-bold text-primary">{cita.nombreEspecialidad}</div>
                          <div className="small text-dark fw-medium">
                            {FormatDate.format_fecha(cita.fecha)} - {cita.horaInicio}
                          </div>
                          <div className="small text-muted" style={{fontSize: '11px'}}>{cita.nombreMedico}</div>
                        </td>
                        <td className="text-center fw-bold">S/ {cita.precioUnitario}</td>
                        <td className="text-center pe-3">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="rounded-pill px-3 fw-bold"
                            onClick={() => abrirPago(cita)}
                          >
                            Pagar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* SECCIÓN 2: EN VERIFICACIÓN */}
        <h6 className="fw-bold text-secondary mb-3">Historial Reciente / Verificación</h6>
        <Card className="border-0 shadow-sm rounded-4 mb-5">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0" style={{ fontSize: '14px' }}>
                <tbody>
                  {citasEnVerificacion.length === 0 ? (
                    <tr><td className="text-center py-3 text-muted">No hay pagos en verificación.</td></tr>
                  ) : (
                    citasEnVerificacion.map((cita) => (
                      <tr key={cita.idCitaSeparada}>
                        <td className="ps-3">
                          <div className="fw-bold">{cita.nombreEspecialidad}</div>
                          <div className="small text-muted">{FormatDate.format_fecha(cita.fecha)}</div>
                        </td>
                        <td className="text-end pe-3">
                          <Badge bg={cita.idCita ? "success" : "warning"} className="rounded-pill px-3 py-2">
                            {cita.idCita ? <FaCheckCircle className="me-1"/> : <FaClock className="me-1"/>} 
                            {cita.idCita ? "Confirmado" : "Procesando"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Modal de Pago */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Completar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {pagoSeleccionado && (
            <PagoVirtual 
              {...pagoSeleccionado} 
              modalClose={(success) => {
                if(success) {
                  setShowModal(false);
                  setActualizar(true);
                }
              }} 
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CitaSeparada;


/*﻿
CitaSeparada.js:52 
{ "idCitaSeparada":299,
  "idProgramacion":2925,
  "horaInicio":"08:00",
  "precioUnitario":80,
  "fecha":"20260304",
  "horaFin":"08:00",
  "idPaciente":0,
  "idMedico":1762,
  "idEspecialidad":9,
  "idServicio":1,
  "idProducto":0,
  "fechaSolicitud":"1773810000000",
  "horaSolicitud":"18:47",
  "tipoUsuario":"WEB       ",
  "fechaSeparacion":"1773810000000",
  "nombreMedico":"Acuña Jimenez Mayra Selenne",
  "nombreEspecialidad":"MEDICINA INTERNA",
  "nombreServicio":"Medicina 1",
  "idCita":0}
    */