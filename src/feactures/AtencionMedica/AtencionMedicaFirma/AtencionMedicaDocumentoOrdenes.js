import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';


export const AtencionMedicaDocumentoOrdenes = ({ listaExamenes = [], patientData = {} }) => {
  const { user } = useAuth();    
 const nombreMedico = user?.nombresUsuario || '--';

    return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Stethoscope size={16} color="#334155" /> ORDEN DE EXÁMENES AUXILIARES
        </h3>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          Fecha: {new Date().toLocaleDateString('es-PE')}
        </span>
      </div>

      <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', fontSize: '12px', borderRadius: '6px', marginBottom: '12px', color: '#334155', border: '1px solid #f1f5f9' }}>
        <strong>Paciente:</strong> {patientData.name || patientData.nombres} &nbsp;|&nbsp; <strong>H.C.:</strong> {patientData.hc || 'N/A'}
      </div>

      {listaExamenes.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#334155', width: '100px' }}>Código</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#334155' }}>Examen / Procedimiento</th>
              <th style={{ padding: '8px', textAlign: 'left', color: '#334155', width: '120px' }}>Área</th>
            </tr>
          </thead>
          <tbody>
            {listaExamenes.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#64748b', fontWeight: '600' }}>
                  {item.codigoProcedimiento || item.codigo || 'N/A'}
                </td>
                <td style={{ padding: '8px', fontWeight: '600', color: '#0f172a' }}>
                  {item.examen || item.descripcion}
                </td>
                <td style={{ padding: '8px' }}>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                    {item.tipoExamen || 'Laboratorio'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      ) : (
        <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', margin: '10px 0' }}>
          No hay exámenes ni órdenes auxiliares registradas en esta atención.
        </p>
      )}
        {/* Firmas */}
        <div style={{ marginTop: '60px', display: 'table', width: '100%' }}>
          <div style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', width: '50%', textAlign: 'center', padding: '10px' }}>
              <div style={{ width: '240px', borderTop: '1px solid #cbd5e1', margin: '0 auto', paddingTop: '6px' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase' }}>
                  Dr(a). {nombreMedico}
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
                  Médico Tratante / Firma Digital
                </p>
              </div>
            </div>
          </div>
        </div>    
    </div>
  );
};