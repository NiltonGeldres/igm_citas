import React from 'react';
import { Layout, Pill, Save, FileText } from 'lucide-react';
import AtencionMedicaFirmaPanel from './AtencionMedicaFirmaPanel';

function AtencionMedicaFirmaPanelV1({
  subTabFirma,
  setSubTabFirma,
  sectionsData = {},
  ejecutarGuardadoYFirmaFinal,
  imprimirFichaCompleta,
  imprimirDocumentosPaciente,
  modoImpresion,
  fullMedicalRecord,
  showModalMessage,
  patientData = {}
}) {
  
  const totalDocumentos =
    (sectionsData.PanelMedicacion?.length || 0) +
    (sectionsData.PanelPlanTrabajo?.length || 0);

  return (
    <div className="sub-window-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub-Botonera Superior: Conmutador de ventanas en Pantalla */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          backgroundColor: '#ffffff',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setSubTabFirma('vista-ficha')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: subTabFirma === 'vista-ficha' ? '#e0f2fe' : 'transparent',
              color: subTabFirma === 'vista-ficha' ? '#0369a1' : '#64748b',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Layout size={15} />
            <span>Historia</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTabFirma('vista-documentos')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: subTabFirma === 'vista-documentos' ? '#dcfce7' : 'transparent',
              color: subTabFirma === 'vista-documentos' ? '#15803d' : '#64748b',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Pill size={15} />
            <span>Órden y Receta ({totalDocumentos})</span>
          </button>
        </div>

        {/* Botón de Acción Principal unificado para Guardar/Firmar todo el acto */}
        <button
          type="button"
          onClick={ejecutarGuardadoYFirmaFinal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(220,38,38,0.2)'
          }}
        >
          <Save size={16} />
          <span>Guardar </span>
        </button>
      </div>

      {/* SUBVENTANA 1: PANEL DE LA FICHA CLÍNICA COMPLETA */}
      {subTabFirma === 'vista-ficha' && (
        <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div className="no-print" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={imprimirFichaCompleta}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#0066ff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <FileText size={14} /> Imprimir HC
            </button>
          </div>

          <div id="documento-clinico-pdf" className={modoImpresion === 'completo' ? '' : 'print-hidden'}>
            <AtencionMedicaFirmaPanel
              medicalRecordData={fullMedicalRecord}
              onModalMessage={showModalMessage}
            />
          </div>
        </div>
      )}

{/* SUBVENTANA 2: CUPONES DE ATENCIÓN AL PACIENTE */}
{subTabFirma === 'vista-documentos' && (
  <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
    <div className="no-print" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', color: '#64748b' }}>
        Estos documentos se imprimen desglosados en hojas independientes para el paciente.
      </span>
      <button
        type="button"
        onClick={imprimirDocumentosPaciente}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#16a34a',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        <Pill size={14} /> Imprimir
      </button>
    </div>

    {/* Renderizado exclusivo en pantalla dentro de su propia subventana */}
    <div id="documentos-desglosados-paciente" className={modoImpresion === 'desglosado' ? '' : 'print-hidden'} style={{ fontFamily: 'sans-serif' }}>
      
      {/* RECETA FARMACIA */}
      {sectionsData.PanelMedicacion?.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '20px', pageBreakInside: 'avoid', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>📋 RECETA MÉDICA (FARMACIA)</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '8px', fontSize: '12px', borderRadius: '4px', marginBottom: '10px', color: '#334155' }}>
            <strong>Paciente:</strong> {patientData.name} &nbsp;|&nbsp; <strong>H.C.:</strong> {patientData.hc || 'N/A'}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Medicamento / Presentación</th>
                <th style={{ padding: '6px', textAlign: 'center', color: '#475569', width: '80px' }}>Cant.</th>
              </tr>
            </thead>
            <tbody>
              {sectionsData.PanelMedicacion.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px', color: '#1e293b' }}>💊 <strong>{item.descripcion}</strong></td>
                  <td style={{ padding: '6px', textAlign: 'center', fontWeight: '700', color: '#16a34a', fontSize: '14px' }}>{item.cantidad} u.</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '200px', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '11px', paddingTop: '4px', color: '#475569' }}>Firma y Sello Médico</div>
          </div>
          <div className="no-print" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '10px', marginTop: '15px', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>✂️ CORTAR AQUÍ ✂️</div>
        </div>
      )}

      {/* INDICACIONES PACIENTE */}
      {sectionsData.PanelMedicacion?.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '20px', pageBreakInside: 'avoid', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>📌 INDICACIONES DE USO (PACIENTE)</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '8px', fontSize: '12px', borderRadius: '4px', marginBottom: '10px', color: '#334155' }}>
            <strong>Paciente:</strong> {patientData.name} &nbsp;|&nbsp; <strong>H.C.:</strong> {patientData.hc || 'N/A'}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Medicamento</th>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Vía</th>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Dosis</th>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Frecuencia</th>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Duración</th>
              </tr>
            </thead>
            <tbody>
              {sectionsData.PanelMedicacion.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px', fontWeight: '600', color: '#1e293b' }}>{item.descripcion}</td>
                  <td style={{ padding: '6px', color: '#334155' }}>{item.via || 'Oral'}</td>
                  <td style={{ padding: '6px', color: '#334155' }}>{item.dosis}</td>
                  <td style={{ padding: '6px', color: '#334155' }}>Cada {item.frecuencia} hrs</td>
                  <td style={{ padding: '6px', fontWeight: '700', color: '#2563eb' }}>{item.periodo} días</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* FIX REALIZADO AQUÍ PARA PANEL ALTA */}
          {sectionsData.PanelAlta?.length > 0 && (
            <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#fff7ed', borderRadius: '4px', border: '1px solid #ffedd5', fontSize: '11px', color: '#c2410c' }}>
              <strong>⚠️ Indicación Especial:</strong> {sectionsData.PanelAlta[0]?.descripcionAlta || 'Sin especificación'}
            </div>
          )}

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '200px', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '11px', paddingTop: '4px', color: '#475569' }}>Indicaciones Médicas</div>
          </div>
          <div className="no-print" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '10px', marginTop: '15px', borderTop: '1px dashed #e2e8f0', paddingTop: '6px' }}>✂️ CORTAR AQUÍ ✂️</div>
        </div>
      )}

      {/* ORDEN DE EXÁMENES */}
      {sectionsData.PanelPlanTrabajo?.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '20px', pageBreakInside: 'avoid', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>🔬 ORDEN DE EXÁMENES AUXILIARES</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '8px', fontSize: '12px', borderRadius: '4px', marginBottom: '10px', color: '#334155' }}>
            <strong>Paciente:</strong> {patientData.name} &nbsp;|&nbsp; <strong>H.C.:</strong> {patientData.hc || 'N/A'}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569', width: '120px' }}>Código</th>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569' }}>Examen / Procedimiento</th>
                <th style={{ padding: '6px', textAlign: 'left', color: '#475569', width: '120px' }}>Área</th>
              </tr>
            </thead>
            <tbody>
              {sectionsData.PanelPlanTrabajo.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px', fontFamily: 'monospace', color: '#64748b' }}>{item.codigoProcedimiento || 'N/A'}</td>
                  <td style={{ padding: '6px', fontWeight: '600', color: '#1e293b' }}>🔬 {item.examen}</td>
                  <td style={{ padding: '6px' }}><span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' }}>{item.tipoExamen || 'Laboratorio'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '200px', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '11px', paddingTop: '4px', color: '#475569' }}>Médico Solicitante</div>
          </div>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}

export default AtencionMedicaFirmaPanelV1;