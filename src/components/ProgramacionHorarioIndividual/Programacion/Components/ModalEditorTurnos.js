import { useState, useEffect } from "react";
import { Icono } from './Icono';
import { TODOS_LOS_TURNOS } from '../Constants/TODOS_LOS_TURNOS';
import TurnoService from "../../../Turno/TurnoService";
import AuthService from "../../../Login/services/auth.service";
import { useNavigate } from "react-router-dom";


const ModalEditorTurnos = ({ estaAbierto, claveDia, alCerrar, horario, setHorario, alGuardar }) => {
    const turnosIniciales = horario[claveDia] || ['libre'];
    const [idsTurnosSeleccionados, setIdsTurnosSeleccionados] = useState(turnosIniciales);
    

    const diaActual = new Date(claveDia + 'T00:00:00').getDate();

    useEffect(() => {
        if (claveDia) {
            setIdsTurnosSeleccionados(horario[claveDia] ? [...horario[claveDia]] : ['libre']);
        }
    }, [claveDia, horario]);

    if (!estaAbierto || !claveDia) return null;

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

    const manejarGuardado = () => {
        const idsFinales = idsTurnosSeleccionados.length > 0 ? idsTurnosSeleccionados : ['libre'];
        const nuevoHorario = { ...horario, [claveDia]: idsFinales };
        setHorario(nuevoHorario);
        alGuardar(nuevoHorario);
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
                        <p className="text-secondary small mb-4">Selecciona los turnos para este día:</p>
                        <div className="d-grid gap-3">
                            {TODOS_LOS_TURNOS.map(turno => {
                                const seleccionado = idsTurnosSeleccionados.includes(turno.id);
                                return (
                                    <button
                                        key={turno.id}
                                        onClick={() => alternarTurno(turno.id)}
                                        className={`btn text-start d-flex justify-content-between align-items-center p-3 rounded-3 transition-all ${seleccionado ? 'btn-success fw-bold shadow-sm border-2' : 'btn-outline-light text-dark border-secondary-subtle'}`}
                                    >
                                        <div>
                                            {turno.nombre} 
                                            <span className="badge rounded-pill bg-light text-secondary border ms-2" style={{fontSize: '0.7rem'}}>{turno.hora}</span>
                                        </div>
                                        {seleccionado && <Icono nombre="CheckCircle" size={20}/>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="modal-footer bg-light border-0 rounded-bottom-4 p-3">
                        <button type="button" className="btn btn-link text-secondary text-decoration-none fw-bold" onClick={alCerrar}>Cancelar</button>
                        <button type="button" onClick={manejarGuardado} className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2">
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