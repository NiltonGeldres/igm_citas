// src/components/AtencionDiagnostico/AtencionMedicaDiagnostico.js
import React, { useState } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import Styles from '../../../Styles'; 
import { Trash2 } from 'lucide-react'; 
import { AtencionMedicaDiagnosticoService } from './AtencionMedicaDiagnosticoService';
import { useAuth } from '../../../shared/context/AuthContext'; 

function AtencionMedicaDiagnosticoPanel({ content = [], onContentChange, onModalMessage }) {
  const { catalogoGlobal } = useAuth(); // Accedemos al contexto
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  // Extraemos el catálogo de tipos de diagnóstico de forma segura
  const tiposDiagnostico = catalogoGlobal?.catalogoTipoDiagnostico || [];


  const fetchDiagnosisSuggestions = async (query) => {
    try {
      return await AtencionMedicaDiagnosticoService.buscarDiagnosticosCatalogo(query);
    } catch (error) {
      if (onModalMessage) onModalMessage('Error al conectar con el catálogo de diagnósticos.');
      return [];
    }
  };

  const handleAddDiagnosis = (diagnosisItem) => {
    const existingDiagnosis = content.find(item => item.codigoCIE === diagnosisItem.codigoCIE);

    if (existingDiagnosis) {
      if (onModalMessage) {
        onModalMessage(`El diagnóstico "${diagnosisItem.label}" [${diagnosisItem.codigoCIE}] ya se encuentra agregado.`);
      }
      return;
    }

    const nuevoDiagnostico = {
      id: diagnosisItem.id, 
      label: diagnosisItem.label,
      diagnostico: diagnosisItem.label,
      codigoCIE: diagnosisItem.codigoCIE || '',
      clasificacion: '' 
    };

    onContentChange([...content, nuevoDiagnostico]);
    setMostrarBuscador(false); 
  };

  const handleClasificacionChange = (id, nuevaClasificacion) => {
    const listaActualizada = content.map(item => {
      if (item.id === id) return { ...item, clasificacion: nuevaClasificacion };
      return item;
    });
    onContentChange(listaActualizada);
  };

  const handleDeleteDiagnosis = (id) => {
    const listaActualizada = content.filter(item => item.id !== id);
    onContentChange(listaActualizada);
  };

  return (
    <div style={Styles.medicalSection}>
      {/* Cabecera Principal */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ ...Styles.sectionTitle, margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
          Panel Diagnóstico
        </h3>
        
        <button
          type="button"
          onClick={() => setMostrarBuscador(!mostrarBuscador)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: mostrarBuscador ? '#f1f5f9' : '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '6px 14px',
            color: '#1d4ed8',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          {mostrarBuscador ? 'Cerrar búsqueda' : 'Añadir diagnóstico'}
        </button>
      </div>
      
      {/* Buscador Desplegable */}
      {mostrarBuscador && (
        <div style={{ marginBottom: '12px' }}>
          <AutoCompleteInput
            placeholder="Escribe el diagnóstico..."
            onSelectSuggestion={handleAddDiagnosis}
            fetchSuggestions={fetchDiagnosisSuggestions}
            onModalMessage={onModalMessage} 
            style={{ padding: '6px 12px', height: '34px', fontSize: '13px' }} 
          />
        </div>
      )}

      {content.length > 0 && (
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}>
          {content.map((item, index) => {
            const selectStyle = !item.clasificacion 
              ? { border: '1px solid #dc2626', backgroundColor: '#fef2f2' }
              : { border: '1px solid #cbd5e1', backgroundColor: '#ffffff' };

            return (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center', // Alineación centrada para mantener la simetría con triaje
                  padding: '14px 16px',
                  borderBottom: index === content.length - 1 ? 'none' : '1px solid #e2e8f0',
                  gap: '14px'
                }}
              >
                {/* 1. Izquierda Acción: Tacho de eliminación */}
                <button
                  type="button"
                  onClick={() => handleDeleteDiagnosis(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#f87171', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>

                {/* 2. Badge Correlativo Numérico estilo Triaje */}
                <div style={{
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '13px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  minWidth: '24px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  {index + 1}
                </div>

                {/* 3. Contenedor Clínico de Doble Fila Exclusiva */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  
                  {/* Fila 1: Exclusiva para la Descripción (Máximo espacio horizontal) */}
                  <div style={{ fontSize: '14px', color: '#334155', fontWeight: '500', lineHeight: '1.2' }}>
                    {item.label || item.diagnostico}
                  </div>
                  
                  {/* Fila 2: Código CIE-10 + Clasificador (Lado a lado) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    
                    {/* Código CIE-10 como micro-badge discreto */}
                    <span style={{ 
                      color: '#475569', 
                      backgroundColor: '#f1f5f9', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid #e2e8f0'
                    }}>
                      {item.codigoCIE || 'S/C'}
                    </span>

                    {/* Selector de Clasificación justo al lado */}

                    <select
                        value={item.clasificacion}
                        onChange={(e) => handleClasificacionChange(item.id, e.target.value)}
                        style={{
                          ...selectStyle,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#334155',
                          width: '140px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">-- Tipo --</option>
                        {tiposDiagnostico.map((tipo) => (
                          <option 
                            key={tipo.idDiagnosticoSubclasificacion} 
                            value={tipo.idDiagnosticoSubclasificacion}
                          >
                            {tipo.descripcion}
                          </option>
                        ))}
                      </select>
                                          
                    {/* Alerta en línea si falta tipificar */}
                    {!item.clasificacion && (
                      <span style={{ color: '#dc2626', fontSize: '11px', fontWeight: '600' }}>
                        ⚠️ Requerido
                      </span>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AtencionMedicaDiagnosticoPanel;