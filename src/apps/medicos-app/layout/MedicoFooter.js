import { CalendarDays, CreditCard, ClipboardList, Stethoscope } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const MedicoFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

const menuItems = [
  { id: 'prog', label: 'Programación', icon: CalendarDays, path: '/med/scheduling' },
  { id: 'fact', label: 'Facturación', icon: CreditCard, path: '/med/billing' },
  { id: 'agenda', label: 'Agenda', icon: ClipboardList, path: '/med/agenda' },
  { id: 'atencion-medica', label: 'Atención', icon: Stethoscope, path: '/med/atencion-medica', ocultarEnFooter: true },];


  return (
    <nav className="medico-footer">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div 
            key={item.id} 
            className={`footer-item ${isActive ? 'active' : ''}`}
            onClick={() => {
              // Evitamos que haga clic directo si por alguna razón intenta regresar usando este botón
    //          if (item.id === 'atencion-medica') return; 
              navigate(item.path);
            }}
            style={item.id === 'atencion-medica' ? { cursor: 'default' } : {}}

//            onClick={() => navigate(item.path)}
          >
            <item.icon size={22} color={isActive ? '#0078f5' : '#6c757d'} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
};