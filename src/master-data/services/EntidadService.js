import header from "../../shared/utils/Header"
import axios from "axios";
import { mapearEntidadRequest } from "../mappers/EntidadData";
import { transformarEntidades } from "../mappers/EntidadData";
const API_URL = process.env.REACT_APP_URL_API;
const SERVICE = "/entidades";
const SERVICE_ENTIDAD = "/entidad";
const SERVICE_ENTIDAD_POR_NOMBRE = "/entidad_por_nombre";
const usuario = sessionStorage.getItem('username');
const DATOS_GLOBALES = "/usuarioDatosGlobales";



const ejecutarAPI = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(API_URL + endpoint, { 
            headers: header(),
            params: params 
        });
  //      console.log("data api :", JSON.stringify(response.data));
        const rawData = response.data ;
        return transformarEntidades(rawData);
    } catch (error) {
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

const obtenerEntidadesPorNombre = async (nombre) => {
    const params = mapearEntidadRequest(nombre);
    return await ejecutarAPI(SERVICE_ENTIDAD_POR_NOMBRE, params);
};




const getTodos = () => {
    return axios.post(API_URL+SERVICE
         ,{}
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

const getXUsuario = () => {
  return axios.post(API_URL+SERVICE
       ,{usuario}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const getEntidad = () => {
  return axios.post(API_URL+SERVICE_ENTIDAD
       ,{}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const obtenerDatosGlobales = () => {
  return axios.post(API_URL+DATOS_GLOBALES
       ,{}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const EntidadService = {
    getTodos,
    getEntidad,
    getXUsuario,
    obtenerEntidadesPorNombre,
    obtenerDatosGlobales,
};
export default EntidadService;