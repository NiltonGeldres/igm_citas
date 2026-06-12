import React, { useState } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import AtencionMedicaDetalleTriajeModal from './AtencionMedicaTriajeDetalleModal'; 
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, Activity } from 'lucide-react'; 

function AtencionMedicaTriajePanel({ content, onContentChange, onModalMessage }) {
  const [mostrarDetalleTriajeModal, setMostrarDetalleTriajeModal] = useState(false);
  const [triajeActualParaEditar, setTriajeActualParaEditar] = useState(null);

  const fetchTriajeSuggestions = async (query) => {
    const mockTriajeMeasures = [
      { id: 't1', label: 'Temperatura' },
      { id: 't2', label: 'Presión Arterial' },
      { id: 't3', label: 'Frecuencia Cardíaca' },
      { id: 't4', label: 'Frecuencia Respiratoria' },
      { id: 't5', label: 'Saturación de Oxígeno' },
      { id: 't6', label: 'Peso' },
      { id: 't7', label: 'Talla' },
      { id: 't8', label: 'IMC' },
      { id: 't9', label: 'Glucosa en Sangre' },
      { id: 't10', label: 'Dolor (Escala)' },
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = mockTriajeMeasures.filter(measure =>
          measure.label.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 200); 
    });
  };

  const handleAddTriajeMeasure = (measureItem) => {
    const existingMeasure = content.find(item => item.medida === measureItem.label);

    if (existingMeasure) {
      onModalMessage(`La medida "${measureItem.label}" ya ha sido agregada. Abriendo para editar.`);
      setTriajeActualParaEditar(existingMeasure);
    } else {
      setTriajeActualParaEditar({
        id: uuidv4(), 
        medida: measureItem.label, 
        valor: '',
        unit: '', // Se mapeará correctamente al guardar en el modal
      });
    }
    setMostrarDetalleTriajeModal(true); 
  };

  const handleSaveTriajeDetails = (updatedTriaje) => {
    const existingIndex = content.findIndex(item => item.id === updatedTriaje.id);
    let updatedList;
    if (existingIndex > -1) {
      updatedList = [...content];
      updatedList[existingIndex] = updatedTriaje;
    } else {
      updatedList = [...content, updatedTriaje];
    }
    onContentChange(updatedList); 
    setMostrarDetalleTriajeModal(false); 
    setTriajeActualParaEditar(null); 
  };

  const handleDeleteTriaje = (triajeId) => {
    const updatedList = content.filter(t => t.id !== triajeId);
    onContentChange(updatedList); 
    onModalMessage('Medida de triaje eliminada.');
  };

  return (
    <div style={panelStyles.container}>
      <div style={panelStyles.headerRow}>
        <Activity size={18} style={{ color: '#0070da' }} />
        <h3 style={panelStyles.sectionTitle}>Signos Vitales y Somatometría</h3>
      </div>
      
      <div style={panelStyles.searchWrapper}>
        <AutoCompleteInput
          placeholder="Escribe o busca una medida (ej: Temperatura, Presión)..."
          onSelectSuggestion={handleAddTriajeMeasure}
          fetchSuggestions={fetchTriajeSuggestions}
          onModalMessage={onModalMessage} 
        />
      </div>

      {content.length > 0 && (
        <div style={panelStyles.listCard}>
          {content.map((item, index) => (
            <div 
              key={item.id} 
              style={{
                ...panelStyles.listItemRow,
                ...(index === content.length - 1 ? { borderBottom: 'none' } : {})
              }}
            >
              <div style={panelStyles.itemInfoArea}>
                <span style={panelStyles.measureLabel}>{item.medida}</span>
                <span style={panelStyles.measureValue}>
                  {item.valor} <span style={panelStyles.measureUnit}>{item.unidad}</span>
                </span>
              </div>

              <div style={panelStyles.actionsArea}>
                <button
                  style={panelStyles.actionButtonEdit}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setTriajeActualParaEditar(item);
                    setMostrarDetalleTriajeModal(true);
                  }}
                  title="Editar"
                >
                  <Pencil size={15} />
                </button>
                <button
                  style={panelStyles.actionButtonDelete}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDeleteTriaje(item.id);
                  }}
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarDetalleTriajeModal && (
        <AtencionMedicaDetalleTriajeModal
          triajeItem={triajeActualParaEditar}
          onClose={() => {
            setMostrarDetalleTriajeModal(false);
            setTriajeActualParaEditar(null); 
          }}
          onSave={handleSaveTriajeDetails}
          showMessage={onModalMessage} 
        />
      )}
    </div>
  );
}


const panelStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    
  },
  headerRow: {
    display: 'flex',
    alignitems: 'center',
    gap: '8px',
    marginBottom: '12px',
    paddingLeft: '4px'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '500', 
    color: '#333333',
    margin: 0,
    letterSpacing: '-0.2px',
  },
  searchWrapper: {
    marginBottom: '16px',
  },
  listCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
    overflow: 'hidden',
  },
  listItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eeeeee',
    transition: 'background-color 0.2s ease',
  },
  itemInfoArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  measureLabel: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#666666',
  },
  measureValue: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#212529',
  },
  measureUnit: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#888888',
  },
  actionsArea: {
    display: 'flex',
    gap: '8px',
  },
  actionButtonEdit: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid rgba(0, 112, 218, 0.15)',
    backgroundColor: 'rgba(0, 112, 218, 0.04)',
    color: '#0070da',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  actionButtonDelete: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid rgba(220, 53, 69, 0.15)',
    backgroundColor: 'rgba(220, 53, 69, 0.04)',
    color: '#dc3545',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  
};

export default AtencionMedicaTriajePanel;