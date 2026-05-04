import header from "../../../shared/utils/Header";
import axios from "axios";
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
      /*.catch(function (error) {
        console.log(error.toJSON());
  })*/
  ;
  
};


const pagoVirtualService = {
    setPagoVirtualCrear
};

export default pagoVirtualService;

