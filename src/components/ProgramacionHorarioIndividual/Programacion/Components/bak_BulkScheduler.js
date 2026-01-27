import { SHIFTS_DATA } from "../Data/Data";
import { Icon } from "./Icon";
import {ALL_SHIFTS} from "../Constants/ALL_SHIFTS"

// Componente para la programación masiva (Mock)
const BulkScheduler = ({ selectedShifts, toggleShift, applyToAllDays, applyBulkSchedule }) => {
    const selectedCount = selectedShifts.length;
    const isReadyToApply = selectedCount > 0;
    
    return (
        <div className="card shadow-lg bg-white h-100">
            <div className="card-header bg-primary text-white fw-bold">
                <Icon name="PlusCircle" className="me-2" style={{width: '20px', height: '20px'}} />
                Configurar Lote
            </div>
            <div className="card-body">
                <h5 className="h6 fw-bold mb-3 text-dark">1. Selecciona Turnos:</h5>
                <div className="d-grid gap-2">
                    {ALL_SHIFTS.map(shift => {
                        const isSelected = selectedShifts.includes(shift.id);
                        const baseClasses = "btn d-flex flex-column align-items-start fw-semibold text-start";
                        return (
                            <button
                                key={shift.id}
                                onClick={() => toggleShift(shift.id)}
                                className={`${baseClasses} ${isSelected ? 'btn-success shadow-sm' : 'btn-outline-secondary'}`}
                            >
                                {shift.name}
                                <span className="small opacity-75">{shift.time}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="d-grid gap-2 mt-4">
                    <h5 className="h6 fw-bold mb-3 text-dark">2. Seleccionar Días:</h5>
                    <button onClick={applyToAllDays} className="btn btn-outline-info btn-sm">
                        <Icon name="CalendarCheck" className="me-2" style={{width: '16px', height: '16px'}} />
                        Seleccionar Todo el Mes
                    </button>
                    <p className='small text-secondary mt-2'>*Luego haz clic en los días específicos en el calendario para editarlos.</p>
                </div>
            </div>
            <div className="card-footer bg-light border-top d-grid">
                <button
                    onClick={applyBulkSchedule}
                    disabled={!isReadyToApply}
                    className={`btn ${isReadyToApply ? 'btn-success' : 'btn-secondary'} fw-bold d-flex justify-content-center align-items-center`}
                >
                    <Icon name="CheckCircle" className="me-2" style={{width: '20px', height: '20px'}} />
                    Aplicar Programación ({selectedCount} Turno{selectedCount !== 1 ? 's' : ''})
                </button>
            </div>
        </div>
    );
};


export default BulkScheduler;