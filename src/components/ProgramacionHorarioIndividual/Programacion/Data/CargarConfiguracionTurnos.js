// Esta es tu única "Constante", pero es dinámica
export let MAPEO_TURNOS = {
    'libre': { 
        id: 'libre', 
        nombre: 'Libre', 
        claseColor: 'bg-light text-secondary border' 
    }
};

// Esta función la llamas al iniciar la App o el Calendario
export const cargarConfiguracionTurnos = (turnosDesdeApi) => {
    turnosDesdeApi.forEach((turno, index) => {
        MAPEO_TURNOS[turno.idTurno] = {
            id: turno.idTurno,
            nombre: turno.descripcion,
            // Generamos colores dinámicos o los traemos de la API si los tienes
            claseColor: obtenerColorPorIndice(index)
        };
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