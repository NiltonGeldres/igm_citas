//cargarConfiguracionTurnos.js

// Esta es tu única "Constante", pero es dinámica
export let MAPEO_TURNOS = {
    'libre': { 
        idTurno: 'libre', 
        descripcion: 'Libre', 
        hora: 'Libre', 
        claseColor: 'bg-light text-secondary border' 
    }
};


export const obtenerTodosLosTurnos = () => Object.values(MAPEO_TURNOS);

// Esta función la llamas al iniciar la App o el Calendario
export const cargarConfiguracionTurnos = (turnosDesdeApi) => {
    turnosDesdeApi.forEach((turno, index) => {
        MAPEO_TURNOS[turno.idTurno] = {
            idTurno: turno.idTurno,
            descripcion: turno.descripcion,
            hora: turno.horaInicio+"-"+ turno.horaFin,
            // Generamos colores dinámicos o los traemos de la API si los tienes
            claseColor: obtenerColorPorIndice(index)
        };
          //  console.log("MAPEO DE TURNOS "+JSON.stringify(MAPEO_TURNOS)) ;          
    });
};

const obtenerColorPorIndice = (i) => {
    const colores = [
        'bg-primary text-white', 
        'bg-success text-white', 
        'bg-warning text-dark', 
        'bg-info text-dark', 
        'bg-dark text-white'
    ];
    return colores[i % colores.length];
};