import { CalendarDays, FileText, ClipboardList } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgramacionHorarioIndividualService from "../../../../components/ProgramacionHorarioIndividual/ProgramacionMedicaIndividualService";
export const MedicoFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'prog', label: 'Programación', icon: CalendarDays, path: '/med/scheduling' },
    { id: 'fact', label: 'Facturación', icon: FileText, path: '/med/billing' },
    { id: 'agenda', label: 'Agenda', icon: ClipboardList, path: '/med/agenda' },
  ];

  return (
    <nav className="medico-footer">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div 
            key={item.id} 
            className={`footer-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={22} color={isActive ? '#0078f5' : '#6c757d'} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
};