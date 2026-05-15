import header from "../Security/Header";
import axios from "axios";
import { transformarProgramacion } from "../Cita/Data/CitaProgramacionMedicaUI";
import { ProgramacionMedicaMapper } from "./ProgramacionMedicaMapper";
import AuthService from "../Login/services/auth.service";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_MEDICO_TODOS =  "/programacionMedicoTodos";
const SERVICE_MEDICO_ESPECIALIDAD_FECHA =  "/programacionMedicoEspecialidadFecha";


// Función genérica interna para centralizar peticiones
const ejecutarAPI = async (endpoint, data = {}) => {
    try {
        const response = await axios.post(API_URL + endpoint, data, { headers: header() });
        const rawData =response.data.programacionMedica;
        return rawData.map(ProgramacionMedicaMapper.toEntity);


    } catch (error) {
        // Centralizamos el manejo de errores de seguridad
        if (error.response && error.response.status === 403) {
            AuthService.logout();
            // Redirección forzada si es necesario, aunque es mejor manejarlo en el componente o un interceptor
            window.location.href = "/login";
        }
        console.error(`Error en API ${endpoint}:`, error.toJSON?.() || error);
        throw error; // Re-lanzamos para que el componente sepa que falló
    }
};


const obtenerDias = (idMedico, idEspecialidad,fecha) => ejecutarAPI(SERVICE_MEDICO_ESPECIALIDAD_FECHA , {idMedico, idEspecialidad,fecha } );

const getDias = (idMedico,idEspecialidad) => {
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
    obtenerDias,
};

export default ProgramacionMedicaService;
