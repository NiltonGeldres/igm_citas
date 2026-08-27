import React, { useState, useRef, useEffect } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import { AtencionMedicaTriajeService } from './AtencionMedicaTriajeService';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, UserX, Search, X } from 'lucide-react';

function AtencionMedicaTriajePanel({ content = [], onContentChange, onModalMessage, idPacienteSeleccionado }) {
  console.log( "ID PACIENTE ENVIADO A PANEL TRIAJES "+idPacienteSeleccionado )
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

  if (!idPacienteSeleccionado) {
    return (
      <div style={panelStyles.blockedContainer}>
        <UserX size={32} color="#94a3b8" />
        <h4 style={panelStyles.blockedTitle}>Paciente no seleccionado</h4>
        <p style={panelStyles.blockedText}>Seleccione una cita para iniciar el registro.</p>
      </div>
    );
  }

  // Inyecta el contenido actual para que el Service oculte los duplicados de las sugerencias
  const fetchTriajeSuggestions = async (query) => {
    return await AtencionMedicaTriajeService.buscarEnCatalogo(query, content);
  };

  /**
   * Agrega el nuevo parámetro clínico seleccionado desde el buscador
   */
  const handleAddCustom = (item) => {
    // Doble verificación de seguridad en el Frontend contra duplicidad de nombres
    const duplicado = content.some(x => x.nombre.toLowerCase() === item.label.toLowerCase());
    if (duplicado) return;

    const maxPrioridad = content.reduce((max, x) => x.prioridad > max ? x.prioridad : max, 0);
    
    onContentChange([...content, { 
      id: item.id || uuidv4(), // Hereda el ID fijo del catálogo maestro
      nombre: item.label, 
      valor: '', 
      unidad: item.unidad || '---', 
      checked: true,
      placeholder: item.placeholder || '---',
      prioridad: maxPrioridad + 1 
    }]);
    
    setIsSearchExpanded(false); 
  };

  /**
   * Elimina de forma definitiva un parámetro de la lista visible de este paciente
   */
  const handleRemoveItem = (id) => {
    onContentChange(content.filter(x => x.id !== id));
  };

  const handleValueChange = (id, valor) => {
    onContentChange(content.map(item => item.id === id ? { ...item, valor } : item));
  };

  // Ordenamos de forma ascendente según el orden clínico / prioridad establecido
  const contenidoOrdenado = [...content].sort((a, b) => a.prioridad - b.prioridad);

return (
    <div style={panelStyles.container}>
      
      {/* HEADER DEL PANEL */}
      <div style={panelStyles.headerBar}>
        <h3 style={panelStyles.panelTitle}>Signos Vitales y Biometría</h3>
        
        <div ref={searchRef} style={panelStyles.searchWrapper}>
          {isSearchExpanded ? (
            <div style={panelStyles.expandedSearchContainer}>
              <AutoCompleteInput
                placeholder="Buscar y añadir parámetro..."
                onSelectSuggestion={handleAddCustom}
                fetchSuggestions={fetchTriajeSuggestions}
                onModalMessage={onModalMessage} 
              />
              <button onClick={() => setIsSearchExpanded(false)} style={panelStyles.closeSearchBtn}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsSearchExpanded(true)} style={panelStyles.triggerSearchBtn}>
              <Search size={16} style={{ marginRight: '4px' }} />
              <span style={{ fontSize: '11px', fontWeight: '500' }}>Añadir parámetro</span>
            </button>
          )}
        </div>
      </div>

      {/* LISTA DINÁMICA DE SIGNOS VITALES */}
      <div style={panelStyles.listContainer}>
        {contenidoOrdenado.length === 0 ? (
          <div style={panelStyles.emptyState}>
            <p style={panelStyles.emptyText}>No hay parámetros clínicos cargados. Use el buscador para añadir.</p>
          </div>
        ) : (
          contenidoOrdenado.map((item, index) => (
            <div key={item.id} style={panelStyles.row}>
              
              <div style={panelStyles.checkArea}>
                <button 
                  onClick={() => handleRemoveItem(item.id)} 
                  style={panelStyles.deleteBtn}
                  title={`Quitar ${item.nombre}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                    e.currentTarget.style.color = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                >
                  <Trash2 size={14} />
                </button>
                
                {/* Badge Correlativo Numérico Secuencial */}
                <span style={panelStyles.priorityBadge}>
                  {index + 1}
                </span>

                <div style={panelStyles.labelGroup}>
                  <span style={panelStyles.label}>{item.nombre}</span>
                  <span style={panelStyles.unit}>{item.unidad}</span>
                </div>
              </div>

              <div style={panelStyles.inputArea}>
                <input
                  type="text"
                  placeholder={item.placeholder || '---'} 
                  value={item.valor}
                  onChange={(e) => handleValueChange(item.id, e.target.value)}
                  style={panelStyles.input}
                />
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

const panelStyles = {
  container: { padding: '0 4px' },
  headerBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', height: '32px', position: 'relative' },
  panelTitle: { fontSize: '13px', fontWeight: '600', color: '#334155', margin: 0 },
  searchWrapper: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1, marginLeft: '12px' },
  triggerSearchBtn: { display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0070da', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  expandedSearchContainer: { display: 'flex', alignItems: 'center', gap: '4px', width: '100%' },
  closeSearchBtn: { border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '4px' },
  listContainer: { backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  row: { display: 'flex', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid #f1f5f9', justifyContent: 'space-between' },
  checkArea: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  priorityBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', backgroundColor: '#f1f5f9', color: '#64748b' },
  labelGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '500', color: '#1e293b' },
  unit: { fontSize: '10.5px', color: '#94a3b8', fontWeight: '500' },
  inputArea: { width: '100px' },
  input: { width: '100%', padding: '5px 8px', fontSize: '13px', textAlign: 'center', fontWeight: '600', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', color: '#0f172a', backgroundColor: '#f8fafc' },
  deleteBtn: { border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', borderRadius: '6px', transition: 'all 0.15s ease' },
  emptyState: { padding: '24px', textAlign: 'center' },
  emptyText: { fontSize: '12px', color: '#64748b', margin: 0 },
  blockedContainer: { textAlign: 'center', padding: '24px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px' },
  blockedTitle: { fontSize: '13px', color: '#475569', margin: '4px 0' },
  blockedText: { fontSize: '11px', color: '#94a3b8', margin: 0 }
};

export default AtencionMedicaTriajePanel;