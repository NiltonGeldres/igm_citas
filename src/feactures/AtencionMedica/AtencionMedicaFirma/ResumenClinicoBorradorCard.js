import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

export function ResumenClinicoBorradorCard({ sourceDetails = {} }) {
  const listaSignos = sourceDetails.PanelTriaje || [];
  const listaAntecedentes = sourceDetails.PanelAntecedentes || [];
  const listaSintomas = sourceDetails.PanelSintomas || [];
  const listaExamenFisico = sourceDetails.PanelExamenFisico || [];
  const listaDiagnosticos = sourceDetails.PanelDiagnostico || [];
  const listaExamenes = sourceDetails.PanelPlanTrabajo || [];
  const listaMedicamentos = sourceDetails.PanelMedicacion || [];
  const listaAlta = sourceDetails.PanelAlta || [];

  return (
    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
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
                {listaAntecedentes.map(a => a.nombreAntecedente || a.descripcion).filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* 3. Síntomas / Anamnesis */}
        {listaSintomas.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Check size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#0f172a' }}>Síntomas / Anamnesis:</strong>
              <span style={{ color: '#475569', marginLeft: '6px' }}>
                {listaSintomas.map(s => s.nombreSintoma || s.descripcion).filter(Boolean).join(', ')}
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
                {listaExamenFisico.map(ef => ef.nombreExamenFisico || ef.descripcion).filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* 5. Diagnósticos (CIE-10) */}
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

        {/* 7. Prescripción / Tratamiento */}
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
                  <li key={i}>{alta.descripcionAlta || alta.nombreAlta || alta.descripcion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}