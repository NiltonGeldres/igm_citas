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

// 💡 Inyectamos parámetros opcionales para controlarla desde el Offcanvas
export const AgendaPage = ({ onSelectPaciente, soloLectura = false }) => {
  const navigate = useNavigate();   
  const { user, loading: authLoading } = useAuth();
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  
  const { citados, loading: agendaLoading } = useAgenda(user?.idMedico, fecha);

  if (authLoading) return <LoadingSpinner />;
  if (!user) return <div style={{ padding: '2rem' }}>No has iniciado sesión.</div>;

  return (
    /* 💡 Agregamos una clase condicional para que si está metida en el offcanvas 
          no aplique layouts rígidos que rompan el contenedor de HCE */
    <div className={onSelectPaciente ? "agenda-compact-embedded" : "agenda-page-main-wrapper"}>
      
      <DateSelector fecha={fecha} setFecha={setFecha} />
      
      <div className="medico-main-content">
        <AgendaStats 
          total={citados?.length || 0} 
          atendidos={citados?.filter(c => c.atendido).length || 0} 
        />

        {agendaLoading ? (
          <LoadingSpinner />
        ) : citados?.length > 0 ? (
          citados.map(p => (
            <PacienteCard 
              key={p.id} 
              paciente={p}
              /* 💡 Si es de 'soloLectura' (pestaña principal de Agenda), anulamos la acción del botón.
                    Si no es solo lectura, revisamos si actúa como interceptor del Offcanvas o como navegación tradicional */
              onAtender={
                soloLectura 
                  ? null 
                  : () => {
                      const pacienteLimpio = JSON.parse(JSON.stringify(p));
                      
                      if (onSelectPaciente) {
                        // Flujo Offcanvas: Le pasa el paciente al formulario sin cambiar de ruta
                        onSelectPaciente(pacienteLimpio);
                      } else {
                        // Flujo Tradicional: Navega cambiando el estado de la ruta
                        navigate('/med/atencion-medica', { state: { paciente: pacienteLimpio } });
                      }
                    }
              } 
            />
          ))
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No hay citas para esta fecha.</p>
          </div>
        )}
      </div>
    </div>        
  );
};