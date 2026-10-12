/*
import FormatDate from "../../shared/utils/FormatDate";
import header from "../../shared/utils/Header";
import axios from "axios";
//const API_URL = "http://192.168.0.200:8080";
const API_URL = process.env.REACT_APP_URL_API;
const API_PAGO_VIRTUAL= "/citaSeparadaPagoVirtualCrear";

const usuario = sessionStorage.getItem('username');
const setPagoVirtualCrear = (
    idCitaSeparada
    ,fecha
    ,nroOperacion
    ,correo
    ,celular
    ,precioUnitario
    ,idTipoOperacion
    ,origenNombre
    ,destino
   ,entidadDestino
) => {
   console.log(idCitaSeparada
    +"-"+fecha
    +"-"+nroOperacion
    +"-"+correo
    +"-"+celular
    +"-"+precioUnitario
    +"-"+idTipoOperacion
    +"-"+origenNombre
    +"-"+destino
   +"-"+entidadDestino)  
   return axios.post(API_URL+API_PAGO_VIRTUAL
    ,{ 
        idCitaSeparada: idCitaSeparada
        ,fecha:  fecha
        ,nroOperacion: nroOperacion
        ,correo: correo
        ,celular: celular
        ,monto: precioUnitario
        ,idTipoOperacion: idTipoOperacion
        ,origen: origenNombre
        ,destino: destino
       ,entidadDestino: entidadDestino
       ,usuario: usuario        
       }
    ,{ headers: header()}
      )
  ;
  
};


const PagoVirtualService = {
    setPagoVirtualCrear
};

export default PagoVirtualService;


*/