import React, { useState } from 'react';
import { Button, Badge, Card, Collapse } from 'react-bootstrap';
import { ChevronDown, ChevronUp, User, Calendar, Clock, Mail, Phone, ReceiptText, CheckCircle } from "lucide-react";
import FormatDate from '../Maestros/FormatDate';
import FacturacionService from './FacturacionService';

const FacturacionRow = ({ rows }) => {
  const [show, setShow] = useState(false);
  const [procesado, setProcesado] = useState(false);

  const crearBoletaCita = () => {
    FacturacionService.setCitasPagadas(rows)
      .then(() => {
        setProcesado(true);
        // Opcional: podrías refrescar la lista general aquí
      })
      .catch((error) => console.error(error));
  };

  return (
    <Card className={`border-0 shadow-sm mb-2 ${procesado ? 'opacity-50 bg-light' : ''}`} style={{ color: '#333' }}>
      <Card.Body className="p-3">
        <div className="row align-items-center">
          {/* Botón Expansor */}
          <div className="col-auto">
            <Button 
              variant="light" 
              size="sm" 
              className="rounded-circle"
              onClick={() => setShow(!show)}
            >
              {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>

          {/* Info Principal */}
          <div className="col">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-capitalize" style={{ fontSize: '15px' }}>{rows.nombres}</span>
              <Badge bg={rows.entidaddestino === "1" ? "info" : "primary"} className="small px-2">
                {rows.entidaddestino === "1" ? "YAPE" : "PLIN"}
              </Badge>
            </div>
            <div className="text-muted small">
              <ReceiptText size={12} className="me-1" />
              Op: <span className="fw-bold">{rows.nrooperacion}</span> • {FormatDate.format_fecha(rows.fechapago)}
            </div>
          </div>

          {/* Precio y Acción */}
          <div className="col-auto text-end">
            <div className="fw-bold text-success mb-1">S/ {rows.preciounitario}</div>
            <Button 
              size="sm" 
              variant={procesado ? "outline-secondary" : "success"} 
              disabled={procesado}
              className="d-flex align-items-center gap-1"
              onClick={crearBoletaCita}
            >
              {procesado ? <CheckCircle size={14} /> : null}
              {procesado ? "Boleta Generada" : "Generar Boleta"}
            </Button>
          </div>
        </div>

        {/* Detalles Expandibles */}
        <Collapse in={show}>
          <div className="mt-3 pt-3 border-top">
            <div className="row g-2">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 small mb-1">
                  <Calendar size={14} className="text-muted" />
                  <strong>Fecha de Cita:</strong> {FormatDate.format_fecha(rows.fechacita)}
                </div>
                <div className="d-flex align-items-center gap-2 small mb-1">
                  <Clock size={14} className="text-muted" />
                  <strong>Hora de Cita:</strong> {rows.horainicio}
                </div>
                <div className="d-flex align-items-center gap-2 small">
                  <ReceiptText size={14} className="text-muted" />
                  <strong>Origen:</strong> {rows.origen}
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 small mb-1">
                  <Mail size={14} className="text-muted" />
                  {rows.correo}
                </div>
                <div className="d-flex align-items-center gap-2 small">
                  <Phone size={14} className="text-muted" />
                  {rows.celular}
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default FacturacionRow;
/*
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
        <div key={row.idcitaseparada} style={{border: '1px solid rgba(0, 0, 0, 0.05)' , color:'black'} } >
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
                                <strong><p style={{fontSize:14, margin: '1px 0'  }}> Telefono: </p></strong>
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
                    <Button size="sm" variant="outline-success"  onClick={crearBoletaCita}>Generar Boleta</Button>
                </row>
            </row> 
        </div>
        </>



  );
}
export default FacturacionRow;

*/