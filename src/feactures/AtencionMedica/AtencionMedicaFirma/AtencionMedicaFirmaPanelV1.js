import React, { useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';

import { ResumenClinicoBorradorCard } from './ResumenClinicoBorradorCard';
import { VisorPdfGCS } from './VisorPdfGCS';
import { BarraHerramientasFirma } from './BarraHerramientasFirma';

function AtencionMedicaFirmaPanelV1({
  sectionsData = {},
  attentionDetails = {},
  crearPdfBorrador,
  imprimirDocumentosPaciente,
  showModalMessage,
  estadoFirma = false,
  jsonFirmadoUrl = null,
  rutaPdfFirmado = null,
  documentosPdf = {} // 🟢 RECIBE EL OBJETO CON LAS 4 RUTAS
}) {
  const [loadingFirma, setLoadingFirma] = useState(false);
  const [vistaDocumento, setVistaDocumento] = useState('hc'); // 'hc' | 'ordenes' | 'receta' | 'indicaciones'

  const sourceDetails = Object.keys(attentionDetails).length > 0 ? attentionDetails : sectionsData;

  const handleGenerarPdfAccion = async () => {
    if (typeof crearPdfBorrador !== 'function') {
      showModalMessage?.("Error: La función crearPdfBorrador no está conectada.");
      return;
    }

    try {
      setLoadingFirma(true);
      await crearPdfBorrador();
    } catch (error) {
      console.error("Error al ejecutar prepararPdf:", error);
      showModalMessage?.("Error al procesar la preparación del PDF.");
    } finally {
      setLoadingFirma(false);
    }
  };

  // 🟢 MAPEA LA PESTAÑA SELECCIONADA CON SU RESPECTIVA RUTA PDF
  const obtenerUrlSegunVista = () => {
    switch (vistaDocumento) {
      case 'hc':
        return documentosPdf?.hc || rutaPdfFirmado;
      case 'ordenes':
        return documentosPdf?.ordenes;
      case 'receta':
        return documentosPdf?.receta;
      case 'indicaciones':
        return documentosPdf?.indicaciones;
      default:
        return rutaPdfFirmado;
    }
  };

  const TITULOS_DOCUMENTO = {
    hc: 'Historia Clínica Digital',
    ordenes: 'Órdenes Médicas',
    receta: 'Receta Médica',
    indicaciones: 'Indicaciones Médicas'
  };

  return (
    <div className="sub-window-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* ESTADO 1: ANTES DE GENERAR PDF BORRADOR */}
      {estadoFirma === "BORRADOR" ? (
        <div className="no-print" style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#0284c7" /> Cierre del Acto Médico y Conformidad
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Verifique los datos clínicos registrados. Al generar el borrador se congelará el expediente y se creará la vista previa en PDF.
              </p>
            </div>
            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', border: '1px solid #fde68a' }}>
              BORRADOR EN EDICIÓN
            </span>
          </div>

          <ResumenClinicoBorradorCard sourceDetails={sourceDetails} />

          <button
            type="button"
            onClick={handleGenerarPdfAccion}
            disabled={loadingFirma}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              backgroundColor: loadingFirma ? '#94a3b8' : '#16a34a', color: '#ffffff',
              border: 'none', borderRadius: '8px', padding: '14px', fontSize: '14px', fontWeight: '700',
              cursor: loadingFirma ? 'not-allowed' : 'pointer'
            }}
          >
            {loadingFirma ? (
              <span>Procesando y generando PDF en Cloud Storage...</span>
            ) : (
              <>
                <Save size={18} /> GENERAR PDF BORRADOR
              </>
            )}
          </button>
        </div>
      ) : (
        
        /* ESTADO 2: SE MUESTRA EL VISOR CON LA RUTA DINÁMICA DE LA PESTAÑA SELECCIONADA */
        <>
          <BarraHerramientasFirma
            vistaDocumento={vistaDocumento}
            setVistaDocumento={setVistaDocumento}
          />

          <div>
            <VisorPdfGCS 
              key={vistaDocumento} // key dinámica fuerza la recarga limpia del iframe
              urlPdfFirmado={obtenerUrlSegunVista()} 
              titulo={`${TITULOS_DOCUMENTO[vistaDocumento] || 'Documento Médico'} - Borrador GCS`} 
            />
          </div>
        </>
      )}

    </div>
  );
}

export default AtencionMedicaFirmaPanelV1;