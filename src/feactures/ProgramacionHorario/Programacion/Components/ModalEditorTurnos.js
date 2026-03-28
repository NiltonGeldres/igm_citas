// ModalEditorTurnos.js 

import { useState, useEffect } from "react";
import { Icono } from './Icono';
import { obtenerListaTurnos } from '../Constants/TODOS_LOS_TURNOS';
import Servicio from "../../../../shared/components/Servicio";

//const ModalEditorTurnos = ({ estaAbierto, claveDia, alCerrar, horario, setHorario, alGuardar,idEntidad,idServ,desServ }) => {
const ModalEditorTurnos = ({ estaAbierto, claveDia, alCerrar, horario,  alGuardar, idEntidad, idServ, desServ }) => {    
// 1. Extraemos de forma segura el turno y servicio actual del objeto o array
    const dataActual = horario[claveDia];
    const idTurnoInicial = dataActual?.idTurno || (Array.isArray(dataActual) ? dataActual[0] : 'libre');
    const idServicioInicial = dataActual?.idServicio || "";

    // Estados locales del modal
    const [idsTurnosSeleccionados, setIdsTurnosSeleccionados] = useState([idTurnoInicial]);
    const [servicioIdLocal, setServicioIdLocal] = useState(idServicioInicial);

    const diaActual = new Date(claveDia + 'T00:00:00').getDate();
    const listaDeTurnos = obtenerListaTurnos();

    //const turnosIniciales = horario[claveDia] || ['libre'];
    //const [idsTurnosSeleccionados, setIdsTurnosSeleccionados] = useState(turnosIniciales);
    //const diaActual = new Date(claveDia + 'T00:00:00').getDate();
    //  Carga de Turnos
    //const listaDeTurnos = obtenerListaTurnos();

    useEffect(() => {
            const d = horario[claveDia];
            // En lugar de [...d], extraemos el valor específico
            const t = d?.idTurno || (Array.isArray(d) ? d[0] : 'libre');
            const s = d?.idServicio || "";
            
            setIdsTurnosSeleccionados([t]);
            setServicioIdLocal(s);
       /* if (claveDia) {
            setIdsTurnosSeleccionados(horario[claveDia] ? [...horario[claveDia]] : ['libre']);
        }*/
    }, [claveDia, horario, estaAbierto]);


    if (!estaAbierto || !claveDia) return null;

    const turnoActualObj = listaDeTurnos.find(t => String(t.idTurno) === String(idsTurnosSeleccionados[0]));

    const seleccionarTurnoUnico = (turnoId) => {
        const nuevosSeleccionados = idsTurnosSeleccionados.includes(turnoId) 
                    ? ['libre'] 
                    : [turnoId];
                setIdsTurnosSeleccionados(nuevosSeleccionados);        
    // Si el médico hace clic en el que ya está seleccionado, lo desmarcamos (pasa a libre)
    // Si hace clic en uno nuevo, reemplazamos el anterior
    /*const nuevosSeleccionados = idsTurnosSeleccionados.includes(turnoId) 
        ? ['libre'] 
        : [turnoId];
    
    setIdsTurnosSeleccionados(nuevosSeleccionados);*/
};

    const confirmarSeleccionDia = () => {
        if (!claveDia) return;
        
        const turnoFinal = idsTurnosSeleccionados[0] || 'libre';

        // 3. ESTRUCTURA DE GUARDADO: Guardamos como objeto para soportar el código de servicio
        const nuevoHorario = { 
            ...horario, 
            [claveDia]: { 
                idTurno: turnoFinal, 
                idServicio: servicioIdLocal 
            } 
        };
//        setHorario(nuevoHorario);
        if (alGuardar) alGuardar(nuevoHorario); 
        alCerrar()
    };

    
    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-2xl animate-in zoom-in duration-200">
                    <div className="modal-header bg-primary text-white border-0 rounded-top-4 p-4">
                        <h5 className="modal-title d-flex align-items-center fw-bold">
                            <Icono nombre="CalendarCheck" className="me-2" />
                            Editar Día {diaActual}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={alCerrar}></button>
                    </div>

                    <div className="modal-body p-4">
                       <h5 className="h6 fw-bold mb-3 text-dark">1. Selecciona Consultorios:</h5>
                        <div className="d-grid gap-3 mb-4 ">
                            <Servicio    
                                idEntidad={idEntidad}
                                value={servicioIdLocal} 
                                valueServicio={(id) => { setServicioIdLocal(id);
                                                         idServ(id);
                                                        }}
                                textServicio={(txt) => desServ(txt)}                                
                            />                             
                        </div>
                        <h5 className="h6 fw-bold mb-3 text-dark">2. Selecciona Turnos:</h5>
                        <div className="d-grid gap-3">
                            {listaDeTurnos.map(turno => {
                                const estaSeleccionado = idsTurnosSeleccionados.includes(turno.idTurno);
                                return (
                                        <button 
                                            onClick={() => seleccionarTurnoUnico(turno.idTurno)}
                                                className={`btn p-3 d-flex justify-content-between align-items-center fw-bold transition-all border-2 
                                            ${estaSeleccionado 
                                                ? `${turno.claseColor} border-white shadow` 
                                                : 'btn-outline-light text-dark border-secondary-subtle hover-light'
                                            }`}
                                        style={{ borderRadius: '12px' }}
                                        >
                                        <div>
                                            {turno.descripcion}
                                            <span className="badge rounded-pill text-bg-light ms-2 text-secondary">{turno.hora}</span>
                                        </div>

                                        </button>                                    
                                );
                            })}
                        </div>

                    </div>
                    
                    <div className="modal-footer bg-light border-0 rounded-bottom-4 p-3">
                        <button type="button" className="btn btn-link text-secondary text-decoration-none fw-bold" onClick={alCerrar}>Cancelar</button>
                        <button type="button" onClick={confirmarSeleccionDia} className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2">
                            <Icono nombre="Save" size={18}/>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ModalEditorTurnos;

