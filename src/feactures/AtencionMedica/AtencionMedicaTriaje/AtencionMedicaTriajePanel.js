import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Styles from '../../../Styles';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import { AtencionMedicaTriajeService } from './AtencionMedicaTriajeService';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, UserX, Search, X } from 'lucide-react';

function AtencionMedicaTriajePanel({ 
  content = [], 
  onContentChange, 
  onModalMessage, 
  idPacienteSeleccionado 
}) {
  const title = "Signos Vitales y Biometría";
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef(null);

  // Auto-cierre de la barra de búsqueda al hacer clic por fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Memorizar contenido y ordenamiento secuencial
  const listaContenido = useMemo(() => {
    return Array.isArray(content) ? content : [];
  }, [content]);

  const contenidoOrdenado = useMemo(() => {
    return [...listaContenido].sort((a, b) => (a.prioridad || 0) - (b.prioridad || 0));
  }, [listaContenido]);

  // Inyecta el contenido actual para que el Service oculte los duplicados
  const fetchTriajeSuggestions = useCallback(async (query) => {
    return await AtencionMedicaTriajeService.buscarEnCatalogo(query, listaContenido);
  }, [listaContenido]);

  /**
   * Agrega el nuevo parámetro clínico seleccionado desde el buscador
   */
  const handleAddCustom = useCallback((item) => {
    const duplicado = listaContenido.some(
      (x) => x.nombre.toLowerCase() === item.label.toLowerCase()
    );
    if (duplicado) return;

    const maxPrioridad = listaContenido.reduce(
      (max, x) => (x.prioridad > max ? x.prioridad : max), 
      0
    );

    onContentChange([
      ...listaContenido,
      {
        id: item.id || uuidv4(),
        nombre: item.label,
        valor: '',
        unidad: item.unidad || '---',
        checked: true,
        placeholder: item.placeholder || '---',
        prioridad: maxPrioridad + 1
      }
    ]);

    setIsSearchExpanded(false);
  }, [listaContenido, onContentChange]);

  /**
   * Elimina de forma definitiva un parámetro
   */
  const handleRemoveItem = useCallback((id) => {
    onContentChange(listaContenido.filter((x) => x.id !== id));
  }, [listaContenido, onContentChange]);

  const handleValueChange = useCallback((id, valor) => {
    onContentChange(
      listaContenido.map((item) => (item.id === id ? { ...item, valor } : item))
    );
  }, [listaContenido, onContentChange]);

  if (!idPacienteSeleccionado) {
    return (
      <div style={Styles.medicalSection}>
        <div style={{
          textAlign: 'center',
          padding: '16px 8px',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '6px'
        }}>
          <UserX size={24} color="#94a3b8" />
          <h4 style={{ fontSize: '12px', color: '#475569', margin: '4px 0 2px 0', fontWeight: '600' }}>
            Paciente no seleccionado
          </h4>
          <p style={{ fontSize: '10.5px', color: '#94a3b8', margin: 0 }}>
            Seleccione una cita para iniciar el registro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={Styles.medicalSection}>
      {/* HEADER DEL PANEL */}
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

        <div ref={searchRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {isSearchExpanded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '220px' }}>
              <AutoCompleteInput
                placeholder="Añadir parámetro..."
                onSelectSuggestion={handleAddCustom}
                fetchSuggestions={fetchTriajeSuggestions}
                onModalMessage={onModalMessage}
              />
              <button
                type="button"
                onClick={() => setIsSearchExpanded(false)}
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
              onClick={() => setIsSearchExpanded(true)}
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

      {/* LISTA DINÁMICA DE SIGNOS VITALES */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {contenidoOrdenado.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
              No hay parámetros clínicos cargados. Use el buscador para añadir.
            </p>
          </div>
        ) : (
          contenidoOrdenado.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                borderBottom: index === contenidoOrdenado.length - 1 ? 'none' : '1px solid #f1f5f9'
              }}
            >
              {/* ÁREA IZQUIERDA: Eliminar + Número + Nombre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  title={`Quitar ${item.nombre}`}
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

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', overflow: 'hidden' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#1e293b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.nombre}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', flexShrink: 0 }}>
                    ({item.unidad})
                  </span>
                </div>
              </div>

              {/* ÁREA DERECHA: Input de Valor Compacto */}
              <div style={{ width: '85px', flexShrink: 0 }}>
                <input
                  type="text"
                  placeholder={item.placeholder || '---'}
                  value={item.valor}
                  onChange={(e) => handleValueChange(item.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '3px 6px',
                    fontSize: '12px',
                    textAlign: 'center',
                    fontWeight: '600',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    outline: 'none',
                    color: '#0f172a',
                    backgroundColor: '#f8fafc',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AtencionMedicaTriajePanel;