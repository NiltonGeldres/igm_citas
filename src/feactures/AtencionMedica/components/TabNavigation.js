import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  FileText, 
  TestTube, 
  Pill, 
  CheckCircle2, 
  FileSignature 
} from 'lucide-react';

const TABS = [
  { id: 'triaje', label: 'Signos', icon: Activity },
  { id: 'diseaseAndExam', label: 'Anamnesis', icon: Stethoscope },
  { id: 'diagnosis', label: 'Diag', icon: FileText },
  { id: 'exams', label: 'Orden', icon: TestTube },
  { id: 'medication', label: 'Receta', icon: Pill },
  { id: 'discharge', label: 'Alta', icon: CheckCircle2 },
  { id: 'signature', label: 'Fin', icon: FileSignature },
];

export const TabNavigation = ({ activeTab, onSelectTab, isDisabled = false }) => {
  return (
    <nav
      aria-label="Navegación de Historia Clínica"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        padding: '0 4px',
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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '54px', // GARANTIZA ALTURA CONFORTABLE Y PROPORCIONADA
              padding: '6px 2px',
              border: 'none',
              borderBottom: isActive ? '3px solid #0066FF' : '3px solid transparent',
              backgroundColor: isActive ? '#EFF6FF' : 'transparent',
              borderRadius: '8px 8px 0 0',
              color: isActive ? '#0066FF' : '#64748B',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.35 : 1,
              transition: 'all 0.18s ease-in-out',
              outline: 'none',
              width: '100%',
              minWidth: 0
            }}
          >
            <IconComponent 
              size={isActive ? 19 : 18} 
              strokeWidth={isActive ? 2.3 : 1.8}
              style={{ 
                color: isActive ? '#0066FF' : '#64748B',
                flexShrink: 0,
                transition: 'transform 0.15s ease'
              }} 
            />
            
            <span 
              style={{ 
                fontSize: '11px',
                fontWeight: isActive ? '700' : '600',
                lineHeight: '1.1',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                color: isActive ? '#0066FF' : '#64748B',
                letterSpacing: '-0.1px'
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