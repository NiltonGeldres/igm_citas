import React, { useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import PagoVirtualService from './PagoVirtualService';
import AuthService from "../Login/services/auth.service";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import FormatDate from '../Maestros/FormatDate';

function PagoVirtual({
  idProgramacion,
  horaInicio,
  idCitaSeparada,
  precioUnitario,
  nombreDestino,
  modalClose,
  email,
  celular
}) {

  //console.log("Ingreso PagoVirtual"+ idProgramacion+'- '+horaInicio+'- '+idCitaSeparada+'- '+precioUnitario+'- '+nombreDestino)

  const navigate = useNavigate();
  const [loading, setLoading]  = useState(false);
  var curr = new Date();
  curr.setDate(curr.getDate() );
  var fechaActual = curr.toISOString().substring(0,10);
  const [formData, setFormData] = useState({
    idCitaSeparada:idCitaSeparada,
    fecha:fechaActual,
    nroOperacion: '',
    correo:email,
    celular:celular,
    precioUnitario:precioUnitario,
    idTipoOperacion:'1',
    origenNombre:'',
    destino:nombreDestino,
    entidadDestino:"2", 
    idUsuario: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 
  const handleSubmit = () => {
    alert(formData.entidadDestino )   
      let fecha3 =  new Date(JSON.stringify(formData.fecha))
      let fechaEnviar = FormatDate.format_yyyymmdd(fecha3)
      PagoVirtualService.setPagoVirtualCrear(
         formData.idCitaSeparada
         ,fechaEnviar
         ,formData.nroOperacion
         ,formData.correo
         ,formData.celular
         ,formData.precioUnitario
         ,formData.idTipoOperacion
         ,formData.origenNombre
         ,formData.destino
        ,formData.entidadDestino
      ).then((response) => {
            console.log("DATA RETORNO pago virtual :  "+JSON.stringify(response.data.citaSeparadaPagoVirtual))
            modalClose(true)
            setLoading(false);
        },(error) => {
                      alert("Comuniquese con personal de soporte tecnico: No se pudo crear el pago", error.response);
                      AuthService.logout();
                      navigate("/login");
                  //    window.location.reload();
      if (error.response && error.response.status === 403) {
                    alert("Comuniquese con personal de soporte tecnico: No se pudo crear el pago", error.response);
                    AuthService.logout();
                    navigate("/login");
              //      window.location.reload();
          }
        });
   }
    

  return (
    <div className="container mt-5">
      <h2>Formulario de Pago</h2>
      <form className="small" onSubmit={handleSubmit}>
      <div className="mb-3">
          <label htmlFor="precioUnitario" className="form-label">
            Precio de servicio
          </label>
          <input
            type="number"
            className="form-control"
            id="precioUnitario"
            name="precioUnitario"
            value={formData.precioUnitario}
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="destino" className="form-label">
            Destino
          </label>
          <input
            type="text"
            className="form-control"
            id="destino"
            name="destino"
            value={formData.destino}
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="entidadDestino" className="form-label">
            Entidad de Destino
          </label>
          <select
            className="form-select"
            id="entidadDestino"
            name="entidadDestino"
            value={formData.entidadDestino}
            onChange={handleChange}
            required
          >
            <option value="1">Yape</option>
            <option value="2">Plim</option>
          </select>
        </div>


        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">
            Fecha de Operacion de pago segun voucher
          </label>
          <input 
            type="date"
            className="form-control"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nroOperacion" className="form-label">
            Número de Operación de pago segun voucher
          </label>
          <input
            type="text"
            className="form-control"
            id="nroOperacion"
            name="nroOperacion"
            value={formData.nroOperacion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">
            Correo Origen
          </label>
          <input
            disabled
            type="email"
            className="form-control"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="celular" className="form-label">
            Celular Origen
          </label>
          <input
            type="text"
            className="form-control"
            id="celular"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="origenNombre" className="form-label">
            Nombre de Origen
          </label>
          <input
            type="text"
            className="form-control"
            id="origenNombre"
            name="origenNombre"
            value={formData.origenNombre}
            onChange={handleChange}
            required
          />
        </div>
        <button type="button" className="btn btn-primary"
            onClick = {() => handleSubmit( )}          
            >
          Enviar Pago
        </button>
      </form>
    </div>
  );
}

export default PagoVirtual ;
