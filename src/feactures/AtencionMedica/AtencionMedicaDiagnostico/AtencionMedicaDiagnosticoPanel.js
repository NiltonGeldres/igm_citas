// src/components/AtencionDiagnostico/AtencionMedicaDiagnostico.js
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import Styles from '../../../Styles'; 
import { Trash2, Search, X } from 'lucide-react'; 
import { AtencionMedicaDiagnosticoService } from './AtencionMedicaDiagnosticoService';
import { useAuth } from '../../../shared/context/AuthContext'; 

function AtencionMedicaDiagnosticoPanel({ 
  content = [], 
  onContentChange, 
  onModalMessage 
}) {
  const title = "Diagnóstico";
  const { catalogoGlobal } = useAuth();
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const searchRef = useRef(null);

  // Extraemos el catálogo de tipos de diagnóstico de forma segura
  const tiposDiagnostico = useMemo(() => {
    return catalogoGlobal?.catalogoTipoDiagnostico || [];
  }, [catalogoGlobal]);

  // Normalización del contenido
  const listaDiagnosticos = useMemo(() => {
    return Array.isArray(content) ? content : [];
  }, [content]);

  // Auto-cierre de la barra de búsqueda al hacer clic por fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMostrarBuscador(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDiagnosisSuggestions = useCallback(async (query) => {
    try {
      return await AtencionMedicaDiagnosticoService.buscarDiagnosticosCatalogo(query);
    } catch (error) {
      if (onModalMessage) onModalMessage('Error al conectar con el catálogo de diagnósticos.');
      return [];
    }
  }, [onModalMessage]);

  const handleAddDiagnosis = useCallback((diagnosisItem) => {
    const existingDiagnosis = listaDiagnosticos.find(
      item => item.codigoCIE === diagnosisItem.codigoCIE
    );

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

    onContentChange([...listaDiagnosticos, nuevoDiagnostico]);
    setMostrarBuscador(false); 
  }, [listaDiagnosticos, onContentChange, onModalMessage]);

  const handleClasificacionChange = useCallback((id, nuevaClasificacion) => {
    const listaActualizada = listaDiagnosticos.map(item => {
      if (item.id === id) return { ...item, clasificacion: nuevaClasificacion };
      return item;
    });
    onContentChange(listaActualizada);
  }, [listaDiagnosticos, onContentChange]);

  const handleDeleteDiagnosis = useCallback((id) => {
    const listaActualizada = listaDiagnosticos.filter(item => item.id !== id);
    onContentChange(listaActualizada);
  }, [listaDiagnosticos, onContentChange]);

  return (
    <div style={Styles.medicalSection}>
      {/* Cabecera Principal Compacta */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
        minHeight: '24px'
      }}>
        <label style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#475569', 
          letterSpacing: '0.025em'
        }}>
          {title}
        </label>

        {/* Botón / Buscador Compacto */}
        <div ref={searchRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {mostrarBuscador ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '240px' }}>
              <AutoCompleteInput
                placeholder="Escribe el diagnóstico..."
                onSelectSuggestion={handleAddDiagnosis}
                fetchSuggestions={fetchDiagnosisSuggestions}
                onModalMessage={onModalMessage} 
              />
              <button
                type="button"
                onClick={() => setMostrarBuscador(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setMostrarBuscador(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '2px 8px',
                color: '#2563eb',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Search size={12} strokeWidth={2.5} />
              <span>Añadir</span>
            </button>
          )}
        </div>
      </div>

      {/* Lista de Diagnósticos Cargados */}
      {listaDiagnosticos.length > 0 && (
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}>
          {listaDiagnosticos.map((item, index) => {
            const selectStyle = !item.clasificacion 
              ? { border: '1px solid #dc2626', backgroundColor: '#fef2f2' }
              : { border: '1px solid #cbd5e1', backgroundColor: '#ffffff' };

            return (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 8px',
                  borderBottom: index === listaDiagnosticos.length - 1 ? 'none' : '1px solid #f1f5f9',
                  gap: '8px'
                }}
              >
                {/* 1. Acción: Tacho de eliminación */}
                <button
                  type="button"
                  onClick={() => handleDeleteDiagnosis(item.id)}
                  title="Eliminar diagnóstico"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <Trash2 size={13} />
                </button>

                {/* 2. Badge Correlativo Numérico */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '700',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  flexShrink: 0
                }}>
                  {index + 1}
                </span>

                {/* 3. Contenedor Clínico de Doble Fila */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  
                  {/* Fila 1: Descripción del Diagnóstico */}
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#1e293b', 
                    fontWeight: '500', 
                    lineHeight: '1.3',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.label || item.diagnostico}
                  </div>
                  
                  {/* Fila 2: Código CIE-10 + Selector de Clasificación */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    
                    {/* Código CIE-10 */}
                    <span style={{ 
                      color: '#475569', 
                      backgroundColor: '#f1f5f9', 
                      padding: '1px 5px', 
                      borderRadius: '4px', 
                      fontSize: '10px',
                      fontWeight: '600',
                      border: '1px solid #e2e8f0',
                      flexShrink: 0
                    }}>
                      {item.codigoCIE || 'S/C'}
                    </span>

                    {/* Selector de Clasificación */}
                    <select
                      value={item.clasificacion}
                      onChange={(e) => handleClasificacionChange(item.id, e.target.value)}
                      style={{
                        ...selectStyle,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#334155',
                        width: '120px',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box'
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

                    {/* Alerta en línea */}
                    {!item.clasificacion && (
                      <span style={{ color: '#dc2626', fontSize: '10px', fontWeight: '600' }}>
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