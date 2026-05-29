import header from "../../../shared/utils/Header";
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;
const API_PAGO_VIRTUAL= "/citaSeparadaPagoVirtualCrear";


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
const usuario = sessionStorage.getItem('username');  
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


const pagoVirtualService = {
    setPagoVirtualCrear
};

export default pagoVirtualService;

