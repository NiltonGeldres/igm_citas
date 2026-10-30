// src/components/Medicacion/AtencionMedicaMedicamentoPanel.js
import React, { useState } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; // Ruta relativa a common
import AtencionMedicaMedicamentoDetalleModal from './AtencionMedicaMedicamentoDetalleModal'; // Ruta relativa al modal en la misma carpeta
import Styles from '../../../Styles'; // Ruta relativa a Styles
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react'; // Importar iconos de Lucide React

/**
 * Componente independiente para gestionar la sección de Medicación.
 * Incluye la búsqueda de medicamentos con autocompletado,
 * la adición de detalles (dosis, frecuencia, cantidad, vía) a través de un modal,
 * y la visualización/edición/eliminación de los medicamentos en una lista.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Array<Object>} props.content - La lista actual de medicamentos (PanelTratamientos).
 * @param {function(Array<Object>): void} props.onContentChange - Función para actualizar la lista de medicamentos en el padre.
 * @param {function(string): void} props.onModalMessage - Función para mostrar mensajes en el modal principal de la aplicación.
 */
function AtencionMedicaMedicamentoPanel({ content, onContentChange, onModalMessage }) {
  // Estado para controlar la visibilidad y el medicamento a editar en el modal de detalles
  const [mostrarDetalleMedicamentoModal, setMostrarDetalleMedicamentoModal] = useState(false);
  const [medicamentoActualParaEditar, setMedicamentoActualParaEditar] = useState(null);

  // --- Función para simular la obtención de sugerencias de medicamentos ---
  // En un proyecto real, esta función haría una llamada a una API
  const fetchMedicationSuggestions = async (query) => {
    console.log("Obteniendo sugerencias de medicamentos para:", query);
    const mockMedications = [
      { id: 'med1', label: 'Paracetamol 500mg' },
      { id: 'med2', label: 'Ibuprofeno 400mg' },
      { id: 'med3', label: 'Amoxicilina 250mg' },
      { id: 'med4', label: 'Omeprazol 20mg' },
      { id: 'med5', label: 'Loratadina 10mg' },
      { id: 'med6', label: 'Atorvastatina 20mg' },
      { id: 'med7', label: 'Metformina 850mg' },
      { id: 'med8', label: 'Salbutamol Inhalador' },
      { id: 'med9', label: 'Losartán 50mg' },
      { id: 'med10', label: 'Tramadol 50mg' },
      { id: 'med11', label: 'Diazepam 5mg' },
      { id: 'med12', label: 'Aspirina 100mg' },
      { id: 'med13', label: 'Ciprofloxacino 500mg' },
      { id: 'med14', label: 'Prednisona 5mg' },
      { id: 'med15', label: 'Simvastatina 40mg' },
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = mockMedications.filter(med =>
          med.label.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 200); // Simula un retraso de red
    });
  };

  /**
   * Maneja la selección de un medicamento del autocompletado.
   * Abre el modal de detalles para que el usuario ingrese dosis, frecuencia y cantidad.
   * Si el medicamento ya existe, lo carga para edición.
   * @param {Object} medicationItem - El medicamento seleccionado del autocompletado.
   */
  const handleAddMedication = (medicationItem) => {
    const existingMed = content.find(item => item.descripcion === medicationItem.label);
    if (existingMed) {
      onModalMessage(`El medicamento "${medicationItem.label}" ya ha sido agregado. Abriendo para editar.`);
      setMedicamentoActualParaEditar(existingMed);
    } else {
      setMedicamentoActualParaEditar({
        id: uuidv4(), // Genera un ID único para el nuevo medicamento
        descripcion: medicationItem.label,
        dosis: '',
        frecuencia: '',
        cantidad: '',
        via: '', // INCLUIDO: el nuevo campo Vía inicializado
      });
    }
    setMostrarDetalleMedicamentoModal(true); // Abre el modal de detalles
  };

  /**
   * Maneja el guardado de los detalles del medicamento desde el modal.
   * Actualiza la lista de medicamentos en el estado del componente padre.
   * @param {Object} updatedMedication - El objeto medicamento con los detalles actualizados.
   */
  const handleSaveMedicationDetails = (updatedMedication) => {
    const existingIndex = content.findIndex(item => item.id === updatedMedication.id);
    let updatedList;
    if (existingIndex > -1) {
      // Si el medicamento ya existe (edición), lo actualiza en la lista
      updatedList = [...content];
      updatedList[existingIndex] = updatedMedication;
    } else {
      // Si es un medicamento nuevo, lo añade a la lista
      updatedList = [...content, updatedMedication];
    }
    onContentChange(updatedList); // Notifica al componente padre el cambio
    setMostrarDetalleMedicamentoModal(false); // Cierra el modal
    setMedicamentoActualParaEditar(null); // Limpia el medicamento en edición
  };

  /**
   * Elimina un medicamento de la lista.
   * @param {string} medicationId - El ID del medicamento a eliminar.
   */
  const handleDeleteMedication = (medicationId) => {
    const updatedList = content.filter(med => med.id !== medicationId);
    onContentChange(updatedList); // Notifica al componente padre el cambio
    onModalMessage('Medicamento eliminado.');
  };

  return (
    <div style={Styles.medicalSection}>
      <h3 style={Styles.sectionTitle}>Panel Medicación</h3>
      <AutoCompleteInput
        placeholder="Dicta o escribe un medicamento..."
        onSelectSuggestion={handleAddMedication}
        fetchSuggestions={fetchMedicationSuggestions}
        onModalMessage={onModalMessage} // Pasa la función de mensajes al autocompletado
      />

      {content.length > 0 && (
        <ul style={Styles.structuredList}>
          {content.map((item) => (
            <li key={item.id} style={Styles.bubbleListItemNoAvatar}>
              {/* Contenido principal del medicamento */}
              <div style={Styles.bubbleContentNoAvatar}>
                <div style={Styles.bubbleTopRow}>
                  <span style={Styles.bubbleName}>{item.descripcion}</span>
                  <div style={Styles.bubbleActionsTopRight}> {/* Contenedor para los iconos de acción */}
                    <button
                      style={Styles.bubbleActionButton}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el botón active el li
                        setMedicamentoActualParaEditar(item);
                        setMostrarDetalleMedicamentoModal(true);
                      }}
                    >
                      <Pencil size={18} style={Styles.bubbleActionButtonIcon} />
                    </button>
                    <button
                      style={{ ...Styles.bubbleActionButton, ...Styles.bubbleActionButtonDelete }}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el botón active el li
                        handleDeleteMedication(item.id);
                      }}
                    >
                      <Trash2 size={18} style={Styles.bubbleActionButtonIcon} />
                    </button>
                  </div>
                </div>
                <p style={Styles.bubbleDetails}>
                  Vía: {item.via || 'N/A'} | Dosis: {item.dosis || 'N/A'} | Frecuencia: {item.frecuencia || 'N/A'} veces/día | Cantidad: {item.cantidad || 'N/A'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Renderiza el modal de detalles de medicación si está visible */}
      {mostrarDetalleMedicamentoModal && (
        <AtencionMedicaMedicamentoDetalleModal
          medication={medicamentoActualParaEditar}
          onClose={() => {
            setMostrarDetalleMedicamentoModal(false);
            setMedicamentoActualParaEditar(null); // Limpiar el estado al cerrar
          }}
          onSave={handleSaveMedicationDetails}
          showMessage={onModalMessage} // Pasa la función de mensajes al modal
        />
      )}
    </div>
  );
}

export default AtencionMedicaMedicamentoPanel;
