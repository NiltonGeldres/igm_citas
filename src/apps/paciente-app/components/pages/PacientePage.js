import { useState } from "react";
import { MedicoLayout } from "./MedicoLayout";
import { DateSelector } from "./DateSelector";
import { PacienteCard } from "./PacienteCard";
import { AgendaStats } from "./agendaStats";
import { useAgenda } from "./useAgenda";
import { useAuth } from "../../../../components/context/AuthContext";
import '../../styles/medico-app.css';

// Componentes auxiliares (puedes dejarlos aquí o moverlos a archivos)
const LoadingSpinner = () => (
  <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>
    <div className="spinner"></div>
    <p>Cargando datos...</p>
  </div>
);

export const PacientePage = () => {
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
    <PacienteLayout nombreMedico={user.usuarioNombres}>
      <CitaV2/>
    </PacienteLayout>
</div>        
  );
};