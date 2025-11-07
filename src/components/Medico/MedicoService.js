import header from "../Security/Header";
import axios from "axios";
//(http://localhost:8081/api_salud_v2/webresources/especialidadService

const API_URL = process.env.REACT_APP_URL_API;
//const API_URL = "http://192.168.0.200:8080";
const SERVICE = "/medico";
const SERVICE_MEDICO_ESPECIALIDAD = "/medicoEspecialidad";
const usuario = sessionStorage.getItem('username');


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
    getMedicoEspecialidad
};
export default MedicoService;