import React from 'react';
import { FileText, ClipboardList } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';

export const AtencionMedicaDocumentoReceta = ({ 
  listaMedicamentos = [], 
  listaAlta = [], 
  patientData = {} 
}) => {
  const { user } = useAuth();    
  const nombreMedico = user?.nombresUsuario || '--';


  if (!listaMedicamentos || listaMedicamentos.length === 0) {
    return (
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
        No hay indicaciones o medicamentos registrados para imprimir.
      </div>
    );
  }

  const nombrePaciente = patientData.name || patientData.nombres || 'N/A';
  const historiaClinica = patientData.hc || patientData.historian | 'N/A';
  const fechaHoy = new Date().toLocaleDateString('es-PE');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'sans-serif' }}>
      
      {/* =========================================================================
          ETIQUETA 1: RECETA MÉDICA (DESPACHO FARMACIA)
         ========================================================================= */}
      <div 
        className="receta-farmacia-block"
        style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '20px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          pageBreakInside: 'avoid'
        }}
      >
        {/* Cabecera Etiqueta Farmacia */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '10px', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#0284c7', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              DOCUMENTO PARA DESPACHO
            </span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '16px', color: '#0f172a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#0284c7" /> RECETA MÉDICA
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Fecha: {fechaHoy}</span>
          </div>
        </div>
        
        {/* Datos del Paciente */}
        <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', fontSize: '12px', borderRadius: '6px', marginBottom: '14px', color: '#334155', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Paciente:</strong> {nombrePaciente}</span>
          <span><strong>H.C.:</strong> {historiaClinica}</span>
        </div>

        {/* Tabla para Farmacia: Sólo Medicamento y Cantidad requerida */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ padding: '8px 10px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Medicamento / Presentación / Dosis Concentrada</th>
              <th style={{ padding: '8px 10px', textAlign: 'center', color: '#334155', fontWeight: '700', width: '120px' }}>Cantidad Total</th>
            </tr>
          </thead>
          <tbody>
            {listaMedicamentos.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px', color: '#0f172a', fontWeight: '600' }}>
                  {item.descripcion || item.medicamento || item.nombre}
                </td>
                <td style={{ padding: '10px', textAlign: 'center', fontWeight: '800', color: '#0f172a', fontSize: '13px' }}>
                  {item.cantidad || 1} u.
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

      {/* =========================================================================
          ETIQUETA 2: INDICACIONES Y TRATAMIENTO (USO PACIENTE)
         ========================================================================= */}
      <div 
        className="indicaciones-paciente-block"
        style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          padding: '20px', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          pageBreakInside: 'avoid'
        }}
      >
        {/* Cabecera Etiqueta Paciente */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #16a34a', paddingBottom: '10px', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#16a34a', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              GUÍA PARA EL PACIENTE
            </span>
            <h3 style={{ margin: '2px 0 0 0', fontSize: '16px', color: '#0f172a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={18} color="#16a34a" /> INDICACIONES DE USO Y POSOLOGÍA
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Fecha: {fechaHoy}</span>
          </div>
        </div>

        {/* Datos del Paciente */}
        <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', fontSize: '12px', borderRadius: '6px', marginBottom: '14px', color: '#334155', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>Paciente:</strong> {nombrePaciente}</span>
          <span><strong>H.C.:</strong> {historiaClinica}</span>
        </div>

        {/* Tabla para el Paciente: Posología y administración detallada */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ padding: '8px 10px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Medicamento</th>
              <th style={{ padding: '8px 10px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Vía</th>
              <th style={{ padding: '8px 10px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Dosis</th>
              <th style={{ padding: '8px 10px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Frecuencia</th>
              <th style={{ padding: '8px 10px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Duración</th>
            </tr>
          </thead>
          <tbody>
            {listaMedicamentos.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px', fontWeight: '700', color: '#0f172a' }}>
                  {item.descripcion || item.medicamento || item.nombre}
                </td>
                <td style={{ padding: '10px', color: '#334155' }}>{item.via || 'Oral'}</td>
                <td style={{ padding: '10px', color: '#334155', fontWeight: '600' }}>{item.dosis || '1 TAB'}</td>
                <td style={{ padding: '10px', color: '#334155' }}>
                  {item.frecuencia ? `Cada ${item.frecuencia} hrs` : 'Según indicación'}
                </td>
                <td style={{ padding: '10px', fontWeight: '700', color: '#0f172a' }}>
                  {item.periodo || item.duracion ? `${item.periodo || item.duracion} días` : 'Tratamiento completo'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Recomendaciones Generales o Indicaciones de Alta */}
        {listaAlta && listaAlta.length > 0 && (
          <div style={{ marginTop: '14px', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#334155' }}>
            <strong style={{ color: '#0f172a' }}>📌 Recomendaciones Generales / Alta:</strong>{' '}
            {listaAlta[0]?.descripcionAlta || listaAlta[0]?.nombreAlta || 'Sin especificación adicional.'}
          </div>
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

    </div>
  );
};