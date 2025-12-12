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
 * Función para obtener el listado de todos los turnos (ALL_SHIFTS).
 * Eliminada la simulación, utiliza la llamada real a axios.post.
 */
const getAllShifts = () => {
    const fullUrl = API_URL + SERVICE_ALL_SHIFTS;
    console.log(`[Servicio] Llamando a getAllShifts en: ${fullUrl}`);

    return axios.post(
        fullUrl,
        {}, // Cuerpo de la petición, vacío según su estructura
        { headers: header() }
    ).catch(function (error) {
        // Registrar el error y relanzarlo para manejo externo
        console.error("Error en getAllShifts:", error.toJSON ? error.toJSON() : error.message);
        throw error;
    });
};


const TurnoService = {
    getTodos,
    getAllShifts
};
export default TurnoService;