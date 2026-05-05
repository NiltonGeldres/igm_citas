import { useState } from "react";
import { DateSelector } from "../components/DateSelector";
import { PacienteCard } from "../components/PacienteCard";
import { AgendaStats } from "../components/agendaStats";
import { useAgenda } from "../hooks/useAgenda";
//import { useAuth } from "../../../components/context/AuthContext";
import { useAuth } from "../../../shared/context/AuthContext";

import "../../medicos-app/styles/medico-app.css"


// Componentes auxiliares (puedes dejarlos aquí o moverlos a archivos)
const LoadingSpinner = () => (
  <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>
    <div className="spinner"></div>
    <p>Cargando datos...</p>
  </div>
);

export const AgendaPage = () => {
  // Extraemos user y loading de TU contexto
  const { user, loading: authLoading } = useAuth();
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  
  // Hook de la agenda
  const { citados, loading: agendaLoading } = useAgenda(user?.idMedico, fecha);

  // SI EL CONTEXTO ESTÁ CARGANDO, MOSTRAR SPINNER GLOBAL
  if (authLoading) return <LoadingSpinner />;

  // SI NO HAY USUARIO (Y terminó de cargar), PODRÍAS REDIRIGIR AL LOGIN
  if (!user) return <div style={{ padding: '2rem' }}>No has iniciado sesión.</div>;

  return (
    <div>
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
            <PacienteCard key={p.id} paciente={p}>
               {/* Aquí puedes meter el botón de atender si el componente PacienteCard acepta children */}
            </PacienteCard>
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