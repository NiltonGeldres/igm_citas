import  { useState } from 'react';
import { Hash, Calendar, User, Phone, Mail, Landmark, Loader2 } from 'lucide-react';
//import PagoVirtualService from './PagoVirtualService';
import pagoVirtualService from '../../services/pagoVirtualServices';
import FormatDate from '../../../../components/Maestros/FormatDate';

//import FormatDate from '../Maestros/FormatDate';
import Swal from 'sweetalert2';
//import { useAuth } from "../context/AuthContext";
import { useAuth } from '../../../../components/context/AuthContext';
/*
function PagoVirtual1({
    idCitaSeparada,
    precioUnitario, 
    nombreDestino,
    email, 
    celular, 
    modalClose 
}) {
  const { entidad } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idCitaSeparada,
    fecha: new Date().toISOString().substring(0, 10),
    nroOperacion: '',
    correo: email || '',
    celular: celular || '',
    precioUnitario,
    idTipoOperacion: '1',
    origenNombre: '',
    destino: entidad?.nombre || 'CENTRO MÉDICO',
    entidadDestino: nombreDestino 
  });

  */
function PagoVirtual1({
    idCitaSeparada,
    precioUnitario, 
    nombreDestino, 
    modalClose, 
    email, 
    celular,
    nombreEntidad }) {


      
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idCitaSeparada,
    fecha: new Date().toISOString().substring(0, 10),
    nroOperacion: '',
    correo: email || '',
    celular: celular || '',
    precioUnitario: precioUnitario || 0,
    idTipoOperacion: '1',
    origenNombre: '',
    destino: nombreDestino || '',
    entidadDestino: nombreDestino || "" // Default Yape
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nroOperacion || !formData.origenNombre) {
      return Swal.fire("Incompleto", "Llena los datos del voucher", "warning");
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
      Swal.fire("¡Éxito!", "Pago registrado correctamente.", "success");
      modalClose(true);
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar el pago.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in">
      {/* Banner de Monto */}
      <div className="p-3 rounded-3 mb-4 d-flex justify-content-between align-items-center" 
           style={{ backgroundColor: 'var(--bg-light)', border: '1px solid #eee' }}>
        <span className="small text-muted">Monto a confirmar:</span>
        <span className="h4 mb-0 fw-bold text-primary">S/ {precioUnitario}</span>
      </div>

      {/* Grid de Formulario */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        
        <div style={{ gridColumn: 'span 2' }}>
          <label className="small fw-bold mb-1 d-block"><Landmark size={14} /> Método de Pago</label>
          <select name="entidadDestino" value={formData.entidadDestino} onChange={handleChange} 
                  className="form-control-custom">
            <option value="1">Yape</option>
            <option value="2">Plin</option>
            <option value="3">Transferencia Bancaria</option>
          </select>
        </div>

        <div>
          <label className="small fw-bold mb-1 d-block"><Hash size={14} /> Nro. Operación</label>
          <input name="nroOperacion" placeholder="Ej: 982371" value={formData.nroOperacion} 
                 onChange={handleChange} className="form-control-custom" required />
        </div>

        <div>
          <label className="small fw-bold mb-1 d-block"><Calendar size={14} /> Fecha</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} 
                 className="form-control-custom" required />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label className="small fw-bold mb-1 d-block"><User size={14} /> Origen Nombre Titular</label>
          <input name="origenNombre" placeholder="Nombre en el voucher" value={formData.origenNombre} 
                 onChange={handleChange} className="form-control-custom" required />
        </div>

        <div>
          <label className="small fw-bold mb-1 d-block"><Phone size={14} /> Origen Celular</label>
          <input name="celular" value={formData.celular} onChange={handleChange} 
                 className="form-control-custom" required />
        </div>

        <div>
          <label className="small fw-bold mb-1 d-block"><Mail size={14} /> Origen Email</label>
          <input name="correo" value={formData.correo} className="form-control-custom bg-light" disabled />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-p-main mt-4">
        {loading ? <Loader2 size={20} className="girar" /> : "REGISTRAR PAGO AHORA"}
      </button>

      <style>{`
        .form-control-custom {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }
        .form-control-custom:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-light);
        }
        @media (max-width: 480px) {
          form div { grid-column: span 2 !important; }
        }
      `}</style>
    </form>
  );
}

export default PagoVirtual1;