import header from "../Security/Header";
import axios from "axios";
import { MedicoMapper } from "./MedicoMapper";
import AuthService from "../Login/services/auth.service";
//(http://localhost:8081/api_salud_v2/webresources/especialidadService

const API_URL = process.env.REACT_APP_URL_API;
//const API_URL = "http://192.168.0.200:8080";
const SERVICE = "/medicosEspecialidad";
const SERVICE_MEDICO_ESPECIALIDAD = "/medicoEspecialidad";
const usuario = sessionStorage.getItem('username');


// Función genérica interna para centralizar peticiones
const ejecutarAPI = async (endpoint, data = {}) => {
    try {
        const response = await axios.post(API_URL + endpoint, data, { headers: header() });
        const rawData =response.data.medico;
        return rawData.map(MedicoMapper.toEntity);
    } catch (error) {
        // Centralizamos el manejo de errores de seguridad
        if (error.response && error.response.status === 403) {
            AuthService.logout();
            // Redirección forzada si es necesario, aunque es mejor manejarlo en el componente o un interceptor
            window.location.href = "/login";
        }
        console.error(`Error en API ${endpoint}:`, error.toJSON?.() || error);
        throw error; // Re-lanzamos para que el componente sepa que falló
    }
};


const obtenerTodosEspecialidad = (idEspecialidad) => {
    return ejecutarAPI(SERVICE, { idEspecialidad });
};




const getTodos = (idEspecialidad) => {
    return axios.post(API_URL+SERVICE
         ,{idEspecialidad:idEspecialidad}
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};



const getMedicoEspecialidad = (idEspecialidad) => {
  console.log(idEspecialidad)
  return axios.post(API_URL+SERVICE_MEDICO_ESPECIALIDAD 
       ,{idEspecialidad:idEspecialidad, usuario:usuario}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};


const MedicoService = {
    getTodos,
    getMedicoEspecialidad,
    obtenerTodosEspecialidad
};
export default MedicoService;