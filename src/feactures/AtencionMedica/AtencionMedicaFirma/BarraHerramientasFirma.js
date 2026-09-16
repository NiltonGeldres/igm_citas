import React from 'react';
import { CheckCircle, Microscope, Pill, FileText,ClipboardList ,Clock} from 'lucide-react';

export function BarraHerramientasFirma({ 
  vistaDocumento, 
  setVistaDocumento,
  estadoFirma 
}) {
  const DOCUMENT_TABS = [
    { id: 'hc', label: 'HC', icon: FileText, title: 'Historia Clínica (PDF)' },
    { id: 'ordenes', label: 'Órdenes', icon: Microscope, title: 'Órdenes Médicas' },
    { id: 'receta', label: 'Receta', icon: Pill, title: 'Receta Médica' },
    { id: 'indicaciones', label: 'Indicaciones', icon: ClipboardList, title: 'indicaciones Médicas' }
  ];
  const CONFIG_ESTADO_FIRMA = {
    PENDIENTE_FIRMA: {
      texto: "Atención Médica Guardada (Pendiente de Firma)",
      colorIcono: "#ec700a", // Azul para indicar que falta completar un paso
      icono: Clock
    },
    FIRMADO: {
      texto: "Atención Médica Guardada y Firmada Digitalmente",
      colorIcono: "#16a34a", // Verde indicando éxito/completado
      icono: CheckCircle
    }
  };


  return (
    <div 
      className="no-print" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '6px 12px',
        gap: '12px'
      }}
    >
      {/* LADO IZQUIERDO: Mensaje informativo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        {(() => {
          const estado = (estadoFirma || '').toUpperCase();
          const config = CONFIG_ESTADO_FIRMA[estado] || {
            texto: `Atención Médica Guardada (${estadoFirma})`,
            colorIcono: "#64748b",
            icono: CheckCircle
          };
          const IconoEstado = config.icono;

          return (
            <>
              <IconoEstado size={40} color={config.colorIcono} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#f1750e', fontWeight: '600' }}>
                {config.texto}
              </span>
            </>
          );
        })()}
      </div>

      {/* LADO DERECHO: Barra estilo Visor de PDF (Fondo oscuro e íconos limpios) */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          backgroundColor: '#323639', // Gris oscuro del visor PDF
          padding: '4px 8px',
          borderRadius: '6px',
          flexShrink: 0 
        }}
      >
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
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                border: 'none',
                borderRadius: '50%', // Forma circular tipo botón de acción
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: isSelected ? '#ffffff' : '#9ca3af',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, color 0.15s ease',
                outline: 'none',
                padding: 0
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              {item.id === 'hc' ? (
                <span style={{ fontSize: '11px', fontWeight: '800', lineHeight: 1 }}>HC</span>
              ) : (
                <Icono size={18} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}