//src/components/ProgramacionHorarioIndividual/ProgramacionHorarioIndividualService.js


import header from "../Security/Header";
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_BLANCO = "/programacionMedicoMesBlanco";
const usuario = sessionStorage.getItem('username');



// ProgramacionHorarioIndividualService.js
const getProgramacionMedicoMesBlanco = (mes, anio, idEspecialidad, idMedico) => {
  // Retornamos directamente la promesa de axios
  return axios.post(API_URL + SERVICE_BLANCO, {
    mes,
    anio,
    usuario,
    idEspecialidad,
    idMedico // Asegúrate de pasar el idMedico si el servicio lo requiere
  }, { headers: header() });
};


const ProgramacionHorarioIndividualService = {
    getProgramacionMedicoMesBlanco
};


export default ProgramacionHorarioIndividualService;








