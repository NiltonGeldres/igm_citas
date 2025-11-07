import header from "../Security/Header";
import axios from "axios";
//(http://localhost:8081/api_salud_v2/webresources/especialidadService
const API_URL = process.env.REACT_APP_URL_API;
//const API_URL = "http://192.168.0.200:8080";
const SERVICE = "/especialidad";
const SERVICE_X_USUARIO = "/especialidadMedico";
const usuario = sessionStorage.getItem('username');

const getTodos = () => {
  //  console.log("Header:   "+JSON.stringify(header()))
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

const EspecialidadService = {
    getTodos,
    getXUsuario,
};
export default EspecialidadService;