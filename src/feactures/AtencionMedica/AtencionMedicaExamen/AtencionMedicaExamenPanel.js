// src/components/AtencionExamen/AtencionMedicaExamen.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import Styles from '../../../Styles'; 
import { Trash2, Layers, CheckSquare, Square, Search, X } from 'lucide-react'; 
import { AtencionMedicaExamenService } from './AtencionMedicaExamenService';
import { v4 as uuidv4 } from 'uuid';

function AtencionMedicaExamenPanel({ 
  content = [], 
  onContentChange, 
  onModalMessage, 
  diagnosticosDisponibles = [] 
}) {
  const title = "Plan de Trabajo / Exámenes";
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState('INDIVIDUAL'); // 'INDIVIDUAL' | 'PAQUETE'
  const [dropdownAbiertoId, setDropdownAbiertoId] = useState(null); 
  const [paquetesDisponibles, setPaquetesDisponibles] = useState([]);
  const [cargandoPaquete, setCargandoPaquete] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Normalización memorizada de contenidos
  const listaExamenes = useMemo(() => {
    return Array.isArray(content) ? content : [];
  }, [content]);

  // Cargar paquetes al montar
  useEffect(() => {
    let isMounted = true;
    const cargarPaquetes = async () => {
      try {
        const lista = await AtencionMedicaExamenService.obtenerListaPaquetes();
        if (isMounted) setPaquetesDisponibles(lista || []);
      } catch (error) {
        console.error("Error al cargar lista de paquetes:", error);
      }
    };
    cargarPaquetes();
    return () => { isMounted = false; };
  }, []);

  // Cierre de dropdowns y buscador al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMostrarBuscador(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbiertoId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchExamSuggestions = useCallback(async (query) => {
    try {
      return await AtencionMedicaExamenService.buscarExamenesCatalogo(query);
    } catch (error) {
      if (onModalMessage) onModalMessage('Error al conectar con el catálogo de exámenes.');
      return [];
    }
  }, [onModalMessage]);

  // Agregar examen individual
  const handleAddExam = useCallback((examItem) => {
    if (!examItem) return;

    const idProdReal = examItem.idProducto || examItem.id;
    const codigoReal = examItem.codigo || examItem.codigoExamen || 'S/C';
    const nombreReal = examItem.nombre || examItem.examen || examItem.label;

    const existingExam = listaExamenes.find(item => 
      String(item.idProducto) === String(idProdReal)
    );

    if (existingExam) {
      if (onModalMessage) {
        onModalMessage(`El examen "${nombreReal}" ya se encuentra en el plan de trabajo.`);
      }
      return;
    }

    const nuevoExamen = {
      id: uuidv4(),
      idProducto: idProdReal,
      codigoExamen: codigoReal,
      label: nombreReal,
      idDiagnostico: null,
      codigoCIE: ''
    };

    onContentChange([...listaExamenes, nuevoExamen]);
    setMostrarBuscador(false);
  }, [listaExamenes, onContentChange, onModalMessage]);

  // Cargar exámenes por paquete
  const handleCargarPaquete = useCallback(async (e) => {
    const paqueteId = e.target.value;
    if (!paqueteId) return;

    const paqueteSeleccionado = paquetesDisponibles.find(
      pkg => String(pkg.idPaqueteExamen || pkg.id) === String(paqueteId)
    );

    try {
      setCargandoPaquete(true);
      const examenesDelPaquete = await AtencionMedicaExamenService.obtenerProductosPorPaquete(paqueteId);

      if (!examenesDelPaquete || examenesDelPaquete.length === 0) {
        if (onModalMessage) onModalMessage('El paquete seleccionado no contiene exámenes registrados.');
        setCargandoPaquete(false);
        e.target.value = "";
        return;
      }

      let nuevosExamenesAgregados = 0;
      const listaActualizada = [...listaExamenes];

      examenesDelPaquete.forEach(examItem => {
        const idProdReal = examItem.idProducto || examItem.id;
        const codigoReal = examItem.codigo || examItem.codigoExamen || 'S/C';
        const nombreReal = examItem.nombre || examItem.examen || examItem.label;

        const yaExiste = listaActualizada.some(item => String(item.idProducto) === String(idProdReal));

        if (!yaExiste) {
          listaActualizada.push({
            id: uuidv4(),
            idProducto: idProdReal,
            codigoExamen: codigoReal,
            label: nombreReal,
            idDiagnostico: null,
            codigoCIE: ''
          });
          nuevosExamenesAgregados++;
        }
      });

      onContentChange(listaActualizada);
      setMostrarBuscador(false);

      if (onModalMessage && nuevosExamenesAgregados > 0) {
        const nombrePkg = paqueteSeleccionado ? paqueteSeleccionado.nombrePaquete : '';
        onModalMessage(`Se añadieron ${nuevosExamenesAgregados} exámenes del paquete "${nombrePkg}".`);
      }
    } catch (error) {
      if (onModalMessage) onModalMessage('Error al obtener el detalle del paquete seleccionado.');
    } finally {
      setCargandoPaquete(false);
      e.target.value = "";
    }
  }, [listaExamenes, paquetesDisponibles, onContentChange, onModalMessage]);

  // Vinculación de Diagnóstico (Relación 1 a 1)
  const handleSelectDiagnostico = useCallback((examId, diagObj) => {
    const listaActualizada = listaExamenes.map(item => {
      if (item.id === examId) {
        const targetDiagId = diagObj.idDiagnostico || diagObj.id;
        if (item.idDiagnostico === targetDiagId) {
          return { ...item, idDiagnostico: null, codigoCIE: '' };
        }
        return { 
          ...item, 
          idDiagnostico: targetDiagId, 
          codigoCIE: diagObj.codigoCIE || diagObj.codigo || 'S/C' 
        };
      }
      return item;
    });
    onContentChange(listaActualizada);
    setDropdownAbiertoId(null);
  }, [listaExamenes, onContentChange]);

  const handleDeleteExam = useCallback((id) => {
    const listaActualizada = listaExamenes.filter(item => item.id !== id);
    onContentChange(listaActualizada);
  }, [listaExamenes, onContentChange]);

  return (
    <div style={Styles.medicalSection}>
      {/* Cabecera Principal Compacta */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
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

        {/* Botón / Desplegable de Búsqueda */}
        <div ref={searchRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {mostrarBuscador ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px',
              width: '280px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setTipoBusqueda('INDIVIDUAL')}
                    style={{
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: tipoBusqueda === 'INDIVIDUAL' ? '#e0f2fe' : 'transparent',
                      color: tipoBusqueda === 'INDIVIDUAL' ? '#0369a1' : '#64748b'
                    }}
                  >
                    Examen
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoBusqueda('PAQUETE')}
                    style={{
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: tipoBusqueda === 'PAQUETE' ? '#e0f2fe' : 'transparent',
                      color: tipoBusqueda === 'PAQUETE' ? '#0369a1' : '#64748b'
                    }}
                  >
                    Paquete
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setMostrarBuscador(false)}
                  style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '0' }}
                >
                  <X size={14} />
                </button>
              </div>

              {tipoBusqueda === 'INDIVIDUAL' ? (
                <AutoCompleteInput
                  placeholder="Escriba el examen..."
                  onSelectSuggestion={handleAddExam}
                  fetchSuggestions={fetchExamSuggestions}
                  onModalMessage={onModalMessage}
                />
              ) : (
                <select
                  onChange={handleCargarPaquete}
                  defaultValue=""
                  disabled={cargandoPaquete}
                  style={{
                    width: '100%',
                    height: '26px',
                    padding: '0 6px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: cargandoPaquete ? '#f1f5f9' : '#ffffff',
                    fontSize: '11px',
                    color: '#334155',
                    outline: 'none',
                    cursor: cargandoPaquete ? 'wait' : 'pointer'
                  }}
                >
                  <option value="" disabled>
                    {cargandoPaquete ? 'Cargando...' : '-- Seleccionar Paquete --'}
                  </option>
                  {paquetesDisponibles.map(pkg => {
                    const pkgId = pkg.idPaqueteExamen || pkg.id;
                    return (
                      <option key={pkgId} value={pkgId}>
                        {pkg.nombrePaquete}
                      </option>
                    );
                  })}
                </select>
              )}
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

      {/* Lista de Registros */}
      {listaExamenes.length > 0 && (
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          backgroundColor: '#ffffff'
        }}>
          {listaExamenes.map((item, index) => {
            const tieneDxIncompleto = !item.idDiagnostico;

            return (
              <div 
                key={item.id} 
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 8px',
                  borderBottom: index === listaExamenes.length - 1 ? 'none' : '1px solid #f1f5f9',
                  gap: '8px'
                }}
              >
                {/* Action Button: Eliminar */}
                <button
                  type="button"
                  onClick={() => handleDeleteExam(item.id)}
                  title="Eliminar examen"
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

                {/* Badge Correlativo */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justify: 'center',
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

                {/* Bloque Clínico */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  
                  {/* Fila 1: Descripción */}
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#1e293b', 
                    fontWeight: '500', 
                    lineHeight: '1.3',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.label}
                  </div>
                  
                  {/* Fila 2: Metadata y Vinculación */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    
                    {/* Código de Examen */}
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
                      Cod: {item.codigoExamen}
                    </span>

                    {/* Botón Vinculador de Diagnóstico */}
                    <div style={{ position: 'relative' }} ref={dropdownAbiertoId === item.id ? dropdownRef : null}>
                      <button
                        type="button"
                        onClick={() => setDropdownAbiertoId(dropdownAbiertoId === item.id ? null : item.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          backgroundColor: tieneDxIncompleto ? '#fef2f2' : '#f0fdf4',
                          border: tieneDxIncompleto ? '1px solid #fca5a5' : '1px solid #bbf7d0',
                          color: tieneDxIncompleto ? '#dc2626' : '#16a34a',
                          fontSize: '10px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <Layers size={10} />
                        {tieneDxIncompleto 
                          ? 'Vincular Dx (Requerido)' 
                          : `Dx: [${item.codigoCIE}]`}
                      </button>

                      {/* Dropdown de Diagnósticos Disponibles */}
                      {dropdownAbiertoId === item.id && (
                        <div style={{
                          position: 'absolute',
                          top: '20px',
                          left: 0,
                          zIndex: 100,
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          padding: '6px',
                          width: '250px',
                          maxHeight: '160px',
                          overflowY: 'auto'
                        }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '4px', paddingBottom: '3px', borderBottom: '1px solid #f1f5f9' }}>
                            Seleccione el diagnóstico asociado:
                          </div>
                          {diagnosticosDisponibles.length === 0 ? (
                            <div style={{ fontSize: '10px', color: '#94a3b8', padding: '4px', textAlign: 'center' }}>
                              ⚠️ Registre diagnósticos en el panel superior.
                            </div>
                          ) : (
                            diagnosticosDisponibles.map((diag) => {
                              const diagId = diag.idDiagnostico || diag.id;
                              const codigo = diag.codigoCIE || diag.codigo || 'S/C';
                              const seleccionado = String(item.idDiagnostico) === String(diagId);

                              return (
                                <div
                                  key={diagId}
                                  onClick={() => handleSelectDiagnostico(item.id, diag)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: seleccionado ? '#eff6ff' : 'transparent',
                                    fontSize: '11px',
                                    color: '#334155'
                                  }}
                                >
                                  {seleccionado ? <CheckSquare size={12} color="#2563eb" /> : <Square size={12} color="#94a3b8" />}
                                  <span style={{ fontWeight: '600', color: '#1e3a8a' }}>[{codigo}]</span>
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {diag.label || diag.diagnostico || diag.descripcion}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>

                    {/* Desvincular Diagnóstico rápido */}
                    {item.idDiagnostico && (
                      <span 
                        onClick={() => handleSelectDiagnostico(item.id, { idDiagnostico: item.idDiagnostico })}
                        title="Eliminar vinculación"
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '4px',
                          padding: '0 4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        {item.codigoCIE} <span style={{ marginLeft: '3px', color: '#ef4444' }}>×</span>
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

export default AtencionMedicaExamenPanel;