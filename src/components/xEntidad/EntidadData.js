//cargarConfiguracionTurnos.js

// Esta es tu única "Constante", pero es dinámica
export let ENTIDAD =  { 
        idEntidad: '', 
        nombre: '', 
        claseColor: 'bg-light text-secondary border' 
    }
;


export const obtenerEntidad = () => ENTIDAD;

// Esta función la llamas al iniciar la App o el Calendario
//export const cargarConfiguracionEntidades = (EntidadDesdeApi) => {
export const cargarConfiguracionEntidades = (entidad) => {
        ENTIDAD = {
                    idEntidad:    entidad.idEntidad,
                    nombre:       entidad.nombre,
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