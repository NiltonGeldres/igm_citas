// src/components/AtencionExamen/AtencionMedicaExamen.js
import React, { useState, useEffect } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import Styles from '../../../Styles'; 
import { Trash2, Layers, CheckSquare, Square } from 'lucide-react'; 
import { AtencionMedicaExamenService } from './AtencionMedicaExamenService';
import { v4 as uuidv4 } from 'uuid';

function AtencionMedicaExamen({ content = [], onContentChange, onModalMessage, diagnosticosDisponibles = [] }) {
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState('INDIVIDUAL'); // 'INDIVIDUAL' o 'PAQUETE'
  const [dropdownAbiertoId, setDropdownAbiertoId] = useState(null); 
  const [paquetesDisponibles, setPaquetesDisponibles] = useState([]);

  // Cargar paquetes al montar el componente
  useEffect(() => {
    const cargarPaquetes = async () => {
      const pkgs = await AtencionMedicaExamenService.obtenerPaquetesDisponibles();
      setPaquetesDisponibles(pkgs);
    };
    cargarPaquetes();
  }, []);

  const fetchExamSuggestions = async (query) => {
    try {
      return await AtencionMedicaExamenService.buscarExamenesCatalogo(query);
    } catch (error) {
      if (onModalMessage) onModalMessage('Error al conectar con el catálogo de exámenes.');
      return [];
    }
  };

  // AGREGAR EXAMEN INDIVIDUAL
  const handleAddExam = (examItem) => {
    const existingExam = content.find(item => item.codigoProcedimiento === examItem.codigoProcedimiento);

    if (existingExam) {
      if (onModalMessage) {
        onModalMessage(`El examen "${examItem.label}" ya se encuentra en el plan de trabajo.`);
      }
      return;
    }

    const nuevoExamen = {
      id: uuidv4(),
      label: examItem.label,
      examen: examItem.label,
      codigoProcedimiento: examItem.codigoProcedimiento || 'S/C',
      tipoExamen: examItem.tipoExamen || '',
      diagnosticosAsociados: [] 
    };

    onContentChange([...content, nuevoExamen]);
    setMostrarBuscador(false);
  };

  // AGREGAR EN BLOQUE POR PAQUETE
  const handleCargarPaquete = (e) => {
    const paqueteId = e.target.value;
    if (!paqueteId) return;

    const paqueteSeleccionado = paquetesDisponibles.find(pkg => pkg.id === paqueteId);
    if (!paqueteSeleccionado) return;

    let nuevosExamenesAgregados = 0;
    const listaActualizada = [...content];

    paqueteSeleccionado.examenesAsociados.forEach(examItem => {
      const yaExiste = listaActualizada.some(item => item.codigoProcedimiento === examItem.codigoProcedimiento);
      
      if (!yaExiste) {
        listaActualizada.push({
          id: uuidv4(),
          label: examItem.label,
          examen: examItem.label,
          codigoProcedimiento: examItem.codigoProcedimiento || 'S/C',
          tipoExamen: examItem.tipoExamen || '',
          diagnosticosAsociados: []
        });
        nuevosExamenesAgregados++;
      }
    });

    onContentChange(listaActualizada);
    setMostrarBuscador(false);
    e.target.value = ""; // Resetear select

    if (onModalMessage && nuevosExamenesAgregados > 0) {
      onModalMessage(`Se añadieron ${nuevosExamenesAgregados} exámenes del paquete "${paqueteSeleccionado.nombrePaquete}".`);
    }
  };

  const handleToggleDiagnostico = (examId, codigoCIE) => {
    const listaActualizada = content.map(item => {
      if (item.id === examId) {
        const yaAsociado = item.diagnosticosAsociados.includes(codigoCIE);
        const nuevosDx = yaAsociado
          ? item.diagnosticosAsociados.filter(code => code !== codigoCIE) 
          : [...item.diagnosticosAsociados, codigoCIE]; 
        return { ...item, diagnosticosAsociados: nuevosDx };
      }
      return item;
    });
    onContentChange(listaActualizada);
  };

  const handleDeleteExam = (id) => {
    const listaActualizada = content.filter(item => item.id !== id);
    onContentChange(listaActualizada);
  };

  return (
    <div style={Styles.medicalSection}>
      {/* Cabecera del Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ ...Styles.sectionTitle, margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
          Plan de Trabajo / Exámenes
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
          {mostrarBuscador ? 'Cerrar opciones' : 'Añadir examen o paquete'}
        </button>
      </div>

      {/* Caja de Herramientas Estructurada Verticalmente */}
      {mostrarBuscador && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px', 
          marginBottom: '16px', 
          backgroundColor: '#f8fafc',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          {/* Selector de modo (Pestañas compactas) */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setTipoBusqueda('INDIVIDUAL')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: tipoBusqueda === 'INDIVIDUAL' ? '#e0f2fe' : 'transparent',
                color: tipoBusqueda === 'INDIVIDUAL' ? '#0369a1' : '#64748b'
              }}
            >
              🔍 Examen Individual
            </button>
            <button
              type="button"
              onClick={() => setTipoBusqueda('PAQUETE')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: tipoBusqueda === 'PAQUETE' ? '#e0f2fe' : 'transparent',
                color: tipoBusqueda === 'PAQUETE' ? '#0369a1' : '#64748b'
              }}
            >
              📦 Cargar por Paquete (Preoperatorio...)
            </button>
          </div>

          {/* Renderizado Condicional: Encima o debajo según el botón */}
          {tipoBusqueda === 'INDIVIDUAL' ? (
            <div>
              <AutoCompleteInput
                placeholder="Busque y seleccione un examen del catálogo..."
                onSelectSuggestion={handleAddExam}
                fetchSuggestions={fetchExamSuggestions}
                onModalMessage={onModalMessage} 
                style={{ padding: '6px 12px', height: '34px', fontSize: '13px' }} 
              />
            </div>
          ) : (
            <div>
              <select
                onChange={handleCargarPaquete}
                defaultValue=""
                style={{
                  width: '100%',
                  height: '34px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>-- Seleccione un Paquete Clínico Configurado --</option>
                {paquetesDisponibles.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.nombrePaquete} ({pkg.examenesAsociados?.length || 0} exámenes)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Lista Estricta de 2 Filas por Registro */}
      {content.length > 0 && (
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: '#ffffff'
        }}>
          {content.map((item, index) => {
            const tieneDxIncompleto = item.diagnosticosAsociados.length === 0;

            return (
              <div 
                key={item.id} 
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '12px 16px',
                  borderBottom: index === content.length - 1 ? 'none' : '1px solid #e2e8f0',
                  gap: '14px'
                }}
              >
                {/* Control Lateral */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '24px' }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteExam(item.id)}
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
                    <Trash2 size={15} strokeWidth={2.5} />
                  </button>

                  <div style={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    fontWeight: '600',
                    fontSize: '12px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    minWidth: '22px',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0'
                  }}>
                    {index + 1}
                  </div>
                </div>

                {/* Bloque Clínico */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  
                  {/* FILA 1: Descripción Completa */}
                  <div style={{ fontSize: '14px', color: '#334155', fontWeight: '500', lineHeight: '1.3' }}>
                    {item.label || item.examen}
                  </div>
                  
                  {/* FILA 2: Metadata y Vinculación */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    
                    <span style={{ 
                      color: '#475569', 
                      backgroundColor: '#f1f5f9', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '11px',
                      fontWeight: '600',
                      border: '1px solid #e2e8f0'
                    }}>
                      Cod: {item.codigoProcedimiento}
                    </span>

                    {/* Desplegable de Diagnósticos */}
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => setDropdownAbiertoId(dropdownAbiertoId === item.id ? null : item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: tieneDxIncompleto ? '#fef2f2' : '#f0fdf4',
                          border: tieneDxIncompleto ? '1px solid #fca5a5' : '1px solid #bbf7d0',
                          color: tieneDxIncompleto ? '#dc2626' : '#16a34a',
                          fontSize: '11px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <Layers size={12} />
                        {tieneDxIncompleto 
                          ? 'Vincular Diagnósticos (0)' 
                          : `Dx Vinculados (${item.diagnosticosAsociados.length})`}
                      </button>

                      {dropdownAbiertoId === item.id && (
                        <div style={{
                          position: 'absolute',
                          top: '24px',
                          left: 0,
                          zIndex: 100,
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          padding: '8px',
                          width: '260px',
                          maxHeight: '180px',
                          overflowY: 'auto'
                        }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '6px', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9' }}>
                            Seleccione los diagnósticos asociados:
                          </div>
                          {diagnosticosDisponibles.length === 0 ? (
                            <div style={{ fontSize: '11px', color: '#94a3b8', padding: '6px', textAlign: 'center' }}>
                              ⚠️ Registre diagnósticos en el panel correspondiente.
                            </div>
                          ) : (
                            diagnosticosDisponibles.map((diag) => {
                              const codigo = diag.codigoCIE || 'S/C';
                              const seleccionado = item.diagnosticosAsociados.includes(codigo);
                              return (
                                <div
                                  key={diag.id}
                                  onClick={() => handleToggleDiagnostico(item.id, codigo)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '5px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: seleccionado ? '#eff6ff' : 'transparent',
                                    fontSize: '12px',
                                    color: '#334155'
                                  }}
                                >
                                  {seleccionado ? <CheckSquare size={13} color="#2563eb" /> : <Square size={13} color="#94a3b8" />}
                                  <span style={{ fontWeight: '600', color: '#1e3a8a' }}>[{codigo}]</span>
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {diag.label || diag.diagnostico}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>

                    {/* Badges de Diagnósticos Vinculados */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {item.diagnosticosAsociados.map(code => (
                        <span 
                          key={code}
                          onClick={() => handleToggleDiagnostico(item.id, code)}
                          title="Eliminar vinculación"
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            borderRadius: '4px',
                            padding: '1px 5px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          {code} <span style={{ marginLeft: '4px', color: '#ef4444', fontWeight: '400' }}>×</span>
                        </span>
                      ))}
                    </div>

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

export default AtencionMedicaExamen;