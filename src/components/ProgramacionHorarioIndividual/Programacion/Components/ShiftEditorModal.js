import { SHIFTS_DATA } from "../Data/Data";
/**
 * Modal para editar individualmente los turnos de un día (usando estructura de Modal de Bootstrap).
 */
const ShiftEditorModal = ({ isOpen, day, onClose }) => {
    // Si no está abierto, devolvemos un elemento vacío
    if (!isOpen || day === null) return null;

    // La lógica del modal de Bootstrap se simula usando clases de posición fija
    return (
        <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow-lg border-0">
                    <div className="modal-header">
                        <h3 className="modal-title h5 fw-bold text-dark">Editar Turnos - Día {day}</h3>
                        <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p className="text-secondary">Aquí se editarían los turnos individualmente para el día **{day}**.</p>
                        
                        {/* Mock de opciones de edición */}
                        <div className="p-3 bg-light rounded-3">
                            <p className="fw-semibold small mb-2">Turnos Disponibles (Mock):</p>
                            <div className="d-grid gap-2">
                                {SHIFTS_DATA.map(shift => (
                                    <span key={shift.id} className={`badge text-capitalize p-2 ${shift.color}`}>{shift.name} - {shift.time}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-primary fw-semibold shadow-sm"
                        >
                            Guardar y Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftEditorModal;