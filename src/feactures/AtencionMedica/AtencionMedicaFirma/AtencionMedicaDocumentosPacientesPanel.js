// src/components/AtencionMedica/AtencionMedicaDocumentosPacientesPanel.js
import React from 'react';
import { Download, Pill, FileSpreadsheet, Activity } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

function AtencionMedicaDocumentosPacientesPanel({ medicalRecordData }) {
  const { user } = useAuth();

  const handleImprimirCupones = () => {
    window.print();
  };

  if (!medicalRecordData) return null;

  const { patient = {}, attentionDetails = {} } = medicalRecordData;
  const entidadNombre = user?.nombreEntidad || 'CLINICA REGALADO SAC';
  const nombreMedico = user?.nombresUsuario || 'Regalado Monteverde Miguel Angel';
  
  // Tus llaves reales confirmadas del backend
  const dataTratamientos = attentionDetails.PanelTratamientos || [];
  const dataExamenes = attentionDetails.PanelPlanTrabajo || [];

  // Estilos inline reutilizables para los cupones (Formato Media Hoja / Ticket de Corte)
  const styles = {
    cuponContenedor: {
      backgroundColor: '#ffffff',
      border: '2px dashed #cbd5e1',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '25px',
      position: 'relative',
      fontFamily: 'sans-serif',
      pageBreakInside: 'avoid', // Evita que un cupón se parta entre dos páginas
    },
    lineaCorte: {
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '11px',
      margin: '15px 0',
      borderTop: '1px dashed #cbd5e1',
      paddingTop: '5px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    cabecera: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: '8px',
      marginBottom: '12px'
    },
    tituloDoc: {
      margin: 0,
      fontSize: '14px',
      color: '#0f172a',
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    tablaFiliacion: {
      width: '100%',
      fontSize: '12px',
      color: '#334155',
      marginBottom: '12px',
      backgroundColor: '#f8fafc',
      padding: '6px 10px',
      borderRadius: '4px'
    },
    tablaDatos: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px',
      marginTop: '10px'
    },
    th: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      textAlign: 'left',
      padding: '8px',
      fontWeight: '600',
      borderBottom: '2px solid #e2e8f0'
    },
    td: {
      padding: '8px',
      borderBottom: '1px solid #f1f5f9',
      color: '#1e293b'
    },
    bloqueFirma: {
      marginTop: '35px',
      display: 'flex',
      justifyContent: 'flex-end',
      textAlign: 'center'
    },
    lineaFirma: {
      width: '200px',
      borderTop: '1px solid #94a3b8',
      paddingTop: '4px',
      fontSize: '11px',
      color: '#475569'
    }
  };

  // Plantilla para la filiación repetitiva en cada media hoja
  const renderFiliacionMinima = () => (
    <div style={styles.tablaFiliacion}>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: '12%', fontWeight: '600', color: '#64748b' }}>Paciente:</td>
            <td style={{ width: '58%', fontWeight: '700' }}>{patient.name}</td>
            <td style={{ width: '12%', fontWeight: '600', color: '#64748b' }}>H.C.:</td>
            <td style={{ width: '18%' }}>{patient.hc || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ marginTop: '30px' }}>
      
      {/* Botón de control de impresión (Solo visible en pantalla) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', backgroundColor: '#f0fdf4', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Pill size={18} color="#16a34a" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#14532d' }}>
            Documentos Desglosados para el Paciente (Formatos de entrega rápida)
          </span>
        </div>
        <button
          type="button"
          onClick={handleImprimirCupones}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)' }}
        >
          <Download size={14} strokeWidth={2.5} />
          <span>Imprimir Órdenes y Recetas</span>
        </button>
      </div>

      {/* CONTENEDOR DE IMPRESIÓN */}
      <div id="seccion-cupones-paciente">

        {/* ========================================== */}
        {/* DOCUMENTO 1: RECETA RETENIDA (FARMACIA)    */}
        {/* ========================================== */}
        {dataTratamientos.length > 0 && (
          <div style={styles.cuponContenedor}>
            <div style={styles.cabecera}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a' }}>🏥 {entidadNombre}</span>
                <h3 style={styles.tituloDoc}>📋 RECETA MÉDICA (FARMACIA)</h3>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                <span>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
              </div>
            </div>

            {renderFiliacionMinima()}

            <table style={styles.tablaDatos}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '75%' }}>Medicamento / Presentación</th>
                  <th style={{ ...styles.th, width: '25%', textAlign: 'center' }}>Cant. Solicitar</th>
                </tr>
              </thead>
              <tbody>
                {dataTratamientos.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td style={styles.td}>💊 <strong style={{ color: '#0f172a' }}>{item.descripcion}</strong></td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '700', fontSize: '14px', color: '#16a34a' }}>
                      {item.cantidad} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>und</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.bloqueFirma}>
              <div style={styles.lineaFirma}>
                <strong>Dr(a). {nombreMedico}</strong><br />CMP / Firma y Sello
              </div>
            </div>
            
            <div className="no-print" style={styles.lineaCorte}>✂️ Doblar o cortar aquí ✂️</div>
          </div>
        )}

        {/* ========================================== */}
        {/* DOCUMENTO 2: INDICACIONES DE MEDICACIÓN    */}
        {/* ========================================== */}
        {dataTratamientos.length > 0 && (
          <div style={styles.cuponContenedor}>
            <div style={styles.cabecera}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb' }}>🏥 {entidadNombre}</span>
                <h3 style={styles.tituloDoc}>📌 INDICACIONES DE TRATAMIENTO (PACIENTE)</h3>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                <span>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
              </div>
            </div>

            {renderFiliacionMinima()}

            <table style={styles.tablaDatos}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '40%' }}>Medicamento</th>
                  <th style={{ ...styles.th, width: '15%' }}>Vía</th>
                  <th style={{ ...styles.th, width: '15%' }}>Dosis</th>
                  <th style={{ ...styles.th, width: '15%' }}>Frecuencia</th>
                  <th style={{ ...styles.th, width: '15%' }}>Duración</th>
                </tr>
              </thead>
              <tbody>
                {dataTratamientos.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td style={{ ...styles.td, fontWeight: '600' }}>{item.descripcion}</td>
                    <td style={styles.td}>{item.via || 'Oral'}</td>
                    <td style={styles.td}>{item.dosis}</td>
                    <td style={styles.td}>Cada {item.frecuencia} hrs</td>
                    <td style={{ ...styles.td, fontWeight: '600', color: '#2563eb' }}>{item.periodo} días</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {attentionDetails.PanelAlta && (
              <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#fdf2f8', borderRadius: '4px', border: '1px solid #fbcfe8', fontSize: '12px' }}>
                <strong>⚠️ Indicaciones Adicionales / Próxima Cita:</strong> {attentionDetails.PanelAlta}
              </div>
            )}

            <div style={styles.bloqueFirma}>
              <div style={styles.lineaFirma}>
                <strong>Dr(a). {nombreMedico}</strong><br />Indicaciones Médicas
              </div>
            </div>

            <div className="no-print" style={styles.lineaCorte}>✂️ Doblar o cortar aquí ✂️</div>
          </div>
        )}

        {/* ========================================== */}
        {/* DOCUMENTO 3: ORDEN DE EXÁMENES / IMÁGENES  */}
        {/* ========================================== */}
        {dataExamenes.length > 0 && (
          <div style={styles.cuponContenedor}>
            <div style={styles.cabecera}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5' }}>🏥 {entidadNombre}</span>
                <h3 style={styles.tituloDoc}>🔬 ORDEN DE EXÁMENES / PLAN DE TRABAJO</h3>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                <span>Fecha: {new Date().toLocaleDateString('es-PE')}</span>
              </div>
            </div>

            {renderFiliacionMinima()}

            <div style={{ padding: '5px 0' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Procedimientos Solicitados:</span>
            </div>

            <table style={styles.tablaDatos}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '15%' }}>Código</th>
                  <th style={{ ...styles.th, width: '55%' }}>Descripción del Examen / Apoyo al Diagnóstico</th>
                  <th style={{ ...styles.th, width: '30%' }}>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {dataExamenes.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td style={{ ...styles.td, fontFamily: 'monospace', color: '#64748b' }}>{item.codigoProcedimiento || 'N/A'}</td>
                    <td style={{ ...styles.td, fontWeight: '600', color: '#0f172a' }}>🔬 {item.examen}</td>
                    <td style={styles.td}><span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>{item.tipoExamen || 'Laboratorio'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.bloqueFirma}>
              <div style={styles.lineaFirma}>
                <strong>Dr(a). {nombreMedico}</strong><br />Médico Solicitante
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Control CSS Especializado para segmentar las Impresiones */}
      <style>{`
        @media print {
          /* Ocultar el resto del sistema, barra lateral y cabeceras de la web */
          body * {
            visibility: hidden;
          }
          /* Activar solo los cupones desglosados */
          #seccion-cupones-paciente, #seccion-cupones-paciente * {
            visibility: visible;
          }
          #seccion-cupones-paciente {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Forzar saltos de página inteligentes para que queden en medias hojas */
          @page {
            size: A4 portrait;
            margin: 10mm 15mm;
          }
        }
      `}</style>
    </div>
  );
}

export default AtencionMedicaDocumentosPacientesPanel;