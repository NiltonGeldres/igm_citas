import header from "../components/Security/Header";
import axios from "axios";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_TURNOS = "/turnos";

const getTodos = () => {
  return axios.post(API_URL+SERVICE_TURNOS
        ,{}
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};


const TurnoService = {
    getTodos,
};
export default TurnoService;