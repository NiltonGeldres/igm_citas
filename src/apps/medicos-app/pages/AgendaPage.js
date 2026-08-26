import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { DateSelector } from "../components/DateSelector";
import { PacienteCard } from "../components/PacienteCard";
import { AgendaStats } from "../components/agendaStats";
import { useAgenda } from "../hooks/useAgenda";
import { useAuth } from "../../../shared/context/AuthContext";
import "../../medicos-app/styles/medico-app.css";

const LoadingSpinner = () => (
  <div className="loading-state" style={{ textAlign: 'center', padding: '1.5rem' }}>
    <div className="spinner"></div>
    <p>Cargando datos...</p>
  </div>
);

export const AgendaPage = ({ onSelectPaciente, soloLectura = false }) => {
  const navigate = useNavigate();   
  const { user, loading: authLoading } = useAuth();
  
  // 1. Fecha elegida en la interfaz
  const [fechaTemp, setFechaTemp] = useState(new Date().toISOString().split('T')[0]);
  
  // 2. Fecha enviada a la API (se inicializa en null para no consultar automáticamente al montar si deseas, 
  // o con la fecha actual si deseas la primera carga automática)
  const [fechaConsulta, setFechaConsulta] = useState(fechaTemp);

  // 3. Estado indicador de si la fecha visible actual fue buscada explícitamente
  const [buscado, setBuscado] = useState(true);

  const { citados, loading: agendaLoading } = useAgenda(user?.idMedico, fechaConsulta);

  // Manejador del cambio de fecha desde el DateSelector
  const handleDateChange = (nuevaFecha) => {
    setFechaTemp(nuevaFecha);
    setBuscado(false); // 💡 Desmarca la búsqueda al cambiar cualquier fecha
  };

  // Manejador del botón de búsqueda (Lupa)
  const handleBuscarAgenda = () => {
    setFechaConsulta(fechaTemp);
    setBuscado(true); // 💡 Marca como confirmada la búsqueda para la fecha activa
  };

  // La lista solo es visible si se ha presionado el botón de búsqueda para la fecha seleccionada
  const citadosVisibles = buscado ? (citados || []) : [];

  if (authLoading) return <LoadingSpinner />;
  if (!user) return <div style={{ padding: '2rem' }}>No has iniciado sesión.</div>;

  return (
    <div className={onSelectPaciente ? "agenda-compact-embedded" : "agenda-page-main-wrapper"}>
      
      <DateSelector 
        fecha={fechaTemp} 
        setFecha={handleDateChange} 
        onSearch={handleBuscarAgenda}
        loading={agendaLoading}
      />
      
      <div className="medico-main-content" style={{ marginTop: '1rem' }}>
        <AgendaStats 
          total={citadosVisibles.length} 
          atendidos={citadosVisibles.filter(c => Number(c.idAtencion) > 0 || c.atendido).length} 
        />

        {agendaLoading ? (
          <LoadingSpinner />
        ) : buscado && citadosVisibles.length > 0 ? (
          citadosVisibles.map(p => (
            <PacienteCard 
              key={p.id || p.idCita} 
              paciente={p}
              onAtender={
                soloLectura 
                  ? null 
                  : () => {
                      const pacienteLimpio = JSON.parse(JSON.stringify(p));
                      const tieneAtencionRegistrada = Number(pacienteLimpio.idAtencion) > 0;
                      const determinarAccion = tieneAtencionRegistrada ? 'ACTUALIZAR' : 'ATENDER';
                      
                      pacienteLimpio.accionAgenda = determinarAccion;

                      if (onSelectPaciente) {
                        onSelectPaciente(pacienteLimpio);
                      } else {
                        navigate('/med/atencion-medica', { 
                          state: { 
                            paciente: pacienteLimpio,
                            accionAgenda: determinarAccion 
                          } 
                        });
                      }
                    }
              } 
            />
          ))
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>
              {!buscado 
                ? "Presione el botón de búsqueda para consultar las citas de esta fecha." 
                : "No hay citas para esta fecha."}
            </p>
          </div>
        )}
      </div>
    </div>        
  );
};