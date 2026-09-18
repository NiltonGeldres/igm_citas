import React from 'react';
import { FileText, Pill, ClipboardList, Microscope } from 'lucide-react';

export function BarraHerramientasFirma({ 
  vistaDocumento, 
  setVistaDocumento 
}) {
  const DOCUMENT_TABS = [
    { id: 'hc', label: 'HC', icon: FileText, title: 'Historia Clínica' },
    { id: 'receta', label: 'Receta', icon: Pill, title: 'Receta Médica' },
    { id: 'ordenes', label: 'Orden', icon: ClipboardList, title: 'Órdenes Médicas' },
    { id: 'indicaciones', label: 'Indicación', icon: Microscope, title: 'Indicaciones Médicas' }
  ];

  return (
    <aside
      style={{
        width: '110px',
        backgroundColor: '#1e293b',
        padding: '20px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px'
      }}
    >
      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px' }}>
        DOCUMENTOS
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
        {DOCUMENT_TABS.map((item) => {
          const isSelected = vistaDocumento === item.id;
          const Icono = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setVistaDocumento(item.id)}
              title={item.title}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                border: isSelected ? '2px solid #0284c7' : '1px solid #334155',
                backgroundColor: isSelected ? '#0284c7' : '#334155',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icono size={20} color="#ffffff" />
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#ffffff' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default BarraHerramientasFirma;