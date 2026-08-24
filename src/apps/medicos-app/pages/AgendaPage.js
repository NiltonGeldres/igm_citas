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
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  
  const { citados, loading: agendaLoading } = useAgenda(user?.idMedico, fecha);

  if (authLoading) return <LoadingSpinner />;
  if (!user) return <div style={{ padding: '2rem' }}>No has iniciado sesión.</div>;

  return (
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
              /* 💡 Si es soloLectura, el botón no debe ejecutar acciones */
              onAtender={
                soloLectura 
                  ? null 
                  : () => {
                      // Clonamos el objeto de manera profunda para evitar mutaciones directas del estado
                      const pacienteLimpio = JSON.parse(JSON.stringify(p));
                      
                      // 💡 CAPTURA SIMÉTRICA: Deducimos la acción según el flag nativo de la API
                      const determinarAccion = pacienteLimpio.estadoCita === 1 ? 'ATENDER' : 'ACTUALIZAR';
//                      const determinarAccion = pacienteLimpio.atendido === true ? 'ACTUALIZAR' : 'ATENDER';
                      
                      // Inyectamos la variable de control que el formulario ya está esperando escuchar
                      pacienteLimpio.accionAgenda = determinarAccion;

                      if (onSelectPaciente) {
                        // Flujo Offcanvas (HCE abierta): Envía el payload enriquecido al formulario directamente
                        console.log(`🔀 [Offcanvas] Pasando paciente con acción: ${determinarAccion}`);
                        onSelectPaciente(pacienteLimpio);
                      } else {
                        // Flujo Tradicional (Vista Agenda): Navega a la HCE inyectando el estado completo en el router
                        console.log(`🚀 [Navegación] Redireccionando a HCE con acción: ${determinarAccion}`);
                        navigate('/med/atencion-medica', { 
                          state: { 
                            paciente: pacienteLimpio,
                            accionAgenda: determinarAccion // Lo pasamos también a nivel de raíz del state por seguridad
                          } 
                        });
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