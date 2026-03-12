import header from "../../shared/utils/Header";
import axios from "axios";


const API_URL = process.env.REACT_APP_URL_API;
const SERVICE = "/citasSeparadasPagadas";
const SERVICE_CONFIRMAR_CITA = "/confimarCitaSeparada";

const usuario = sessionStorage.getItem('username');

const getCitasSeparadasPagadas = () => {
    return axios.post(API_URL+SERVICE
         ,{}
          ,{ headers: header()}
        ).catch(function (error) {
          console.log(error.toJSON());
        });
};

const setCitasPagadas = (
  row
) => {
  return axios.post(API_URL+SERVICE_CONFIRMAR_CITA
       ,{
        usuario : usuario,
        idCitaSeparada      : row.idcitaseparada
      }
        ,{ headers: header()}
      ).catch(function (error) {
        console.log(error.toJSON());
      });
};

const FacturacionService = {
    getCitasSeparadasPagadas,
    setCitasPagadas,

};
export default FacturacionService;

/**
 * 
         nombres             : row.nombres,
        fechaSolicitud      : row.fechasolicitud,
        fechaCita           : row.fechacita,
        horaInicio          : row.horainicio,
        precioUnitario      : row.preciounitario,
        idCitaSeparadaPago  : row.idcitaseparadapago,
        idComprobantePago   : row.idcomprobantepago,
        fechaPago           : row.fechapago,
        nroOperacion        : row.nrooperacion,
        correo              : row.correo,
        celular             : row.celular,
        idTipoOperacion     : row.idtipooperacion,
        origen              : row.origen,
        destino             : row.destino,
        entidadDestino      : row.entidaddestino,
        idUsuario           : row.idusuario

 */