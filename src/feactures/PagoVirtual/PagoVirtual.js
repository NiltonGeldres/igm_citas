import { useState } from 'react';
import { Form, Row, Col, Button, Card, InputGroup } from 'react-bootstrap';
import { FaHashtag, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaUniversity } from 'react-icons/fa';
import PagoVirtualService from './PagoVirtualService';
import Swal from 'sweetalert2';
import FormatDate from '../../shared/utils/FormatDate';

function PagoVirtual({
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
      return Swal.fire("Campos incompletos", "Por favor llena todos los datos del voucher", "warning");
    }
    setLoading(true);
    try {
      const fechaEnviar = FormatDate.format_yyyymmdd(new Date(formData.fecha));
      await PagoVirtualService.setPagoVirtualCrear(
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
    <Form onSubmit={handleSubmit} className="p-2">
      <Card className="border-0 bg-light mb-3">
        <Card.Body className="py-2 px-3">
          <div className="d-flex justify-content-between align-items-center text-muted small">
            <span>Pagar a: <strong>{formData.destino}</strong></span>
            <span className="fs-5 text-primary fw-bold">S/ {precioUnitario}</span>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-3">
        {/* Entidad de Destino */}
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-bold"><FaUniversity /> Método de Pago</Form.Label>
            <Form.Select name="entidadDestino" value={formData.entidadDestino} onChange={handleChange} className="rounded-3">
              <option value="1">Yape</option>
              <option value="2">Plin</option>
              <option value="3">Transferencia Bancaria</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Número de Operación */}
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-bold"><FaHashtag /> Nro. de Operación</Form.Label>
            <Form.Control 
              name="nroOperacion" 
              placeholder="Ej: 982371" 
              value={formData.nroOperacion} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
        </Col>

        {/* Fecha de Pago */}
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-bold"><FaCalendarAlt /> Fecha del Voucher</Form.Label>
            <Form.Control type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
          </Form.Group>
        </Col>

        {/* Nombre de quien pagó */}
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-bold"><FaUser /> Nombre Titular de Pago</Form.Label>
            <Form.Control 
              name="origenNombre" 
              placeholder="Nombre según voucher" 
              value={formData.origenNombre} 
              onChange={handleChange} 
              required 
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-bold"><FaPhone /> Celular de Origen de Pago</Form.Label>
            <Form.Control name="celular" value={formData.celular} onChange={handleChange} required />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-bold"><FaEnvelope /> Correo Confirmación</Form.Label>
            <Form.Control name="correo" value={formData.correo} readOnly disabled className="bg-white" />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-grid mt-4">
        <Button 
          variant="primary" 
          type="submit" 
          size="lg" 
          disabled={loading}
          className="rounded-pill fw-bold shadow-sm"
        >
          {loading ? "Procesando..." : "REGISTRAR PAGO AHORA"}
        </Button>
      </div>
    </Form>
  );
}

export default PagoVirtual;