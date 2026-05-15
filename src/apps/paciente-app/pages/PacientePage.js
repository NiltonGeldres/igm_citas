import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { Calendar, CreditCard, Home,  CheckCircle2, ChevronLeft,  Loader2 } from 'lucide-react';
//import   "../styles/ESTILOS_CSS";
import { ESTILOS_CSS } from '../styles/ESTILOS_CSS';
import { useCallback } from 'react';

import MedicoService from '../../../master-data/services/MedicoService';
import CitaSeparadaService from '../../../master-data/services/CitaSeparadaService';
import EspecialidadService from '../../../master-data/services/EspecialidadService';
import ProgramacionHorarioIndividualService from '../../../feactures/ProgramacionHorario/ProgramacionHorarioService';
import AuthService from '../../../master-data/services/auth.service';

import CitaSeparada from '../../../feactures/CitaSeparada/CitaSeparada';
import CitaService from '../../../feactures/Cita/CitaService';
import citaService from "../../paciente-app/services/citaServices"
import { transformarEspecialidades } from '../mapper/CitaEspecialidad';
import { transformarMedicos } from '../mapper/CitaMedicoUI';
import { transformarProgramacion } from '../mapper/CitaProgramacionMedicaUI';

import { useAuth } from "../../../shared/context/AuthContext"
import { BaseHeader } from '../../../shared/components/layout/BaseHeader';
import { obtenerFechaActualYYYYMMDD } from '../../../shared/utils/ObtenerFechaActualYYYYMMDD';

import { InicioDashboard } from '../components/InicioDashboard';
import { Paso1Especialidad } from '../components/reserva/Paso1Especialidad';
import { Paso2Medico } from '../components/reserva/Paso2Medico';
import { Paso3Horario } from '../components/reserva/Paso3Horario';
import { ListaMisCitas } from '../components/reserva/ListaMisCitas';
import { Paso4Confirmacion } from '../components/reserva/Paso4Confirmacion';
import { mapperCitaSeparadaApiToReserva } from '../mapper/CitaSeparadaMapper';


const HeaderPasos = ({ pasoActual, onAtras }) => (
  <div className="d-flex align-items-center gap-3 mb-4">
    <button 
      onClick={onAtras} 
      className="btn btn-light rounded-circle p-2 shadow-sm text-secondary border-0"
      style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <ChevronLeft size={20} />
    </button>
    <div>
      <p className="mb-0 text-primary fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1px' }}>
        Paso {pasoActual} de 4
      </p>
      <h6 className="fw-bold mb-0 text-dark">
        {pasoActual === 1 && "Selecciona Especialidad"}
        {pasoActual === 2 && "Selecciona Médico"}
        {pasoActual === 3 && "Fecha y Hora"}
        {pasoActual === 4 && "Confirmación de Cita"}
      </h6>
    </div>
  </div>
);

const LoaderCargando = () => (
  <div className="text-center py-5">
    <Loader2 className="animate-spin text-primary" size={40} />
    <p className="small text-secondary mt-2">Cargando información...</p>
  </div>
);

const ExitoReserva = ({ nombreEntidad, onReiniciar, onIrAPagos }) => (
  <div className="text-center py-5 fade-in">
    <div className="bg-success bg-opacity-10 text-success p-4 rounded-circle d-inline-block mb-4">
      <CheckCircle2 size={50} />
    </div>
    <h3 className="fw-bold">¡Todo listo!</h3>
    <p className="text-secondary mb-4 px-4">
      Tu cita ha sido agendada en <strong>{nombreEntidad}</strong> correctamente.
    </p>
    <div className="d-flex flex-column gap-2 px-3">
      <button onClick={onReiniciar} className="btn btn-primary w-100 p-3 rounded-4 fw-bold">
        Ver mis Citas
      </button>
      <button onClick={onIrAPagos} className="btn btn-light w-100 p-3 rounded-4 fw-bold border">
        Ver Comprobante
      </button>
    </div>
  </div>
);

export default function PacientePage({  direccionClinica = "Sede Central" , onLogout }) {
//  const { user, entidad } = useAuth();
  const { user } = useAuth();
  const perfil = AuthService.leerPerfil();
  const [pestanaActual, setPestanaActual] = useState('inicio');
  const [modoReserva, setModoReserva] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [programacionMensual, setProgramacionMensual] = useState([]);
  const [medicosActuales, setMedicosActuales] = useState([]);
  const fechaFiltro = obtenerFechaActualYYYYMMDD();
  const [procesandoBloqueo, setProcesandoBloqueo] = useState(false);
  // --- ESTADO DE CACHÉ Y DATOS ---
  const [cache, setCache] = useState({
    especialidades: [],
    horasDisponibles: {}     // key: medId-fecha
  });

  const [datosReserva, setDatosReserva] = useState({ 
    idCitaSeparada:0,
    especialidad: null, 
    servicio: null, 
    doctor: null, 
    fecha: '', 
    fechaObjeto: { mes: new Date().getMonth(), anio: new Date().getFullYear(), dia: null },
    fechaYYYYMMDD: '', 
    hora: '' ,
    idCitaBloqueada:0,
    precioUnitario: 0,
    nombreDestino: '',
    email: user.email,

  });

  const [misCitas, setMisCitas] = useState([]);
  //const [misPagos, setMisPagos] = useState([]);
  const [misMedicosEntidad, setMisMedicosEntidad] = useState([]);
  
  const obtenerCitas = useCallback(async (idPaciente, fecha) => {  
      setCargando(true);
      try {
        const data = await citaService.getCitaPacienteListarPendientes(user.idReferencia, fechaFiltro);
        setMisCitas(data);
      } catch (error) {
        console.error("Error al traer citas:", error);
      } finally {
        setCargando(false);
      }
  }, [user?.idReferencia,fechaFiltro]);
  //}, [user?.idPaciente,fechaFiltro]);

  const obtenerMedicosEntidad = async (idEntidad) => {
    setCargando(true);
    try {
      const data1 = await MedicoService.getListarMedicosEntidad(idEntidad);
      
     setMisMedicosEntidad(data1.data.medicos || []);      
    } catch (error) {
      console.error("Error al traer citas:", error);
    } finally {
      setCargando(false);
    }
  };

  // 1. CARGAR ESPECIALIDADES (Al entrar a Citas)
  useEffect(() => {
    const cargar = async () => {
      if (cache.especialidades.length > 0) {
        console.log("Cargando especialidades desde el caché...");
        return; 
      }
      try {
        const data = await EspecialidadService.getXEntidad();
        const dataListaParaUI = transformarEspecialidades(data);
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
  }, [user?.id, fechaFiltro, obtenerCitas]);


  useEffect(() => {
      if (user?.idEntidad) {
          obtenerMedicosEntidad(user.idEntidad);
      }
  }, [user?.idEntidad]);

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
   //     console.log("espID     "+espId)
  //      console.log("medID     "+JSON.stringify(med))
  //      console.log("medID     "+medId)
  //      const serId = datosReserva.servicio?.idServicio || datosReserva.servicio?.id;

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
 //     const keyHora = `${datosReserva.doctor.id}-${fechaStr}`;

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
      const mesActual = datosReserva.fechaObjeto.mes; 
      const anioActual = datosReserva.fechaObjeto.anio;
      const fechaTemporal = new Date(anioActual, mesActual, 1);
      fechaTemporal.setMonth(fechaTemporal.getMonth() + direccion);
      const nuevoMesIndice = fechaTemporal.getMonth(); 
      const nuevoAnio = fechaTemporal.getFullYear();
      setDatosReserva(prev => ({
        ...prev,
        fechaObjeto: { ...prev.fechaObjeto, mes: nuevoMesIndice, anio: nuevoAnio, dia: null }
      }));
      const medId = datosReserva.doctor?.id;
      const espId = datosReserva.especialidad?.idEspecialidad;
      if (medId && espId) {
        obtenerProgramacionMedicaMes(nuevoMesIndice + 1, nuevoAnio, espId, medId, 10);
      }
    };

    const handleHoraSeleccionada = async (hora, idProg, idServ) => {
       if (procesandoBloqueo) return;
       let timerInterval;
       setProcesandoBloqueo(true);
        try {
            // PASO 1: Bloqueo temporal en el Servidor
            const respBloqueo = await CitaService.getCitaBloquear(hora, datosReserva.fechaYYYYMMDD, datosReserva.doctor.id);

            const idBloqueo = respBloqueo.data.idCitaBloqueada;

            // PASO 2: Confirmación con el Usuario
            const result = await Swal.fire({
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
                        if (b) b.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                },
                willClose: () => clearInterval(timerInterval)
            });

            // PASO 3: Acciones según respuesta
            if (result.isConfirmed) {
                await finalizarReserva(hora, idProg, idServ, idBloqueo);
            } else {
                // Liberar si cancela, cierra o expira el timer
                await CitaService.getEliminarCitaBloqueada(idBloqueo);
            }

        } catch (error) {
            Swal.fire('Error', 'El horario ya no está disponible o hubo un problema de conexión.', 'error');
        } finally {
            setProcesandoBloqueo(false); // Liberamos el semáforo siempre al finalizar
        }
    };
    
    const finalizarReserva = async (hora, idProg, idServ, idBloqueo) => {
        try {
              // 1. Crear la cita separada en el Backend
            const  res =  await CitaSeparadaService.getCitaSeparadaCrear(
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
          if (res.data?.idCitaSeparada) {
              // 1. Mapeamos (la limpieza de campos ocurre aquí dentro)
              const reservaFinal = mapperCitaSeparadaApiToReserva(res.data, datosReserva);
              // 2. Guardamos en estado
              setDatosReserva(reservaFinal);
              // 3. Solo si hubo éxito, avanzamos de fase
              setPasoActual(4);

          } else {
              // Si entró aquí, es porque la API respondió pero sin el ID esperado
              Swal.fire("Atención", "No pudimos confirmar tu reserva. Por favor, intenta nuevamente.", "warning");
          }
              // 3. Limpiar el bloqueo (ya que ahora es una reserva real)
              await CitaService.getEliminarCitaBloqueada(idBloqueo);

              // 4. Avanzar al siguiente paso (Pago/Confirmación)
              setPasoActual(4);

        } catch (error) {
            console.error("Error al finalizar reserva:", error);
            throw new Error("No se pudo procesar la reserva final.");
        }
    };

  const manejarAtras = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    } else {
      setModoReserva(false);
    }
  };    

  return (
    <div className="container-fluid p-0 pb-5 mb-5">
      <style>{ESTILOS_CSS}</style>

      <BaseHeader 
        user={user} 
//        entidad={entidad}
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
          <InicioDashboard 
            nombresUsuario={user.nombresUsuario}
            nombreEntidad={user.nombreEntidad}
            misCitas={misCitas}
            misMedicosEntidad={misMedicosEntidad}
            direccionClinica={direccionClinica}
            onNuevaCita={() => { 
              setPestanaActual('citas'); 
              setModoReserva(true); 
              setPasoActual(1); 
            }}
            onIrAPagos={() => setPestanaActual('pagos')}
          />
        )}
        {/* --- VISTA CITAS --- */}
        {pestanaActual === 'citas' && (
          <div className="fade-in px-3 pt-4">
            {!modoReserva ? (
              <ListaMisCitas 
                misCitas={misCitas} 
                onNuevaCita={() => { setModoReserva(true); setPasoActual(1); }} 
              />
            ) : (
              <div className="flujo-reserva">
                {mostrarExito ? (
                  <ExitoReserva 
                    nombreEntidad={user.nombreEntidad} 
                    onReiniciar={reiniciarFlujo} 
                    onIrAPagos={() => { setMostrarExito(false); setModoReserva(false); setPestanaActual('pagos'); }} 
                  />
                ) : (
                  <>
                    <HeaderPasos pasoActual={pasoActual} onAtras={manejarAtras} />
                    
                    {cargando && <LoaderCargando />}

                    <div className={cargando ? 'opacity-25' : ''}>
                      {pasoActual === 1 && (
                        <Paso1Especialidad 
                          especialidades={cache.especialidades} 
                          onSeleccionar={seleccionarEspecialidad} 
                        />
                      )}

                      {pasoActual === 2 && (
                        <Paso2Medico 
                          medicos={medicosActuales} 
                          onSeleccionar={seleccionarMedico} 
                        />
                      )}

                      {pasoActual === 3 && (
                        <Paso3Horario 
                          datosReserva={datosReserva}
                          programacionMensual={programacionMensual}
                          cambiarMes={cambiarMes}
                          seleccionarDia={seleccionarDia}
                          onHoraSeleccionada={handleHoraSeleccionada}
                          cargando={cargando}
                          onSiguiente={() => setPasoActual(4)}
                          onAtras={() => setPasoActual(2)}
                        />
                      )}

                      {pasoActual === 4 && (
                        <Paso4Confirmacion 
                          datosReserva={datosReserva} 
                          onFinalizar={reiniciarFlujo}
                          onPagarTarde={() => { setPestanaActual('pagos'); setModoReserva(false); }}
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
                    console.log(user.id+ ""+ fechaFiltro)
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


           /* const {
              idCitaSeparada = 0,
              especialidad = null,
              servicio = null,
              doctor = null,
              fecha = '',
              fechaObjeto = { mes: new Date().getMonth(), anio: new Date().getFullYear(), dia: null },
              fechaYYYYMMDD = '',
              hora = '',
              idCitaBloqueada = 0,
              precioUnitario = 0,
              nombreDestino = 'ENTIDAD MÉDICA', // Valor por defecto amigable
              email = ''
          } = r.data || {}; // El '|| {}' evita errores si 'data' es null

          // 2. Validación de Seguridad: Si no hay ID, no procedemos al pago
          if (!idCitaSeparada || idCitaSeparada === 0) {
              return Swal.fire("Error de Registro", "La cita no se pudo crear en el servidor.", "error");
          }

          // 3. Actualizamos el estado con datos limpios
          setDatosReserva(prev => ({
              ...prev,
              idCitaSeparada,
              especialidad,
              servicio,
              doctor,
              fecha,
              fechaObjeto,
              fechaYYYYMMDD,
              hora,
              idCitaBloqueada,
              precioUnitario,
              nombreDestino,
              email
          }));
          
              // 2. Actualizar estado global de la reserva
              setDatosReserva(prev => ({
                  ...prev,
                  hora: hora,
                  idProgramacion: idProg,
                  idCitaBloqueada: idBloqueo
              }));
*/