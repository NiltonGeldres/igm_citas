import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { Calendar, CreditCard, Home, Star, ChevronRight,User, CheckCircle2, ChevronLeft, Plus, Loader2 } from 'lucide-react';
import { ESTILOS_CSS } from './Constantes/ESTILOS_CSS';

import CalendarioReserva from './Componentes/CalendarioReserva';
import ProgramacionHoras from './Componentes/ProgramacionHoras';
import CitaSeparadaService from '../CitaSeparada/CitaSeparadaService';
import CitaService from '../Cita/CitaService';
import EspecialidadService from '../Especialidad/EspecialidadService';
import {transformarEspecialidades} from "../Cita/Data/CitaEspecialidad"
import MedicoService from '../Medico/MedicoService';
import { transformarMedicos } from './Data/CitaMedicoUI';
import { transformarProgramacion } from './Data/CitaProgramacionMedicaUI';
import ProgramacionHorarioIndividualService from '../ProgramacionHorarioIndividual/ProgramacionMedicaIndividualService';
import FinalizarReserva from './Componentes/FinalizarReserva';
import CitaSeparada from '../CitaSeparada/CitaSeparada';
import AuthService from '../Login/services/auth.service';
import { useAuth } from '../context/AuthContext';
import { BaseHeader } from '../../shared/components/layout/BaseHeader';
import citaService from '../../apps/paciente-app/services/citaServices';

let timerInterval;


export default function CitaV2({  direccionClinica = "Sede Central" , onLogout }) {
  const { user, entidad } = useAuth();
  const perfil = AuthService.leerPerfil();
  const [pestanaActual, setPestanaActual] = useState('inicio');
  const [modoReserva, setModoReserva] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [programacionMensual, setProgramacionMensual] = useState([]);
  const [medicosActuales, setMedicosActuales] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("2026-03-16"); // Fecha actual por defecto

//  const { entidad, user } = useAuth();

  // --- ESTADO DE CACHÉ Y DATOS ---
  const [cache, setCache] = useState({
    especialidades: [],
    horasDisponibles: {}     // key: medId-fecha
  });

  const [datosReserva, setDatosReserva] = useState({ 
    especialidad: null, 
    servicio: null, 
    doctor: null, 
    fecha: '', 
    fechaObjeto: { mes: new Date().getMonth(), anio: new Date().getFullYear(), dia: null },
    fechaYYYYMMDD: '', 
    hora: '' ,
    idCitaBloqueada:0
  });

  const [misCitas, setMisCitas] = useState([]);
  const [misPagos, setMisPagos] = useState([]);

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


  useEffect(() => {
    if (user?.id) {
      obtenerCitas(user.id, fechaFiltro);
    }
  }, [user?.id]); // Solo se ejecuta al cargar el componente

  const manejarClickMisCitas = () => {
    setPestanaActual('citas');
    setModoReserva(false);
    obtenerCitas(user.id, fechaFiltro); // <--- Refresca la variable
  };

  const obtenerCitas = async (idPaciente, fecha) => {
    setCargando(true);
    try {
      const data = await citaService.getCitaPacienteListarPendientes(19, '2026-03-13');
      console.log("DATA "+JSON.stringify(data))
      setMisCitas(data);
    } catch (error) {
      console.error("Error al traer citas:", error);
    } finally {
      setCargando(false);
    }
  };

  const  seleccionarEspecialidad = async (espec) => {
        setDatosReserva(prev => ({ ...prev, especialidad: espec, doctor: null }));
        const data = await   MedicoService.obtenerTodosEspecialidad(espec.idEspecialidad)
        const dataListaMedicosParaUI = transformarMedicos(data);
        setMedicosActuales(dataListaMedicosParaUI);
        setPasoActual(2);
  };

  const seleccionarMedico = async (med) => { // 1. Hacemos la función principal async
        // 2. Obtenemos los datos directamente del médico seleccionado (med) y la especialidad actual

        const medId = med.id;
        const espId = datosReserva.especialidad?.idEspecialidad || datosReserva.especialidad?.idEspecialidad;
        console.log("espID     "+espId)
        console.log("medID     "+JSON.stringify(med))
        console.log("medID     "+medId)
        const serId = datosReserva.servicio?.idServicio || datosReserva.servicio?.id;

        // 3. Actualizamos el estado con el médico elegido y pasamos al paso 3
        setDatosReserva(prev => ({ 
          ...prev, 
          doctor: med, 
          hora: '',
          fechaObjeto: { ...prev.fechaObjeto, dia: null } 
        }));
        
        setPasoActual(3);

        // 4. Cargamos la programación inmediatamente
        if (medId && espId ) {
          const { mes, anio } = datosReserva.fechaObjeto;
          obtenerProgramacionMedicaMes(mes+1,anio,espId,medId, 1)      
        }
  };

  const obtenerProgramacionMedicaMes = async (mes,anio,idEspecialidad,idMedico) =>{
          setCargando(true);
          try {
            // Nota: Asegúrate de enviar mes+1 y anio si tu API lo requiere
            const data = await ProgramacionHorarioIndividualService.obtenerProgramacionMesUsuario(mes, anio, idEspecialidad,idMedico,0);
            const dataProgramacionUI = transformarProgramacion(data.data.programacionMedicaDiaResponse);
            setProgramacionMensual(dataProgramacionUI);
            console.log("obtenerProgramacionMedicaMes dataProgramacionUI   "+JSON.stringify(dataProgramacionUI))
            console.log("obtenerProgramacionMedicaMes DATA  PROGRAMACION "+JSON.stringify(data.data.programacionMedicaDiaResponse))
            console.log("obtenerProgramacionMedicaMes DATA   "+JSON.stringify(data))

          } catch (error) {
            console.error("Error al cargar programación:", error);
            setProgramacionMensual([]); 
          } finally {
            setCargando(false);
          }
  }  

    const seleccionarDia = async (dia) => {
      const { mes, anio } = datosReserva.fechaObjeto;
      // Formato para mostrar en el UI (ej: "15 de Marzo")
      const fechaStr = `${dia} ${new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(anio, mes))}`;
      const keyHora = `${datosReserva.doctor.id}-${fechaStr}`;

      const mesFormat = String(mes + 1).padStart(2, '0');
      const diaFormat = String(dia).padStart(2, '0');
      const fechaString = `${anio}${mesFormat}${diaFormat}`;

      setDatosReserva(prev => ({ 
        ...prev, 
        fechaYYYYMMDD: fechaString, 
        fecha: fechaStr, 
        fechaObjeto: { ...prev.fechaObjeto, dia } ,
        hora:''
      }));
      
/*
        const data = await ejecutarAPI("obtenerProgramacionMedicaHorasService", { 
          medId: datosReserva.doctor.id, 
          fechay: datosReserva.fechaYYYYMMDD 
        });
//          fecha: `${anio}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}` 
        console.log("DATA DE TURNOS O CUPOS  "+data)*/
    };


    const reiniciarFlujo = () => {
      setModoReserva(false);
      setPasoActual(1);
      setMostrarExito(false);
      setDatosReserva({ especialidad: null, doctor: null, fecha: '', fechaObjeto: { mes: new Date().getMonth(), anio: new Date().getFullYear(), dia: null }, hora: '' });
      setPestanaActual('inicio');
    };

    const cambiarMes = (direccion) => { // direccion será 1 o -1
      
      // 1. Obtenemos el mes y año que el usuario está viendo actualmente
      const mesActual = datosReserva.fechaObjeto.mes; 
      const anioActual = datosReserva.fechaObjeto.anio;

      // 2. Creamos una fecha temporal basada en lo que vemos
      const fechaTemporal = new Date(anioActual, mesActual, 1);

      // 3. AQUÍ es donde ocurre el aumento o reducción:
      // Si direccion es 1:  mesActual + 1 (Avanza)
      // Si direccion es -1: mesActual - 1 (Retrocede)
      fechaTemporal.setMonth(fechaTemporal.getMonth() + direccion);

      // JavaScript es inteligente: 
      // Si estás en Diciembre (mes 11) y sumas 1, automáticamente cambia el año a 2027 y el mes a 0 (Enero).
      const nuevoMesIndice = fechaTemporal.getMonth(); 
      const nuevoAnio = fechaTemporal.getFullYear();

      // 4. Actualizamos el estado para que la interfaz cambie
      setDatosReserva(prev => ({
        ...prev,
        fechaObjeto: { ...prev.fechaObjeto, mes: nuevoMesIndice, anio: nuevoAnio, dia: null }
      }));

      // 5. Llamamos a la API con el mes corregido (+1)
      const medId = datosReserva.doctor?.id;
      const espId = datosReserva.especialidad?.idEspecialidad;
      
      if (medId && espId) {
        // IMPORTANTE: nuevoMesIndice + 1 porque la API no entiende de 0 a 11, sino de 1 a 12
        obtenerProgramacionMedicaMes(nuevoMesIndice + 1, nuevoAnio, espId, medId, 10);
      }
    };

    const handleHoraSeleccionada = async (hora, idProg, idServ) => {
      console.log(hora+"  "+idProg+"  "+ idServ)
      try {
        const respBloqueo = await CitaService.getCitaBloquear(hora, datosReserva.fechaYYYYMMDD, datosReserva.doctor.id);        
        const idBloqueo = respBloqueo.data.idCitaBloqueada;
        
        // 2. Mostrar confirmación con Timer
        Swal.fire({
          title: '¿Confirmar horario?',
          html: `Has seleccionado las <b>${hora}</b>.<br/>Confirma en <b>60</b> segundos.`,
          timer: 60000,
          timerProgressBar: true,
          showCancelButton: true,
          confirmButtonText: 'Sí, reservar',
          cancelButtonText: 'Cancelar',
          didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector('b');
            timerInterval = setInterval(() => {
              b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000);
          },
          willClose: () => clearInterval(timerInterval)
        }).then(async (result) => {
          if (result.isConfirmed) {

            console.log(
                datosReserva.fechaYYYYMMDD 
                +' ' + hora 
                +' ' + hora
                +'  ' + 0
                +'    ' +datosReserva.doctor?.id
                +'   ' +datosReserva.especialidad?.idEspecialidad
                +'   ' +idServ
                +'   ' +idProg
                +'   ' +0
                +'   ' + datosReserva.doctor?.montoFormateado
          )
              await CitaSeparadaService.getCitaSeparadaCrear(
                datosReserva.fechaYYYYMMDD, 
                hora, 
                hora,
                0, 
                datosReserva.doctor?.id, 
                datosReserva.especialidad?.idEspecialidad,
                idServ,
                idProg,
                0, 
                datosReserva.doctor?.monto
              );
            // Proceder al siguiente paso o guardar
            setDatosReserva(prev => ({ 
                    ...prev, 
                    hora: hora, 
                    idProgramacion: idProg, 
                    idCitaBloqueada: idBloqueo // Guardamos el ID para liberarlo luego si es necesario
            }));
            await CitaService.getEliminarCitaBloqueada(idBloqueo);
            setPasoActual(4); 
          } else {
            // 3. Liberar si cancela o se acaba el tiempo
            await CitaService.getEliminarCitaBloqueada(idBloqueo);
          }
        });

      } catch (error) {
        Swal.fire('Error', 'Este horario acaba de ser tomado por otro usuario.', 'error');
      }
    };

  return (
    <div className="container-fluid p-0 pb-5 mb-5">
      <style>{ESTILOS_CSS}</style>

      <BaseHeader 
        user={user} 
        entidad={entidad}
        bgColor="linear-gradient(135deg, #0078f5 0%, #0056b3 100%)"
        onLogout={onLogout}
      >
        {/* 2. Este es el 'children' del header, aparecerá debajo del nombre del médico */}
        <div className="header-page-title" style={{ padding: '0 0.5rem 1rem' }}>
          <h4 style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>Mis Citas</h4>
        </div>
      </BaseHeader>

      <main style={{maxWidth: '480px', margin: '0 auto'}}>
        
        {/* --- VISTA INICIO --- */}
        {pestanaActual === 'inicio' && (
          <div className="fade-in px-3 pt-4">
            <div className="card border-0 bg-primary text-white p-4 shadow-lg mb-4" style={{borderRadius: '28px'}}>
              <h5 className="fw-bold mb-1">¡Hola,{perfil.usuarioNombres}</h5>
              <p className="opacity-75 small mb-4">Bienvenido a {entidad?.nombre}. Tu salud es prioridad.</p>
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
                  <div className="fw-bold small text-dark">Pago Citas Reservada</div>
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
                {console.log(JSON.stringify(misCitas.length)) }
                {misCitas.length > 0 ? (
                  misCitas.map(cita => (
                    <div key={cita.id} className="tarjeta-personalizada bg-white p-4 shadow-sm border-start border-primary border-4">
                      <div className="d-flex justify-content-between mb-2">
                        <div>
                          <p className="fw-bold mb-0">{cita.servicioNombre}</p>
                          <p className="text-secondary small mb-0">{cita.nombres}</p>

                        </div>
                        <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 h-fit">
                          <Calendar size={18} />
                        </div>
                      </div>
                      <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                        <div>
                           <span className="text-uppercase text-secondary fw-bold d-block" style={{fontSize: '10px'}}>{cita.fecha}</span>
                           <span className="fw-bold text-dark" style={{fontSize: '12px'}}>{cita.horaInicio}</span>
                        </div>
                        <span className="etiqueta-pago bg-success bg-opacity-10 text-success">Confirmado</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-secondary opacity-50">
                    <Calendar size={48} className="mb-3" />
                    <p>No tienes {misCitas.length} citas programadas </p>
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
                    <p className="text-secondary mb-4 px-4">Tu cita ha sido agendada en <strong>{entidad?.nombre}</strong> correctamente.</p>
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
                        <p className="mb-0 text-primary fw-bold text-uppercase" style={{fontSize: '16px', letterSpacing: '1px'}}>Paso {pasoActual} de 4</p>
                        <h6 className="fw-bold mb-0 text-black ">
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
                      {pasoActual === 3 && (
                        <div className="fade-in">
                          {/* Título de sección */}
                          <div className="mb-4">
                            <h5 className="fw-bold mb-1">Selecciona Fecha y Hora</h5>
                            <p className="text-muted small">Los días marcados con un reloj tienen disponibilidad.</p>
                          </div>
                          <div className="row g-4">
                            {/* COLUMNA IZQUIERDA: El Calendario */}
                            <div className="col-12 col-lg-7">
                              <CalendarioReserva 
                                fechaObjeto={datosReserva.fechaObjeto}
                                cambiarMes={cambiarMes}
                                programacionMensual={programacionMensual}
                                seleccionarDia={seleccionarDia}
                                cargando={cargando}
                              />
                            </div>
                          <div className="col-lg-5">
                                <ProgramacionHoras 
                                  idMedico={datosReserva.doctor?.id}
                                  idEspecialidad={datosReserva.especialidad?.idEspecialidad}
                                  fechaCalendar={datosReserva.fechaYYYYMMDD}
                                  horaActualSeleccionada={datosReserva.hora}
                                  onHoraSeleccionada={handleHoraSeleccionada}
                                />
                          </div>
                            {/* COLUMNA DERECHA: Selector de Horas (Se activa al elegir un día) */}
                          </div>
                          {/* Botón de navegación inferior */}
                          <div className="mt-4 d-flex justify-content-between">
                            <button className="btn btn-light px-4" onClick={() => setPasoActual(2)}>Atrás</button>
                            <button 
                              className="btn btn-primary px-5 fw-bold" 
                              disabled={!datosReserva.fechaObjeto.dia || !datosReserva.hora}
                              onClick={() => setPasoActual(4)}
                            >
                              Siguiente
                            </button>
                          </div>
                        </div>
                      )}


                      {/* PASO 4: CONFIRMACIÓN Y PAGO (API 5) */}
                      {pasoActual === 4 && (
                        <FinalizarReserva 
                          datosReserva={datosReserva} 
                          onFinalizar={() => setPestanaActual('inicio')}
                          onPagarTarde={() => {
                            setPestanaActual('pagos'); // Cambia a la pestaña de pagos
                            setModoReserva(false);     // Quita la vista de reserva
                          }}
                        />
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
                {/* LLAMADA AL COMPONENTE QUE LISTA LAS CITAS SEPARADAS */}
                <CitaSeparada datosReserva={datosReserva}/> 
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
              onClick={() => {
                  setPestanaActual(item.id);
                  setModoReserva(false);
                  if (item.id === 'citas') {
                    obtenerCitas(user.id, fechaFiltro);
                  }                  
              }}
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



/*
    // 5. GUARDAR CITA
    const finalizarReserva = async () => {
      /*const res = await ejecutarAPI("GuardarCitaService", datosReserva);
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
*/

  // --- MOCK DE LAS 5 APIS ---
  /*const ejecutarAPI = async (nombre, params) => {
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
  };*/