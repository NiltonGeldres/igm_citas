import header from "../Security/Header";
import axios from "axios";

const API_URL = process.env.REACT_APP_URL_API;
//const API_URL = "http://192.168.0.200:8080";
const SERVICE_MEDICO_TODOS =  "/programacionMedicoTodos";

const getDias = (idMedico,idEspecialidad) => {
//    console.log("Header:   "+JSON.stringify(header()))
    console.log('Datos Enviados: idMedico '+ idMedico+'--- idEspecialidad  '+idEspecialidad)
    return axios.post(API_URL+SERVICE_MEDICO_TODOS
         ,{idMedico : idMedico, idEspecialidad: idEspecialidad }
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

const ProgramacionMedicaService = {
    getDias,
};

export default ProgramacionMedicaService;
