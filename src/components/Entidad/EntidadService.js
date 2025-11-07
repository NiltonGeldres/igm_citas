import header from "../Security/Header";
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;
const SERVICE = "/entidades";
const usuario = sessionStorage.getItem('username');

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


const EntidadService = {
    getTodos,
    getXUsuario,
};
export default EntidadService;