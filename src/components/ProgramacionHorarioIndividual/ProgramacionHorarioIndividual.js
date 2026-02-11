//src/components/ProgramacionHorarioIndividual/ProgramacionHorarioIndividual.js
//import { cargarConfiguracionTurnos } from './Programacion/Data/CargarConfiguracionTurnos.js';
//import { TODOS_LOS_TURNOS } from "../ProgramacionHorarioIndividual/Programacion/Constants/TODOS_LOS_TURNOS.js";
//import { TODOS_LOS_TURNOS } from "../ProgramacionHorarioIndividual/Programacion/Constants/TODOS_LOS_TURNOS.js";
//import { MONTHS_ES, WEEKDAYS, ALL_SHIFTS, SHIFT_MAPPING, firebaseConfig, appId, initialAuthToken} from "../ProgramacionHorarioIndividual/Programacion/Data/Constants.js"
//import { MONTHS_ES} from "../ProgramacionHorarioIndividual/Programacion/Data/Constants.js"
//import { CalendarCheck, ChevronLeft, ChevronRight, X, PlusCircle, Clock, CheckCircle } from 'lucide-react';

// Importaciones de subcomponentes (Manteniendo rutas originales para simular la estructura)

import  { useState, useCallback, useMemo, useEffect } from 'react';
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
import { crearProgramacionHorarioDia, mapearListaAUI } from "../ProgramacionHorarioIndividual/Programacion/Modelos/ProgramacionHorarioDiaModelo.js";




export default function ProgramacionHorarioIndividual() {
    
    const [fechaActual, setFechaActual] = useState(new Date()); 
    const [horarioCalendario, setHorarioCalendario] = useState({}); 
    const [estadoGuardado, setEstadoGuardado] = useState(null);

    const [modoMasivo, setModoMasivo] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [diaSeleccionadoParaEdicion, setDiaSeleccionadoParaEdicion] = useState(null);
    const [turnosMasivosSeleccionados, setTurnosMasivosSeleccionados] = useState([]);
    const [diasMasivosSeleccionados, setDiasMasivosSeleccionados] = useState([]);
    const [turnosCargados, setTurnosCargados]  = useState([]);
    const [datosOriginalesBackend, setDatosOriginalesBackend] = useState([]);

            // Estado para simular la programación actual de turnos en el calendario (Day: [Shift IDs])
            /*const [calendarSchedule, setCalendarSchedule] = useState({
                '3': ['morning', 'afternoon'],
                '15': ['morning', 'afternoon', 'evening'],
            });*/

    useEffect(() => {
        TurnoService.getTodos().then(res => {
            cargarConfiguracionTurnos(res.data);
            const turnosParaEstado = Object.values(MAPEO_TURNOS);
            setTurnosCargados(turnosParaEstado);        });
    }, []);

    //  console.log("todos los turnos fuera Useffec:  "+JSON.stringify(TODOS_LOS_TURNOS))
  /*  const guardarHorario = useCallback((datosNuevos) => {
        console.log("GUARDAR ===> "+JSON.stringify(datosNuevos));
        setEstadoGuardado('guardando');
        setTimeout(() => {
            setEstadoGuardado('guardado');
            setTimeout(() => setEstadoGuardado(null), 2000);
        }, 600);
    }, []);
*/
    //...............................................................................
    const cargarProgramacionCompleta = useCallback(async () => {
        // 1. Preparar parámetros (estos vendrían de tus estados de filtros)
        const mes = fechaActual.getMonth() + 1;
        const anio = fechaActual.getFullYear();
        const idEspecialidad = 9; // id de ejemplo
        const idMedico = 1762;    // id de 
        
        console.log("DATA BLANCO cargarProgramacionCompleta   "+ mes+anio)

        setEstadoGuardado('guardando ');

        try {
            // 2. Llamada al Service
            const res = await ProgramacionHorarioIndividualService.getProgramacionMedicoMesBlanco(
                mes, anio, idEspecialidad, idMedico
            );
              console.log("DATA BLANCO "+JSON.stringify(res))

            if (res.data && Array.isArray(res.data)) {
                // 3. TRANSFORMACIÓN A MODELOS (La clave del éxito)
                // Convertimos cada objeto plano del JSON en un "Modelo Funcional"
                console.log("DATA BLANCO "+JSON.stringify(res.data))
                const modelosProcesados = res.data.map(item => crearProgramacionHorarioDia(item));

                // 4. ACTUALIZAR ESTADOS
                // Guardamos la lista completa de modelos (los 31 días)
                setDatosOriginalesBackend(modelosProcesados);

                // Generamos el mapa visual para el calendario { "2026-05-01": ["1"] }
                const mapaParaUI = mapearListaAUI(res.data);
                setHorarioCalendario(mapaParaUI);
                
                console.log("Datos cargados y modelados correctamente.");
            }
        } catch (error) {
            console.error("Error al obtener la programación del médico:", error);
        } finally {
            setEstadoGuardado(null);
        }
    }, [fechaActual]); 

    // Disparador automático al cambiar de mes/año
    useEffect(() => {
        cargarProgramacionCompleta();
    }, [cargarProgramacionCompleta]);

    const prepararDatosParaEnvio = (horarioUI, plantillaOriginal) => {
        // Recorremos la plantilla original (los 31 días que el backend nos envió)
        return plantillaOriginal.map(diaOriginal => {
            // 1. Obtenemos la clave de este día (ej: "2026-05-01")
            const clave = diaOriginal.getClaveCalendario();
            // 2. Buscamos qué seleccionó el usuario en el calendario de React
            const seleccionUI = horarioUI[clave]; // Devuelve ['1'], ['2'] o ['libre']
            // 3. Determinamos el ID del turno (0 si es libre)
            const nuevoIdTurno = (seleccionUI && seleccionUI[0] !== 'libre') 
                ? seleccionUI[0] 
                : 0;
            // 4. Usamos nuestro "Setter Inmutable" para crear el objeto actualizado
            const diaActualizado = actualizarTurnoEnDia(diaOriginal, nuevoIdTurno);
            // 5. IMPORTANTE: El backend no necesita la función 'getClaveCalendario'
            // Extraemos solo los datos puros (data transfer object)
            const { getClaveCalendario, ...datosLimpios } = diaActualizado;
            return datosLimpios;
        });
    };

    const guardarHorario = useCallback(async () => {
        setEstadoGuardado('guardando');
        try {
            // Generamos el array final de 31 objetos perfectamente modelados
            const datosFinales = prepararDatosParaEnvio(horarioCalendario, datosOriginalesBackend);

            console.log("JSON listo para la API:", datosFinales);
            // Llamada al servicio (POST / PUT)
            const respuesta = await ProgramacionHorarioIndividualService.guardarProgramacionMes(datosFinales);
            if (respuesta.status === 200) {
                setEstadoGuardado('guardado');
                // Opcional: Recargar datos del servidor para confirmar
                // cargarProgramacionExistente();
            }
        } catch (error) {
            console.error("Error al sincronizar con el backend:", error);
            setEstadoGuardado(null);
            alert("Hubo un error al guardar la programación.");
        } finally {
            // Quitamos el mensaje de "Guardado" después de 3 segundos
            setTimeout(() => setEstadoGuardado(null), 3000);
        }
    }, [horarioCalendario, datosOriginalesBackend]);
    //...............................................................................

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
/*
    const alternarTurnoMasivo = useCallback((turnoId) => {
        setTurnosMasivosSeleccionados(prev =>
            prev.includes(turnoId) ? prev.filter(id => id !== turnoId) : [...prev, turnoId]
        );
    }, []);
    */
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
        guardarHorario(nuevoHorario);
        setTurnosMasivosSeleccionados([]);
        setDiasMasivosSeleccionados([]);
        alternarModoMasivo();
    }, [diasMasivosSeleccionados, turnosMasivosSeleccionados, horarioCalendario, alternarModoMasivo, guardarHorario]);

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
                    </div>

                    <BarraFiltros />

                    <div className="row g-4">
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
                </div>
                
                <ModalEditorTurnos
                    estaAbierto={modalAbierto}
                    claveDia={diaSeleccionadoParaEdicion}
                    alCerrar={() => setModalAbierto(false)}
                    horario={horarioCalendario}
                    setHorario={setHorarioCalendario}
                    alGuardar={guardarHorario} 
                />
            </div>
        </>
    );
};

//export default ProgramacionHorarioPersonal:

/**
 // Dentro de export default function ProgramacionHorarioIndividual() { ...

// Función para obtener y formatear la data del servidor al estado del calendario
const cargarDatosPrevios = useCallback(async () => {
    setEstadoGuardado('guardando'); // Reutilizamos el estado para mostrar carga
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    const idEspecialidad = 1; // Obtener de tus filtros
    const idMedico = 1;       // Obtener de tu sesión o filtros
    try {
        const res = await ProgramacionHorarioIndividualService.getProgramacionMedicoMesBlanco(mes, anio, idEspecialidad, idMedico);
        if (res.data) {


            // Suponiendo que res.data viene en formato { "2024-05-01": ["turno1"], ... }
            // Si el JSON viene diferente, aquí debes mapearlo al formato de tu estado
            const dataConFormato = mapearAFormatoCalendario(res.data)
            setHorarioCalendario(dataConFormato);
        }
    } catch (error) {
        console.error("Error al cargar programación previa:", error);
    } finally {
        setEstadoGuardado(null);
    }
}, [fechaActual]);

const mapearAFormatoCalendario = (data) => {
    return data; 
}


// Efecto para cargar datos cada vez que la fecha (mes/año) cambia
useEffect(() => {
    cargarDatosPrevios();
}, [cargarDatosPrevios]);



// Actualizar la función guardarHorario para que sea real
const guardarHorario = useCallback(async (datosNuevos) => {
    setEstadoGuardado('guardando');
    
    try {
        // Aquí llamarías a tu servicio de GUARDADO (no al de carga "Blanco")
        // await ProgramacionService.guardar(datosNuevos);
        
        console.log("Datos a enviar:", datosNuevos);
        
        setEstadoGuardado('guardado');
        setTimeout(() => setEstadoGuardado(null), 2000);
    } catch (error) {
        setEstadoGuardado(null);
        alert("Error al guardar");
    }
}, []);

 */