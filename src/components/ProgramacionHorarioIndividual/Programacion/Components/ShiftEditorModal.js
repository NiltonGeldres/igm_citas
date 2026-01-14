import { useState, useEffect } from "react";
import { Icon } from './Icon';
import { ALL_SHIFTS } from '../Constants/ALL_SHIFTS';
import TurnoService from "../../../Turno/TurnoService";
import AuthService from "../../../Login/services/auth.service";
import { useNavigate } from "react-router-dom";

const ShiftEditorModal = ({ isOpen, dayKey, onClose, schedule, setSchedule, onSave }) => {
    const [selectedShiftIds, setSelectedShiftIds] = useState(initialShifts);
    if (!isOpen || !dayKey) return null;

    const currentDay = new Date(dayKey).getDate();
    
    const initialShifts = schedule[dayKey] || ['free'];

    // Asegura que el estado interno se actualice si el día cambia mientras el modal está abierto
    React.useEffect(() => {
        if (dayKey) {
            const dayShifts = schedule[dayKey] ? [...schedule[dayKey]] : ['free'];
            setSelectedShiftIds(dayShifts);
        }
    }, [dayKey, schedule]);

    // Función para manejar la selección/deselección de un turno
    const toggleShift = (shiftId) => {
        if (shiftId === 'free') {
            setSelectedShiftIds(prev => (prev.includes('free') && prev.length === 1) ? [] : ['free']);
        } else {
            setSelectedShiftIds(prev => {
                const filtered = prev.filter(id => id !== 'free');
                if (filtered.includes(shiftId)) {
                    const newIds = filtered.filter(id => id !== shiftId);
                    return newIds.length > 0 ? newIds : ['free']; 
                } else {
                    return [...filtered, shiftId];
                }
            });
        }
    };

    // Manejador del botón Guardar (Actualiza el estado local y llama a onSave)
    const handleSave = () => {
        const finalIds = selectedShiftIds.length > 0 
            ? selectedShiftIds.filter(id => id !== 'free').length > 0 
                ? selectedShiftIds.filter(id => id !== 'free') 
                : ['free'] 
            : ['free'];
        
        // 1. Crear el nuevo objeto de horario completo
        const newSchedule = { 
            ...schedule, 
            [dayKey]: finalIds
        };

        // 2. Actualizar estado local 
        setSchedule(newSchedule);
        
        // 3. Llamar a la función de guardado (que ahora solo actualiza el estado)
        onSave(newSchedule);
        
        onClose();
    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow-lg">
                    <div className="modal-header bg-primary text-white border-0 rounded-top-4">
                        <h5 className="modal-title d-flex align-items-center">
                            <Icon name="CalendarCheck" className="me-2" style={{width: '20px', height: '20px'}} />
                            Editar Turnos - Día {currentDay}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
                    </div>

                    <div className="modal-body p-4">
                        <p className="text-secondary small mb-3">
                            Selecciona los turnos disponibles para el día **{currentDay}**.
                        </p>
                        
                        <div className="d-grid gap-3">
                            {ALL_SHIFTS.map(shift => {
                                const isSelected = selectedShiftIds.includes(shift.id);
                                return (
                                    <button
                                        key={shift.id}
                                        onClick={() => toggleShift(shift.id)}
                                        className={`
                                            btn text-start d-flex justify-content-between align-items-center
                                            ${isSelected ? 'btn-success fw-bold shadow-sm border-2' : 'btn-outline-secondary'}
                                        `}
                                    >
                                        <div>
                                            {shift.name} 
                                            <span className="badge rounded-pill text-bg-light ms-2 text-secondary">{shift.time}</span>
                                        </div>
                                        {isSelected && <Icon name="CheckCircle" style={{width: '20px', height: '20px'}}/>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="modal-footer bg-light border-0 rounded-bottom-4">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="btn btn-primary d-flex align-items-center"
                            disabled={selectedShiftIds.length === 0}
                        >
                            <Icon name="Save" className="me-2" style={{width: '20px', height: '20px'}}/>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftEditorModal;
/*
                            {posts.map(turno => {
                                const isSelected = selectedShiftIds.includes(turno.id);
                                return (
                                    <button
                                        key={turno.id}
                                        onClick={() => toggleShift(turno.idTurno)}
                                        className={`
                                            btn text-start d-flex justify-content-between align-items-center
                                            ${isSelected ? 'btn-success fw-bold shadow-sm border-2' : 'btn-outline-secondary'}
                                        `}
                                    >
                                        <div>
                                            {turno.descripcion} 
                                            <span className="badge rounded-pill text-bg-light ms-2 text-secondary">{turno.horainicio}</span>
                                        </div>
                                        {isSelected && <Icon name="CheckCircle" style={{width: '20px', height: '20px'}}/>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    */


/*
    //  Carga de Turnos
            useEffect(() => {
                LoadData() ;
        }, []);

                const LoadData = ()=>{
                    setLoading(true);
                        TurnoService.getTodos()
                        .then((response) => {
                            console.log("TURNOS  "+JSON.stringify(response) );                    
                            console.log("TURNOS 2 "+JSON.stringify(response.data) );                    
                            setPosts(response.data);

                    setLoading(false);
                    },(error) => {
                        console.log("Turno PostService Error page", error.response);
                        if (error.response && error.response.status === 403) {
                            AuthService.logout();
                            navigate("/login");
                            window.location.reload();
                        }
                    });
            };    
            
*/
