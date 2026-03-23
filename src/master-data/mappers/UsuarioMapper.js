
 export const mapearUsuarioRequest = (uiData) => {
  return {
        username: uiData.username,
        password: uiData.password,
        email: uiData.email,
        primerNombre: uiData.primerNombre,
        segundoNombre: uiData.segundoNombre,
        apellidoPaterno: uiData.apellidoPaterno,
        apellidoMaterno: uiData.apellidoMaterno,
        numeroCelular: uiData.numeroCelular,
        idSexo: uiData.idSexo,
        idTipoDocumento: uiData.idTipoDocumento,
        numeroDocumento: uiData.numeroDocumento,
        fechaAlta: "",
        fechaBaja:"",
        fechaModificacion:"",
        estado: "A",
        idEntidad: uiData.idEntidad,
        idReferenciaRol : 1        
  };
};




export const transformarUsuarios = (apiData) => {
  // 1. Si apiData es null, undefined, un string vacío o no es un array, retornamos []
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

        return apiData.map((apiData) => {
            // Si la entidad por alguna razón es nula dentro del array
            if (!apiData) return null;

            return {
            // Data original para no perder campos extra
            ...apiData,
            // Mapeo con valores por defecto (null-safety)
                username: apiData.username,
                password: apiData.password,
                email: apiData.email,
                primerNombre: apiData.primerNombre,
                segundoNombre: apiData.segundoNombre,
                apellidoPaterno: apiData.apellidoPaterno,
                apellidoMaterno: apiData.apellidoMaterno,
                numeroCelular: apiData.numeroCelular,
                idSexo: apiData.idSexo,
                idTipoDocumento: apiData.idTipoDocumento,
                numeroDocumento: apiData.numeroDocumento,
                idEntidad: apiData.idEntidad      
            };
        }).filter(item => item !== null); // Limpiamos posibles nulos
};