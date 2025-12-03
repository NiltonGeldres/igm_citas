import React from 'react';
import { Icon } from "../Components/Icons"; // Importación correcta
import { Clock } from 'lucide-react';

const CalendarCell = ({ day, isToday, hasSchedule, isSelectedForBulk, isEmpty, handleDayClick }) => {
    if (isEmpty) {
        // CORRECCIÓN: Asegurar que las celdas vacías tengan los estilos de borde de la cuadrícula
        return <div className="bg-gray-50/50"></div>; 
    }

    const cellClasses = `
        calendar-cell p-3 relative cursor-pointer transition duration-200
        ${isToday ? 'bg-indigo-50 border-indigo-300' : 'bg-white'}
        ${hasSchedule > 0 ? 'border-l-4 border-l-blue-500' : ''}
        ${isSelectedForBulk ? 'selected-for-bulk' : ''}
        flex flex-col items-start
    `;

    const dayTextClasses = `font-bold text-lg leading-none ${isToday ? 'text-indigo-700' : 'text-gray-800'}`;

    return (
        <div 
            className={cellClasses} 
            onClick={() => handleDayClick(String(day))}
            aria-label={`Día ${day}. Programados: ${hasSchedule} turnos`}
        >
            <span className={dayTextClasses}>{day}</span>
            {hasSchedule > 0 && (
                <div className="mt-1 flex items-center day-info">
                    <Clock className="w-3 h-3 mr-1 text-blue-500" />
                    <span className="text-xs text-gray-600 font-medium">{hasSchedule} Turnos</span>
                </div>
            )}
            
            {isSelectedForBulk && (
                 <div className="absolute top-1 right-1 bg-green-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shadow-lg">
                    ✓
                 </div>
            )}
        </div>
    );
};

export default CalendarCell;