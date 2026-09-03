// src/components/AtencionMedica/AtencionMedicaPdfPanel.js
import React from 'react';
import Styles from "../../../Styles";
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';

function AtencionMedicaFirmaPanel({ medicalRecordData }) {
  const { user } = useAuth();

  const handleDescargarPdf = () => {
    window.print();
  };

  if (!medicalRecordData) {
    return (
      <div style={Styles.medicalSection}>
        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
          No hay datos disponibles de la atención médica.
        </p>
      </div>
    );
  }

  console.log("DATA a MOSTRAR " + JSON.stringify(medicalRecordData));

  // Extracción según la estructura real del JSON
  const { patient = {}, attentionDetails = {} } = medicalRecordData;
  
  // Variables de cabecera
  const entidadNombre = user?.nombreEntidad || '--';
  const nombreMedico = user?.nombresUsuario || '--';

  // =======================================================================
  // MAPEO DIRECTO DE LLAVES REALES DEL BACKEND
  // =======================================================================
 const dataTriaje = attentionDetails.PanelTriaje || [];
  const dataAntecedentes = attentionDetails.PanelAntecedentes || [];
  const dataSintomas = attentionDetails.PanelSintomas || [];
  const dataExamenFisico = attentionDetails.PanelExamenFisico || [];
  const dataDiagnosticos = attentionDetails.PanelDiagnostico || [];
  const dataExamenes = attentionDetails.PanelPlanTrabajo || [];
  const dataMedicacion = attentionDetails.PanelMedicacion || [];
  const dataAlta = attentionDetails.PanelAlta || [];

  // =======================================================================
  // RENDERIZADOR ESPECÍFICO PARA TRIAJE
  // =======================================================================
  const renderTriaje = (triajeArray) => {
    if (!triajeArray || !Array.isArray(triajeArray) || triajeArray.length === 0) {
      return <p style={{ margin: '0 0 0 14px', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No refiere.</p>;
    }
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', paddingLeft: '14px' }}>
        {triajeArray.map((item, idx) => (
          <div key={item.id || idx} style={{ fontSize: '12px', padding: '0px 0px', borderRadius: '4px', border: '0px solid #e2e8f0' }}>
            <span style={{ color: '#475569', fontWeight: '500' }}>{item.nombre}:</span>{' '}
            <span style={{ fontWeight: '700', color: '#0f172a' }}>{item.valor}</span>{' '}
            <span style={{ fontSize: '11px', color: '#64748b' }}>{item.unidad}</span> 
          </div>
        ))}
      </div>
    );
  };

  // =======================================================================
  // RENDERIZADOR EXCLUSIVO PARA ARREGLOS DE OBJETOS
  // =======================================================================
  const renderListaEstructurada = (lista, campoMostrar) => {
    if (!Array.isArray(lista) || lista.length === 0) {
      return (
        <p style={{ margin: '0 0 0 14px', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
          No refiere.
        </p>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px' }}>
        {lista.map((item, idx) => {
          const valorTexto = item?.[campoMostrar];
          if (!valorTexto) return null;

          return (
            <div key={item.id || idx} style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
              • {valorTexto}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={Styles.medicalSection}>
      {/* REPORTE CLÍNICO IMPRESO */}
      <div id="documento-clinico-pdf" style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}>
        
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #050505', paddingBottom: '12px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '12px', color: '#050505', fontWeight: 'bold', textTransform: 'uppercase' }}>
              🏥 {entidadNombre}
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
              Expediente Electrónico de Atención Ambulatoria
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
              HISTORIA CLINICA
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
              Fecha: {new Date().toLocaleDateString('es-PE')}
            </p>
          </div>
        </div>

        {/* Filiación */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'table', width: '100%', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', padding: '10px' }}>
            <div style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell', padding: '4px 8px', fontWeight: '600', color: '#475569', width: '15%' }}>Paciente:</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', color: '#1e293b', width: '45%', fontWeight: '700' }}>{patient.name}</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', fontWeight: '600', color: '#475569', width: '15%' }}>N° Historia:</div>
              <div style={{ display: 'table-cell', padding: '4px 8px', color: '#1e293b', width: '25%' }}>{patient.hc || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* CUERPO CLINICO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. Triaje */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ClipboardList size={13} color="#475569" />
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#050505' }}>
                Triaje / Signos Vitales
              </h4>
            </div>
            {renderTriaje(dataTriaje)}
          </div>

          {/* 2. Antecedentes */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ClipboardList size={13} color="#475569" />
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#050505' }}>
                Antecedentes
              </h4>
            </div>
            {renderListaEstructurada(dataAntecedentes, 'nombreAntecedente')}
          </div>

          {/* 3. Síntomas */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ClipboardList size={13} color="#475569" />
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#050505' }}>
                Síntomas
              </h4>
            </div>
            {renderListaEstructurada(dataSintomas, 'nombreSintoma')}
          </div>

          {/* 4. Examen Físico */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ClipboardList size={13} color="#475569" />
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#050505' }}>
                Examen Físico
              </h4>
            </div>
            {renderListaEstructurada(dataExamenFisico, 'nombreExamenFisico')}
          </div>

          {/* 5. Diagnósticos */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ClipboardList size={13} color="#475569" />
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#050505' }}>
                Diagnósticos
              </h4>
            </div>
            {!dataDiagnosticos || dataDiagnosticos.length === 0 ? (
              <p style={{ margin: '0 0 0 14px', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No refiere.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '14px' }}>
                {dataDiagnosticos.map((item, idx) => (
                  <div key={item.id || idx} style={{ fontSize: '13px', color: '#1e293b' }}>
                    • <span >{item.diagnostico}</span> {item.codigoCIE && `[CIE-10: ${item.codigoCIE}]`} - <span style={{ fontStyle: 'italic', color: '#64748b' }}>{item.clasificacion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. Exámenes */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ClipboardList size={13} color="#475569" />
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#050505' }}>
                Exámenes
              </h4>
            </div>
            {!dataExamenes || dataExamenes.length === 0 ? (
              <p style={{ margin: '0 0 0 14px', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No refiere.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '14px' }}>
                {dataExamenes.map((item, idx) => (
                  <div key={item.id || idx} style={{ fontSize: '13px', color: '#1e293b' }}>
                    • <span >{item.examen}</span> {item.codigoProcedimiento && `(CPT: ${item.codigoProcedimiento})`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. Medicación */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ClipboardList size={13} color="#050505" />
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#050505' }}>
                Medicación
              </h4>
            </div>
            {!dataMedicacion || dataMedicacion.length === 0 ? (
              <p style={{ margin: '0 0 0 14px', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No refiere.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '14px' }}>
                {dataMedicacion.map((item, idx) => (
                  <div key={item.id || idx} style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.4' }}>
                    • <span >{item.descripcion}</span>
                    {item.via && ` - Vía: ${item.via}`}
                    {item.dosis && ` (Dosis: ${item.dosis})`}
                    {item.frecuencia && ` cada ${item.frecuencia} horas`}
                    {item.periodo && ` por ${item.periodo} días`}
                    {item.cantidad && ` [Cantidad: ${item.cantidad} und]`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 8. Alta */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ClipboardList size={13} color="#475569" />
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#050505' }}>
                Alta
              </h4>
            </div>
            {renderListaEstructurada(dataAlta, 'descripcionAlta')}
          </div>

        </div>

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

      {/* Estilos CSS de impresión */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #documento-clinico-pdf, #documento-clinico-pdf * { visibility: visible; }
            #documento-clinico-pdf { position: absolute; left: 0; top: 0; width: 100%; border: none !important; padding: 0 !important; }
            @page { size: auto; margin: 15mm 12mm; }
            .no-print { display: none !important; }
          }
        `}
      </style>
    </div>
  );
}

export default AtencionMedicaFirmaPanel;