//cargarConfiguracionTurnos.js

// Esta es tu única "Constante", pero es dinámica
export let ENTIDADES = {
    'libre': { 
        idEntidad: 'Seleccione', 
        nombre: 'Seleccione', 
        claseColor: 'bg-light text-secondary border' 
    }
};


export const obtenerTodasLasEntidades = () => Object.values(ENTIDADES);

// Esta función la llamas al iniciar la App o el Calendario
//export const cargarConfiguracionEntidades = (EntidadDesdeApi) => {
export const cargarConfiguracionEntidades = (entidad) => {
 //   alert(JSON.stringify(EntidadDesdeApi));
//    EntidadDesdeApi.forEach((entidad, index) => {
        ENTIDADES[entidad.idEntidad] = {
                    idEntidad:    entidad.idEntidad,
                    nombre:       entidad.nombre,
            // Generamos colores dinámicos o los traemos de la API si los tienes
//            claseColor: obtenerColorPorIndice(index)
            claseColor: obtenerColorPorIndice(1)
        };
          //  console.log("MAPEO DE TURNOS "+JSON.stringify(MAPEO_TURNOS)) ;          
 //   });
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