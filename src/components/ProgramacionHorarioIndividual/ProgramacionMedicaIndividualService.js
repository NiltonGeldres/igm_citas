/*
//src/components/ProgramacionHorarioIndividual/ProgramacionHorarioIndividualService.js
import header from "../Security/Header";
import axios from "axios";

const usuario = sessionStorage.getItem('username');
const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_BLANCO = "/programacionMedicoMesBlanco";
const SERVICE = "/programacionMedicoMes";
const SERVICE_CREAR = "/programacionMedicaCrear";

const obtenerProgramacionMesBlanco = (mes, anio, idEspecialidad, idMedico) => {
  return axios.post(API_URL + SERVICE_BLANCO
      , { mes,  anio,  usuario,   idEspecialidad, idMedico  }
      , { headers: header() }
    );
  };

const  obtenerProgramacionMesUsuario = (mes,anio,idEspecialidad,idMedico,idServicio) => {
  console.log("obtenerProgramacionMesUsuario parametros "+mes+"---"+anio+"----"+idEspecialidad+"----"+idMedico+"----"+idServicio)
  return axios.post(API_URL+SERVICE 
      ,{mes,anio,idEspecialidad,idMedico,idServicio}
      ,{ headers: header()}
    );
  };

const crearProgramacionMesUsuario = (payloadFinal) => {
    return axios.post(API_URL+SERVICE_CREAR
      ,payloadFinal
      ,{ headers: header()}
    );  
  };

const ProgramacionHorarioIndividualService = {
    obtenerProgramacionMesUsuario,
    obtenerProgramacionMesBlanco,
    crearProgramacionMesUsuario
};
export default ProgramacionHorarioIndividualService;


/**
 *const crearProgramacionMes = (fecha,idEspecialidad,idMedico,programacion,idServicio) => {
  return axios.post(API_URL+SERVICE_CREAR
      ,{fecha, idEspecialidad, idMedico, programacion, usuario, idServicio }
      ,{ headers: header()}
    );  
  };

 */





