import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  CreditCard, 
  Home, 
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
  ExternalLink,
  MapPin
} from 'lucide-react';

import EspecialidadService from '../Especialidad/EspecialidadService';
import {transformarEspecialidades} from "../Cita/Data/CitaEspecialidad"
import MedicoService from '../Medico/MedicoService';
import { transformarMedicos } from './Data/CitaMedicoUI';
import ProgramacionMedicaService from '../ProgramacionMedica/ProgramacionMedicaService';
import { transformarProgramacion } from './Data/CitaProgramacionMedicaUI';

// --- ESTILOS PERSONALIZADOS (Mantenidos intactos) ---
const ESTILOS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');

  body { 
    font-family: 'Plus Jakarta Sans', sans-serif !important; 
    background-color: #f8fafc; 
    color: #1e293b;
  }
  
  .calendario-grid { 
    display: grid; 
    grid-template-columns: repeat(7, 1fr); 
    gap: 4px;
  }
  
  .calendario-celda { 
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
  
  .calendario-celda:hover:not(:disabled) { 
    background-color: #f1f5f9 !important; 
    z-index: 10; 
    transform: scale(1.05); 
    color: #0ea5e9;
  }
  
  .seleccion-masiva { 
    background-color: #0ea5e9 !important; 
    border: 2px solid #0ea5e9 !important; 
    color: white !important;
  }
  
  .girar { 
    animation: girar 1s linear infinite; 
  }
  
  @keyframes girar { 
    from { transform: rotate(0deg); } 
    to { transform: rotate(360deg); } 
  }

  .nav-difuminado {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.8);
  }

  .tarjeta-personalizada {
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .tarjeta-personalizada:active {
    transform: scale(0.98);
  }

  .etiqueta-pago {
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const DIAS_CABECERA = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export default function App({  nombreClinica = "MediFlow Center",  direccionClinica = "Sede Central" }) {

  const [pestanaActual, setPestanaActual] = useState('inicio');
  const [modoReserva, setModoReserva] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [programacionMensual, setProgramacionMensual] = useState([]);
  const [medicosActuales, setMedicosActuales] = useState([]);
  
  // --- ESTADO DE CACHÉ Y DATOS ---
  const [cache, setCache] = useState({
    especialidades: [],
    medicos: {},             // key: espId
    programacionMensual: {}, // key: medId-mes-anio
    horasDisponibles: {}     // key: medId-fecha
  });

  const [datosReserva, setDatosReserva] = useState({ 
    especialidad: null, 
    doctor: null, 
    fecha: '', 
    fechaObjeto: { mes: new Date().getMonth(), anio: new Date().getFullYear(), dia: null },
    hora: '' 
  });
  
  const [misCitas, setMisCitas] = useState([]);
  const [misPagos, setMisPagos] = useState([]);

  // --- MOCK DE LAS 5 APIS ---
  const ejecutarAPI = async (nombre, params) => {
    setCargando(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simular latencia y paginación
    setCargando(false);

    switch(nombre) {
      case "obtenerProgramacionMedicaHorasService":
        return ["09:00 AM", "10:30 AM", "03:00 PM", "04:30 PM"];
      case "GuardarCitaService":
        return { success: true };
      default: return [];
    }
  };

  // 1. CARGAR ESPECIALIDADES (Al entrar a Citas)
  useEffect(() => {
    const cargar = async () => {
      // 1. Verificamos si ya existen especialidades en el caché
      if (cache.especialidades.length > 0) {
        console.log("Cargando especialidades desde el caché...");
        return; 
      }
      try {
        console.log("Iniciando petición a la API...");
        const data = await EspecialidadService.getXEntidad();
        // 2. Transformamos la data
        const dataListaParaUI = transformarEspecialidades(data);
        // 3. Guardamos en el estado de caché
        setCache(prev => ({
          ...prev,
          especialidades: dataListaParaUI
        }));
      } catch (error) {
        console.error("Error cargando especialidades:", error);
      }
    };

    cargar();
  }, [cache.especialidades.length]);

  // 2. SELECCIONAR ESPECIALIDAD -> CARGAR MÉDICOS
  const seleccionarEspecialidad = async (espec) => {
      setDatosReserva(prev => ({ ...prev, especialidad: espec, doctor: null }));
      const data = await   MedicoService.obtenerTodosEspecialidad(espec.idEspecialidad)
      const dataListaMedicosParaUI = transformarMedicos(data);
      setMedicosActuales(dataListaMedicosParaUI);
      setPasoActual(2);
    };

  const seleccionarMedico = async (med) => { // 1. Hacemos la función principal async
    // 2. Obtenemos los datos directamente del médico seleccionado (med) y la especialidad actual
    const medId = med.id;
    const espId = datosReserva.especialidad?.idEspecialidad || datosReserva.especialidad?.id;

    // 3. Actualizamos el estado con el médico elegido y pasamos al paso 3
    setDatosReserva(prev => ({ 
      ...prev, 
      doctor: med, 
      hora: '',
      fechaObjeto: { ...prev.fechaObjeto, dia: null } 
    }));
    
    setPasoActual(3);

    // 4. Cargamos la programación inmediatamente
    if (medId && espId) {
      const { mes, anio } = datosReserva.fechaObjeto;
      setCargando(true);
      
      try {
        console.log(`Cargando para Medico ${medId} en Mes ${mes + 1}`);
        // Nota: Asegúrate de enviar mes+1 y anio si tu API lo requiere
        const data = await ProgramacionMedicaService.obtenerDias(medId, espId,);
        const dataProgramacionUI = transformarProgramacion(data);
        
        setProgramacionMensual(dataProgramacionUI);
      } catch (error) {
        console.error("Error al cargar programación:", error);
        setProgramacionMensual([]); 
      } finally {
        setCargando(false);
      }
    }
  };

  const seleccionarDia = async (dia) => {
    const { mes, anio } = datosReserva.fechaObjeto;
    // Formato para mostrar en el UI (ej: "15 de Marzo")
    const fechaStr = `${dia} ${new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(anio, mes))}`;
    
    const keyHora = `${datosReserva.doctor.id}-${fechaStr}`;
    
    setDatosReserva(prev => ({ 
      ...prev, 
      fecha: fechaStr, 
      fechaObjeto: { ...prev.fechaObjeto, dia } 
    }));
    
    // Si no hay horas en caché para este médico y esta fecha específica
    if (!cache.horasDisponibles[keyHora]) {
      // Aquí llamarías a la API 4 (Horas), enviando la fecha completa
      const data = await ejecutarAPI("obtenerProgramacionMedicaHorasService", { 
        medId: datosReserva.doctor.id, 
        fecha: `${anio}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}` 
      });
      setCache(prev => ({ ...prev, horasDisponibles: { ...prev.horasDisponibles, [keyHora]: data } }));
    }
  };


    // 5. GUARDAR CITA
    const finalizarReserva = async () => {
      const res = await ejecutarAPI("GuardarCitaService", datosReserva);
      if (res.success) {
        const idCita = `CTA-${Math.floor(Math.random() * 10000)}`;
        const nuevaCita = { ...datosReserva, id: idCita };
        setMisCitas([nuevaCita, ...misCitas]);
        
        const nuevoPago = {
          id: `TRX-${Math.floor(Math.random() * 999999)}`,
          idCita: idCita,
          fecha: new Date().toLocaleDateString(),
          monto: datosReserva.especialidad.precio,
          concepto: `Cita: ${datosReserva.especialidad.nombre}`,
          metodo: 'Visa **** 4242',
          estado: 'Completado'
        };
        setMisPagos([nuevoPago, ...misPagos]);
        setMostrarExito(true);
      }
    };

    const reiniciarFlujo = () => {
      setModoReserva(false);
      setPasoActual(1);
      setMostrarExito(false);
      setDatosReserva({ especialidad: null, doctor: null, fecha: '', fechaObjeto: { mes: new Date().getMonth(), anio: new Date().getFullYear(), dia: null }, hora: '' });
      setPestanaActual('inicio');
    };

  const cambiarMes = (direccion) => {
    setDatosReserva(prev => {
      // Calculamos el nuevo mes/año basado en el actual
      const nuevaFecha = new Date(prev.fechaObjeto.anio, prev.fechaObjeto.mes + direccion, 1);
      return {
        ...prev,
        fechaObjeto: {
          ...prev.fechaObjeto,
          mes: nuevaFecha.getMonth(),
          anio: nuevaFecha.getFullYear(),
          dia: null // Resetear día al cambiar de mes
        },
        hora: '' // Resetear hora
      };
    });
  };

  return (
    <div className="container-fluid p-0 pb-5 mb-5">
      <style>{ESTILOS_CSS}</style>

      <main style={{maxWidth: '480px', margin: '0 auto'}}>
        
        {/* --- VISTA INICIO --- */}
        {pestanaActual === 'inicio' && (
          <div className="fade-in px-3 pt-4">
            <div className="card border-0 bg-primary text-white p-4 shadow-lg mb-4" style={{borderRadius: '28px'}}>
              <h2 className="fw-bold mb-1">¡Hola, Diego!</h2>
              <p className="opacity-75 small mb-4">Bienvenido a {nombreClinica}. Tu salud es prioridad.</p>
              <div className="row g-2">
                <div className="col-6">
                  <div className="bg-white bg-opacity-10 p-2 rounded-4 text-center">
                    <p className="small mb-0 opacity-75" style={{fontSize: '10px'}}>PRÓXIMA CITA</p>
                    <p className="small fw-bold mb-0 text-truncate">
                      {misCitas.length > 0 ? `${misCitas[0].hora}` : 'Sin citas'}
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-10 p-2 rounded-4 text-center">
                    <p className="small mb-0 opacity-75" style={{fontSize: '10px'}}>UBICACIÓN</p>
                    <p className="small fw-bold mb-0 text-truncate">{direccionClinica}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <div onClick={() => { setPestanaActual('citas'); setModoReserva(true); setPasoActual(1); }} className="tarjeta-personalizada bg-white shadow-sm p-4 text-center d-block">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4 d-inline-block mb-2">
                    <Calendar size={24} />
                  </div>
                  <div className="fw-bold small text-dark">Nueva Cita</div>
                </div>
              </div>
              <div className="col-6">
                <div onClick={() => setPestanaActual('pagos')} className="tarjeta-personalizada bg-white shadow-sm p-4 text-center d-block">
                  <div className="bg-success bg-opacity-10 text-success p-3 rounded-4 d-inline-block mb-2">
                    <CreditCard size={24} />
                  </div>
                  <div className="fw-bold small text-dark">Pagos</div>
                </div>
              </div>
            </div>

            <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center px-1">
              Especialistas Recomendados
              <span className="text-primary small" style={{fontSize: '11px'}}>Ver todos</span>
            </h6>
            <div className="d-flex flex-column gap-3">
               {[
                 { id: 'd1', nombre: 'Dr. Roberto Gómez', calificacion: 4.8 },
                 { id: 'd2', nombre: 'Dra. Elena Martínez', calificacion: 4.9 }
               ].map(doctor => (
                <div key={doctor.id} className="tarjeta-personalizada bg-white p-3 shadow-sm d-flex align-items-center gap-3">
                  <div className="bg-light rounded-circle p-2 text-secondary"><User size={24} /></div>
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-bold small text-dark">{doctor.nombre}</p>
                    <p className="mb-0 text-secondary" style={{fontSize: '11px'}}>{direccionClinica}</p>
                  </div>
                  <div className="text-warning fw-bold small d-flex align-items-center gap-1">
                    <Star size={12} fill="currentColor" /> {doctor.calificacion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VISTA CITAS --- */}
        {pestanaActual === 'citas' && (
          <div className="fade-in px-3 pt-4">
            {!modoReserva ? (
              <div className="d-flex flex-column gap-3">
                <h5 className="fw-bold">Mis Citas</h5>
                {misCitas.length > 0 ? (
                  misCitas.map(cita => (
                    <div key={cita.id} className="tarjeta-personalizada bg-white p-4 shadow-sm border-start border-primary border-4">
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <p className="fw-bold mb-0">{cita.especialidad.nombre}</p>
                          <p className="text-secondary small mb-0">{cita.doctor.nombre}</p>
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
                <button onClick={() => { setModoReserva(true); setPasoActual(1); }} className="btn btn-primary p-3 rounded-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-2">
                  <Plus size={20} /> Nueva Cita
                </button>
              </div>
            ) : (
              <div className="flujo-reserva">
                {mostrarExito ? (
                  <div className="text-center py-5">
                    <div className="bg-success bg-opacity-10 text-success p-4 rounded-circle d-inline-block mb-4">
                      <CheckCircle2 size={50} />
                    </div>
                    <h3 className="fw-bold">¡Todo listo!</h3>
                    <p className="text-secondary mb-4 px-4">Tu cita ha sido agendada en <strong>{nombreClinica}</strong> correctamente.</p>
                    <div className="d-flex flex-column gap-2">
                      <button onClick={reiniciarFlujo} className="btn btn-primary w-100 p-3 rounded-4 fw-bold">Ver mis Citas</button>
                      <button onClick={() => { setMostrarExito(false); setModoReserva(false); setPestanaActual('pagos'); }} className="btn btn-light w-100 p-3 rounded-4 fw-bold">Ver Comprobante</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <button onClick={() => pasoActual === 1 ? setModoReserva(false) : setPasoActual(p => p - 1)} className="btn btn-light rounded-circle p-2 shadow-sm text-secondary">
                        <ChevronLeft size={20} />
                      </button>
                      <div>
                        <p className="mb-0 text-primary fw-bold text-uppercase" style={{fontSize: '9px', letterSpacing: '1px'}}>Paso {pasoActual} de 4</p>
                        <h6 className="fw-bold mb-0">
                          {pasoActual === 1 && "Selecciona Especialidad"}
                          {pasoActual === 2 && "Selecciona Especialista"}
                          {pasoActual === 3 && "Fecha y Hora"}
                          {pasoActual === 4 && "Confirmación de Pago"}
                        </h6>
                      </div>
                    </div>

                    {cargando && (
                      <div className="text-center py-5">
                        <Loader2 className="girar text-primary" size={40} />
                        <p className="small text-secondary mt-2">Cargando información...</p>
                      </div>
                    )}

                    <div className={`d-flex flex-column gap-2 ${cargando ? 'opacity-25' : ''}`}>
                      {/* PASO 1: ESPECIALIDADES (API 1) */}
                      {pasoActual === 1 && cache.especialidades.map(espec => (
                        <div key={espec.idEspecialidad} 
                              onClick={() => seleccionarEspecialidad(espec)} 
                              className="tarjeta-personalizada bg-white p-4 shadow-sm d-flex align-items-center gap-3 cursor-pointer">
                          <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-4"
                              >{espec.icono}
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-bold small text-dark">
                                {espec.descripcionEspecialidad}
                             </p>
                          </div>
                          <ChevronRight size={18} className="text-light" />
                        </div>
                      ))}

                      {/* PASO 2: MÉDICOS (API 2) */}
                      {pasoActual === 2 && (medicosActuales || []).map(doctor => (
                        <div key={doctor.id} onClick={() => seleccionarMedico(doctor)} className="tarjeta-personalizada bg-white p-3 shadow-sm d-flex align-items-center gap-3 cursor-pointer">
                          <div className="bg-light rounded-circle p-2 text-secondary"><User size={24} /></div>
                          <div className="flex-grow-1">
                            <p className="mb-0 fw-bold small text-dark">{doctor.nombres}</p>
                            <p className="mb-0 text-primary fw-bold" style={{fontSize: '15px'}}>{doctor.montoFormateado}</p>                            
                          </div>
                          <ChevronRight size={18} className="text-light" />
                        </div>
                      ))}

   {/* --- paso 3  --- */}
  {pasoActual === 3 && (() => {
    const { mes, anio } = datosReserva.fechaObjeto;
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const primerDiaMes = new Date(anio, mes, 1).getDay(); 
    const offset = (primerDiaMes + 6) % 7; 
    // IMPORTANTE: La KEY debe ser idéntica a la del useEffect para encontrar los datos
    const medId = datosReserva.doctor?.id;
    const espId = datosReserva.especialidad?.idEspecialidad || datosReserva.especialidad?.id;
    const key = `${medId}-${espId}-${mes}-${anio}`;
    console.log("programacionMensual  "+JSON.stringify(programacionMensual))
    const diasDisponiblesAPI = programacionMensual;
    const nombreMes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(anio, mes));

    return (
      <div className="fade-in">
        <div className="tarjeta-personalizada bg-white p-4 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button onClick={() => cambiarMes(-1)} className="btn btn-sm btn-outline-secondary border-0"><ChevronLeft/></button>
            <h6 className="fw-bold mb-0 text-capitalize">{nombreMes} {anio}</h6>
            <button onClick={() => cambiarMes(1)} className="btn btn-sm btn-outline-secondary border-0"><ChevronRight/></button>
          </div>

          <div className="calendario-grid">
            {DIAS_CABECERA.map((d, i) => (
              <div key={i} className="text-center text-secondary fw-bold mb-2" style={{fontSize: '10px'}}>{d}</div>
            ))}

            {Array.from({ length: offset }).map((_, i) => (
              <div key={`vacia-${i}`} className="calendario-celda opacity-0"></div>
            ))}

            {Array.from({ length: diasEnMes }).map((_, i) => {
              const dia = i + 1;
              // Buscamos si el día existe en la data transformada de la API
              const tieneProgramacion = diasDisponiblesAPI.some(p => parseInt(p.fechadia) === dia);

              return (
                <button 
                  key={dia} 
                  disabled={!tieneProgramacion || cargando}
                  onClick={() => seleccionarDia(dia)}
                  className={`calendario-celda border-0 
                    ${datosReserva.fechaObjeto.dia === dia ? 'seleccion-masiva text-white' : 'bg-transparent'} 
                    ${!tieneProgramacion ? 'text-muted opacity-25' : 'text-dark fw-bold'}`}
                >
                  {dia}
                  {tieneProgramacion && <div className="dot-disponible" style={{width: '4px', height: '4px', backgroundColor: '#0ea5e9', borderRadius: '50%', position: 'absolute', bottom: '5px'}}></div>}
                </button>
              );
            })}
          </div>
        </div>
        {/* ... Resto del renderizado de horas */}
      </div>
    );
  })()}
                      {/* PASO 4: CONFIRMACIÓN Y PAGO (API 5) */}
                      {pasoActual === 4 && (
                        <div className="fade-in">
                          <div className="bg-white p-4 rounded-5 border mb-4 shadow-sm">
                            <p className="text-secondary small fw-bold text-uppercase mb-3">Resumen de Pago</p>
                            <div className="d-flex flex-column gap-2 mb-4">
                              <div className="d-flex justify-content-between">
                                <span className="small text-secondary">Especialidad</span>
                                <span className="small fw-bold text-dark">{datosReserva.especialidad?.nombre}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span className="small text-secondary">Médico</span>
                                <span className="small fw-bold text-dark">{datosReserva.doctor?.nombre}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span className="small text-secondary">Fecha y Hora</span>
                                <span className="small fw-bold text-dark">{datosReserva.fecha} - {datosReserva.hora}</span>
                              </div>
                              <div className="d-flex justify-content-between pt-2 border-top">
                                <span className="fw-bold text-dark">Total a pagar</span>
                                <span className="fw-bold text-primary">S/ {datosReserva.especialidad?.precio.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="bg-light p-3 rounded-4 d-flex align-items-center gap-3">
                              <div className="bg-white p-2 rounded-3 border"><CreditCard size={18} /></div>
                              <div className="flex-grow-1">
                                <p className="mb-0 fw-bold text-dark" style={{fontSize: '12px'}}>Visa **** 4242</p>
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
                            {cargando ? <Loader2 className="girar" /> : "Confirmar y Pagar"}
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
          <div className="fade-in px-3 pt-4">
            <h5 className="fw-bold mb-4">Pagos y Facturas</h5>
            
            {misPagos.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {misPagos.map(pago => (
                  <div key={pago.id} className="tarjeta-personalizada bg-white p-4 shadow-sm border-0">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex gap-3">
                        <div className="bg-light p-3 rounded-4 text-primary d-flex align-items-center justify-content-center">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="fw-bold mb-0 text-dark">{pago.concepto}</p>
                          <p className="text-secondary mb-0" style={{fontSize: '11px'}}>{nombreClinica}</p>
                          <p className="text-secondary" style={{fontSize: '10px'}}>Transacción: {pago.id}</p>
                        </div>
                      </div>
                      <span className="etiqueta-pago bg-primary bg-opacity-10 text-primary">{pago.estado}</span>
                    </div>

                    <div className="bg-light p-3 rounded-4 d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <p className="text-secondary mb-0" style={{fontSize: '10px'}}>MÉTODO</p>
                        <p className="fw-bold mb-0 small text-dark">{pago.metodo}</p>
                      </div>
                      <div className="text-end">
                        <p className="text-secondary mb-0" style={{fontSize: '10px'}}>MONTO</p>
                        <p className="fw-bold mb-0 text-primary">S/ {pago.monto.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-light border text-dark flex-grow-1 rounded-3 small fw-bold d-flex align-items-center justify-content-center gap-2" style={{fontSize: '12px'}}>
                        <Download size={14} /> PDF
                      </button>
                      <button className="btn btn-outline-light border text-dark flex-grow-1 rounded-3 small fw-bold d-flex align-items-center justify-content-center gap-2" style={{fontSize: '12px'}}>
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
          </div>
        )}
      </main>

      {/* NAVEGACIÓN INFERIOR (Mantenida idéntica) */}
      <footer className="fixed-bottom bg-white border-top py-3 nav-difuminado" style={{zIndex: 1000}}>
        <div className="d-flex justify-content-around align-items-center">
          {[
            { id: 'inicio', icono: Home, etiqueta: 'Inicio' },
            { id: 'citas', icono: Calendar, etiqueta: 'Citas' },
            { id: 'pagos', icono: CreditCard, etiqueta: 'Pagos' }
          ].map(item => (
            <div 
              key={item.id} 
              onClick={() => {setPestanaActual(item.id); setModoReserva(false);}}
              className={`d-flex flex-column align-items-center cursor-pointer transition-all ${pestanaActual === item.id ? 'text-primary' : 'text-secondary opacity-50'}`}
              style={{flex: 1}}
            >
              <item.icono size={22} className="mb-1" />
              <span className="fw-bold" style={{fontSize: '10px'}}>{item.etiqueta}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}



/**
 * 
   useEffect(() => {
          setDatosReserva(prev => ({
          ...prev,
          fecha: '', // Limpia el string de fecha
          hora: '',  // Limpia la hora seleccionada
          fechaObjeto: { ...prev.fechaObjeto, dia: null } // Deselecciona el día en el calendario
        }));
    
      // 1. Verificamos que estemos en el paso de calendario y tengamos los IDs necesarios
      const medId = datosReserva.doctor?.id;
      const espId = datosReserva.especialidad?.idEspecialidad || datosReserva.especialidad?.id;
      console.log("Datos de Reserva  "+medId+"-----"+espId)
      if (pasoActual === 3 && medId && espId) {
        const cargarProgramacionDelMes = async () => {
        const { mes, anio } = datosReserva.fechaObjeto;
        const key = `${medId}-${espId}-${mes}-${anio}`;
        // Eliminamos el if (!cache.programacionMensual[key]) para ignorar el caché
        setCargando(true);
      try {
          console.log(`Solicitando API para: Mes ${mes + 1}, Año ${anio}`);
          // Llamada directa a la API
          const data = await ProgramacionMedicaService.obtenerDias(medId, espId);
          const dataUI = transformarProgramacion(data);
                  //        console.log(`Solicitando API para: Mes data `+JSON.stringify(dataUI));
          // Actualizamos el estado para que el calendario se renderice con la nueva data
          setCache(prev => ({
            ...prev,
            programacionMensual: { 
              ...prev.programacionMensual, 
              [key]: dataUI 
            }
          }));
        } catch (error) {
          console.error("Error al cargar programación desde la API:", error);
        } finally {
          setCargando(false);
        }
      };

      cargarProgramacionDelMes();
    }
    // El efecto reacciona al cambio de mes, año, doctor o paso
  }, [
    datosReserva.fechaObjeto.mes, 
    datosReserva.fechaObjeto.anio, 
    datosReserva.doctor?.id, 
    pasoActual
  ]);


 */

    /*
    // 4. SELECCIONAR DÍA -> CARGAR HORAS
    const seleccionarDia = async (dia) => {
      const fechaStr = `${dia} Feb`; // Simplificado para el UI
      const key = `${datosReserva.doctor.id}-${fechaStr}`;
      setDatosReserva(prev => ({ ...prev, fecha: fechaStr, fechaObjeto: { ...prev.fechaObjeto, dia } }));
      
      if (!cache.horasDisponibles[key]) {
        const data = await ejecutarAPI("obtenerProgramacionMedicaHorasService", { medId: datosReserva.doctor.id, fecha: fechaStr });
        setCache(prev => ({ ...prev, horasDisponibles: { ...prev.horasDisponibles, [key]: data } }));
      }
    };
  */


    /**
     * 
     * 
         
  const seleccionarMedico = (med) => {
  //---------------------------------------------
      // 1. Verificamos que estemos en el paso de calendario y tengamos los IDs necesarios
      const medId = datosReserva.doctor?.id;
      const espId = datosReserva.especialidad?.idEspecialidad || datosReserva.especialidad?.id;
      console.log("Datos de Reserva  "+medId+"-----"+espId)
      if (pasoActual === 3 && medId && espId) {
        async () => {
            const { mes, anio } = datosReserva.fechaObjeto;
  //          const key = `${medId}-${espId}-${mes}-${anio}`;
            setCargando(true);
            try {
                  console.log(`Solicitando API para: Mes ${mes + 1}, Año ${anio}`);
                  // Llamada directa a la API
                  const data = await ProgramacionMedicaService.obtenerDias(medId, espId);
                  const dataProgramacionUI = transformarProgramacion(data);
                  setProgramacionMensual(dataProgramacionUI)
                  setDatosReserva(prev => ({ 
                    ...prev, 
                    doctor: med, 
                    hora: '',
                    fechaObjeto: { ...prev.fechaObjeto, dia: null } // Reset día
                  }));
                  setPasoActual(3); // El useEffect detectará el paso 3 y el medId y disparará la API sola.              
                // Actualizamos el estado para que el calendario se renderice con la nueva data
              } catch (error) {
                console.error("Error al cargar programación desde la API:", error);
              } finally {
                setCargando(false);
              }
      };

  };
};

     */