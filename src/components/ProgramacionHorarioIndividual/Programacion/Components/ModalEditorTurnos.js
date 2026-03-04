// ModalEditorTurnos.js 

import { useState, useEffect } from "react";
import { Icono } from './Icono';
import { obtenerListaTurnos } from '../Constants/TODOS_LOS_TURNOS';
import Servicio from "../../../Servicio/Servicio";


const ModalEditorTurnos = ({ estaAbierto, claveDia, alCerrar, horario, setHorario, alGuardar,idEntidad,idServ,desServ }) => {
    const turnosIniciales = horario[claveDia] || ['libre'];
    const [idsTurnosSeleccionados, setIdsTurnosSeleccionados] = useState(turnosIniciales);
    const diaActual = new Date(claveDia + 'T00:00:00').getDate();
    //  Carga de Turnos
    const listaDeTurnos = obtenerListaTurnos();

    useEffect(() => {
        if (claveDia) {
            setIdsTurnosSeleccionados(horario[claveDia] ? [...horario[claveDia]] : ['libre']);
        }
    }, [claveDia, horario]);


    if (!estaAbierto || !claveDia) return null;

const turnoActualObj = listaDeTurnos.find(t => String(t.idTurno) === String(idsTurnosSeleccionados[0]));

    const seleccionarTurnoUnico = (turnoId) => {
    // Si el médico hace clic en el que ya está seleccionado, lo desmarcamos (pasa a libre)
    // Si hace clic en uno nuevo, reemplazamos el anterior
    const nuevosSeleccionados = idsTurnosSeleccionados.includes(turnoId) 
        ? ['libre'] 
        : [turnoId];
    
    setIdsTurnosSeleccionados(nuevosSeleccionados);
};

    const confirmarSeleccionDia = () => {
        if (!claveDia) return; // Supervivencia: si no hay clave, no guardes nada
        const idsFinales = idsTurnosSeleccionados.length > 0 ? idsTurnosSeleccionados : ['libre'];

        // 1. Actualizamos el mapa visual { "2026-02-12": ["1"] }
        const nuevoHorario = { ...horario, [claveDia]: idsFinales };
        setHorario(nuevoHorario);
        
        // 2. Notificamos al padre (si existe la prop alGuardar)
        if (alGuardar) alGuardar(nuevoHorario); 
        
        alCerrar();
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
                                    idEntidad={idEntidad} // Viene de tu perfil/contexto
                                    valueServicio={(id) => {  idServ(id)}} // Solo actualiza el ID
                                    textServicio={(txt) =>    desServ(txt)}                                
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


/*
    const alternarTurno = (turnoId) => {
        if (turnoId === 'libre') {
            setIdsTurnosSeleccionados(['libre']);
        } else {
            setIdsTurnosSeleccionados(prev => {
                const filtrados = prev.filter(id => id !== 'libre');
                if (filtrados.includes(turnoId)) {
                    const nuevosIds = filtrados.filter(id => id !== turnoId);
                    return nuevosIds.length > 0 ? nuevosIds : ['libre']; 
                } else {
                    return [...filtrados, turnoId];
                }
            });
        }
    };
*/

/*

                        <div className="mb-4">
                            <select 
                                className={`form-select form-select-lg fw-bold transition-all ${
                                    turnoActualObj?.claseColor || 'bg-light text-secondary border'
                                }`}
                                value={idsTurnosSeleccionados[0] || 'libre'}
                                onChange={(e) => seleccionarTurnoUnico(e.target.value)}
                                style={{ minHeight: '60px', borderRadius: '12px' }}
                            >
                                <option value="libre" className="bg-white text-dark">-- Día Libre --</option>
                                {listaDeTurnos.map(turno => (
                                    <option 
                                        key={turno.idTurno} 
                                        value={turno.idTurno}
                                        className="bg-white text-dark"
                                    >
                                        {turno.descripcion} ({turno.hora})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {turnoActualObj && idsTurnosSeleccionados[0] !== 'libre' && (
                            <div className={`p-3 rounded-3 border d-flex align-items-center gap-3 animate__animated animate__fadeIn`}>
                                <div className={`p-2 rounded-circle bg-white text-primary shadow-sm`}>
                                    <Icono nombre="Clock" size={20} />
                                </div>
                                <div>
                                    <div className="fw-bold">{turnoActualObj.descripcion}</div>
                                    <div className="small opacity-75">{turnoActualObj.hora}</div>
                                </div>
                            </div>
                        )}
                    </div>

*/