import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Loader2, CalendarCheck } from 'lucide-react';
import CitaService from '../../../feactures/Cita/CitaService';
import FormatDate from '../../../shared/utils/FormatDate';

const ProgramacionHoras = ({ idMedico, idEspecialidad, fechaCalendar, onHoraSeleccionada, horaActualSeleccionada }) => {
  const [horas, setHoras] = useState([]);
  const [loading, setLoading] = useState(false);

  const fechaSeleccionada = fechaCalendar ? FormatDate.format_fecha(fechaCalendar) : '---';

  useEffect(() => {
    const cargarHoras = async () => {
      if (!idMedico || !idEspecialidad || !fechaCalendar) {
        setHoras([]);
        return;
      }
      setLoading(true);
      try {
        const response = await CitaService.getCitaDisponible(idMedico, idEspecialidad, fechaCalendar);
        setHoras(response?.data?.cita || []);
      } catch (error) {
        console.error("Error cargando horas:", error);
        setHoras([]);
      } finally {
        setLoading(false);
      }
    };
    cargarHoras();
  }, [idMedico, idEspecialidad, fechaCalendar]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0' }}>
        <Loader2 size={20} style={{ color: '#006699', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Buscando turnos...</span>
      </div>
    );
  }

  if (!fechaCalendar) {
    return (
      <div style={{ backgroundColor: '#f1f5f9', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
        <CalendarCheck size={20} style={{ color: '#94a3b8', marginBottom: '2px' }} />
        <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Seleccione un día en el calendario para ver las horas.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', marginTop: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={13} color="#006699" /> Horarios Disponibles
        </span>
        <span style={{ backgroundColor: '#e0f2fe', color: '#006699', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
          {fechaSeleccionada}
        </span>
      </div>

      {horas.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '5px', maxHeight: '160px', overflowY: 'auto' }}>
          {horas.map((h, index) => {
            const isSelected = horaActualSeleccionada === h.horaInicio;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onHoraSeleccionada(h.horaInicio, h.idProgramacion, h.idServicio)}
                style={{
                  padding: '5px 3px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: isSelected ? '1.5px solid #006699' : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? '#006699' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#006699',
                  cursor: 'pointer'
                }}
              >
                {h.horaInicio}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ backgroundColor: '#fffbe3', border: '1px solid #fef08a', borderRadius: '6px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={13} color="#ca8a04" />
          <span style={{ fontSize: '10.5px', color: '#854d0e' }}>No hay cupos disponibles para esta fecha.</span>
        </div>
      )}
    </div>
  );
};

export default ProgramacionHoras;