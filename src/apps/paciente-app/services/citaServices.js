// src/components/Cita/CitaService.js
import header from "../Security/Header";
import axios from "axios";
import { transformarCitas } from "../mapper/citaPacientePendiente";
import { mapearCitaPacienteRequest } from "../mapper/citaPacienteMapper";

const API_URL = process.env.REACT_APP_URL_API;

const SERVICE_CITA_PACIENTE_PENDIENTE = "/citas/paciente-pendiente"; 

// Función genérica interna para centralizar peticiones
const ejecutarAPI = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(API_URL + endpoint, { 
            headers: header(),
            params: params 
        });
        // Extraemos la data (manejando si viene envuelta en .data)
        const rawData = response.data.data || response.data;
        return transformarCitas(rawData);
    } catch (error) {
        // TU LÓGICA DE DEPURACIÓN AQUÍ:
        if (error.response) {
            // El servidor respondió con un código (4xx, 5xx)
            console.log("Error de respuesta (Status):", error.response.status);
            
            if (error.response.status === 403) {
                window.location.href = "/login";
            }
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta (Error de red/CORS)
            console.log("Error de conexión (No response):", error.message);
        } else {
            // Error al configurar la petición
            console.log("Error de configuración:", error.message);
        }
        throw error; 
    }
};

const getCitaPacientePendiente = async (idPaciente, fechaUI) => {
    const params = mapearCitaPacienteRequest(idPaciente, fechaUI);
    return await ejecutarAPI(SERVICE_CITA_PACIENTE_PENDIENTE, params);
};

const citaService = {
    getCitaPacientePendiente
};
export default citaService;


