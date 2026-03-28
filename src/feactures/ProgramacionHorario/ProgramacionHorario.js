import  { useState, useCallback, useMemo, useEffect } from 'react';
import { Icono } from './Programacion/Components/Icono.js';

import BarraFiltros from "./Programacion/Components/BarraFiltros.js";
import ProgramadorMasivo from "./Programacion/Components/ProgramadorMasivo.js";
import CeldaCalendario from "./Programacion/Components/CeldaCalendario.js";
import ModalEditorTurnos from "./Programacion/Components/ModalEditorTurnos.js";
import ESTILOS_PERSONALIZADOS from './ESTILOS_PERSONALIZADOS.js';
import {MESES_ES} from "./Programacion/Constants/MESES_ES.js"
import {DIAS_SEMANA} from "./Programacion/Constants/DIAS_SEMANA.js"

import TurnoService from "../../master-data/services/TurnoService.js";
import { cargarConfiguracionTurnos, MAPEO_TURNOS } from "./Programacion/Data/CargarConfiguracionTurnos.js";
import ProgramacioHorarioService from "../ProgramacionHorario/ProgramacionHorarioService.js";
import { actualizarTurnoEnDia } from "../ProgramacionHorario/Programacion/Modelos/ProgramacionHorarioDiaModelo.js";
import { modelarCrearProgramacion ,modelarDia} from "../ProgramacionHorario/Programacion/Modelos/ProgramacionHorarioDiaModelo.js";
import Especialidad from "../../shared/components/Especialidad.js"
import ProgramacionHorarioService from "../../feactures/ProgramacionHorario/ProgramacionHorarioService.js"
import Swal from 'sweetalert2';
import { transformarTurnosAPI } from './Programacion/Data/CargarConfiguracionTurnos.js';

export default function ProgramacionHorario() {
    
    
    const [fechaActual, setFechaActual] = useState(new Date()); 
    const [horarioCalendario, setHorarioCalendario] = useState({}); 
    const [estadoGuardado, setEstadoGuardado] = useState(null);
    const [modoMasivo, setModoMasivo] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [diaSeleccionadoParaEdicion, setDiaSeleccionadoParaEdicion] = useState(null);
    const [turnosMasivosSeleccionados, setTurnosMasivosSeleccionados] = useState([]);
    const [diasMasivosSeleccionados, setDiasMasivosSeleccionados] = useState([]);
    const [datosOriginalesBackend, setDatosOriginalesBackend] = useState([]);
    
 //   const [idEntidad, setIdEntidad] = useState(''); 
  //  const [descripcionEntidad, setDescipcionEntidad] = useState(""); 
    const [idEspecialidad, setIdEspecialidad] = useState(''); 
    const [descripcionEspecialidad, setDescripcionEspecialidad] = useState(""); 
    const [tiempoPromedioAtencion, setTiempoPromedioAtencion] = useState(""); 
    const [idServicio, setIdServicio] = useState(""); 
    const [descripcionServicio, setDescripcionServicio] = useState(""); 

    const [turnosCargados, setTurnosCargados]  = useState([]);
    const [envoltorioOriginal, setEnvoltorioOriginal] = useState([]);
 //   const [nombreMedico, setNombreMedico] = useState('');
 //   const [idEspSeleccionada, setIdEspSeleccionada] = useState(null);
 //   const [idServSeleccionado, setIdServSeleccionado] = useState(null);
    //Turnos

    const [mapeoTurnos, setMapeoTurnos] = useState({
        'libre': { idTurno: 'libre', descripcion: 'Libre', hora: 'Libre', claseColor: 'bg-light border' }
    });    


    useEffect(() => {
        TurnoService.getTodos().then(res => {
            cargarConfiguracionTurnos(res.data);
            const turnosParaEstado = Object.values(MAPEO_TURNOS);
            setTurnosCargados(turnosParaEstado);        });
    }, []);





    const contexto = useMemo(() => {
        const perfil = JSON.parse(sessionStorage.getItem('user_profile'));
        return {
            // Datos del Login (JWT)
            idEntidad: perfil?.idEntidad,
            idMedico: perfil?.idMedico,
            usuario: perfil?.username,
            
            // Datos de la Selección Actual (Tus componentes independientes)
            idEspecialidad: idEspecialidad,
            nombreEspecialidad: descripcionEspecialidad,
            tiempoPromedioAtencion: tiempoPromedioAtencion,
            idServicio: idServicio,
            nombreServicio: descripcionServicio,
            
            // Datos del Calendario
            mes: fechaActual.getMonth() + 1,
            anio: fechaActual.getFullYear()
        };
    }, [idEspecialidad,  fechaActual]);

//...............................................................................
    // Obtener la programacion del mes y su UssEffect
    //...............................................................................
    const cargarProgramacionCompleta = useCallback(async () => {
            // Extraemos los datos del contexto justo cuando se ejecuta la función
            const { mes, anio, idEspecialidad, idServicio, idMedico } = contexto;
            if (!idMedico || !idEspecialidad ) return;
            setEstadoGuardado('cargando');

            try {
                let res = await ProgramacionHorarioService.obtenerProgramacionMesUsuario(
                    mes, anio, idEspecialidad, idMedico, idServicio
                );
                // ... resto de tu lógica de procesamiento (res.data, etc.) ...
                
                    if (!res.data.programacionMedicaDiaResponse?.length) {
                        res = await ProgramacionHorarioService.obtenerProgramacionMesBlanco(
                            mes, anio, idEspecialidad, idMedico,idServicio
                        );
                        console.log("DATA  BLACO "+JSON.stringify(res.data))
                    }
                        console.log("DATA CARGAR PROGRAMACION COMPLETA "+JSON.stringify(res.data))
                    // Se obtiene la respuesta del API ,se toma data: que tiene cantidad registros y la lista
                    const envoltorioBack = res.data; 
                    // se obtitne la lista programacionMedicaDiaResponse de la respuesta API
                    const listaRaw = envoltorioBack?.programacionMedicaDiaResponse;

                    if (envoltorioBack && Array.isArray(listaRaw)) {
                        setEnvoltorioOriginal(envoltorioBack);
                        const modelosProcesados = listaRaw.map(item => modelarDia(item));
                        setDatosOriginalesBackend(modelosProcesados);
                        const mapaParaUI = modelosProcesados.reduce((acc, dia) => {
                            const clave = dia.getClaveCalendario();
                            // Si idTurno es 0, es 'libre'. Si tiene ID (ej: 1, 2), se guarda como string.
                            //acc[clave] = (dia.idTurno && dia.idTurno !== 0) ? [String(dia.idTurno)] : ['libre'];
                            acc[clave] = {
                               idTurno: (dia.idTurno && dia.idTurno !== 0) ? String(dia.idTurno) : 'libre',
                               idServicio: dia.idServicio, // Guardamos el servicio que viene del backend para cada día
                               codigoServicio: dia.codigoServicio // Guardamos el codigo de servicio que viene del backend para cada día
                            };
                            return acc;
                        }, {});
                 //       console.log("mapaParaUI  modelosProcesados por modelarDia():", JSON.stringify(mapaParaUI ));
                        setHorarioCalendario(mapaParaUI);
                        console.log("Programación cargada y sincronizada:", envoltorioBack);
                    }

            } catch (error) {
                console.error("Error en API:", error);
            } finally {
                setEstadoGuardado(null);
            }
    }, [contexto]); // <--- IMPORTANTE: Se recrea solo cuando el contexto cambia

    useEffect(() => {
            // Aquí el log siempre será el actual
            console.log("REVISANDO CONTEXTO:", contexto.idMedico, contexto.idEspecialidad, contexto.idServicio);

            if (contexto.idMedico && contexto.idEspecialidad ) {
                cargarProgramacionCompleta();
            }
    }, [contexto.idMedico, contexto.idEspecialidad,  contexto.mes, cargarProgramacionCompleta]);

    //...............................................................................
    // Guardado de datos
    //...............................................................................
    const manejarGuardado = useCallback( async (horarioActualizado = null) => {
        setEstadoGuardado('guardando');
        try {
            const fuenteDeDatos = horarioActualizado || horarioCalendario;
            const diasConTurnos = datosOriginalesBackend.map(dia => {
                const clave = dia.getClaveCalendario();
                const seleccion = fuenteDeDatos[clave];
                const nuevoIdTurno = (seleccion && seleccion.idTurno !== 'libre') ? Number(seleccion.idTurno) : 0;
                const servicioDeEsteDia = seleccion?.idServicio || contexto.idServicio; // Fallback al global si no hay                
                const diaActualizado = actualizarTurnoEnDia(dia, nuevoIdTurno);
                diaActualizado.idServicio = servicioDeEsteDia;                
                return diaActualizado;
            });

            const payloadFinal = modelarCrearProgramacion(contexto, diasConTurnos);
            const response = await ProgramacionHorarioService.crearProgramacionMesUsuario(payloadFinal);
            //const response = [];
            
            if (response && response.status === 200) {
                await cargarProgramacionCompleta(); 
                setEstadoGuardado('guardado');
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado correctamente!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });                
                return true;
            }
            
            throw new Error("Servidor no responde");
            setEstadoGuardado('error');
            return false;

        } catch (error) {
            console.error("Error al guardar:", error);
            setEstadoGuardado('error');
            Swal.fire({
                icon: 'error',
                title: '¡Ups! Algo salió mal',
                text: 'No pudimos conectar con el servidor para guardar los cambios. Por favor, verifica tu conexión o intenta más tarde.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#d33', // Color rojo para error
                backdrop: `rgba(255,0,0,0.1)` // Un fondo sutil rojizo
            });            
            return false;
        } finally {
            // Limpiamos el feedback visual
            setTimeout(() => setEstadoGuardado(null), 3000);
        }
        // Agregamos 'contexto' porque si cambias de médico, la función debe renovarse
    }, [horarioCalendario, datosOriginalesBackend, cargarProgramacionCompleta, contexto]);

    const irMesAnterior = useCallback(() => {
        setFechaActual(prev => {
            const nueva = new Date(prev.getTime());
            nueva.setMonth(nueva.getMonth() - 1);
            return nueva;
        });
        setModoMasivo(false);
        setDiasMasivosSeleccionados([]);
    }, []);

    const irMesSiguiente = useCallback(() => {
        setFechaActual(prev => {
            const nueva = new Date(prev.getTime());
            nueva.setMonth(nueva.getMonth() + 1);
            return nueva;
        });
        setModoMasivo(false);
        setDiasMasivosSeleccionados([]);
    }, []);

    const alternarModoMasivo = useCallback(() => {
        setModoMasivo(prev => {
            if (prev) {
                setDiasMasivosSeleccionados([]);
                setTurnosMasivosSeleccionados([]);
            }
            return !prev;
        });
    }, []);

    const alternarTurnoMasivo = useCallback((turnoId) => {
        // Si el usuario hace clic en un turno, ese es el ÚNICO seleccionado
        setTurnosMasivosSeleccionados([turnoId]);
    }, []);

    const seleccionarTodoElMes = useCallback(() => {
        const año = fechaActual.getFullYear();
        const mes = fechaActual.getMonth();
        const diasEnMes = new Date(año, mes + 1, 0).getDate();
        const clavesTodosLosDias = Array.from({ length: diasEnMes }, (_, i) => {
            const d = String(i + 1).padStart(2, '0');
            const m = String(mes + 1).padStart(2, '0');
            return `${año}-${m}-${d}`;
        });
        setDiasMasivosSeleccionados(clavesTodosLosDias);
    }, [fechaActual]);

    const aplicarProgramacionMasiva = useCallback(async () => {
        if (diasMasivosSeleccionados.length === 0 || turnosMasivosSeleccionados.length === 0) return;
        const nuevoHorario = { ...horarioCalendario };
        const turnoId = turnosMasivosSeleccionados[0] || 'libre';
        diasMasivosSeleccionados.forEach(clave => { 
            nuevoHorario[clave] = {
                idTurno: turnoId,
                idServicio: idServicio // Aquí usamos el ID global del filtro/barra lateral
            }; 
        });
        //---------------------------------

        const exito = await manejarGuardado(nuevoHorario);
        if (exito) {
                setTurnosMasivosSeleccionados([]);
                setDiasMasivosSeleccionados([]);
                alternarModoMasivo();
        } else {
                console.log("No se pudo aplicar la programación masiva por error en servidor.");
        }     
//        setHorarioCalendario(nuevoHorario);
//        setTurnosMasivosSeleccionados([]);
//        setDiasMasivosSeleccionados([]);
//        alternarModoMasivo();
//        manejarGuardado(nuevoHorario);
    }, [diasMasivosSeleccionados, turnosMasivosSeleccionados, horarioCalendario, alternarModoMasivo, manejarGuardado]);

    const manejarClickDia = useCallback((claveFecha) => {
        if (modoMasivo) {
            setDiasMasivosSeleccionados(prev =>
                prev.includes(claveFecha) ? prev.filter(d => d !== claveFecha) : [...prev, claveFecha]
            );
        } else {
            setDiaSeleccionadoParaEdicion(claveFecha);
            setModalAbierto(true);
        }
    }, [modoMasivo]);
    
    const datosCalendario = useMemo(() => {
        
        const año = fechaActual.getFullYear();
        const mes = fechaActual.getMonth();
        const diasEnMes = new Date(año, mes + 1, 0).getDate();
        const primerDiaMes = new Date(año, mes, 1);
        const offsetInicio = (primerDiaMes.getDay() - 1 + 7) % 7; 
        const celdas = [];
        const claveHoy = new Date().toISOString().slice(0, 10);
        for (let i = 0; i < offsetInicio; i++) {
            celdas.push(<CeldaCalendario key={`vacia-${i}`} dia={null} />);
        }
        for (let d = 1; d <= diasEnMes; d++) {
            const dPadded = String(d).padStart(2, '0');
            const mPadded = String(mes + 1).padStart(2, '0');
            const clave = `${año}-${mPadded}-${dPadded}`;
            const turnos = horarioCalendario[clave];
            //const tieneDatos = turnos && turnos.length > 0 && !(turnos.length === 1 && turnos[0] === 'libre');
        //    console.log("horarioCalendario   "+JSON.stringify(horarioCalendario))                    

            const dataDia = horarioCalendario[clave];
           // console.log("data dia  ===> "+JSON.stringify(dataDia));
            //const tieneDatos = dataDia && dataDia.idTurno !== 'libre';        

            const tieneTurnoAsignado = 
                    dataDia && 
                    dataDia.idTurno !== 0 && 
                    dataDia.idTurno !== '0' && 
                    dataDia.idTurno !== 'libre' &&
                    dataDia.idTurno !== null;
       //     console.log("dataDia   "+JSON.stringify(dataDia))                    
       //     console.log("tieneTurnoAsignado   "+tieneTurnoAsignado)                    

        //    const diaConfirmado = datosOriginalesBackend.find(diaBack => diaBack.getClaveCalendario() === clave);
        //    const confirmadoEnBackend = diaConfirmado && diaConfirmado.idTurno !== 0 && diaConfirmado.idTurno !== '0';            
            //const codServ    = dataDia && dataDia.codigoServicio !== '' ;        
            const codServ = dataDia?.codigoServicio || "";
        /*    console.log("datosCalendario dPadded ===> "+JSON.stringify(dPadded)
                +" mPadded ===> "+JSON.stringify(mPadded)
                +" clave ===> "+JSON.stringify(clave)
                +" turnos ===> "+JSON.stringify(turnos)
                +" tieneDatos ===> "+JSON.stringify(tieneDatos)
                +" codServ ===> "+JSON.stringify(codServ)
            );*/
            celdas.push(
                <CeldaCalendario
                    key={clave}
                    dia={d}
                    claveFecha={clave}
                    esHoy={clave === claveHoy}
                    tieneHorario={tieneTurnoAsignado}
//                    tieneHorario={tieneDatos}
                    estaSeleccionadoMasivo={diasMasivosSeleccionados.includes(clave)}
                    manejarClickDia={manejarClickDia}
                    horario={horarioCalendario}
                    codServ={codServ}
                />
            );
        }
        return { celdas, nombreMes: MESES_ES[mes], año };
    }, [fechaActual, diasMasivosSeleccionados, horarioCalendario, manejarClickDia]);

    const handleEspecialidadChange = (id, texto) => {
            setIdEspecialidad(id);
            setDescripcionEspecialidad(texto || "");
            // Resetear el servicio para que el usuario deba elegir uno nuevo
            setIdServicio(""); 
            setDescripcionServicio("");
                
            // Opcional: Limpiar el calendario visualmente hasta que elijan el nuevo servicio
            setHorarioCalendario({});        
        /*setIdEspecialidad(id);
        if (texto) setDescripcionEspecialidad(texto);
            setIdServicio(null); 
            setDescripcionServicio("");*/
    }
    
    const listoParaProgramar = idEspecialidad ;

    return (
        <>
        
            <style dangerouslySetInnerHTML={{ __html: ESTILOS_PERSONALIZADOS }} />
            <div className={`p-4 p-md-5 ${modoMasivo ? 'bulk-mode' : ''} min-vh-100`}>
                <div className="container-xl">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
                        <div>
                            <h1 className="h2 fw-extrabold text-slate-900 mb-1 d-flex align-items-center">
                                <Icono nombre="CalendarCheck" className="text-primary me-3" size={36} />
                                Gestión de Horarios Médicos
                            </h1>
                            <p className="text-secondary small fw-medium mb-0">Configuración mensual y programación en lote por servicio.</p>
                        </div>

                        <div className='mb-1' style={{width:400}}>
                            <Especialidad
                                valueEspecialidad={(val) => handleEspecialidadChange(val, null)}
                                textEspecialidad={(txt) => setDescripcionEspecialidad(txt)}                                
                                tiempoPromedioAtencion={(tiempo) => setTiempoPromedioAtencion(tiempo)}/>
                        </div>           
                
                    </div>
    
                    {!listoParaProgramar ? (
                        <div className="text-center p-5 bg-white rounded-4 shadow-sm">
                            <Icono nombre="Clock" size={48} className="text-muted mb-3" />
                            <h3 className="text-secondary">Seleccione una especialidad y consultorio</h3>
                            <p className="text-muted">Debe elegir el lugar de atención para gestionar el horario.</p>
                        </div>
                    ) : (
                  

                    <div className="row g-4">
                        <div className="d-flex align-items-center gap-3">
                            {estadoGuardado === 'guardado' && (
                                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill d-flex align-items-center animate-in fade-in">
                                    <Icono nombre="CheckCircle" size={14} className="me-2"/> Guardado
                                </span>
                            )}
                            {estadoGuardado === 'guardando' && (
                                <span className="badge bg-warning-subtle text-warning px-3 py-2 rounded-pill d-flex align-items-center">
                                    <Icono nombre="Loader" size={14} className="me-2 spin"/> Procesando
                                </span>
                            )}

                            <button
                                onClick={alternarModoMasivo}
                                className={`btn ${modoMasivo ? 'btn-danger shadow-danger' : 'btn-primary shadow-primary'} px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2 transition-all`}
                            >
                                <Icono nombre={modoMasivo ? "X" : "PlusCircle"} size={18} />
                                {modoMasivo ? 'Cancelar Lote' : 'Programación Masiva'}
                            </button>
                        </div>


                        {modoMasivo && (
                            <div className="col-12 col-lg-3 animate-in slide-in-from-left duration-300">
                                <ProgramadorMasivo
                                    turnosSeleccionados={turnosMasivosSeleccionados}
                                    alternarTurno={alternarTurnoMasivo}
                                    aplicarATodosLosDias={seleccionarTodoElMes}
                                    aplicarProgramacionMasiva={aplicarProgramacionMasiva}
                                    idEntidad={contexto.idEntidad}
                                    idServ={(id) => {  setIdServicio(id)}} // Solo actualiza el ID
                                    desServ={(txt) => setDescripcionServicio(txt)}    
                                    idServicio={idServicio}                            
                                />
                            </div>
                        )}

                        <div className={`col-12 ${modoMasivo ? 'col-lg-9' : 'col-lg-12'} transition-all duration-300`}>
                            <div className="bg-white rounded-4 shadow-sm border border-light-subtle overflow-hidden">
                                <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-white">
                                    <h2 className="h4 fw-bold text-dark mb-0">
                                        {datosCalendario.nombreMes} <span className="text-primary">{datosCalendario.año}</span>
                                    </h2>
                                    <div className="d-flex gap-2">
                                        <button onClick={irMesAnterior} className="btn btn-outline-light text-dark border-secondary-subtle rounded-3 p-2 hover:bg-light">
                                            <Icono nombre="ChevronLeft" size={20}/>
                                        </button>
                                        <button onClick={irMesSiguiente} className="btn btn-outline-light text-dark border-secondary-subtle rounded-3 p-2 hover:bg-light">
                                            <Icono nombre="ChevronRight" size={20}/>
                                        </button>
                                    </div>
                                </div>

                                <div className="calendar-grid text-center small fw-bold bg-slate-50 border-bottom">
                                    {DIAS_SEMANA.map(dia => (
                                        <div key={dia} className="py-3 text-secondary text-uppercase tracking-wider" style={{fontSize: '0.7rem'}}>{dia}</div>
                                    ))}
                                </div>
                                <div className="calendar-grid">
                                    {datosCalendario.celdas}
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                
                <ModalEditorTurnos
                    estaAbierto={modalAbierto}
                    claveDia={diaSeleccionadoParaEdicion}
                    alCerrar={() => setModalAbierto(false)}
                    horario={horarioCalendario}
 //                   setHorario={setHorarioCalendario}
 //                   alGuardar={manejarGuardado} 
                    alGuardar={async (nuevoHorarioDelDia) => {
                        const exito = await manejarGuardado(nuevoHorarioDelDia);
                        if (exito) { setModalAbierto(false); }
                    }}                   
                    idEntidad={contexto.idEntidad}
                    idServ={(id) => {  setIdServicio(id)}} // Solo actualiza el ID
                    desServ={(txt) => setDescripcionServicio(txt)}                                
                />
            </div>
     
        </>
    );
};



