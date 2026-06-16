import React from 'react';
import { CheckCircle, Printer, Download, ArrowRight } from 'lucide-react';

function ModalExitoFirma({ isOpen, documentos, onCerrar }) {
  if (!isOpen || !documentos) return null;

  // Función para mandar a imprimir directamente consumiendo la API sin descargar el archivo al disco
  const handleImprimirDirecto = (urlDocumento) => {
    const ventanaImpresion = window.open(urlDocumento, '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.focus();
      // Nota: Si el backend devuelve los headers correctos de PDF, 
      // el navegador mostrará su interfaz nativa de impresión/guardado.
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '16px' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', maxWidth: '480px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', backgroundColor: '#dcfce7', borderRadius: '50%', marginBottom: '16px' }}>
          <CheckCircle size={32} color="#15803d" />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
          ¡Atención Guardada y Firmada!
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
          El acto médico se registró correctamente. Los documentos oficiales ya incluyen su rúbrica y sello digitalizado.
        </p>

        {/* Bloque de opciones de documentos a demanda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', textAlign: 'left' }}>
          
          {/* Ficha Clínica */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>📄 Ficha Clínica HCE</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleImprimirDirecto(documentos.urlFicha)} style={{ padding: '6px 10px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Printer size={13} /> Ver/Imprimir
              </button>
            </div>
          </div>

          {/* Receta e Indicaciones */}
          {documentos.tieneReceta && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>💊 Receta Médica</span>
              <button onClick={() => handleImprimirDirecto(documentos.urlReceta)} style={{ padding: '6px 10px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Printer size={13} /> Ver/Imprimir
              </button>
            </div>
          )}
        </div>

        {/* Botón de salida para liberar la pantalla */}
        <button
          onClick={onCerrar}
          style={{ width: '100%', padding: '12px', backgroundColor: '#475569', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <span>Siguiente Cita</span>
          <ArrowRight size={14} />
        </button>

      </div>
    </div>
  );
}

export default ModalExitoFirma;