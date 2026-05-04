import { useState } from 'react';
import { FaHashtag, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaUniversity } from 'react-icons/fa';
import pagoVirtualService from '../../services/pagoVirtualServices'; // Ruta actualizada según tu código
import Swal from 'sweetalert2';
import FormatDate from '../../../../shared/utils/FormatDate';

function PagoVirtual({
    idCitaSeparada,
    precioUnitario,
    nombreDestino,
    email,
    celular, // Prop que viene del padre
    modalClose
}) {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idCitaSeparada,
    fecha: new Date().toISOString().substring(0, 10),
    nroOperacion: '',
    correo: email || '',
    celular: celular || '', // Inicializado con la prop recibida
    precioUnitario: precioUnitario || 0,
    idTipoOperacion: '1',
    origenNombre: '',
    destino: nombreDestino || '',
    entidadDestino: '1' // Default: Yape
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nroOperacion || !formData.origenNombre || !formData.celular) {
      return Swal.fire("Campos incompletos", "Por favor llena todos los datos del voucher", "warning");
    }

    setLoading(true);
    try {
      const fechaEnviar = FormatDate.format_yyyymmdd(new Date(formData.fecha));
      
      await pagoVirtualService.setPagoVirtualCrear(
        formData.idCitaSeparada,
        fechaEnviar,
        formData.nroOperacion,
        formData.correo,
        formData.celular,
        formData.precioUnitario,
        formData.idTipoOperacion,
        formData.origenNombre,
        formData.destino,
        formData.entidadDestino
      );

      Swal.fire("¡Éxito!", "Pago registrado. En breve verificaremos su cita.", "success");
      modalClose(true);
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar el pago. Verifique su conexión.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-1">
      {/* Resumen del Monto */}
      <div className="card border-0 bg-light mb-4 rounded-3 shadow-sm">
        <div className="card-body py-3 px-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
               <span className="text-muted small d-block">Pagar a:</span>
               <strong className="text-primary">{formData.destino}</strong>
            </div>
            <div className="text-end">
                <span className="fs-4 fw-bold text-dark">S/ {precioUnitario}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Método de Pago */}
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">
            <FaUniversity className="me-1" /> Origen: Método de Pago
          </label>
          <select 
            className="form-select border-2 rounded-3 shadow-sm" 
            name="entidadDestino" 
            value={formData.entidadDestino} 
            onChange={handleChange}
          >
            <option value="1">Yape</option>
            <option value="2">Plin</option>
            <option value="3">Transferencia Bancaria</option>
          </select>
        </div>

        {/* Nro Operación */}
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">
            <FaHashtag className="me-1" /> Origen: Nro. Operación
          </label>
          <input 
            type="text"
            className="form-control border-2 rounded-3 shadow-sm"
            name="nroOperacion" 
            placeholder="Ej: 982371" 
            value={formData.nroOperacion} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Fecha */}
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">
            <FaCalendarAlt className="me-1" /> Origen: Fecha Voucher
          </label>
          <input 
            type="date" 
            className="form-control border-2 rounded-3 shadow-sm"
            name="fecha" 
            value={formData.fecha} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Nombre Titular */}
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">
            <FaUser className="me-1" /> Origen: Nombre Titular
          </label>
          <input 
            type="text"
            className="form-control border-2 rounded-3 shadow-sm"
            name="origenNombre" 
            placeholder="Nombre según voucher" 
            value={formData.origenNombre} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Celular del Pago */}
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">
            <FaPhone className="me-1" /> Origen: Nro Celular
          </label>
          <input 
            type="text"
            className="form-control border-2 rounded-3 shadow-sm"
            placeholder="Número usado para pagar" 
            name="celular" 
            value={formData.celular} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Correo (Solo lectura) */}
        <div className="col-md-6">
          <label className="form-label small fw-bold text-secondary">
            <FaEnvelope className="me-1" /> Correo Confirmación
          </label>
          <input 
            type="email"
            className="form-control border-2 rounded-3 bg-light text-muted shadow-none"
            name="correo" 
            value={formData.correo} 
            readOnly 
            disabled 
          />
        </div>
      </div>

      {/* Botón de Acción */}
      <div className="d-grid mt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary btn-lg rounded-pill fw-bold shadow py-3"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              PROCESANDO...
            </>
          ) : "REGISTRAR PAGO AHORA"}
        </button>
      </div>
    </form>
  );
}

export default PagoVirtual;