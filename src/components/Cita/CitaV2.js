import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  CreditCard, 
  Home, 
  Building2, 
  Star, 
  Bell, 
  Stethoscope,
  ChevronRight,
  Activity,
  Heart,
  Smile,
  User,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Plus,
  Loader2,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';

import EntidadService from '../Entidad/EntidadService';
import { cargarConfiguracionEntidades, ENTIDADES } from '../Entidad/EntidadData';

// --- ESTILOS PERSONALIZADOS ---
const ESTILOS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');

  body { 
    font-family: 'Plus Jakarta Sans', sans-serif !important; 
    background-color: #f8fafc; 
    color: #1e293b;
  }
  
  .calendar-grid { 
    display: grid; 
    grid-template-columns: repeat(7, 1fr); 
    gap: 4px;
  }
  
  .calendar-cell { 
    min-height: 45px; 
    transition: all 0.2s ease; 
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.85rem;
    border-radius: 8px;
  }
  
  .calendar-cell:hover { 
    background-color: #f1f5f9 !important; 
    z-index: 10; 
    transform: scale(1.05); 
    color: #0ea5e9;
  }
  
  .is-bulk-selected { 
    background-color: #e0f2fe !important; 
    border: 2px solid #0ea5e9 !important; 
    color: #0ea5e9;
  }
  
  .spin { 
    animation: spin 1s linear infinite; 
  }
  
  @keyframes spin { 
    from { transform: rotate(0deg); } 
    to { transform: rotate(360deg); } 
  }

  .nav-blur {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.8);
  }

  .card-custom {
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card-custom:active {
    transform: scale(0.98);
  }

  .payment-badge {
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

// --- DATOS MOCK ---
/*const ENTIDADES = [
  { id: 'e1', nombre: 'Clínica San Pablo', direccion: 'Av. Encalada 101, Surco', color: 'bg-primary' },
  { id: 'e2', nombre: 'Clínica Internacional', direccion: 'Sede San Borja', color: 'bg-info' },
  { id: 'e3', nombre: 'Clínica Delgado', direccion: 'Miraflores, Lima', color: 'bg-primary' }
];*/

const ESPECIALIDADES = [
  { id: 's1', nombre: 'Medicina General', icono: <Activity size={20} />, precio: 80.00 },
  { id: 's2', nombre: 'Odontología', icono: <Smile size={20} />, precio: 150.00 },
  { id: 's3', nombre: 'Cardiología', icono: <Heart size={20} />, precio: 220.00 },
  { id: 's4', nombre: 'Pediatría', icono: <User size={20} />, precio: 120.00 }
];

const MEDICOS = [
  { id: 'm1', nombre: 'Dr. Roberto Gómez', especialidadId: 's1', calificacion: 4.8 },
  { id: 'm2', nombre: 'Dra. Elena Martínez', especialidadId: 's3', calificacion: 4.9 },
  { id: 'm3', nombre: 'Dr. Carlos Ruiz', especialidadId: 's4', calificacion: 4.7 },
  { id: 'm4', nombre: 'Dra. Ana Lucía', especialidadId: 's2', calificacion: 5.0 }
];

const DIAS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export default function App() {
  const [pestanaActual, setPestanaActual] = useState('inicio');
  const [modoReserva, setModoReserva] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [datosReserva, setDatosReserva] = useState({ entidad: null, especialidad: null, medico: null, fecha: '', hora: '' });
  
  const [misCitas, setMisCitas] = useState([]);
  const [misPagos, setMisPagos] = useState([]);
  
  const [mostrarExito, setMostrarExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [entidadesCargados, setEntidadesCargados] = useState(false);

    useEffect(() => {

        EntidadService.getEntidad().then(res => {
            cargarConfiguracionEntidades(res.data);
            const entidadesParaEstado = Object.values(ENTIDADES);
          setEntidadesCargados(entidadesParaEstado);
          alert("entodades  "+ JSON.stringify(ENTIDADES))
          alert("Datos API "+entidadesCargados.nombre+ "   ---" +JSON.stringify(entidadesCargados))
         });
    }, []);



  const manejarSeleccion = (llave, valor) => {
    setDatosReserva(prev => ({ ...prev, [llave]: valor }));
    setPasoActual(prev => prev + 1);
  };

  const finalizarReserva = () => {
    setCargando(true);
    setTimeout(() => {
      const citaId = `APT-${Math.floor(Math.random() * 10000)}`;
      const nuevaCita = { ...datosReserva, id: citaId };
      
      setMisCitas([nuevaCita, ...misCitas]);
      
      const nuevoPago = {
        id: `TRX-${Math.floor(Math.random() * 999999)}`,
        citaId: citaId,
        fecha: new Date().toLocaleDateString(),
        monto: datosReserva.especialidad.precio,
        concepto: `Cita: ${datosReserva.especialidad.nombre}`,
        entidad: datosReserva.entidad.nombre,
        metodo: 'Visa **** 4242',
        estado: 'Completado'
      };
      setMisPagos([nuevoPago, ...misPagos]);

      setMostrarExito(true);
      setCargando(false);
    }, 1500);
  };

  const reiniciarFlujo = () => {
    setModoReserva(false);
    setPasoActual(1);
    setMostrarExito(false);
    setDatosReserva({ entidad: null, especialidad: null, medico: null, fecha: '', hora: '' });
    setPestanaActual('inicio');
  };

  return (
    <div className="container-fluid p-0 pb-5 mb-5">
      <style>{ESTILOS_CSS}</style>

      {/* NAVBAR SUPERIOR */}
      <header className="p-3 bg-white border-bottom sticky-top d-flex justify-content-between align-items-center nav-blur" style={{zIndex: 1000}}>
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary rounded-3 p-2 text-white shadow-sm d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
            <Stethoscope size={22} />
          </div>
          <span className="h5 mb-0 fw-bold text-primary">MediFlow</span>
        </div>
        <div className="d-flex gap-2">
          <div className="p-2 text-secondary cursor-pointer"><Search size={22} /></div>
          <div className="p-2 text-secondary cursor-pointer position-relative">
            <Bell size={22} />
            {misCitas.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            )}
          </div>
        </div>
         <div  className="card-custom bg-white p-3 shadow-sm d-flex align-items-center gap-3 cursor-pointer">
             <div className={`${entidadesCargados.color} text-white p-3 rounded-4`}><Building2 size={20} /></div>
                <div className="flex-grow-1">
                  <p className="mb-0 fw-bold small">{entidadesCargados.nombre}</p>
                 <p className="mb-0 text-secondary" style={{fontSize: '11px'}}>{entidadesCargados.direccion}</p>
             </div>

         </div>

      </header>

      <main className="px-4 py-4" style={{maxWidth: '480px', margin: '0 auto'}}>
        
        {/* --- VISTA INICIO --- */}
        {pestanaActual === 'inicio' && (
          <div className="fade-in">
            <div className="card border-0 bg-primary text-white p-4 shadow-lg mb-4" style={{borderRadius: '28px'}}>
              <h2 className="fw-bold mb-1">¡Hola, Diego!</h2>
              <p className="opacity-75 small mb-4">Tu salud es nuestra prioridad hoy.</p>
              <div className="row g-2">
                <div className="col-6">
                  <div className="bg-white bg-opacity-10 p-2 rounded-4">
                    <p className="small mb-0 opacity-75" style={{fontSize: '10px'}}>PRÓXIMA CITA</p>
                    <p className="small fw-bold mb-0 text-truncate">
                      {misCitas.length > 0 ? `${misCitas[0].hora}` : 'Sin citas'}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-10 p-2 rounded-4">
                    <p className="small mb-0 opacity-75" style={{fontSize: '10px'}}>SEGURO</p>
                    <p className="small fw-bold mb-0">EPS Pacífico</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <button onClick={() => { setPestanaActual('citas'); setModoReserva(true); }} className="btn btn-white w-100 p-4 card-custom bg-white shadow-sm text-center">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4 d-inline-block mb-2">
                    <Calendar size={24} />
                  </div>
                  <div className="fw-bold small">Nueva Cita</div>
                </button>
              </div>
              <div className="col-6">
                <button onClick={() => setPestanaActual('pagos')} className="btn btn-white w-100 p-4 card-custom bg-white shadow-sm text-center">
                  <div className="bg-success bg-opacity-10 text-success p-3 rounded-4 d-inline-block mb-2">
                    <CreditCard size={24} />
                  </div>
                  <div className="fw-bold small">Pagos</div>
                </button>
              </div>
            </div>

            <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
              Médicos Recomendados
              <span className="text-primary small" style={{fontSize: '11px'}}>Ver todos</span>
            </h6>
            <div className="d-flex flex-column gap-3">
              {MEDICOS.slice(0, 2).map(med => (
                <div key={med.id} className="card-custom bg-white p-3 shadow-sm d-flex align-items-center gap-3">
                  <div className="bg-light rounded-circle p-2 text-secondary"><User size={24} /></div>
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-bold small">{med.nombre}</p>
                    <p className="mb-0 text-secondary" style={{fontSize: '11px'}}>Clínica Delgado • San Borja</p>
                  </div>
                  <div className="text-warning fw-bold small d-flex align-items-center gap-1">
                    <Star size={12} fill="currentColor" /> {med.calificacion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VISTA CITAS --- */}
        {pestanaActual === 'citas' && (
          <div className="fade-in">
            {!modoReserva ? (
              <div className="d-flex flex-column gap-3">
                <h5 className="fw-bold">Mis Citas</h5>
                {misCitas.length > 0 ? (
                  misCitas.map(cita => (
                    <div key={cita.id} className="card-custom bg-white p-4 shadow-sm border-start border-primary border-4">
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <p className="fw-bold mb-0">{cita.especialidad.nombre}</p>
                          <p className="text-secondary small mb-0">{cita.medico.nombre}</p>
                        </div>
                        <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 h-fit">
                          <Calendar size={18} />
                        </div>
                      </div>
                      <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                        <div>
                           <span className="text-uppercase text-secondary fw-bold d-block" style={{fontSize: '10px'}}>{cita.fecha}</span>
                           <span className="fw-bold text-dark" style={{fontSize: '12px'}}>{cita.hora}</span>
                        </div>
                        <span className="payment-badge bg-success bg-opacity-10 text-success">Confirmado</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-secondary opacity-50">
                    <Calendar size={48} className="mb-3" />
                    <p>No tienes citas programadas</p>
                  </div>
                )}
                <button onClick={() => setModoReserva(true)} className="btn btn-primary p-3 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2">
                  <Plus size={20} /> Nueva Cita
                </button>
              </div>
            ) : (
              <div className="booking-flow">
                {mostrarExito ? (
                  <div className="text-center py-5">
                    <div className="bg-success bg-opacity-10 text-success p-4 rounded-circle d-inline-block mb-4">
                      <CheckCircle2 size={50} />
                    </div>
                    <h3 className="fw-bold">¡Todo listo!</h3>
                    <p className="text-secondary mb-4 px-4">Tu cita ha sido agendada y el pago se procesó correctamente.</p>
                    <div className="d-flex flex-column gap-2">
                      <button onClick={reiniciarFlujo} className="btn btn-primary w-100 p-3 rounded-4 fw-bold">Ver mis Citas</button>
                      <button onClick={() => { setMostrarExito(false); setModoReserva(false); setPestanaActual('pagos'); }} className="btn btn-light w-100 p-3 rounded-4 fw-bold">Ver Comprobante</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <button onClick={() => pasoActual === 1 ? setModoReserva(false) : setPasoActual(s => s - 1)} className="btn btn-light rounded-circle p-2 shadow-sm text-secondary">
                        <ChevronLeft size={20} />
                      </button>
                      <div>
                        <p className="mb-0 text-primary fw-bold text-uppercase" style={{fontSize: '9px', letterSpacing: '1px'}}>Paso {pasoActual} de 5</p>
                        <h6 className="fw-bold mb-0">
                          {pasoActual === 1 && "Selecciona Entidad"}
                          {pasoActual === 2 && "Especialidad"}
                          {pasoActual === 3 && "Especialista"}
                          {pasoActual === 4 && "Fecha y Hora"}
                          {pasoActual === 5 && "Confirmación de Pago"}
                        </h6>
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-2">

                      {pasoActual === 2 && ESPECIALIDADES.map(espec => (
                        <div key={espec.id} onClick={() => manejarSeleccion('especialidad', espec)} className="card-custom bg-white p-4 shadow-sm d-flex align-items-center gap-3 cursor-pointer">
                          <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4">{espec.icono}</div>
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-bold small">{espec.nombre}</p>
                            <p className="mb-0 text-primary fw-bold" style={{fontSize: '12px'}}>S/ {espec.precio.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}

                      {pasoActual === 3 && MEDICOS.filter(m => m.especialidadId === datosReserva.especialidad.id).map(med => (
                        <div key={med.id} onClick={() => manejarSeleccion('medico', med)} className="card-custom bg-white p-3 shadow-sm d-flex align-items-center gap-3 cursor-pointer">
                          <div className="bg-light rounded-circle p-2 text-secondary"><User size={24} /></div>
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-bold small">{med.nombre}</p>
                            <div className="text-warning fw-bold d-flex align-items-center gap-1" style={{fontSize: '10px'}}>
                              <Star size={10} fill="currentColor" /> {med.calificacion}
                            </div>
                          </div>
                        </div>
                      ))}

                      {pasoActual === 4 && (
                        <div className="fade-in">
                          <div className="card-custom bg-white p-4 shadow-sm mb-4">
                            <div className="calendar-grid">
                              {DIAS.map((d, i) => <div key={i} className="text-center text-secondary fw-bold mb-2" style={{fontSize: '10px'}}>{d}</div>)}
                              {Array.from({length: 14}).map((_, i) => (
                                <div 
                                  key={i} 
                                  onClick={() => setDatosReserva({...datosReserva, fecha: `1${i+1} Feb`})}
                                  className={`calendar-cell ${datosReserva.fecha.includes(`1${i+1}`) ? 'is-bulk-selected' : ''}`}
                                >
                                  {10 + i}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="row g-2">
                            {["09:00 AM", "10:30 AM", "03:00 PM", "04:30 PM"].map(hora => (
                              <div key={hora} className="col-6">
                                <button onClick={() => manejarSeleccion('hora', hora)} className="btn btn-outline-primary w-100 rounded-4 fw-bold p-3 small">{hora}</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {pasoActual === 5 && (
                        <div className="fade-in">
                          <div className="bg-white p-4 rounded-5 border mb-4">
                            <p className="text-secondary small fw-bold text-uppercase mb-3">Resumen de Pago</p>
                            <div className="d-flex flex-column gap-2 mb-4">
                              <div className="d-flex justify-content-between">
                                <span className="small text-secondary">Consulta Médica</span>
                                <span className="small fw-bold">S/ {datosReserva.especialidad.precio.toFixed(2)}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span className="small text-secondary">IGV (18%)</span>
                                <span className="small fw-bold">S/ 0.00</span>
                              </div>
                              <div className="d-flex justify-content-between pt-2 border-top">
                                <span className="fw-bold">Total a pagar</span>
                                <span className="fw-bold text-primary">S/ {datosReserva.especialidad.precio.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3">
                              <div className="bg-white p-2 rounded-3 border"><CreditCard size={18} /></div>
                              <div className="flex-grow-1">
                                <p className="mb-0 fw-bold" style={{fontSize: '12px'}}>Visa **** 4242</p>
                                <p className="mb-0 text-secondary" style={{fontSize: '10px'}}>Exp: 12/26</p>
                              </div>
                              <span className="text-primary fw-bold" style={{fontSize: '10px'}}>EDITAR</span>
                            </div>
                          </div>
                          <button 
                            onClick={finalizarReserva} 
                            disabled={cargando}
                            className="btn btn-dark w-100 p-4 rounded-4 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-3"
                          >
                            {cargando ? <Loader2 className="spin" /> : "Confirmar y Pagar"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- VISTA PAGOS --- */}
        {pestanaActual === 'pagos' && (
          <div className="fade-in">
            <h5 className="fw-bold mb-4">Pagos y Facturas</h5>
            
            {misPagos.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {misPagos.map(pago => (
                  <div key={pago.id} className="card-custom bg-white p-4 shadow-sm border-0">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex gap-3">
                        <div className="bg-light p-3 rounded-4 text-primary d-flex align-items-center justify-content-center">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="fw-bold mb-0">{pago.concepto}</p>
                          <p className="text-secondary mb-0" style={{fontSize: '11px'}}>{pago.entidad}</p>
                          <p className="text-secondary" style={{fontSize: '10px'}}>Transacción: {pago.id}</p>
                        </div>
                      </div>
                      <span className="payment-badge bg-primary bg-opacity-10 text-primary">{pago.estado}</span>
                    </div>

                    <div className="bg-light p-3 rounded-4 d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <p className="text-secondary mb-0" style={{fontSize: '10px'}}>MÉTODO</p>
                        <p className="fw-bold mb-0 small">{pago.metodo}</p>
                      </div>
                      <div className="text-end">
                        <p className="text-secondary mb-0" style={{fontSize: '10px'}}>MONTO</p>
                        <p className="fw-bold mb-0 text-primary">S/ {pago.monto.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-light text-dark flex-grow-1 rounded-3 small fw-bold d-flex align-items-center justify-content-center gap-2" style={{fontSize: '12px'}}>
                        <Download size={14} /> PDF
                      </button>
                      <button className="btn btn-outline-light text-dark flex-grow-1 rounded-3 small fw-bold d-flex align-items-center justify-content-center gap-2" style={{fontSize: '12px'}}>
                        <ExternalLink size={14} /> Detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-secondary opacity-50">
                <CreditCard size={48} className="mb-3" />
                <p>Aún no tienes registros de pagos realizados.</p>
              </div>
            )}

            <div className="mt-4 p-4 rounded-5 bg-primary bg-opacity-10 border border-primary border-opacity-10 text-center">
              <p className="small text-primary fw-bold mb-1">¿Necesitas ayuda con un pago?</p>
              <p className="text-secondary" style={{fontSize: '11px'}}>Contáctanos al soporte médico para dudas con tu facturación.</p>
              <button className="btn btn-primary btn-sm rounded-pill px-4 fw-bold">Soporte</button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER NAV */}
      <footer className="fixed-bottom bg-white border-top py-3 nav-blur" style={{zIndex: 1000}}>
        <div className="d-flex justify-content-around align-items-center">
          {[
            { id: 'inicio', icon: Home, etiqueta: 'Inicio' },
            { id: 'citas', icon: Calendar, etiqueta: 'Citas' },
            { id: 'pagos', icon: CreditCard, etiqueta: 'Pagos' }
          ].map(item => (
            <div 
              key={item.id} 
              onClick={() => {setPestanaActual(item.id); setModoReserva(false);}}
              className={`d-flex flex-column align-items-center cursor-pointer transition-all ${pestanaActual === item.id ? 'text-primary' : 'text-secondary opacity-50'}`}
              style={{flex: 1}}
            >
              <item.icon size={22} className="mb-1" />
              <span className="fw-bold" style={{fontSize: '10px'}}>{item.etiqueta}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}


