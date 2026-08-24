// src/feactures/AtencionMedica/components/TabNavigation.js
import React from 'react';

const TABS = [
  { id: 'triaje', label: 'Triaje' },
  { id: 'enfermedad', label: 'Enfermedad' },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'examenes', label: 'Exámenes' },
  { id: 'medicacion', label: 'Medicación' },
  { id: 'alta', label: 'Alta' },
  { id: 'firma', label: 'Firma y Cierre' },
];

export const TabNavigation = ({ activeTab, onSelectTab }) => {
  return (
    <nav style={{
      display: 'flex',
      gap: '8px',
      borderBottom: '2px solid #e9ecef',
      paddingBottom: '8px',
      marginBottom: '16px',
      overflowX: 'auto'
    }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: isActive ? '#0d6efd' : '#f8f9fa',
              color: isActive ? '#ffffff' : '#495057',
              fontWeight: isActive ? '600' : '400',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};