import { CheckCircle, Clock } from "lucide-react";

export const PacienteCard = ({ paciente, onAtender }) => (
  <div className="patient-card">
    <div className="time-col">
      <div className="time-val">{paciente.horainicio}</div>
      <div className="time-label">HORA</div>
    </div>
    <div className="divider" />
    <div className="info-col">
      <div className="name-row">
        <span>{paciente.nombres}</span>
        {paciente.pagado && <CheckCircle size={14} color="#198754" />}
      </div>
      <div className="service-row">
        <Clock size={12} />
        <span>{paciente.servicioNombre || 'Cons. Externa'}</span>
      </div>
    </div>
    <button className="btn-atender" onClick={onAtender}>ATENDER</button>
  </div>
);