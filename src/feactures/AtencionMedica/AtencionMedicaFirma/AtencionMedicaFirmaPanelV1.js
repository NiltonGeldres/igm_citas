import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle, 
  Printer, 
  Download, 
  ShieldCheck, 
  Microscope, 
  Pill, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { AtencionMedicaDocumentoHC } from './AtencionMedicaDocumentoHC';
import { AtencionMedicaDocumentoOrdenes } from './AtencionMedicaDocumentoOrdenes';
import { AtencionMedicaDocumentoReceta } from './AtencionMedicaDocumentoReceta';

function AtencionMedicaFirmaPanelV1({
  sectionsData = {},
  attentionDetails = {},
  ejecutarGuardadoYFirmaFinal,
  imprimirDocumentosPaciente,
  fullMedicalRecord,
  showModalMessage,
  patientData = {},
  user = {},
  atencionFirmada = false,
  jsonFirmadoUrl = null
}) {
  const [loadingFirma, setLoadingFirma] = useState(false);
  const [vistaDocumento, setVistaDocumento] = useState('hc'); // 'hc' | 'ordenes' | 'receta'

  // Normalización utilizando las claves exactas de attentionDetails (o sectionsData)
  const sourceDetails = Object.keys(attentionDetails).length > 0 ? attentionDetails : sectionsData;

  const listaSignos = sourceDetails.PanelTriaje || [];
  const listaAntecedentes = sourceDetails.PanelAntecedentes || [];
  const listaSintomas = sourceDetails.PanelSintomas || [];
  const listaExamenFisico = sourceDetails.PanelExamenFisico || [];
  const listaDiagnosticos = sourceDetails.PanelDiagnostico || [];
  const listaExamenes = sourceDetails.PanelPlanTrabajo || [];
  const listaMedicamentos = sourceDetails.PanelMedicacion || [];
  const listaAlta = sourceDetails.PanelAlta || [];

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
    <div className="sub-window-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* =========================================================================
          ESTADO 1: EN BORRADOR (ANTES DE GENERAR PDF / FIRMAR)
          ========================================================================= */}
      {!atencionFirmada ? (
        <div 
          className="no-print"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* Header del Panel */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#0284c7" /> Cierre del Acto Médico y Conformidad
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Verifique los datos clínicos registrados. Al confirmar, el expediente se congelará y se generará el documento oficial.
              </p>
            </div>
            <span style={{ 
              backgroundColor: '#fef3c7', 
              color: '#92400e', 
              fontSize: '11px', 
              fontWeight: '700', 
              padding: '4px 10px', 
              borderRadius: '20px',
              border: '1px solid #fde68a'
            }}>
              BORRADOR
            </span>
          </div>

          {/* Tarjeta de Resumen Detallado para Validación */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
              Detalle de Información Registrada
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
              
              {/* 1. Triaje / Signos Vitales */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {listaSignos.length > 0 ? <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} /> : <AlertCircle size={16} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />}
                <div>
                  <strong style={{ color: '#0f172a' }}>Triaje / Signos Vitales:</strong>
                  {listaSignos.length > 0 ? (
                    <span style={{ color: '#475569', marginLeft: '6px' }}>
                      {listaSignos.map(s => `${s.nombre || 'Parámetro'}: ${s.valor ?? '-'}${s.unidad ? ' ' + s.unidad : ''}`).join(' | ')}
                    </span>
                  ) : (
                    <span style={{ color: '#dc2626', marginLeft: '6px' }}>Sin registros en triaje</span>
                  )}
                </div>
              </div>

              {/* 2. Antecedentes */}
              {listaAntecedentes.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#0f172a' }}>Antecedentes:</strong>
                    <span style={{ color: '#475569', marginLeft: '6px' }}>
                      {listaAntecedentes.map(a => a.nombreAntecedente).filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {/* 3. Síntomas */}
              {listaSintomas.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#0f172a' }}>Síntomas:</strong>
                    <span style={{ color: '#475569', marginLeft: '6px' }}>
                      {listaSintomas.map(s => s.nombreSintoma).filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {/* 4. Examen Físico */}
              {listaExamenFisico.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#0f172a' }}>Examen Físico:</strong>
                    <span style={{ color: '#475569', marginLeft: '6px' }}>
                      {listaExamenFisico.map(ef => ef.nombreExamenFisico).filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {/* 5. Diagnósticos */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {listaDiagnosticos.length > 0 ? <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} /> : <AlertCircle size={16} color="#dc2626" style={{ marginTop: '2px', flexShrink: 0 }} />}
                <div>
                  <strong style={{ color: '#0f172a' }}>Diagnósticos (CIE-10):</strong>
                  {listaDiagnosticos.length > 0 ? (
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: '#334155' }}>
                      {listaDiagnosticos.map((d, i) => (
                        <li key={i}>
                          <strong>({d.codigoCIE || 'CIE'})</strong> {d.diagnostico} {d.clasificacion ? `- [${d.clasificacion}]` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#dc2626', marginLeft: '6px' }}>No se ha registrado ningún diagnóstico</span>
                  )}
                </div>
              </div>

              {/* 6. Órdenes / Exámenes Auxiliares */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {listaExamenes.length > 0 ? <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} /> : <Check size={16} color="#94a3b8" style={{ marginTop: '2px', flexShrink: 0 }} />}
                <div>
                  <strong style={{ color: '#0f172a' }}>Órdenes / Exámenes Auxiliares:</strong>
                  {listaExamenes.length > 0 ? (
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: '#334155' }}>
                      {listaExamenes.map((ex, i) => (
                        <li key={i}>
                          {ex.codigoProcedimiento ? <strong>({ex.codigoProcedimiento}) </strong> : null}
                          {ex.examen || ex.descripcion} {ex.tipoExamen ? `[${ex.tipoExamen}]` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#64748b', marginLeft: '6px' }}>Sin órdenes médicas</span>
                  )}
                </div>
              </div>

              {/* 7. Medicación / Prescripción */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {listaMedicamentos.length > 0 ? <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} /> : <Check size={16} color="#94a3b8" style={{ marginTop: '2px', flexShrink: 0 }} />}
                <div>
                  <strong style={{ color: '#0f172a' }}>Tratamiento / Prescripción:</strong>
                  {listaMedicamentos.length > 0 ? (
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: '#334155' }}>
                      {listaMedicamentos.map((m, i) => (
                        <li key={i}>
                          <strong>{m.descripcion || m.medicamento || m.nombre}</strong>
                          {m.dosis ? ` - Dosis: ${m.dosis}` : ''}
                          {m.via ? ` (${m.via})` : ''}
                          {m.frecuencia ? ` cada ${m.frecuencia}` : ''}
                          {m.periodo ? ` por ${m.periodo}` : ''}
                          {m.cantidad ? ` - Cantidad: ${m.cantidad}` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#64748b', marginLeft: '6px' }}>Sin medicamentos prescritos</span>
                  )}
                </div>
              </div>

              {/* 8. Alta / Recomendaciones */}
              {listaAlta.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#0f172a' }}>Alta / Recomendaciones:</strong>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: '#334155' }}>
                      {listaAlta.map((alta, i) => (
                        <li key={i}>{alta.descripcionAlta || alta.nombreAlta}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Botón Principal para la Generación del PDF y Cierre */}
          <button
            type="button"
            onClick={handleFirmarAccion}
            disabled={loadingFirma}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: loadingFirma ? '#94a3b8' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loadingFirma ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(22,163,74,0.25)',
              transition: 'background-color 0.2s'
            }}
          >
            {loadingFirma ? (
              <span>Procesando y generando documentos...</span>
            ) : (
              <>
                <Save size={18} /> GENERAR PDF Y FINALIZAR ATENCIÓN
              </>
            )}
          </button>
        </div>
      ) : (
        /* =========================================================================
           ESTADO 2: ATENCIÓN FINALIZADA Y PDF RENDERIZADO
           ========================================================================= */
        <>
          {/* Cabecera de Confirmación */}
          <div
            className="no-print"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderLeft: '5px solid #16a34a',
              padding: '12px 18px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={22} color="#16a34a" />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>
                  Atención Médica Finalizada y Documento Generado
                </h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569' }}>
                  El expediente ha sido congelado correctamente.
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

          {/* Selector de Vistas de Documento PDF */}
          <div
            className="no-print"
            style={{
              display: 'flex',
              gap: '12px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '8px'
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

          {/* Visualizador del Subcomponente PDF Generado */}
          <div>
            {vistaDocumento === 'hc' && (
              <AtencionMedicaDocumentoHC
                fullMedicalRecord={fullMedicalRecord}
                showModalMessage={showModalMessage}
                user={user}
                patientData={patientData}
              />
            )}

            {vistaDocumento === 'ordenes' && (
              <AtencionMedicaDocumentoOrdenes
                listaExamenes={listaExamenes}
                patientData={patientData}
                user={user}
              />
            )}

            {vistaDocumento === 'receta' && (
              <AtencionMedicaDocumentoReceta
                listaMedicamentos={listaMedicamentos}
                listaAlta={listaAlta}
                patientData={patientData}
                user={user}
              />
            )}
          </div>
        </>
      )}

    </div>
  );
}

export default AtencionMedicaFirmaPanelV1;