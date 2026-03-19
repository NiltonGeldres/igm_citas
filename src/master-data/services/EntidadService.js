import header from "../../shared/utils/Header"
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;
const SERVICE = "/entidades";
const SERVICE_ENTIDAD = "/entidad";
const SERVICE_ENTIDAD_POR_NOMBRE = "/entidad_por_nombre";
const usuario = sessionStorage.getItem('username');


const obtenerEntidadesporNombre = (nombre) => {

  return axios.get(API_URL+SERVICE_ENTIDAD_POR_NOMBRE
       ,{nombre}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
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

const EntidadService = {
    getTodos,
    getEntidad,
    getXUsuario,
    obtenerEntidadesporNombre,
};
export default EntidadService;