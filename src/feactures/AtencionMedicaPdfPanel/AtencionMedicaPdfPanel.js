// src/features/AtencionMedica/components/AtencionMedicaPdfPanel.js
import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, AlertCircle, User, Activity, Stethoscope, Pill, TestTube } from 'lucide-react';

function AtencionMedicaPdfPanel({ medicalRecordData }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { patient, attentionDetails } = medicalRecordData || {};

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      // Simulación de generación / llamada al servicio de PDF del backend o html2pdf/jsPDF
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log('Generando PDF con la data:', medicalRecordData);
      alert('Documento generado exitosamente para firma digital.');
    } catch (error) {
      console.error('Error al generar PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER DE ACCIONES */}
      <div style={styles.actionHeader}>
        <div>
          <h3 style={styles.title}>Vista Previa y Cierre de Consulta</h3>
          <p style={styles.subtitle}>Verifique los datos consolidados antes de proceder con la firma digital.</p>
        </div>
        <button 
          onClick={handleDownloadPdf} 
          disabled={isGenerating}
          style={isGenerating ? { ...styles.downloadBtn, ...styles.disabledBtn } : styles.downloadBtn}
        >
          {isGenerating ? (
            <span>Generando PDF...</span>
          ) : (
            <>
              <Download size={16} />
              <span>Generar Documento / Firmar</span>
            </>
          )}
        </button>
      </div>

      {/* HOJA DE VISTA PREVIA (SIMULACIÓN DE HISTORIA CLÍNICA PDF) */}
      <div style={styles.paperContainer}>
        
        {/* ENCABEZADO DEL DOCUMENTO */}
        <div style={styles.docHeader}>
          <div>
            <h2 style={styles.docTitle}>INFORME DE ATENCIÓN MÉDICA</h2>
            <span style={styles.docSubtitle}>Historia Clínica Ambulatoria</span>
          </div>
          <div style={styles.badgeSuccess}>
            <CheckCircle2 size={14} />
            <span>Listo para cierre</span>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* 1. SECCIÓN PACIENTE */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <User size={16} color="#0d6efd" />
            <h4 style={styles.sectionTitle}>1. DATOS DEL PACIENTE</h4>
          </div>
          <div style={styles.gridTwoCols}>
            <p style={styles.dataText}><strong>Nombre:</strong> {patient?.name || '---'}</p>
            <p style={styles.dataText}><strong>N° Historia Clínica:</strong> {patient?.hc || '---'}</p>
          </div>
        </div>

        {/* 2. SIGNOS VITALES / TRIAJE */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Activity size={16} color="#0d6efd" />
            <h4 style={styles.sectionTitle}>2. TRIAJE Y SIGNOS VITALES</h4>
          </div>
          {patient?.triaje && patient.triaje.length > 0 ? (
            <div style={styles.triajeGrid}>
              {patient.triaje.map((t) => (
                <div key={t.id || t.nombre} style={styles.triajeCard}>
                  <span style={styles.triajeLabel}>{t.nombre}:</span>
                  <span style={styles.triajeValue}>{t.valor ? `${t.valor} ${t.unidad}` : 'Sin registro'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>No hay registros de triaje asociados.</p>
          )}
        </div>

        {/* 3. ANAMNESIS Y EXAMEN FÍSICO */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Stethoscope size={16} color="#0d6efd" />
            <h4 style={styles.sectionTitle}>3. ENFERMEDAD ACTUAL Y EXAMEN FÍSICO</h4>
          </div>
          <div style={styles.blockText}>
            <p style={styles.blockTitle}>Antecedentes:</p>
            <p style={styles.blockContent}>{attentionDetails?.PanelAntecedentes || 'Sin antecedentes registrados.'}</p>
          </div>
          <div style={styles.blockText}>
            <p style={styles.blockTitle}>Anamnesis / Síntomas:</p>
            <p style={styles.blockContent}>{attentionDetails?.PanelSintomas || 'Sin registro de síntomas.'}</p>
          </div>
          <div style={styles.blockText}>
            <p style={styles.blockTitle}>Hallazgos Examen Físico:</p>
            <p style={styles.blockContent}>{attentionDetails?.PanelExamenFisico || 'Sin hallazgos particulares.'}</p>
          </div>
        </div>

        {/* 4. DIAGNÓSTICOS */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FileText size={16} color="#0d6efd" />
            <h4 style={styles.sectionTitle}>4. DIAGNÓSTICOS (CIE-10)</h4>
          </div>
          {attentionDetails?.PanelDiagnostico && attentionDetails.PanelDiagnostico.length > 0 ? (
            <ul style={styles.list}>
              {attentionDetails.PanelDiagnostico.map((d, index) => (
                <li key={d.id || index} style={styles.listItem}>
                  <strong>{d.codigo || d.cie10}</strong> - {d.descripcion || d.nombre} ({d.tipo || 'Presuntivo'})
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyText}>No se registraron diagnósticos.</p>
          )}
        </div>

        {/* 5. PLAN DE TRABAJO Y EXÁMENES */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <TestTube size={16} color="#0d6efd" />
            <h4 style={styles.sectionTitle}>5. EXÁMENES Y PROCEDIMIENTOS</h4>
          </div>
          {attentionDetails?.PanelPlanTrabajo && attentionDetails.PanelPlanTrabajo.length > 0 ? (
            <ul style={styles.list}>
              {attentionDetails.PanelPlanTrabajo.map((ex, index) => (
                <li key={ex.id || index} style={styles.listItem}>
                  {ex.nombre || ex.descripcion}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyText}>No se solicitaron exámenes auxiliares.</p>
          )}
        </div>

        {/* 6. MEDICAClÓN / TRATAMIENTO */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Pill size={16} color="#0d6efd" />
            <h4 style={styles.sectionTitle}>6. TRATAMIENTO Y RECETA</h4>
          </div>
          {attentionDetails?.PanelTratamientos && attentionDetails.PanelTratamientos.length > 0 ? (
            <ul style={styles.list}>
              {attentionDetails.PanelTratamientos.map((med, index) => (
                <li key={med.id || index} style={styles.listItem}>
                  <strong>{med.nombre || med.medicamento}</strong> - {med.indicaciones || `${med.dosis || ''} ${med.frecuencia || ''}`}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.emptyText}>No se recetaron medicamentos.</p>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { padding: '8px' },
  actionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0 },
  subtitle: { fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' },
  downloadBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0d6efd', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
  disabledBtn: { opacity: 0.6, cursor: 'not-allowed' },
  paperContainer: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  docHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  docTitle: { fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 },
  docSubtitle: { fontSize: '12px', color: '#64748b' },
  badgeSuccess: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  divider: { margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' },
  section: { marginBottom: '20px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#334155', margin: 0 },
  gridTwoCols: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px' },
  dataText: { fontSize: '12px', color: '#334155', margin: 0 },
  triajeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' },
  triajeCard: { backgroundColor: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11px' },
  triajeLabel: { color: '#64748b', display: 'block' },
  triajeValue: { fontWeight: '700', color: '#0f172a' },
  blockText: { marginBottom: '8px' },
  blockTitle: { fontSize: '11px', fontWeight: '600', color: '#64748b', margin: '0 0 2px 0' },
  blockContent: { fontSize: '12px', color: '#1e293b', margin: 0, backgroundColor: '#f8fafc', padding: '8px', borderRadius: '4px' },
  list: { margin: 0, paddingLeft: '18px' },
  listItem: { fontSize: '12px', color: '#1e293b', marginBottom: '4px' },
  emptyText: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }
};

export default AtencionMedicaPdfPanel;