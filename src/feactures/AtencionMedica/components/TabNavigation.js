import React from 'react';
import { 
  Thermometer, 
  Stethoscope, 
  Lightbulb, 
  Microscope, 
  Pill, 
  CheckCircle, 
  PenTool 
} from 'lucide-react';

const TABS = [
  { id: 'triaje', label: 'Signos', icon: Thermometer },
  { id: 'diseaseAndExam', label: 'Anamnesis', icon: Stethoscope },
  { id: 'diagnosis', label: 'Diag', icon: Lightbulb },
  { id: 'exams', label: 'Orden', icon: Microscope },
  { id: 'medication', label: 'Receta', icon: Pill },
  { id: 'discharge', label: 'Alta', icon: CheckCircle },
  { id: 'signature', label: 'Firma ', icon: PenTool },
];

export const TabNavigation = ({ activeTab, onSelectTab, isDisabled = false }) => {
  return (
    <nav
      aria-label="Navegación de Historia Clínica"
      style={{
        display: 'flex',
        gap: '6px',
        padding: '6px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflowX: 'auto',
        marginBottom: '16px',
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)'
      }}
    >
      {TABS.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 6px',
              border: 'none',
              borderRadius: '7px',
              backgroundColor: isActive ? '#0284c7' : 'transparent',
              color: isActive ? '#ffffff' : '#64748b',
              fontWeight: isActive ? '600' : '500',
              fontSize: '13px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.5 : 1,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive ? '0 2px 4px rgba(2, 132, 199, 0.25)' : 'none'
            }}
          >
            <IconComponent 
              size={16} 
              style={{ 
                color: isActive ? '#ffffff' : '#0284c7',
                transition: 'color 0.2s ease'
              }} 
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default TabNavigation;