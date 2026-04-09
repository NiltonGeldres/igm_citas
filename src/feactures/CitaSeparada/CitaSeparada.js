import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSync, FaClock, FaCheckCircle } from 'react-icons/fa';
import { X, RefreshCw } from "lucide-react"; // Usamos lucide para consistencia

import AuthService from "../../master-data/services/auth.service";
import CitaSeparadaService from "../CitaSeparada/CitaSeparadaService";

//import PagoVirtual from "../PagoVirtual/PagoVirtual";
import PagoVirtual from "../../apps/paciente-app/components/reserva/PagoVirtual";
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
      setCitasPendientes(resPendientes.data.citaSeparada || []);

      const resVerificacion = await CitaSeparadaService.getCitasSeparadaConPagoVirtualLeer();
      setCitasEnVerificacion(resVerificacion.data.citaSeparada || []);
    } catch (error) {
      if (error.response?.status === 403) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const abrirPago = (cita) => {
    setPagoSeleccionado({
      idProgramacion: cita.idProgramacion,
      horaInicio: cita.horaInicio,
      idCitaSeparada: cita.idCitaSeparada,
      precioUnitario: cita.precioUnitario,
      nombreDestino: cita.destino_cuenta,
      email: usuarioData?.email,
      celular: usuarioData?.numero_celular
    });
    setShowModal(true);
  };

  return (
    <div className="animate__animated animate__fadeIn px-2 pb-5">
      
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <div>
          <h3 className="fw-bold mb-0 text-dark">Mis Pagos</h3>
          <p className="text-muted small mb-0">Gestiona tus citas reservadas</p>
        </div>
        <button 
          className="btn btn-light shadow-sm rounded-circle p-2 border-0"
          onClick={() => setActualizar(true)}
          disabled={loading}
        >
          <RefreshCw className={loading ? 'animate-spin text-primary' : 'text-primary'} size={20} />
        </button>
      </div>

      <div className="container-fluid p-0">
        
        {/* SECCIÓN 1: PENDIENTES */}
        <h6 className="fw-bold text-danger mb-3 d-flex align-items-center">
          <span className="bg-danger p-1 rounded-circle me-2" style={{width: '10px', height: '10px', display: 'inline-block'}}></span>
          Pendientes de Pago (Próximas 2h)
        </h6>
        
        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '14px' }}>
                <thead className="bg-light">
                  <tr>
                    <th className="ps-3 py-3 border-0">Detalle de Cita</th>
                    <th className="text-center border-0">Monto</th>
                    <th className="text-center pe-3 border-0">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && citasPendientes.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                  ) : citasPendientes.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 text-muted">No hay citas pendientes.</td></tr>
                  ) : (
                    citasPendientes.map((cita) => (
                      <tr key={cita.idCitaSeparada}>
                        <td className="ps-3 py-3">
                          <div className="fw-bold text-primary">{cita.nombreEspecialidad}</div>
                          <div className="small text-dark fw-medium">
                            {FormatDate.format_fecha(cita.fecha)} - {cita.horaInicio}
                          </div>
                          <div className="small text-muted" style={{fontSize: '11px'}}>{cita.nombreMedico}</div>
                        </td>
                        <td className="text-center fw-bold">S/ {cita.precioUnitario}</td>
                        <td className="text-center pe-3">
                          { cita.estadoReserva === 'PENDIENTE_PAGO' ? (
                            <button 
                              className="btn btn-primary btn-sm rounded-pill px-3 fw-bold shadow-sm"
                              onClick={() => abrirPago(cita)}
                            >
                              Pagar
                            </button>

                          ):( 
                              <button  className="btn btn-sm rounded-pill px-3 fw-bold shadow-sm bg-warning" >
                                {cita.estadoReserva}
                              </button>

                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: VERIFICACIÓN */}
        <h6 className="fw-bold text-secondary mb-3">Historial Reciente / Verificación</h6>
        <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '14px' }}>
                <tbody>
                  {citasEnVerificacion.length === 0 ? (
                    <tr><td className="text-center py-3 text-muted">No hay pagos en verificación.</td></tr>
                  ) : (
                    citasEnVerificacion.map((cita) => (
                      <tr key={cita.idCitaSeparada}>
                        <td className="ps-3 py-3">
                          <div className="fw-bold">{cita.nombreEspecialidad}</div>
                          <div className="small text-muted">{FormatDate.format_fecha(cita.fecha)}</div>
                        </td>
                        <td className="text-end pe-3">
                          <span className={`badge rounded-pill px-3 py-2 ${cita.idCita ? "bg-success" : "bg-warning text-dark"}`}>
                            {cita.idCita ? <FaCheckCircle className="me-1"/> : <FaClock className="me-1"/>} 
                            {cita.idCita ? "Confirmado" : "Procesando"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago (Custom Overlay) */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content slide-up">
            <div className="custom-modal-header d-flex justify-content-between align-items-center">
              <h5 className="fw-bold m-0 text-dark">Completar Pago</h5>
              <button onClick={() => setShowModal(false)} className="btn-close-custom border-0 bg-transparent">
                <X size={24} className="text-muted" />
              </button>
            </div>
            <div className="custom-modal-body">
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
            </div>     
          </div>
        </div>
      )}

      {/* Estilos locales para el Modal Custom si no están en el global.css */}
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CitaSeparada;