import React from 'react';
import { CheckCircle, Download, Printer, Microscope, Pill } from 'lucide-react';

export function BarraHerramientasFirma({ 
  jsonFirmadoUrl, 
  imprimirDocumentosPaciente, 
  vistaDocumento, 
  setVistaDocumento 
}) {
  return (
    <>
      <div className="no-print" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #16a34a', padding: '12px 18px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={22} color="#16a34a" />
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>
              Atención Médica Guardada y Documento Generado
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569' }}>
              Consulte el PDF borrador antes de proceder con el firmado final.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {jsonFirmadoUrl && (
            <a href={jsonFirmadoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
              <Download size={14} /> JSON Firmado
            </a>
          )}
          <button type="button" onClick={imprimirDocumentosPaciente} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            <Printer size={14} /> Imprimir Documentos
          </button>
        </div>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        {[
          { id: 'hc', type: 'text', content: 'HC', title: 'Historia Clínica (PDF GCS)' },
          { id: 'ordenes', type: 'icon', icon: Microscope, title: 'Órdenes Médicas' },
          { id: 'receta', type: 'icon', icon: Pill, title: 'Receta Medicamentos' }
        ].map((item) => {
          const isSelected = vistaDocumento === item.id;
          const Icono = item.icon;
          return (
            <span
              key={item.id}
              onClick={() => setVistaDocumento(item.id)}
              title={item.title}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: isSelected ? '#1d4ed8' : '#3b82f6',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', opacity: isSelected ? 1 : 0.7, transition: 'all 0.15s ease'
              }}
            >
              {item.type === 'text' ? (
                <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '800' }}>{item.content}</span>
              ) : (
                <Icono size={18} color="#ffffff" />
              )}
            </span>
          );
        })}
      </div>
    </>
  );
}