import header from "../../shared/utils/Header";
import axios from "axios";
//(http://localhost:8081/api_salud_v2/webresources/especialidadService
//const API_URL = "http://192.168.0.200:8080";
const API_URL = process.env.REACT_APP_URL_API;
const API_LEER_CITA_SEPARADA_XUSUARIO = "/citaSeparadaLeer";
const API_LEER_CITA_SEPARADA_CONPAGOVIRTUAL_XUSUARIO = "/citaSeparadaConPagoVirtualLeer";
const API_LEER_CITA_SEPARADA_CONCOMPROBANTE_XUSUARIO = "/citaSeparadaConComprobanteLeer";
const API_CREAR_CITA_SEPARADA= "/citaSeparadaCrear";
const API_LEER_CITA_SEPARADA_CONPAGOVIRTUAL_XMEDICO= "/citaSeparadaConPagoVirtualXMedicoLeer";


const usuario = sessionStorage.getItem('username');

const getCitasSeparadaLeer = () => {
    return axios.post(API_URL+API_LEER_CITA_SEPARADA_XUSUARIO
    ,{ 
      usuario    : usuario
      }
    ,{ headers: header()}
     )
/*     .catch(function (error) {
        console.log(error.toJSON());
      })*/
      ;
};

const getCitasSeparadaConPagoVirtualLeer = () => {
    return axios.post(API_URL+API_LEER_CITA_SEPARADA_CONPAGOVIRTUAL_XUSUARIO
    ,{ 
      usuario    : usuario
      }
    ,{ headers: header()}
     )

      ;
};

const getCitasSeparadaConComprobanteLeer = () => {
    return axios.post(API_URL+API_LEER_CITA_SEPARADA_CONCOMPROBANTE_XUSUARIO
      ,{ usuario    : usuario }
      ,{ headers: header()}
     );
};

const getCitaSeparadaCrear = (
              fecha
              ,horaInicio
              ,horaFin
              ,idPaciente
              ,idMedico
              ,idEspecialidad
              ,idServicio
              ,idProgramacion
              ,idProducto
              ,precioUnitario) => {
       
   return axios.post(API_URL+API_CREAR_CITA_SEPARADA
    ,{ 
        usuario           : usuario,
        fecha             : fecha,
        horaInicio        : horaInicio,
        horaFin           : horaFin,
        idPaciente        : idPaciente,
        idMedico          : idMedico,
        idEspecialidad    : idEspecialidad,
        idServicio        : idServicio,
        idProgramacion    : idProgramacion,
        idProducto        : idProducto,
        fechaSolicitud    :fecha,
        horaSolicitud     :horaInicio,
        tipoUsuario       : "WEB",
        fechaSeparacion   :fecha,
        precioUnitario    :precioUnitario,
       }
    ,{ headers: header()}
      )
      
      /*.catch(function (error) {
        console.log(error.toJSON());
  })*/
  ;
};

const getCitasSeparadasConPagoVirtualXMedicoLeer = () => {
  return axios.post(API_URL+API_LEER_CITA_SEPARADA_CONPAGOVIRTUAL_XMEDICO
    ,{ idMedico    : 1762 }
    ,{ headers: header()}
   );
};


const CitaSeparadaService = {
  
    getCitasSeparadaLeer,
    getCitasSeparadaConPagoVirtualLeer,
    getCitasSeparadaConComprobanteLeer,
    getCitaSeparadaCrear,
    getCitasSeparadasConPagoVirtualXMedicoLeer
};
export default CitaSeparadaService;