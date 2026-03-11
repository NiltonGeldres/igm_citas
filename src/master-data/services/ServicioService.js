import header from "../../shared/utils/Header"
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;
const SERVICE = "/servicios";
const SERVICE_X_ESPECIALIDAD = "/servicios";
const SERVICE_X_ENTIDAD = "/serviciosxentidad";

const getTodos = () => {
    return axios.post(API_URL+SERVICE
         ,{}
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

const getXIdEspecialidad = (idEspecialidad) => {
  return axios.post(API_URL+SERVICE_X_ESPECIALIDAD
       ,{idEntidadEspecialidad:idEspecialidad}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const getXIdEntidad = (idEntidad) => {
 // alert("Servicio   "+idEntidad)
  return axios.post(API_URL+SERVICE_X_ENTIDAD
       ,{idEntidad:idEntidad}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const ServicioService = {
    getTodos,
    getXIdEspecialidad,
    getXIdEntidad,
};
export default ServicioService;