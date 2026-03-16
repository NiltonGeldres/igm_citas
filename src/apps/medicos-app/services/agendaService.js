// src/components/Cita/CitaService.js
import header from "../../../shared/utils/Header";
import axios from "axios";
import { transformarCitados } from "../mapper/agendaPorMedicoMapperUI";
import { mapearAgendaRequest } from "../mapper/agendaPorMedicoMapperUI";


const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_MEDICO_CITA_DIARIA = "/citas/medico-diaria"; 

// Función genérica interna para centralizar peticiones
const ejecutarAPI = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(API_URL + endpoint, { 
            headers: header(),
            params: params 
        });
        // Extraemos la data (manejando si viene envuelta en .data)
        const rawData = response.data.data || response.data;
        return transformarCitados(rawData);
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


const getAgendaPorMedico = async (idMedico, fechaUI) => {
    const params = mapearAgendaRequest(idMedico, fechaUI);
    return await ejecutarAPI(SERVICE_MEDICO_CITA_DIARIA, params);
};

const agendaService = {
    getAgendaPorMedico
};
export default agendaService;



/*
    const  getAgendaPorMedico1 = (idMedico, fecha) => {
        console.log("Solicitando agenda diaria del médico: " + idMedico + " para la fecha: " + fecha);
        return axios.get(API_URL + SERVICE_MEDICO_CITA_DIARIA, {
            headers: header(),
            params: {
                idMedico: idMedico,
                fecha: fecha
            }

        }).catch(function (error) {
            if (error.response) {
                console.log("Error de respuesta:", error.response.status);
            } else {
                console.log("Error de conexión:", error.message);
            }
            throw error; 
        });
    };
*/




/*
export const agendaService = {
  getAgendaPorMedico: async (idMedico, fecha) => {
    // Simulación de API
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: 1, horainicio: "08:00", nombres: "JUAN PEREZ GARCIA", servicioNombre: "CARDIOLOGÍA", pagado: true, atendido: true },
      { id: 2, horainicio: "08:30", nombres: "MARIA LOPEZ SOSA", servicioNombre: "MEDICINA INTERNA", pagado: true, atendido: false },
      { id: 3, horainicio: "09:00", nombres: "CARLOS RUIZ DIAZ", servicioNombre: "CARDIOLOGÍA", pagado: false, atendido: false },
    ];
  }
};

*/