// AtencionMedicaService.js

import header from "../../shared/utils/Header";
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API; 
const usuario = sessionStorage.getItem('username');

const SERVICE = "/atencionmedica"; 
const SERVICE_BASE = "/api/v1/atenciones-medicas";
const SERVICE_BASE_OBTENER = "/api/v1/atenciones-medicas/detalle";
// Endpoint exacto solicitado para el proceso unificado de Guardado y Firma (Rúbrica)
const ENDPOINT_GUARDAR_FIRMA = "/atencionMedicaGuardar"; 
const ENDPOINT_GENERAR_PDF_BORRADOR ="/preparar-pdf";


const crearAtencionBorrador = (atencionMedicaRequest) => {
    return axios.post(
        `${API_URL}${SERVICE_BASE}/guardar-borrador`, 
        atencionMedicaRequest,
        { headers: header() }
    ).then(response => response.data)
     .catch(function (error) {
        console.error("Error en crearAtencionBorrador:", error.response?.data || error.toJSON());
        throw error; 
    });
};

/**
 * 2. ETAPA "EN_EDICION" - ACTUALIZAR ATENCIÓN EXISTENTE (PUT)
 * Se usa cuando ya existe un idAtencion asignado (Auto-save o actualización manual).
 */
const actualizarAtencionBorrador = (idAtencion, atencionMedicaRequest) => {
    return axios.put(
        `${API_URL}${SERVICE_BASE}/actualizar-borrador/${idAtencion}`, 
        atencionMedicaRequest,
        { headers: header() }
    ).then(response => response.data)
     .catch(function (error) {
        console.error("Error en actualizarAtencionBorrador:", error.response?.data || error.toJSON());
        throw error; 
    });
};

/**
 * 3. ETAPA "PDF_BORRADOR" - VALIDAR Y PREPARAR PDF (POST)
 * Pasa el filtro estricto, congela el estado a PDF_BORRADOR y devuelve el PDF preliminar.
 */
const generarPdfBorradorAtencion = (idAtencion) => {
    return axios.post(
        `${API_URL}${SERVICE_BASE}/preparar-pdf`, 
        { idAtencion },
        { headers: header() }
    ).then(response => response.data)
     .catch(function (error) {
        console.error("Error en generarPdfBorradorAtencion:", error.response?.data || error.toJSON());
        throw error; 
    });
};

/**
 * 4. ETAPA "FIRMADO" - FIRMA DIGITAL DEFINITIVA (POST)
 */
const firmarAtencionDigital = (idAtencion, tokenFirma) => {
    return axios.post(
        `${API_URL}${SERVICE_BASE}/firmar-digitalmente`, 
        { idAtencion, tokenFirma },
        { headers: header() }
    ).then(response => response.data)
     .catch(function (error) {
        console.error("Error en firmarAtencionDigital:", error.response?.data || error.toJSON());
        throw error; 
    });
};

/**
 * Consulta la atención médica completa por idAtencion.
 * Petición HTTP única para recuperar todo el expediente clínico guardado.
 */
const obtenerAtencionPorId = (idAtencion) => {
    return axios.get(
        `${API_URL}${SERVICE_BASE_OBTENER}/${idAtencion}`,
        { headers: header() }
    ).then(response => response.data)
     .catch(function (error) {
        console.error("Error en obtenerAtencionPorId:", error.response?.data || error.toJSON());
        throw error;
    });
};

/**
 * Persiste la atención médica en BD pasando las validaciones @Valid de Spring Boot.
 */
const guardarAtencionCompleta = (atencionMedicaRequest) => {
    console.log("****   JSON A GUARDAR "+JSON.stringify(atencionMedicaRequest))
    return axios.post(
        `${API_URL}${SERVICE_BASE}/guardar`, 
        atencionMedicaRequest,
        { headers: header() }
    ).then(response => response.data)
     .catch(function (error) {
        console.error("Error en guardarAtencionCompleta:", error.response?.data || error.toJSON());
        throw error; 
    });
};


/**
 * Proceso del MVP: Envía el JSON clínico, Spring Boot persiste en BD, 
 * estampa la rúbrica del médico y genera las rutas de los PDFs finales.
 */
/*const guardarYFirmarAtencion = (fullMedicalRecord) => {
    return axios.post(
        API_URL + ENDPOINT_GUARDAR_FIRMA, 
        fullMedicalRecord,
        { headers: header() }
    ).catch(function (error) {
        console.error("Error en AtencionMedicaService.guardarYFirmarAtencion:", error.toJSON());
        throw error; 
    });
};
*/

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
  crearAtencionBorrador,
  actualizarAtencionBorrador,
  generarPdfBorradorAtencion,
  firmarAtencionDigital,  
  obtenerAtencionPorId,    
  guardarAtencionCompleta,    
  getTodos,
  getXUsuario,
  guardarRegistro,
 // guardarYFirmarAtencion, 
};

export default AtencionMedicaService;