import { Icon } from "./Icon";
/**
 * Celda individual del calendario.
 */
const CalendarCell = ({ day, isToday, hasSchedule, isSelectedForBulk, isEmpty, handleDayClick }) => {
    if (isEmpty) {
        // bg-light es el equivalente a bg-gray-50/50
        return <div className="calendar-cell bg-light opacity-50"></div>;
    }

    // Adaptación de clases Tailwind a Bootstrap
    let cellClasses = `calendar-cell p-3 position-relative`;
    
    // Condición de Hoy (bg-primary-subtle y border-primary)
    cellClasses += isToday ? ' bg-primary-subtle border-primary' : ' bg-white';

    // Indicador de horario programado (borde izquierdo azul)
    cellClasses += hasSchedule ? ' border-start border-5 border-primary' : '';
    
    // Indicador de selección masiva
    cellClasses += isSelectedForBulk ? ' selected-for-bulk' : '';
    
    // Texto del día
    const dayTextClasses = `fw-bold fs-5 lh-1 ${isToday ? 'text-primary' : 'text-dark'}`;

    return (
        <div
            className={cellClasses}
            onClick={() => handleDayClick(String(day))}
            aria-label={`Día ${day}. Programados: ${hasSchedule} turnos`}
        >
            <span className={dayTextClasses}>{day}</span>
            {hasSchedule > 0 && (
                <div className="mt-2 d-flex align-items-center day-info">
                    <Icon name="Clock" className="text-primary me-1" style={{width: '16px', height: '16px'}}/>
                    <span className="small text-secondary fw-semibold">{hasSchedule} Turnos</span>
                </div>
            )}
            
            {isSelectedForBulk && (
                 // Badge o indicador de selección
                 <div className="position-absolute top-0 end-0 mt-1 me-1 bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow" style={{width: '20px', height: '20px', fontSize: '12px'}}>
                    ✓
                 </div>
            )}
        </div>
    );
};

export default CalendarCell;