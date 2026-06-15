// src/components/AtencionMedica/AtencionMedicaPdfPanel.js
import React from 'react';
import Styles from "../../../Styles";
import { FileText, Download, User, ClipboardList } from 'lucide-react';

/**
 * Componente optimizado para la visualización e impresión de la Ficha Clínica.
 * Aplica correcciones de exclusión de paneles y nombres dinámicos del sistema.
 * * @param {Object} props
 * @param {Object} props.medicalRecordData - Objeto maestro de la atención (DataPaciente)
 * @param {Object} props.userSession - Datos del usuario logueado en la App (Médico)
 */
function AtencionMedicaPdfPanel({ medicalRecordData, userSession }) {

  const handleDescargarPdf = () => {
    window.print();
  };

  if (!medicalRecordData || Object.keys(medicalRecordData).length === 0) {
    return (
      <div style={Styles.medicalSection}>
        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
          No hay datos disponibles de la atención médica para generar el reporte.
        </p>
      </div>
    );
  }

  // 1. Extracción de Filiación, Paneles y Datos del Entorno
  const { patient = {}, attentionDetails = {}, entidadNombre = 'MICLINICA' } = medicalRecordData;
  
  // 5. Nombre del Médico de la sesión actual de la APP
  const nombreMedico = userSession?.nombre || userSession?.usuario || 'Médico Tratante';
  
  // 6. Nombre del Paciente para la firma
  const nombrePaciente = patient.name || 'Paciente';

  return (
    <div style={Styles.medicalSection}>
      
      {/* Botón de control superior (Oculto en la impresión) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="#0066ff" />
          <h3 style={{ ...Styles.sectionTitle, margin: 0, fontSize: '16px', color: '#1e293b' }}>
            Documento de Egreso / Ficha Clínica PDF
          </h3>
        </div>
        
        <button
          type="button"
          onClick={handleDescargarPdf}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#0066ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 102, 255, 0.2)',
            transition: 'background-color 0.2s'
          }}
        >
          <Download size={14} strokeWidth={2.5} />
          <span>Descargar / Imprimir PDF</span>
        </button>
      </div>

      {/* ======================================================================= */}
      {/* AREA DEL DOCUMENTO OFICIAL (LO QUE QUEDARÁ EN EL PDF IMPRESO) */}
      {/* ======================================================================= */}
      <div id="documento-clinico-pdf" style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontFamily: 'sans-serif'
      }}>
        
        {/* Cabecera Institucional (4. Nombre dinámico de la clínica) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0066ff', paddingBottom: '12px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', color: '#0066ff', fontWeight: 'bold', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
              🏥 {entidadNombre}
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
              Expediente Electrónico de Atención Ambulatoria
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
              INFORME DE ATENCIÓN MÉDICA
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
              Fecha: {new Date().toLocaleDateString('es-PE')}
            </p>
          </div>
        </div>

        {/* Bloque: Datos del Paciente */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#0066ff' }}>
            <User size={14} strokeWidth={2.5} />
            <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Filiación del Paciente
            </h4>
          </div>
          
          <div style={{ 
            display: 'table', 
            width: '100%', 
            backgroundColor: '#f8fafc', 
            borderRadius: '6px', 
            border: '1px solid #e2e8f0',
            fontSize: '13px',
            padding: '10px'
          }}>
            <div style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell', padding: '4px 8px', fontWeight: '600', color: '#475569', width: '15%' }}>Paciente:</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', color: '#1e293b', width: '45%' }}>{nombrePaciente}</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', fontWeight: '600', color: '#475569', width: '15%' }}>Documento:</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', color: '#1e293b', width: '25%' }}>{patient.id || 'N/A'}</div>
            </div>
            <div style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell', padding: '4px 8px', fontWeight: '600', color: '#475569' }}>Edad:</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', color: '#1e293b' }}>{patient.age ? `${patient.age} años` : 'N/A'}</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', fontWeight: '600', color: '#475569' }}>Sexo:</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', color: '#1e293b', textTransform: 'capitalize' }}>{patient.sex || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Bloque: Detalles Clínicos Dinámicos (Filtrados) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(attentionDetails)
            .filter(([panelKey]) => {
              // 2 y 3. Excluir explícitamente Alergias e Impresión
              const keyMinuscula = panelKey.toLowerCase();
              return !keyMinuscula.includes('alergia') && !keyMinuscula.includes('impresion');
            })
            .map(([panelKey, value]) => {
              
              // Normalizar nombres clave (ej: "panelTratamientos" o "panelMedicacion" -> "Medicamentos")
              let cleanTitle = panelKey.replace(/Panel/g, '').replace(/([A-Z])/g, ' $1').trim();
              if (cleanTitle.toLowerCase().includes('tratamiento') || cleanTitle.toLowerCase().includes('medicaci')) {
                cleanTitle = "Medicamentos / Receta";
              }

              return (
                <div key={panelKey} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#334155' }}>
                    <ClipboardList size={13} color="#475569" />
                    <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#475569' }}>
                      {cleanTitle}
                    </h4>
                  </div>

                  {/* 1. Tratamiento Correcto de Arreglos (Mapeo de la Medicación estructurada) */}
                  {Array.isArray(value) ? (
                    value.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px' }}>
                        {value.map((item, idx) => (
                          <div key={item.id || idx} style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.4' }}>
                            • <span style={{ fontWeight: '600' }}>{item.descripcion || item.diagnostico || item.examen || item.label || JSON.stringify(item)}</span>
                            {item.codigoCIE && ` [CIE-10: ${item.codigoCIE}]`}
                            {item.via && ` - Vía: ${item.via}`}
                            {item.dosis && ` (Dosis: ${item.dosis})`}
                            {item.frecuencia && ` cada ${Math.round(24 / item.frecuencia)} hrs`}
                            {item.periodo && ` por ${item.periodo} días`}
                            {item.cantidad && ` [Cant. Recetada: ${item.cantidad} und]`}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: '0 0 0 14px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Sin registros anotados en esta sección.</p>
                    )
                  ) : (
                    <p style={{ margin: '0 0 0 14px', fontSize: '13px', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                      {value || 'No refiere.'}
                    </p>
                  )}
                </div>
              );
            })}
        </div>

        {/* Sección de Firmas al pie con Nombres de Variables Reales */}
        <div style={{ marginTop: '60px', display: 'table', width: '100%' }}>
          <div style={{ display: 'table-row' }}>
            {/* 5. Firma con el Nombre del Médico Logueado */}
            {/* Firma del Médico */}
            <div style={{ display: 'table-cell', width: '50%', textAlign: 'center', padding: '10px' }}>
              <div style={{ width: '240px', borderTop: '1px solid #cbd5e1', margin: '0 auto', paddingTop: '6px' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase' }}>
                  Dr(a). {nombreMedico}
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
                  Médico Tratante / Auditor
                </p>
              </div>
            </div>
            
            {/* 6. Firma con el Nombre Completo del Paciente */}
            <div style={{ display: 'table-cell', width: '50%', textAlign: 'center', padding: '10px' }}>
              <div style={{ width: '220px', borderTop: '1px solid #cbd5e1', margin: '0 auto', paddingTop: '6px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase' }}>
                  {nombrePaciente}
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
                  Paciente / Huella Digital
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CSS DE IMPRESIÓN SEGURO */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #documento-clinico-pdf, #documento-clinico-pdf * {
              visibility: visible;
            }
            #documento-clinico-pdf {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              border: none !important;
              padding: 0 !important;
            }
            @page {
              size: auto;
              margin: 15mm 12mm;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AtencionMedicaPdfPanel;