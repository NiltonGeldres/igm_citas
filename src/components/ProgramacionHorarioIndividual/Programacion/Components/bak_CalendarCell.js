import React from "react";
import { Icon } from "./Icon";
import { SHIFT_MAPPING } from "../Constants/SHIFT_MAPPING";

// Componente para la celda individual del calendario
const CalendarCell = React.memo(({ day, dateKey, isToday, hasSchedule, isSelectedForBulk, handleDayClick, schedule }) => {
    if (!day) {
        return <div className="calendar-cell p-2 bg-light border-0"></div>; // Celda vacía
    }

/*console.log("Day ==>  "+day);
console.log("dateKey ==>  "+dateKey);
console.log("isToday ==>  "+isToday);
console.log("hasSchedule ==>  "+hasSchedule);
console.log( "isSelectedForBulk ==>  "+isSelectedForBulk);
console.log("handleDayClick ==>  "+handleDayClick);
console.log("schedule ==>  "+JSON.stringify(schedule));
*/

    // Usa las constantes globales SHIFT_MAPPING
    const currentShifts = schedule[dateKey] || [SHIFT_MAPPING.freeId.id]; // Usar 'free' por defecto
    const isFree = currentShifts.length === 1 && currentShifts[0] === SHIFT_MAPPING.freeId.id;
    
    // Si hay turnos programados, usamos la primera letra de cada turno para mostrar
    
    const bgColor = isSelectedForBulk ? 'bg-primary-subtle border-primary shadow-sm' : 'bg-white border-light';
    const dayClasses = `
        calendar-cell
        p-2 p-sm-3 
        text-start 
        fw-normal 
        border 
        cursor-pointer 
        transition-all 
        duration-200 
        hover:shadow-md 
        hover:border-primary 
        ${bgColor}
    `;

    return (
        <div
            className={`${dayClasses} ${isToday ? 'bg-info-subtle border-info text-info fw-bold' : ''} ${isSelectedForBulk ? 'is-bulk-selected' : ''}`}
            onClick={() => handleDayClick(dateKey)}
            data-day={day}
        >
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className={`fw-bolder ${isToday ? 'text-info' : 'text-dark'} text-sm`}>{day}</span>
                {hasSchedule > 0 && <Icon name="Clock" className="text-success" style={{width: '16px', height: '16px'}}/>}
            </div>
             {console.log("currentShifts  ==>  "+currentShifts)}

            <div className="mt-1 d-flex flex-wrap gap-1" style={{minHeight: '20px'}}>
                {isFree ? (
                    <span className="badge rounded-pill text-bg-secondary fw-normal">Libre</span>
                ) : (
                    currentShifts.map(shiftId => {
                        console.log("shiftid  ==>"+  JSON.stringify(shiftId))
                        const p = SHIFT_MAPPING[shiftId] ;
                        console.log("shiftid P ==>"+  JSON.stringify(p))
                        const s = SHIFT_MAPPING[shiftId] || { name: 'Desconocido', colorClass: 'bg-danger text-white' };
                        console.log("currentShifts  ==>  "+currentShifts)
                        console.log("SHIFT_MAPPING  ==>"+  JSON.stringify(s))
                        return (
                             <span key={shiftId} className={`badge rounded-pill ${s.colorClass} fw-normal`}>
                                {s.name.substring(0, 1)}
                            </span>
                        );
                    })
                )}
            </div>
        </div>
    );
});

export default CalendarCell;