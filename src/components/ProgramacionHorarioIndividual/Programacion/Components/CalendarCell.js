import React from 'react';
import { Icon } from "../Components/Icons"; // *** CORREGIDO: USANDO LA EXTENSIÓN .js ***

/**
 * Componente para la celda individual del calendario.
 * Es un componente de presentación (no tiene estado ni lógica compleja).
 */
const CalendarCell = React.memo(({ day, isEmpty, isToday, hasSchedule, isSelectedForBulk, handleDayClick }) => {
    const dayString = String(day);
    
    // Clases dinámicas basadas en el estado
    let cellClasses = "calendar-cell p-3 transition duration-150 ease-in-out relative rounded-md";
    
    if (isEmpty) {
        cellClasses += " bg-gray-50/50";
    } else {
        cellClasses += " bg-white hover:bg-gray-50 cursor-pointer";
        if (isToday) {
            cellClasses += " bg-blue-100 font-bold border-blue-400 shadow-inner";
        }
        // Clase especial aplicada por el contenedor principal (ProgramacionHorariosApp)
        if (isSelectedForBulk) {
            cellClasses += " selected-for-bulk"; 
        }
    }

    return (
        <div 
            className={cellClasses} 
            data-day={dayString} 
            onClick={isEmpty ? null : () => handleDayClick(dayString)}
        >
            {isEmpty ? null : (
                <>
                    {/* Número del día */}
                    <span className={`text-lg font-semibold ${hasSchedule ? 'text-blue-700' : 'text-gray-900'} ${isToday ? 'text-gray-900' : ''}`}>
                        {day}
                    </span>
                    {/* Información de turnos programados */}
                    {hasSchedule > 0 && (
                        <div className="text-xs text-green-600 font-medium mt-1 flex items-center day-info">
                            <Icon name="Clock" className="w-3 h-3 inline mr-1" />
                            {hasSchedule} Turno{hasSchedule !== 1 ? 's' : ''}
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

export default CalendarCell;