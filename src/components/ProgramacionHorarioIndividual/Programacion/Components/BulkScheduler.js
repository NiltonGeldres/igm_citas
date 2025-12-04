import { SHIFTS_DATA } from "../Data/Data";
import { Icon } from "./Icon";

/**
 * Panel para la programación masiva de turnos.
 */
const BulkScheduler = ({ selectedShifts, toggleShift, applyToAllDays, applyBulkSchedule }) => {
    const isApplyDisabled = selectedShifts.length === 0;

    return (
        <div className="card shadow-lg p-4 border-0 h-fit mb-4 mb-lg-0">
            <h3 className="h5 fw-bold text-dark mb-3 border-bottom pb-2">Programación Masiva</h3>
            
            <p className="fw-semibold text-secondary mb-2 small">1. Selecciona Turnos:</p>
            <div className="d-grid gap-2 mb-4">
                {SHIFTS_DATA.map(shift => {
                    const isSelected = selectedShifts.includes(shift.id);
                    return (
                        <div
                            key={shift.id}
                            onClick={() => toggleShift(shift.id)}
                            className={`p-3 rounded-3 cursor-pointer transition ${
                                isSelected
                                    ? 'bg-primary-subtle border border-primary text-primary fw-bold'
                                    : 'bg-light border border-secondary-subtle hover-bg-light-subtle'
                            } d-flex justify-content-between align-items-center`}
                        >
                            <span className="small">{shift.name} ({shift.time})</span>
                            {isSelected && <Icon name="CheckCircle" className="text-primary" style={{width: '18px', height: '18px'}} />}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 d-grid gap-2">
                <button
                    onClick={applyToAllDays}
                    className="btn btn-outline-info btn-sm fw-semibold"
                >
                    Seleccionar Todos los 30 Días
                </button>
                <button
                    onClick={applyBulkSchedule}
                    disabled={isApplyDisabled}
                    className="btn btn-success fw-bold shadow-sm"
                >
                    Aplicar Programación ({selectedShifts.length} turnos)
                </button>
            </div>
        </div>
    );
};


export default BulkScheduler;