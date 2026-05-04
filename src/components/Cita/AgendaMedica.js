import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  CheckCircle,
  Loader2,
  Clock,
  Home,
  CalendarDays,
  CreditCard,
  Stethoscope,
  ClipboardList
} from "lucide-react";

/** * SIMULACIÓN DE SERVICIOS Y CONTEXTO
 * (Mantenemos las simulaciones para asegurar que el componente funcione de forma autónoma)
 */
const useAuth = () => ({
  user: { idMedico: 123, usuarioNombres: "GELDRÉS CAYO NILTON CÉSAR" }
});

const FormatDate = {
  format_fecha: (fechaStr) => {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fechaStr + 'T00:00:00').toLocaleDateString('es-PE', opciones);
  }
};

const CitaSeparadaService = {
  getAgendaPorMedico: async (idMedico, fecha) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      { id: 1, horainicio: "08:00", nombres: "JUAN PEREZ GARCIA", servicioNombre: "CARDIOLOGÍA", pagado: true, atendido: true },
      { id: 2, horainicio: "08:30", nombres: "MARIA LOPEZ SOSA", servicioNombre: "MEDICINA INTERNA", pagado: true, atendido: false },
      { id: 3, horainicio: "09:00", nombres: "CARLOS RUIZ DIAZ", servicioNombre: "CARDIOLOGÍA", pagado: false, atendido: false },
    ];
  }
};

// --- SUB-COMPONENTE: AGENDA MÉDICA ---
const AgendaMedicaView = () => {
  const { user } = useAuth(); 
  const [citados, setCitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  const cargarAgenda = useCallback(async () => {
    setLoading(true);
    try {
      const data = await CitaSeparadaService.getAgendaPorMedico(user.idMedico, fechaSeleccionada);
      setCitados(data);
    } catch (e) { setCitados([]); }
    finally { setLoading(false); }
  }, [fechaSeleccionada, user.idMedico]);

  useEffect(() => { cargarAgenda(); }, [cargarAgenda]);

  const cambiarFecha = (dias) => {
    const fecha = new Date(fechaSeleccionada + 'T00:00:00');
    fecha.setDate(fecha.getDate() + dias);
    setFechaSeleccionada(fecha.toISOString().split('T')[0]);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="p-4 shadow-sm" style={{ 
        background: 'linear-gradient(135deg, #0078f5 0%, #0056b3 100%)', 
        color: 'white', borderBottomLeftRadius: '2.5rem', borderBottomRightRadius: '2.5rem'
      }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-xl m-0">Mi Agenda</h4>
            <p className="text-xs opacity-80 m-0">Dr. {user.usuarioNombres}</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full"><CalendarIcon size={20} /></div>
        </div>
        
        <div className="bg-white rounded-2xl p-2 flex items-center justify-between text-gray-800 shadow-md">
          <button className="p-2 text-blue-600" onClick={() => cambiarFecha(-1)}><ChevronLeft size={24} /></button>
          <div className="text-center">
            <div className="font-bold">{FormatDate.format_fecha(fechaSeleccionada)}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-tighter">
              {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
            </div>
          </div>
          <button className="p-2 text-blue-600" onClick={() => cambiarFecha(1)}><ChevronRight size={24} /></button>
        </div>
      </div>

      <div className="px-6 flex gap-4 -mt-5">
        <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm text-center border border-gray-100">
          <div className="text-blue-600 font-bold text-xl">{citados.length}</div>
          <div className="text-[9px] text-gray-400 font-bold">CITAS</div>
        </div>
        <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm text-center border border-gray-100">
          <div className="text-green-600 font-bold text-xl">{citados.filter(c => c.atendido).length}</div>
          <div className="text-[9px] text-gray-400 font-bold">ATENDIDOS</div>
        </div>
      </div>

      <div className="px-6 mt-6 pb-24">
        <h6 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4">Lista de Pacientes</h6>
        {loading ? (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <span className="text-sm text-gray-400">Actualizando...</span>
          </div>
        ) : (
          citados.map(paciente => (
            <div key={paciente.id} className="bg-white rounded-2xl p-4 shadow-sm mb-3 flex items-center border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="mr-4 text-center min-w-[50px]">
                <div className="font-bold text-gray-800">{paciente.horainicio}</div>
                <div className="text-[9px] text-gray-400">HORA</div>
              </div>
              <div className="h-10 w-[1px] bg-gray-100 mr-4"></div>
              <div className="flex-grow">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-800 text-xs uppercase truncate max-w-[120px]">{paciente.nombres}</span>
                  {paciente.pagado && <CheckCircle size={12} className="text-green-500" />}
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                   <Clock size={10} /> {paciente.servicioNombre}
                </div>
              </div>
              <button className="border-2 border-blue-500 text-blue-500 rounded-full px-3 py-1 text-[10px] font-bold hover:bg-blue-50">ATENDER</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const App = () => {
  const [activeTab, setActiveTab] = useState('agenda');

  const navItems = [
    { id: 'programacion', label: 'Programación', icon: CalendarDays },
    { id: 'facturacion', label: 'Facturación', icon: CreditCard },
    { id: 'agenda', label: 'Agenda', icon: ClipboardList },
    { id: 'atencion', label: 'Atención', icon: Stethoscope },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'agenda': return <AgendaMedicaView />;
      case 'programacion': return (
        <div className="p-10 text-center text-gray-400">
          <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
          <h2 className="font-bold text-gray-600">Programación Médica</h2>
          <p className="text-sm mt-2">Módulo de gestión de horarios y turnos.</p>
        </div>
      );
      case 'facturacion': return (
        <div className="p-10 text-center text-gray-400">
          <CreditCard size={48} className="mx-auto mb-4 opacity-20" />
          <h2 className="font-bold text-gray-600">Facturación</h2>
          <p className="text-sm mt-2">Seguimiento de pagos y reportes financieros.</p>
        </div>
      );
      case 'atencion': return (
        <div className="p-10 text-center text-gray-400">
          <Stethoscope size={48} className="mx-auto mb-4 opacity-20" />
          <h2 className="font-bold text-gray-600">Atención Médica</h2>
          <p className="text-sm mt-2">Historia clínica y registro de consultas.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20">
      
      {/* Contenido Principal */}
      <main className="max-w-md mx-auto min-h-screen">
        {renderContent()}
      </main>

      {/* Footer / Barra de Navegación */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-50">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
                style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                <div className={`p-1 rounded-xl ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}>
                  <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <style>{`
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;