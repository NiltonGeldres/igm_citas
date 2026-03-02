import header from "../Security/Header";
import axios from "axios";
import AuthService from "../Login/services/auth.service";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE = "/especialidad";
const SERVICE_X_USUARIO = "/especialidadMedico";
const SERVICE_X_ENTIDAD = "/especialidadxidentidad";


// Función genérica interna para centralizar peticiones
const ejecutarAPI = async (endpoint, data = {}) => {
    try {
        const response = await axios.post(API_URL + endpoint, data, { headers: header() });
        return response.data;
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

const getTodos = () => ejecutarAPI(SERVICE);

const getXUsuario = () => {
    const usuario = sessionStorage.getItem('username');
    return ejecutarAPI(SERVICE_X_USUARIO, { usuario });
};

const getXEntidad = () => ejecutarAPI(SERVICE_X_ENTIDAD);

const EspecialidadService = {
    getTodos,
    getXEntidad,
    getXUsuario,
};
export default EspecialidadService;


/*
const getTodos = () => {
    return axios.post(API_URL+SERVICE
         ,{}
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

const getXUsuario = () => {
  return axios.post(API_URL+SERVICE_X_USUARIO
       ,{usuario}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const getXEntidad = () => {
    return axios.post(API_URL+SERVICE_X_ENTIDAD
         ,{}
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

*///const usuario = sessionStorage.getItem('username');
