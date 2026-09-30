// src/components/Medicacion/AtencionMedicaMedicamentoPanel.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import AtencionMedicaMedicamentoDetalleModal from './AtencionMedicaMedicamentoDetalleModal'; 
import Styles from '../../../Styles'; 
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, Layers, CheckSquare, Square, Search, X } from 'lucide-react'; 
import { AtencionMedicaMedicamentoService } from './AtencionMedicaMedicamentoService';

function AtencionMedicaMedicamentoPanel({ 
  content = [], 
  onContentChange, 
  onModalMessage, 
  diagnosticosDisponibles = [] 
}) {
  const title = "Tratamiento / Medicación";
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState('INDIVIDUAL'); // 'INDIVIDUAL' | 'PAQUETE'
  const [mostrarDetalleMedicamentoModal, setMostrarDetalleMedicamentoModal] = useState(false);
  const [medicamentoActualParaEditar, setMedicamentoActualParaEditar] = useState(null);
  const [paquetesDisponibles, setPaquetesDisponibles] = useState([]);
  const [cargandoPaquete, setCargandoPaquete] = useState(false);
  const [dropdownAbiertoId, setDropdownAbiertoId] = useState(null);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Normalización memorizada del contenido
  const listaMedicamentos = useMemo(() => {
    return Array.isArray(content) ? content : [];
  }, [content]);

  // Carga inicial de paquetes con prevención de memory leaks
  useEffect(() => {
    let isMounted = true;
    const cargarPaquetes = async () => {
      try {
        const pkgs = await AtencionMedicaMedicamentoService.obtenerListaPaquetes();
        if (isMounted) setPaquetesDisponibles(pkgs || []);
      } catch (error) {
        console.error("Error al cargar lista de paquetes de medicamentos:", error);
      }
    };
    cargarPaquetes();
    return () => { isMounted = false; };
  }, []);

  // Cierre de dropdowns y buscador al hacer clic fuera
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

  const fetchMedicationSuggestions = useCallback(async (query) => {
    try {
      return await AtencionMedicaMedicamentoService.buscarMedicamentosCatalogo(query);
    } catch (error) {
      if (onModalMessage) onModalMessage('Error al conectar con el catálogo de medicamentos.');
      return [];
    }
  }, [onModalMessage]);

  // Selección individual de medicamento
  const handleAddMedication = useCallback((medicationItem) => {
    if (!medicationItem) return;

    const existingMed = listaMedicamentos.find(item => item.descripcion === medicationItem.label);
    
    if (existingMed) {
      if (onModalMessage) {
        onModalMessage(`El medicamento "${medicationItem.label}" ya fue agregado. Editando posología.`);
      }
      setMedicamentoActualParaEditar(existingMed);
    } else {
      setMedicamentoActualParaEditar({
        id: uuidv4(),
        idProducto: medicationItem.idProducto,
        descripcion: medicationItem.label,
        dosis: medicationItem.dosisDefault || '',
        frecuencia: medicationItem.frecuenciaDefault || '',
        periodo: medicationItem.duracionDiasDefault || '',
        cantidad: medicationItem.cantidadPredefinida || '',
        via: medicationItem.idViaDefault || '',
        idDiagnostico: null,
        codigoCIE: ''
      });
    }
    setMostrarDetalleMedicamentoModal(true);
  }, [listaMedicamentos, onModalMessage]);

  // Cargar medicamentos desde paquete preconfigurado
  const handleCargarPaquete = useCallback(async (e) => {
    const paqueteId = e.target.value;
    if (!paqueteId) return;

    const paqueteSeleccionado = paquetesDisponibles.find(
      pkg => String(pkg.idPaqueteExamen || pkg.id) === String(paqueteId)
    );

    try {
      setCargandoPaquete(true);
      const medicamentosAsociados = await AtencionMedicaMedicamentoService.obtenerProductosPorPaquete(paqueteId);

      if (!medicamentosAsociados || medicamentosAsociados.length === 0) {
        if (onModalMessage) onModalMessage('El paquete seleccionado no contiene medicamentos registrados.');
        setCargandoPaquete(false);
        e.target.value = "";
        return;
      }

      let nuevosAgregados = 0;
      const listaActualizada = [...listaMedicamentos];

      medicamentosAsociados.forEach(medItem => {
        const nombreMed = medItem.label || medItem.descripcion;
        const yaExiste = listaActualizada.some(
          item => item.descripcion && item.descripcion.toLowerCase() === nombreMed.toLowerCase()
        );

        if (!yaExiste) {
          listaActualizada.push({
            id: uuidv4(),
            idProducto: medItem.idProducto || medItem.id,
            descripcion: nombreMed,
            dosis: medItem.dosisDefault || '',
            frecuencia: medItem.frecuenciaDefault || '',
            periodo: medItem.duracionDiasDefault || '',
            cantidad: medItem.cantidadPredefinida || '',
            via: medItem.idViaDefault || '',
            idDiagnostico: null,
            codigoCIE: ''
          });
          nuevosAgregados++;
        }
      });

      onContentChange(listaActualizada);
      setMostrarBuscador(false);

      if (onModalMessage && nuevosAgregados > 0) {
        const nombrePkg = paqueteSeleccionado ? (paqueteSeleccionado.label || paqueteSeleccionado.nombrePaquete) : '';
        onModalMessage(`Se inyectaron ${nuevosAgregados} medicamentos del paquete "${nombrePkg}".`);
      }
    } catch (error) {
      if (onModalMessage) onModalMessage('Error al obtener el detalle del paquete seleccionado.');
    } finally {
      setCargandoPaquete(false);
      e.target.value = "";
    }
  }, [listaMedicamentos, paquetesDisponibles, onContentChange, onModalMessage]);

  // Guardar posología editada en modal
  const handleSaveMedicationDetails = useCallback((updatedMedication) => {
    const existingIndex = listaMedicamentos.findIndex(item => item.id === updatedMedication.id);
    let updatedList = [...listaMedicamentos];

    if (existingIndex > -1) {
      updatedList[existingIndex] = updatedMedication;
    } else {
      updatedList.push(updatedMedication);
    }

    onContentChange(updatedList);
    setMostrarDetalleMedicamentoModal(false);
    setMedicamentoActualParaEditar(null);
    setMostrarBuscador(false);
  }, [listaMedicamentos, onContentChange]);

  // Vinculación / Desvinculación de Diagnóstico (Relación 1 a 1)
  const handleSelectDiagnostico = useCallback((medicamentoId, diagObj) => {
    const targetDiagId = diagObj.idDiagnostico || diagObj.id;
    const codigoCieReal = diagObj.codigoCIE || diagObj.codigo || diagObj.codigoCie10 || 'S/C';

    const listaActualizada = listaMedicamentos.map(item => {
      if (item.id === medicamentoId) {
        if (String(item.idDiagnostico) === String(targetDiagId)) {
          return { ...item, idDiagnostico: null, codigoCIE: '' };
        }
        return {
          ...item,
          idDiagnostico: targetDiagId,
          codigoCIE: codigoCieReal
        };
      }
      return item;
    });

    onContentChange(listaActualizada);
    setDropdownAbiertoId(null);
  }, [listaMedicamentos, onContentChange]);

  // Eliminar medicamento de la lista
  const handleDeleteMedication = useCallback((medicamentoId) => {
    const listaActualizada = listaMedicamentos.filter(med => med.id !== medicamentoId);
    onContentChange(listaActualizada);
    if (onModalMessage) onModalMessage('Medicamento eliminado del tratamiento.');
  }, [listaMedicamentos, onContentChange, onModalMessage]);

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

        {/* Botón / Desplegable de Búsqueda Compacto */}
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
                    Fármaco
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
                    Receta Preconfigurada
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
                  placeholder="Escriba el fármaco..."
                  onSelectSuggestion={handleAddMedication}
                  fetchSuggestions={fetchMedicationSuggestions}
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
                    {cargandoPaquete ? 'Cargando...' : '-- Seleccionar Receta --'}
                  </option>
                  {paquetesDisponibles.map(pkg => {
                    const pkgId = pkg.idPaqueteExamen || pkg.id;
                    return (
                      <option key={pkgId} value={pkgId}>
                        {pkg.label || pkg.nombrePaquete}
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
      {listaMedicamentos.length > 0 && (
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          backgroundColor: '#ffffff'
        }}>
          {listaMedicamentos.map((item, index) => {
            const tieneDxIncompleto = !item.idDiagnostico;

            return (
              <div 
                key={item.id} 
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 8px',
                  borderBottom: index === listaMedicamentos.length - 1 ? 'none' : '1px solid #f1f5f9',
                  gap: '8px'
                }}
              >
                {/* Action Buttons: Editar / Eliminar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMedicamentoActualParaEditar(item);
                      setMostrarDetalleMedicamentoModal(true);
                    }}
                    title="Editar posología"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#3b82f6',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '4px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMedication(item.id)}
                    title="Eliminar medicamento"
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
                </div>

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
                    {item.descripcion}
                  </div>
                  
                  {/* Fila 2: Metadata de Posología y Vinculación */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                    
                    {/* Badges Posológicos */}
                    <span style={{ fontSize: '10px', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '1px 5px', borderRadius: '4px', border: '1px solid #bbf7d0', fontWeight: '500', textTransform: 'capitalize' }}>
                      Vía: {item.via || 'N/A'}
                    </span>
                    <span style={{ fontSize: '10px', backgroundColor: '#eff6ff', color: '#2563eb', padding: '1px 5px', borderRadius: '4px', border: '1px solid #bfdbfe', fontWeight: '500' }}>
                      Dosis: {item.dosis || 'N/A'}
                    </span>
                    <span style={{ fontSize: '10px', backgroundColor: '#fff7ed', color: '#ea580c', padding: '1px 5px', borderRadius: '4px', border: '1px solid #ffedd5', fontWeight: '500' }}>
                      Cada: {item.frecuencia ? `Cada ${Math.round(24 / item.frecuencia)} hrs` : 'N/A'} ({item.frecuencia || 0} v/d)
                    </span>
                    <span style={{ fontSize: '10px', backgroundColor: '#f3e8ff', color: '#9333ea', padding: '1px 5px', borderRadius: '4px', border: '1px solid #e9d5ff', fontWeight: '500' }}>
                      Durante: {item.periodo || '0'} días
                    </span>
                    <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: '600' }}>
                      Total: {item.cantidad || 0} und.
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
                          : `Dx: [${item.codigoCIE || 'S/C'}]`}
                      </button>

                      {/* Dropdown Flotante de Diagnósticos */}
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
                              const codigo = diag.codigoCIE || diag.codigo || diag.codigoCie10 || 'S/C';
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

      {/* Modal de Detalles Operativo */}
      {mostrarDetalleMedicamentoModal && (
        <AtencionMedicaMedicamentoDetalleModal
          medication={medicamentoActualParaEditar}
          onClose={() => {
            setMostrarDetalleMedicamentoModal(false);
            setMedicamentoActualParaEditar(null);
          }}
          onSave={handleSaveMedicationDetails}
          showMessage={onModalMessage}
        />
      )}
    </div>
  );
}

export default AtencionMedicaMedicamentoPanel;