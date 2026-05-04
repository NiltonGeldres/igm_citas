import header from "../Security/Header";
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;
const SERVICE = "/programacionMedicoMes";
const SERVICE_BLANCO = "/programacionMedicoMesBlanco";
const SERVICE_CREAR = "/programacionMedicaCrear";
const usuario = sessionStorage.getItem('username');




const getProgramacionMedicoMes = (mes,anio,idEspecialidad,idMedico) => {
    return axios.post(API_URL+SERVICE
         ,{mes,anio,usuario,idEspecialidad
         }
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

const getProgramacionMedicoMesBlanco = (mes,anio,idEspecialidad,idMedico) => {
  return axios.post(API_URL+SERVICE_BLANCO
       ,{mes,anio,usuario,idEspecialidad
       }
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const setProgramacionCrear = (fecha,idEspecialidad,idMedico,programacion,idServicio) => {
  console.log("DATA ENVIAR PARA CREAR   "+JSON.stringify({fecha,idEspecialidad,idServicio,idMedico,programacion,usuario }))
  return axios.post(API_URL+SERVICE_CREAR
    ,{fecha,idEspecialidad,idMedico,programacion,usuario,idServicio
       }
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const ProgramacionHorarioService = {
    getProgramacionMedicoMes,
    getProgramacionMedicoMesBlanco,
    setProgramacionCrear
};
export default ProgramacionHorarioService;

