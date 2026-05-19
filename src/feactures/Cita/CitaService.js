// src/components/Cita/CitaService.js
import header from "../../shared/utils/Header";
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;

const SERVICE_MEDICO_CITAS = "/citaDisponible";
const SERVICE_BLOQUEAR_CITA = "/citaBloquear";
const SERVICE_ELIMINAR_CITA_BLOQUEADA = "/eliminarCitaBloqueada";
const SERVICE_ELIMINAR_CITA_BLOQUEADA_XUSUARIO = "/eliminarCitaBloqueadaXUsuario";

const getCitaDisponible = (idMedico,idEspecialidad,fecha) => {
    return axios.post(API_URL+SERVICE_MEDICO_CITAS
         ,{ idMedico:idMedico,
            idEspecialidad:idEspecialidad,
            fecha:fecha
          }
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

const getCitaBloquear = (horaInicio,fecha,idMedico) => {
const usuarioActual = sessionStorage.getItem('username');
  return axios.post(API_URL+SERVICE_BLOQUEAR_CITA
    ,{ 
        usuario     : usuarioActual,
        fecha       : fecha,
        horaInicio  : horaInicio,
        idMedico    : idMedico,
       }
    ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};


const getEliminarCitaBloqueada = (idCitaBloqueada) => {
  return axios.post(API_URL+SERVICE_ELIMINAR_CITA_BLOQUEADA
    ,{ 
      idCitaBloqueada    : idCitaBloqueada,
        fecha       :"",
      }
    ,{ headers: header()}
     ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const getEliminarCitaBloqueadaXUsuario = () => {
const usuarioActual = sessionStorage.getItem('username');
  return axios.post(API_URL+SERVICE_ELIMINAR_CITA_BLOQUEADA_XUSUARIO
    ,{ usuario    : usuarioActual,}
    ,{ headers: header()}
     ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const CitaService = {
    getCitaDisponible,
    getCitaBloquear,
    getEliminarCitaBloqueada,
    getEliminarCitaBloqueadaXUsuario,
};
export default CitaService;

