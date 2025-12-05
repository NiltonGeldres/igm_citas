import header from "../components/Security/Header";
import axios from "axios";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_TURNOS = "/turnos";

// URL base de la API (asumiendo que está definida en .env)
const SERVICE_ALL_SHIFTS = "/turnos/all_shifts"; // Nuevo endpoint para la constante ALL_SHIFTS

const getTodos = () => {
  return axios.post(API_URL+SERVICE_TURNOS
        ,{}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};


/**
 * NUEVA CONSTANTE AGREGADA: getAllShifts
 * Obtiene el listado completo de turnos (simulando la constante ALL_SHIFTS).
 * Sigue el mismo patrón de llamada POST con encabezados de seguridad.
 */
const getAllShifts = () => {
    console.log(`Llamando a la API para obtener ALL_SHIFTS en: ${API_URL + SERVICE_ALL_SHIFTS}`);
    return axios.post(
        API_URL + SERVICE_ALL_SHIFTS, // Usamos el nuevo endpoint
        {},
        { headers: header() }
    ).catch(function (error) {
        // Propagamos el error para que el componente (Context) lo maneje
        console.log("Error en getAllShifts:", error.toJSON());
        throw error; 
    });
};

const TurnoService = {
    getTodos,
    getAllShifts
};
export default TurnoService;