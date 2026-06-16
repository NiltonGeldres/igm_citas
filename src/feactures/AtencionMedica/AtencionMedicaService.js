// AtencionMedicaService.js

import header from "../../shared/utils/Header";
import axios from "axios";

// Asegúrate de que esta variable de entorno esté configurada correctamente
const API_URL = process.env.REACT_APP_URL_API; 

const SERVICE = "/atencionmedica"; 
// Endpoint exacto solicitado para el proceso unificado de Guardado y Firma (Rúbrica)
const ENDPOINT_GUARDAR_FIRMA = "/atencionMedicaGuardar"; 
const usuario = sessionStorage.getItem('username');

/**
 * Proceso del MVP: Envía el JSON clínico, Spring Boot persiste en BD, 
 * estampa la rúbrica del médico y genera las rutas de los PDFs finales.
 */
const guardarYFirmarAtencion = (fullMedicalRecord) => {
    return axios.post(
        API_URL + ENDPOINT_GUARDAR_FIRMA, 
        fullMedicalRecord,
        { headers: header() }
    ).catch(function (error) {
        console.error("Error en AtencionMedicaService.guardarYFirmarAtencion:", error.toJSON());
        throw error; 
    });
};

// Función antigua de persistencia (la mantenemos por si la usa tu hook de auto-guardado debounced)
const guardarRegistro = (fullMedicalRecord) => {
    return axios.post(
        API_URL + SERVICE, 
        fullMedicalRecord,
        { headers: header() }
    ).catch(function (error) {
        console.error("Error en AtencionMedicaService.guardarRegistro:", error.toJSON());
        throw error; 
    });
};

const getTodos = () => {
  return axios.post(API_URL + SERVICE, {}, { headers: header() })
    .catch(function (error) {
        console.error(error.toJSON());
        throw error;
    });
};

const getXUsuario = () => {
 return axios.post(API_URL + SERVICE, { usuario }, { headers: header() })
    .catch(function (error) {
        console.error(error.toJSON());
        throw error;
    });
};

const AtencionMedicaService = {
  getTodos,
  getXUsuario,
  guardarRegistro,
  guardarYFirmarAtencion, 
};

export default AtencionMedicaService;