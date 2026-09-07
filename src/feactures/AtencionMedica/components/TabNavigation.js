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
  { id: 'signature', label: 'Fin', icon: PenTool },
];

export const TabNavigation = ({ activeTab, onSelectTab, isDisabled = false }) => {
  return (
    <nav
      aria-label="Navegación de Historia Clínica"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)', // Fuerza distribución equitativa de las 7 pestañas
        gap: '2px',
        padding: '4px 2px 0 2px',
        backgroundColor: '#ffffff',
        width: '100%',
        boxSizing: 'border-box'
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
              flexDirection: 'column', // Ícono arriba, texto abajo para ahorrar ancho
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '6px 2px',
              border: 'none',
              borderBottom: isActive ? '2.5px solid #0284c7' : '2.5px solid transparent',
              backgroundColor: isActive ? '#f0f9ff' : 'transparent', // Ligero fondo al estar activo
              borderRadius: '6px 6px 0 0',
              color: isActive ? '#0284c7' : '#64748b',
              fontWeight: isActive ? '700' : '500',
              fontSize: '11px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.4 : 1,
              transition: 'all 0.15s ease',
              outline: 'none',
              width: '100%',
              minWidth: 0 // Previene desbordamientos de flex/grid
            }}
          >
            <IconComponent 
              size={15} 
              style={{ 
                color: isActive ? '#0284c7' : '#64748b',
                flexShrink: 0
              }} 
            />
            <span 
              style={{ 
                fontSize: '10.5px',
                lineHeight: '1',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default TabNavigation;