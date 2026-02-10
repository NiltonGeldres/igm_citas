//CeldaCalendario.js
import React from "react";
import { Icono } from "./Icono";
import { TODOS_LOS_TURNOS } from "../Constants/TODOS_LOS_TURNOS";
//import { MAPEO_TURNOS } from "../Constants/MAPEO_TURNOS";
import { MAPEO_TURNOS } from "../Data/CargarConfiguracionTurnos";


const CeldaCalendario = React.memo(({ dia, claveFecha, esHoy, tieneHorario, estaSeleccionadoMasivo, manejarClickDia, horario }) => {
    if (!dia) {
        return <div className="calendar-cell p-2 bg-light border-0 opacity-25"></div>;
    }
 

    const turnosActuales = horario[claveFecha] || [MAPEO_TURNOS.libre.id]; 
    const esLibre = turnosActuales.length === 1 && turnosActuales[0] === MAPEO_TURNOS.libre.id;
    const claseFondo = estaSeleccionadoMasivo ? 'bg-primary-subtle border-primary shadow-sm' : 'bg-white border-light';
    const clasesDia = `
        calendar-cell
        p-2 p-sm-3 
        text-start 
        fw-normal 
        border 
        cursor-pointer 
        transition-all 
        ${claseFondo}
        ${esHoy ? 'bg-info-subtle border-info border-2' : ''}
    `;

    return (
        <div
            className={clasesDia}
            onClick={() => manejarClickDia(claveFecha)}
            data-day={dia}
        >
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className={`fw-bolder ${esHoy ? 'text-info' : 'text-dark'} text-sm`}>{dia}</span>
                {tieneHorario && <Icono nombre="Clock" className="text-success" style={{width: '14px', height: '14px'}}/>}
            </div>

            <div className="mt-1 d-flex flex-wrap gap-1" style={{minHeight: '20px'}}>
                {esLibre ? (
                    <span className="badge rounded-pill text-bg-secondary fw-normal opacity-50" style={{fontSize: '0.65rem'}}>Libre</span>
                ) : (
// CeldaCalendario.js
turnosActuales.map(turnoId => {
    const t = MAPEO_TURNOS[turnoId] || MAPEO_TURNOS['libre'];
    
    // Si el ID es 'libre', no queremos solo la "L", queremos el texto o un icono
    const esLibre = turnoId === 'libre';
    const textoMostrar = esLibre ? "Libre" : (t.descripcion || '').substring(0, 1);

    return (
        <span 
            key={turnoId} 
            className={`badge rounded-pill ${t.claseColor} fw-normal d-flex align-items-center justify-content-center`} 
            style={{ 
                fontSize: esLibre ? '0.6rem' : '0.65rem',
                minWidth: esLibre ? '45px' : '20px' // Le damos más ancho si es la palabra "Libre"
            }}
        >
            {esLibre && <Icono nombre="X" size={10} className="me-1" />} 
            {textoMostrar}
        </span>
    );
})
                )}
            </div>
        </div>
    );
});

export default CeldaCalendario;