import  { useState, useCallback, useMemo, useEffect, Box} from 'react';
import { Icono } from "../ProgramacionHorarioIndividual/Programacion/Components/Icono.js";
import BarraFiltros from "../ProgramacionHorarioIndividual/Programacion/Components/BarraFiltros.js";
import ProgramadorMasivo from "../ProgramacionHorarioIndividual/Programacion/Components/ProgramadorMasivo.js";
import CeldaCalendario from "../ProgramacionHorarioIndividual/Programacion/Components/CeldaCalendario.js";
import ModalEditorTurnos from "../ProgramacionHorarioIndividual/Programacion/Components/ModalEditorTurnos.js";
import ESTILOS_PERSONALIZADOS from './ESTILOS_PERSONALIZADOS.js';
import {MESES_ES} from "./Programacion/Constants/MESES_ES.js"
import {DIAS_SEMANA} from "./Programacion/Constants/DIAS_SEMANA.js"
import TurnoService from "../Turno/TurnoService.js";
import { cargarConfiguracionTurnos, MAPEO_TURNOS } from "./Programacion/Data/CargarConfiguracionTurnos.js";
import ProgramacionHorarioIndividualService from "../ProgramacionHorarioIndividual/ProgramacionMedicaIndividualService.js";
import { actualizarTurnoEnDia } from "../ProgramacionHorarioIndividual/Programacion/Modelos/ProgramacionHorarioDiaModelo.js";
import { modelarCrearProgramacion ,modelarDia} from "../ProgramacionHorarioIndividual/Programacion/Modelos/ProgramacionHorarioDiaModelo.js";
import Especialidad from "../Especialidad/Especialidad.js"
import Servicio from "../Servicio/Servicio.js"



export default function ProgramacionHorarioIndividual() {
    
    const [fechaActual, setFechaActual] = useState(new Date()); 
    const [horarioCalendario, setHorarioCalendario] = useState({}); 
    const [estadoGuardado, setEstadoGuardado] = useState(null);
    const [modoMasivo, setModoMasivo] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [diaSeleccionadoParaEdicion, setDiaSeleccionadoParaEdicion] = useState(null);
    const [turnosMasivosSeleccionados, setTurnosMasivosSeleccionados] = useState([]);
    const [diasMasivosSeleccionados, setDiasMasivosSeleccionados] = useState([]);
    const [datosOriginalesBackend, setDatosOriginalesBackend] = useState([]);
    
    const [idEntidad, setIdEntidad] = useState(''); 
    const [descripcionEntidad, setDescipcionEntidad] = useState(""); 
    const [idEspecialidad, setIdEspecialidad] = useState(''); 
    const [descripcionEspecialidad, setDescripcionEspecialidad] = useState(""); 
    const [idServicio, setIdServicio] = useState(""); 
    const [descripcionServicio, setDescripcionServicio] = useState(""); 

    const [turnosCargados, setTurnosCargados]  = useState([]);
    const [envoltorioOriginal, setEnvoltorioOriginal] = useState([]);
    const [nombreMedico, setNombreMedico] = useState('');
    const [idEspSeleccionada, setIdEspSeleccionada] = useState(null);
//    const [idServSeleccionado, setIdServSeleccionado] = useState(null);
    
    useEffect(() => {
        TurnoService.getTodos().then(res => {
            cargarConfiguracionTurnos(res.data);
            const turnosParaEstado = Object.values(MAPEO_TURNOS);
            setTurnosCargados(turnosParaEstado);        });
    }, []);


    // Se carga/actualiza cada vez que cambie la especialidad, el servicio o el mes
    const contexto = useMemo(() => {
        const perfil = JSON.parse(sessionStorage.getItem('user_profile'));
        return {
            // Datos del Login (JWT)
            idEntidad: perfil?.idEntidad,
            idMedico: perfil?.idMedico,
            usuarioNombres: perfil?.usuarioNombres,
            
            // Datos de la Selección Actual (Tus componentes independientes)
            idEspecialidad: idEspecialidad,
            nombreEspecialidad: descripcionEspecialidad,
            idServicio: idServicio,
            nombreServicio: descripcionServicio,
            
            // Datos del Calendario
            mes: fechaActual.getMonth() + 1,
            anio: fechaActual.getFullYear()
        };
    }, [idEspecialidad, idServicio, fechaActual]);

    //...............................................................................
    const cargarProgramacionCompleta = useCallback(async () => {
/*        const mes = contextofechaActual.getMonth() + 1;
        const anio = fechaActual.getFullYear();
        const idEspecialidad = 9; 
        const idMedico = 1762; 
 */       
        const mes = contexto.mes;
        const anio = contexto.anio;
        const idEspecialidad = contexto.idEspecialidad; 
        const idMedico = contexto.idMedico; 
        
        setEstadoGuardado('cargando');

        try {
            // 1. INTENTO PRIMARIO: Cargar programación existente
            // (Asumo que tienes un service para obtener lo ya guardado)
            let res = await ProgramacionHorarioIndividualService.obtenerProgramacionMesUsuario(
                mes, anio, idEspecialidad
            );

            // 2. FALLBACK: Si el backend devuelve 200 pero la lista está vacía, pedimos el "Blanco"
            // Nota: Ajusta 'programacionMedicaDiaResponse' según el nombre exacto de tu API de consulta
            if (!res.data.programacionMedicaDiaResponse?.length) {
                res = await ProgramacionHorarioIndividualService.obtenerProgramacionMesBlanco(
                    mes, anio, idEspecialidad, idMedico
                );
            }

            // 3. PROCESAMIENTO ÚNICO (Para ambos casos)
            // Axios -> Wrapper Java (.data) -> Objeto con lista (.data)
            const envoltorioBack = res.data; 
            const listaRaw = envoltorioBack?.programacionMedicaDiaResponse;

            if (envoltorioBack && Array.isArray(listaRaw)) {
                setEnvoltorioOriginal(envoltorioBack);

                const modelosProcesados = listaRaw.map(item => modelarDia(item));
                setDatosOriginalesBackend(modelosProcesados);

                const mapaParaUI = modelosProcesados.reduce((acc, dia) => {
                    const clave = dia.getClaveCalendario();
                    // Si idTurno es 0, es 'libre'. Si tiene ID (ej: 1, 2), se guarda como string.
                    acc[clave] = (dia.idTurno && dia.idTurno !== 0) ? [String(dia.idTurno)] : ['libre'];
                    return acc;
                }, {});

                setHorarioCalendario(mapaParaUI);
                console.log("Programación cargada y sincronizada:", envoltorioBack);
            }

        } catch (error) {
            console.error("Error fatal en el flujo de carga:", error);
            // Opcional: Podrías setear un estado de error para mostrar un mensaje al usuario
        } finally {
            setEstadoGuardado(null);
        }
    }, [fechaActual]);

    // Disparador automático al cambiar de mes/año
    useEffect(() => {
        if (contexto.idMedico && contexto.idEspecialidad && contexto.idServicio) {
        cargarProgramacionCompleta();
        }
    }, [contexto, cargarProgramacionCompleta]);


    //...............................................................................
    // Guardado de datos
    const manejarGuardado = useCallback(async (horarioActualizado = null) => {
        setEstadoGuardado('guardando');

        try {
            // La fuente de datos es lo que el usuario ve ahora (Mayo)
            const fuenteDeDatos = horarioActualizado || horarioCalendario;
            
            // Mapeamos usando la "foto" de los datos originales
            const diasConTurnos = datosOriginalesBackend.map(dia => {
                const clave = dia.getClaveCalendario();
                const seleccion = fuenteDeDatos[clave];
                const nuevoIdTurno = (seleccion && seleccion[0] !== 'libre') ? Number(seleccion[0]) : 0;
                
                // Retorna un objeto nuevo con el ID actualizado (idProgramacion se mantiene si existía)
                return actualizarTurnoEnDia(dia, nuevoIdTurno);
            });

            // El payload necesita el contexto actual (Médico, Especialidad, Sede)
            const payloadFinal = modelarCrearProgramacion(contexto, diasConTurnos);

            const response = await ProgramacionHorarioIndividualService.crearProgramacionMesUsuario(payloadFinal);
            
            if (response.status === 200) {
                // REFRESH: Llamamos a la versión actual de la función de carga
                await cargarProgramacionCompleta(); 
                setEstadoGuardado('guardado');
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            setEstadoGuardado('error');
        } finally {
            // Limpiamos el feedback visual
            setTimeout(() => setEstadoGuardado(null), 3000);
        }
        // Agregamos 'contexto' porque si cambias de médico, la función debe renovarse
    }, [horarioCalendario, datosOriginalesBackend, cargarProgramacionCompleta, contexto]);
// ^ Importante agregar cargarProgramacionCompleta a las dependencias
//.........................................


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

    const aplicarProgramacionMasiva = useCallback(() => {
        if (diasMasivosSeleccionados.length === 0 || turnosMasivosSeleccionados.length === 0) return;
        const nuevoHorario = { ...horarioCalendario };
        const turnosAAplicar = turnosMasivosSeleccionados.length === 0 ? ['libre'] : turnosMasivosSeleccionados;
        diasMasivosSeleccionados.forEach(clave => { nuevoHorario[clave] = turnosAAplicar; });
        setHorarioCalendario(nuevoHorario);
        manejarGuardado(nuevoHorario);
        setTurnosMasivosSeleccionados([]);
        setDiasMasivosSeleccionados([]);
        alternarModoMasivo();
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
        console.log("Clave Hoy ===> "+claveHoy);
        for (let i = 0; i < offsetInicio; i++) {
            celdas.push(<CeldaCalendario key={`vacia-${i}`} dia={null} />);
        }
        for (let d = 1; d <= diasEnMes; d++) {
            const dPadded = String(d).padStart(2, '0');
            const mPadded = String(mes + 1).padStart(2, '0');
            const clave = `${año}-${mPadded}-${dPadded}`;
            const turnos = horarioCalendario[clave];
            const tieneDatos = turnos && turnos.length > 0 && !(turnos.length === 1 && turnos[0] === 'libre');
            celdas.push(
                <CeldaCalendario
                    key={clave}
                    dia={d}
                    claveFecha={clave}
                    esHoy={clave === claveHoy}
                    tieneHorario={tieneDatos}
                    estaSeleccionadoMasivo={diasMasivosSeleccionados.includes(clave)}
                    manejarClickDia={manejarClickDia}
                    horario={horarioCalendario}
                />
            );
        }
        return { celdas, nombreMes: MESES_ES[mes], año };
    }, [fechaActual, diasMasivosSeleccionados, horarioCalendario, manejarClickDia]);

    const handleEspecialidadChange = (id, texto) => {
        setIdEspecialidad(id);
        if (texto) setDescripcionEspecialidad(texto);
            setIdServicio(null); 
            setDescripcionServicio("");
    }
    
    const listoParaProgramar = idEspecialidad && idServicio;

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
                                textEspecialidad={(txt) => setDescripcionEspecialidad(txt)}                                />
                        </div>           
                
                        <div className='mb-1' style={{width:400}}>
                                <Servicio    
                                    idEntidad={contexto.idEntidad} // Viene de tu perfil/contexto
                                    valueServicio={(id) => setIdServicio(id)} // Solo actualiza el ID
                                    textServicio={(txt) => setDescripcionServicio(txt)}                                
                                />
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
                    setHorario={setHorarioCalendario}
                    alGuardar={manejarGuardado} 
                />
            </div>
     
        </>
    );
};

