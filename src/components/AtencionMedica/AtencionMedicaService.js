// AtencionMedicaService.js

import header from "../Security/Header";
import axios from "axios";
// Asegúrate de que esta variable de entorno esté configurada correctamente
const API_URL = process.env.REACT_APP_URL_API; 
// Ajusta el SERVICE para el endpoint de guardar la atención médica
const SERVICE = "/atencionmedica"; 
const usuario = sessionStorage.getItem('username');

// Función que se encarga de enviar el objeto de registro médico
const guardarRegistro = (fullMedicalRecord) => {
    return axios.post(API_URL + SERVICE, 
        // Datos enviados en el cuerpo de la petición
        fullMedicalRecord,
        // Cabeceras con la seguridad (Autenticación)
        { headers: header() }
    ).catch(function (error) {
        // Loguea el error detallado para el desarrollador
        console.error("Error en AtencionMedicaService.guardarRegistro:", error.toJSON());
        // Lanza el error para que el componente AtencionMedicaForm pueda manejarlo
        throw error; 
    });
};

const getTodos = () => {
  return axios.post(API_URL+SERVICE
  ,{}
  ,{ headers: header()}
  ).catch(function (error) {
      console.error(error.toJSON());
      throw error;
 });
};

const getXUsuario = () => {
 return axios.post(API_URL+SERVICE
      ,{usuario}
      ,{ headers: header()}
   ).catch(function (error) {
      console.error(error.toJSON());
      throw error;
    });
};


const AtencionMedicaService = {
 getTodos,
 getXUsuario,
    // Exportamos la nueva función de guardar
 guardarRegistro,
};
export default AtencionMedicaService;