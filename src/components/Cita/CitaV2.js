import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { Calendar, CreditCard, Home, Star, ChevronRight,User, CheckCircle2, ChevronLeft, Plus, Loader2,
        FileText,Download, ExternalLink} from 'lucide-react';
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
import { ESTILOS_CSS } from './Constantes/ESTILOS_CSS';
import FinalizarReserva from './Componentes/FinalizarReserva';
import CitaSeparada from '../CitaSeparada/CitaSeparada';
import AuthService from '../Login/services/auth.service';
import { useAuth } from '../context/AuthContext';

let timerInterval;


export default function CitaV2({  direccionClinica = "Sede Central" }) {

  const perfil = AuthService.leerPerfil();
  const [pestanaActual, setPestanaActual] = useState('inicio');
  const [modoReserva, setModoReserva] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [programacionMensual, setProgramacionMensual] = useState([]);
  const [medicosActuales, setMedicosActuales] = useState([]);
  const { entidad, user } = useAuth();

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
      

        const data = await ejecutarAPI("obtenerProgramacionMedicaHorasService", { 
          medId: datosReserva.doctor.id, 
          fechay: datosReserva.fechaYYYYMMDD 
        });
//          fecha: `${anio}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}` 
        console.log("DATA DE TURNOS O CUPOS  "+data)
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
                        <p className="mb-0 text-primary fw-bold text-uppercase" style={{fontSize: '9px', letterSpacing: '1px'}}>Paso {pasoActual} de 4</p>
                        <h6 className="fw-bold mb-0 text-black">
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
                {/* LLAMADA AL COMPONENTE QUE LISTA LAS CITAS PENDIENTES */}
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

/**
 
  
       <div className="col-12 col-lg-5">
        <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <Clock size={18} className="me-2 text-primary" />
            Horarios para el día {datosReserva.fechaObjeto.dia || '...'}
          </h6>

          {!datosReserva.fechaObjeto.dia ? (
            <div className="text-center py-5">
              <p className="text-muted small">Selecciona un día disponible para ver las horas.</p>
            </div>
          ) : (
            <div className="d-grid gap-2 overflow-auto" style={{ maxHeight: '350px' }}>
   
             {programacionMensual
                .filter(p => parseInt(p.fechadia) === datosReserva.fechaObjeto.dia)
                .map((horario, index) => (
                  <button
                    key={index}
                    onClick={() => setDatosReserva(prev => ({ ...prev, hora: horario.horainicio }))}
                    className={`btn py-2 px-3 rounded-3 text-start border transition-all ${
                      datosReserva.hora === horario.horainicio 
                        ? 'btn-primary border-primary shadow-sm' 
                        : 'btn-outline-light text-dark border-light-subtle hover-bg-light'
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">{horario.horainicio}</span>
                      <small className={datosReserva.hora === horario.horainicio ? 'text-white' : 'text-muted'}>
                        Disponible
                      </small>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
 */
//           {/* Filtramos la programación mensual para mostrar solo las horas del día seleccionado */}


 
 /**
       const { mes, anio } = datosReserva.fechaObjeto;
  
      // 2. Formateamos a YYYYMMDD
      // Recordar: mes + 1 porque en JS Enero es 0
      const mesFormat = String(mes + 1).padStart(2, '0');
      const diaFormat = String(dia).padStart(2, '0');
      const fechaString = `${anio}${mesFormat}${diaFormat}`;

      // Formato para mostrar en el UI (ej: "15 de Marzo")
      const fechaStr = `${dia} ${new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(anio, mes))}`;
  //    const keyHora = `${datosReserva.doctor.id}-${fechaStr}`;
      alert(fechaString)
      setDatosReserva(prev => ({ 
        ...prev, 
          fechaYYMMDD: fechaString, 
          fecha: fechaStr, 
        fechaObjeto: { ...prev.fechaObjeto, dia } 
      }));
      
 
 * 
 */



      /**
       * 
       * 
                      {pasoActual === 4 && (
                        <div className="fade-in">
                          <div className="bg-white p-4 rounded-5 border mb-4 shadow-sm">
                            <p className="text-secondary small fw-bold text-uppercase mb-3">Resumen de Pago</p>
                            <div className="d-flex flex-column gap-2 mb-4">
                              <div className="d-flex justify-content-between">
                                <span className="small text-secondary">Especialidad</span>
                                <span className="small fw-bold text-dark">{datosReserva.especialidad?.descripcionEspecialidad}</span>
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
                                <span className="fw-bold text-primary">{datosReserva.doctor?.montoFormateado}</span>
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
       
       */