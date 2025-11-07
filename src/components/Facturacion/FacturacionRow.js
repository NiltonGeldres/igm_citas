
import  {useState } from 'react';
import React  from 'react';
import { Button, Badge } from 'react-bootstrap';
import FormatDate from '../Maestros/FormatDate';
import FacturacionService from './FacturacionService';
import { useNavigate } from "react-router-dom";
import AuthService from '../Login/services/auth.service';


const FacturacionRow = ({rows}) => {
    const navigate = useNavigate();
    const [loading, setLoading]  = useState(false);

    const [row, setRow] = useState({
        idcitaseparada      : rows.idcitaseparada,
        nombres             : rows.nombres,
        fechasolicitud      : rows.fechasolicitud,
        fechacita           : rows.fechacita,
        horainicio          : rows.horainicio,
        preciounitario      : rows.preciounitario,
        idcitaseparadapago  : rows.idcitaseparadapago,
        idcomprobantepago   : rows.idcomprobantepago,
        fechapago           : rows.fechapago,
        nrooperacion        : rows.nrooperacion,
        correo              : rows.correo,
        celular             : rows.celular,
        idtipooperacion     : rows.idtipooperacion,
        origen              : rows.origen,
        destino             : rows.destino,
        entidaddestino      : rows.entidaddestino,
        idusuario           : rows.idusuario,
      });   
      
  
     const [show, setShow] = useState(false);

    
      const handleHideDetails = () => {
        setShow(null);
      };
    const mostrarClick =() =>{
        setShow(prev =>!prev)
    }

    const crearBoletaCita =() =>{
        FacturacionService.setCitasPagadas(row)
        .then((response) => {
            //setCitasSeparadas(response.data);
            console.log(JSON.stringify(response));
             setLoading(false);
        },(error) => {
            alert.log("Facturacion Error page", error.response);
            if (error.response && error.response.status === 403) {
                AuthService.logout();
                navigate("/login");
                window.location.reload();
            }
        });        

    }




  return (
    <>
        <div key={row.idcitaseparada} style={{border: '1px solid rgba(0, 0, 0, 0.05)'} } >
            <row className="row"> 
                <row className="col-1">
                <Badge 
                    pill bg="primary"
                    onClick={mostrarClick}>
                    +
                </Badge>
                </row >
                <row className="col-6">
                <div style={{fontSize:14 ,textTransform:"capitalize"}}>{row.nombres} </div>
                <strong><p style={{fontSize:13 }}> 
                {row.entidaddestino==="1" ?( "Yape ") :( "Plin")} {"- Nro OP "+row.nrooperacion}
               </p></strong>
                
                    {show  && (
                        <div >
                            <div className="row" > 
                                <div className="col-5"> 
                                <strong><p style={{fontSize:13, margin: '1px 0' }} > Fecha Cita: </p></strong>
                                </div>
                                <div className="col-7"> 
                                    <p style={{fontSize:13, margin: '1px 0' }}> {FormatDate.format_fecha(row.fechacita)}</p>
                                 </div>
                            </div>

                            <div className="row" > 
                                <div className="col-5"> 
                                <strong><p  style={{fontSize:13 ,margin: '1px 0' }}> Hora Cita: </p></strong>
                                </div>
                                <div className="col-7"> 
                                    <p style={{fontSize:13, margin: '1px 0' }}> {" " +row.horainicio}</p>
                                 </div>
                            </div>

                            <div className="row"> 
                                <div className="col-5"> 
                                <strong><p style={{fontSize:13 , margin: '1px 0' }}> Origen: </p></strong>
                                </div>
                                <div className="col-7"> 
                                    <p style={{fontSize:13, margin: '1px 0' }}> {row.origen}</p>
                                 </div>
                            </div>

                            <div className="row"> 
                                <div className="col-5"> 
                                <strong><p style={{fontSize:14, margin: '1px 0'  }}> Correo: </p></strong>
                                </div>
                                <div className="col-7"> 
                                    <p style={{fontSize:14, margin: '1px 0' }}> {row.correo}</p>
                                 </div>
                            </div>
                            <div className="row"> 
                                <div className="col-5"> 
                                <strong><p style={{fontSize:14, margin: '1px 0'  }}> Telfono: </p></strong>
                                </div>
                                <div className="col-7"> 
                                    <p style={{fontSize:14, margin: '1px 0' }}> {row.celular}</p>
                                 </div>
                            </div>
                         </div>
                )}
                </row>
                <row className="col-2" style={{fontSize:13 }}>
                     {FormatDate.format_fecha(row.fechapago)} 
                </row>
                <row className="col-2">
                    <Button size="sm" variant="outline-success"  onClick={crearBoletaCita}>Boleta</Button>
                </row>
            </row> 
        </div>
        </>



  );
}
export default FacturacionRow;


     /* const [row, setRow] = useState({
        idcitaseparada      : rows.idcitaseparada,
        nombres             : rows.nombres,
        fechasolicitud      : "",
        fechacita           : "",
        horainicio          : "",
        preciounitario      : "",
        idcitaseparadapago  : "",
        idcomprobantepago   : "",
        fechapago           : "",
        nrooperacion        : "",
        correo              : "",
        celular             : "",
        idtipooperacion     : "",
        origen              : "",
        destino             : "",
        entidaddestino      : "",
        idusuario           : "",
      });     
      */  