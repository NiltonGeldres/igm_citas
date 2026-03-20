//cargarConfiguracionTurnos.js

// Esta es tu única "Constante", pero es dinámica
export let ENTIDAD =  { 
        idEntidad: '', 
        nombre: '', 
        claseColor: 'bg-light text-secondary border' 
    }
;

 export const mapearEntidadRequest = (nombre) => {
  return {
    nombre: nombre
  };
};

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


export const transformarEntidades = (apiData) => {
  // 1. Si apiData es null, undefined, un string vacío o no es un array, retornamos []
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  return apiData.map((entidad) => {
    // Si la entidad por alguna razón es nula dentro del array
    if (!entidad) return null;

    return {
      // Data original para no perder campos extra
      ...entidad,
      // Mapeo con valores por defecto (null-safety)
      idEntidad:      entidad.idEntidad || 0,
      nombre:         entidad.nombre || "Sin Nombre",
      direccion:      entidad.direccion || "Dirección no disponible",
      nombreDistrito: entidad.nombreDistrito || "N/A",
      codigo:         entidad.codigo || "",
      logoUrl:        entidad.logoUrl || null,
    };
  }).filter(item => item !== null); // Limpiamos posibles nulos
};