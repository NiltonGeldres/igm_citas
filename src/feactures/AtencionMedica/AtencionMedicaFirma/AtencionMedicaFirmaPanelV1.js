import React, { useState } from 'react';
import { Save, CheckCircle, Printer, Download, ShieldCheck, FileText, Stethoscope, Activity } from 'lucide-react';
import { AtencionMedicaDocumentoHC } from './AtencionMedicaDocumentoHC';
import { AtencionMedicaDocumentoOrdenes } from './AtencionMedicaDocumentoOrdenes';
import { AtencionMedicaDocumentoReceta } from './AtencionMedicaDocumentoReceta';
import { Microscope, Pill } from 'lucide-react';

function AtencionMedicaFirmaPanelV1({
  sectionsData = {},
  ejecutarGuardadoYFirmaFinal,
  imprimirDocumentosPaciente,
  fullMedicalRecord,
  showModalMessage,
  patientData = {},
  atencionFirmada = false,
  jsonFirmadoUrl = null
}) {
  const [loadingFirma, setLoadingFirma] = useState(false);
  const [vistaDocumento, setVistaDocumento] = useState('hc'); // 'hc' | 'ordenes' | 'receta'

  // Normalización de listas
  const listaMedicamentos = sectionsData.PanelMedicacion || sectionsData.PanelTratamientos || [];
  const listaExamenes = sectionsData.PanelPlanTrabajo || [];
  const listaAlta = sectionsData.PanelAlta || [];

  const handleFirmarAccion = async () => {
    try {
      setLoadingFirma(true);
      await ejecutarGuardadoYFirmaFinal();
    } catch (error) {
      if (showModalMessage) {
        showModalMessage("Error al procesar la firma digital.");
      }
    } finally {
      setLoadingFirma(false);
    }
  };

  return (
    <div className="sub-window-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* 1. CABECERA FIJA */}
      {!atencionFirmada ? (
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '12px 18px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#0284c7" /> Resumen de Atención para Conformidad
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Revise los datos clínicos ingresados antes de proceder a la firma digital y cierre del acto médico.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFirmarAccion}
            disabled={loadingFirma}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: loadingFirma ? '#94a3b8' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: loadingFirma ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(22,163,74,0.2)'
            }}
          >
            {loadingFirma ? <span>Procesando...</span> : <><Save size={15} /> SELLAR Y FIRMAR ATENCIÓN</>}
          </button>
        </div>
      ) : (
        <div
          className="no-print"
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderLeft: '5px solid #16a34a',
            padding: '12px 18px',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={22} color="#16a34a" />
            <div>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>
                Atención Médica Firmada Digitalmente
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569' }}>
                El acto médico ha sido registrado y sellado.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {jsonFirmadoUrl && (
              <a
                href={jsonFirmadoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                <Download size={14} /> JSON Firmado
              </a>
            )}

            <button
              type="button"
              onClick={imprimirDocumentosPaciente}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Printer size={14} /> Imprimir Documentos
            </button>
          </div>
        </div>
      )}





{/* SUB-BOTONES MINIMALISTAS (SOLO ÍCONOS/SIGLAS) */}
<div
  className="no-print"
  style={{
    display: 'flex',
    gap: '12px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '8px',
    marginBottom: '16px'
  }}
>
  {[
    { id: 'hc', type: 'text', content: 'HC', title: 'Historia Clínica' },
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
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: isSelected ? '#1d4ed8' : '#3b82f6',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          opacity: isSelected ? 1 : 0.7,
          boxShadow: isSelected ? '0 2px 4px rgba(29, 78, 216, 0.3)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        {item.type === 'text' ? (
          <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            {item.content}
          </span>
        ) : (
          <Icono size={18} color="#ffffff" />
        )}
      </span>
    );
  })}
</div>

      {/* 3. CONMUTADOR DE SUBCOMPONENTES */}
      <div>
        {vistaDocumento === 'hc' && (
          <AtencionMedicaDocumentoHC
            fullMedicalRecord={fullMedicalRecord}
            showModalMessage={showModalMessage}
          />
        )}

        {vistaDocumento === 'ordenes' && (
          <AtencionMedicaDocumentoOrdenes
            listaExamenes={listaExamenes}
            patientData={patientData}
          />
        )}

        {vistaDocumento === 'receta' && (
          <AtencionMedicaDocumentoReceta
            listaMedicamentos={listaMedicamentos}
            listaAlta={listaAlta}
            patientData={patientData}
          />
        )}
      </div>

    </div>
  );
}

export default AtencionMedicaFirmaPanelV1;