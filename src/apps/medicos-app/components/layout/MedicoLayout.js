import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  CheckCircle,
  Loader2,
  Clock,
  CalendarDays,
  FileText,
  ClipboardList
} from "lucide-react";

/**
 * SIMULACIÓN DE CONTEXTO Y SERVICIOS
 */
const useAuth = () => ({
  user: {
    idMedico: 123,
    usuarioNombres: "GELDRÉS CAYO NILTON CÉSAR"
  }
});

const FormatDate = {
  format_fecha: (fechaStr) => {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fechaStr + 'T00:00:00').toLocaleDateString('es-PE', opciones);
  }
};

const CitaSeparadaService = {
  getAgendaPorMedico: async (idMedico, fecha) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: 1, horainicio: "08:00", nombres: "JUAN PEREZ GARCIA", servicioNombre: "CARDIOLOGÍA", pagado: true, atendido: true },
      { id: 2, horainicio: "08:30", nombres: "MARIA LOPEZ SOSA", servicioNombre: "MEDICINA INTERNA", pagado: true, atendido: false },
      { id: 3, horainicio: "09:00", nombres: "CARLOS RUIZ DIAZ", servicioNombre: "CARDIOLOGÍA", pagado: false, atendido: false },
    ];
  }
};

const AgendaMedica = () => {
  const { user } = useAuth(); 
  const [citados, setCitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState('Agenda');
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0]
  );

  const cargarAgenda = useCallback(async () => {
    if (!user?.idMedico) return;
    setLoading(true);
    try {
      const data = await CitaSeparadaService.getAgendaPorMedico(user.idMedico, fechaSeleccionada);
      setCitados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando agenda:", error);
      setCitados([]);
    } finally {
      setLoading(false);
    }
  }, [fechaSeleccionada, user?.idMedico]);

  useEffect(() => {
    cargarAgenda();
  }, [cargarAgenda]);

  const cambiarFecha = (dias) => {
    const fecha = new Date(fechaSeleccionada + 'T00:00:00');
    fecha.setDate(fecha.getDate() + dias);
    setFechaSeleccionada(fecha.toISOString().split('T')[0]);
  };

  return (
    <div className="agenda-container" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      
      {/* Header con Degradado */}
      <div className="p-4 shadow-sm" style={{ 
        background: 'linear-gradient(135deg, #0078f5 0%, #0056b3 100%)', 
        color: 'white',
        borderBottomLeftRadius: '2.5rem',
        borderBottomRightRadius: '2.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: 'bold' }}>Mi Agenda</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.75 }}>Dr. {user?.usuarioNombres || 'Médico'}</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '50%', padding: '0.5rem', display: 'flex' }}>
             <CalendarIcon size={20} />
          </div>
        </div>
        
        {/* Selector de Fecha */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '1rem', 
          padding: '0.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginTop: '1rem',
          color: '#333',
          boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)'
        }}>
          <button style={{ background: 'none', border: 'none', color: '#0078f5', cursor: 'pointer' }} onClick={() => cambiarFecha(-1)}>
            <ChevronLeft size={24} />
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              {FormatDate.format_fecha(fechaSeleccionada)}
            </div>
            <div style={{ color: '#6c757d', fontSize: '10px', textTransform: 'capitalize' }}>
              {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
            </div>
          </div>

          <button style={{ background: 'none', border: 'none', color: '#0078f5', cursor: 'pointer' }} onClick={() => cambiarFecha(1)}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Resumen de Citas */}
      <div style={{ padding: '0 1.5rem', marginTop: '-1.25rem', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)', textAlign: 'center' }}>
          <div style={{ color: '#0078f5', fontWeight: 'bold', fontSize: '1.5rem' }}>{citados.length}</div>
          <div style={{ color: '#6c757d', fontSize: '10px', fontWeight: '600' }}>TOTAL CITAS</div>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)', textAlign: 'center' }}>
          <div style={{ color: '#198754', fontWeight: 'bold', fontSize: '1.5rem' }}>
            {citados.filter(c => c.atendido).length}
          </div>
          <div style={{ color: '#6c757d', fontSize: '10px', fontWeight: '600' }}>ATENDIDOS</div>
        </div>
      </div>

      {/* Timeline de Pacientes */}
      <div style={{ padding: '0 1.5rem', marginTop: '1.5rem' }}>
        <h6 style={{ color: '#6c757d', marginBottom: '1rem', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Lista de Pacientes
        </h6>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Loader2 style={{ animation: 'spin 1s linear infinite', color: '#0078f5', margin: '0 auto' }} size={32} />
            <p style={{ color: '#6c757d', marginTop: '0.5rem', fontSize: '0.875rem' }}>Cargando agenda...</p>
          </div>
        ) : (
          <>
            {citados.map((paciente) => (
              <div key={paciente.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '1rem', 
                padding: '1rem', 
                boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)', 
                marginBottom: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                borderLeft: '4px solid #0078f5'
              }}>
                <div style={{ marginRight: '1rem', textAlign: 'center', minWidth: '65px' }}>
                  <div style={{ fontWeight: 'bold', color: '#212529', fontSize: '16px' }}>
                    {paciente.horainicio}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '10px' }}>HORA</div>
                </div>

                <div style={{ width: '1px', backgroundColor: 'rgba(0,0,0,0.1)', height: '2.5rem', marginRight: '1rem' }}></div>

                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#212529', fontSize: '13px', textTransform: 'uppercase' }}>
                      {paciente.nombres}
                    </span>
                    {paciente.pagado && <CheckCircle size={14} style={{ color: '#198754' }} />}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <Clock size={12} style={{ opacity: 0.5 }} /> 
                    <span style={{ fontSize: '11px' }}>{paciente.servicioNombre || 'Cons. Externa'}</span>
                  </div>
                </div>

                <button style={{ 
                  backgroundColor: 'transparent', 
                  border: '2px solid #0078f5', 
                  color: '#0078f5', 
                  borderRadius: '50rem', 
                  padding: '0.25rem 0.75rem', 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  ATENDER
                </button>
              </div>
            ))}

            {citados.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '1rem', padding: '3rem', backgroundColor: 'white', borderRadius: '2rem', boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)' }}>
                <div style={{ backgroundColor: '#f8f9fa', borderRadius: '50%', display: 'inline-block', padding: '1rem', marginBottom: '1rem' }}>
                    <User size={32} style={{ color: '#6c757d', opacity: 0.5 }} />
                </div>
                <p style={{ color: '#6c757d', fontWeight: '500' }}>No hay citas para esta fecha.</p>
                <button 
                  style={{ background: 'none', border: 'none', color: '#0078f5', fontSize: '0.875rem', cursor: 'pointer' }}
                  onClick={() => setFechaSeleccionada(new Date().toISOString().split('T')[0])}
                >
                    Ir a Hoy
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER DE NAVEGACIÓN */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
        borderTop: '1px solid #eee',
        zIndex: 1000
      }}>
        <div 
          onClick={() => setTabActiva('ProgramacionMedica')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: tabActiva === 'ProgramacionMedica' ? 1 : 0.4 }}
        >
          <CalendarDays size={22} color={tabActiva === 'ProgramacionMedica' ? '#0078f5' : '#6c757d'} />
          <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold', color: tabActiva === 'ProgramacionMedica' ? '#0078f5' : '#6c757d' }}>Programación</span>
        </div>

        <div 
          onClick={() => setTabActiva('Facturacion')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: tabActiva === 'Facturacion' ? 1 : 0.4 }}
        >
          <FileText size={22} color={tabActiva === 'Facturacion' ? '#0078f5' : '#6c757d'} />
          <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold', color: tabActiva === 'Facturacion' ? '#0078f5' : '#6c757d' }}>Facturación</span>
        </div>

        <div 
          onClick={() => setTabActiva('Agenda')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', opacity: tabActiva === 'Agenda' ? 1 : 0.4 }}
        >
          <ClipboardList size={22} color={tabActiva === 'Agenda' ? '#0078f5' : '#6c757d'} />
          <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold', color: tabActiva === 'Agenda' ? '#0078f5' : '#6c757d' }}>Agenda</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .agenda-container button:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
};

export default AgendaMedica;