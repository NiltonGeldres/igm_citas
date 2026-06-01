// src/components/Triaje/AtencionMedicaTriaje.js
import React, { useState } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; // Ruta relativa a common
import AtencionMedicaDetalleTriajeModal from './AtencionMedicaTriajeDetalleModal'; // Ruta relativa al modal en la misma carpeta
import Styles from '../../../Styles'; // Ruta relativa a Styles
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react'; // Importar iconos de Lucide React

/**
 * Componente independiente para gestionar la sección de Triaje.
 * Incluye la búsqueda de medidas de triaje con autocompletado,
 * la adición de detalles (valor, unidad) a través de un modal,
 * y la visualización/edición/eliminación de las medidas en una lista.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Array<Object>} props.content - La lista actual de medidas de triaje.
 * @param {function(Array<Object>): void} props.onContentChange - Función para actualizar la lista de triaje en el padre.
 * @param {function(string): void} props.onModalMessage - Función para mostrar mensajes en el modal principal de la aplicación.
 */
function AtencionMedicaTriajePanel({ content, onContentChange, onModalMessage }) {
  // Estado para controlar la visibilidad y el item de triaje a editar en el modal de detalles
  const [mostrarDetalleTriajeModal, setMostrarDetalleTriajeModal] = useState(false);
  const [triajeActualParaEditar, setTriajeActualParaEditar] = useState(null);

  // --- Función para simular la obtención de sugerencias de medidas de triaje ---
  // En un proyecto real, esta función haría una llamada a una API
  const fetchTriajeSuggestions = async (query) => {
    console.log("Obteniendo sugerencias de triaje para:", query);
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
      }, 200); // Simula un retraso de red
    });
  };

  /**
   * Maneja la selección de una medida de triaje del autocompletado.
   * Abre el modal de detalles para que el usuario ingrese el valor y la unidad.
   * Si la medida ya existe, la carga para edición.
   * @param {Object} measureItem - La medida seleccionada del autocompletado (solo tiene id y label).
   */
  const handleAddTriajeMeasure = (measureItem) => {
    // Buscar si la medida ya existe en la lista por su 'medida' original
    const existingMeasure = content.find(item => item.medida === measureItem.label);

    if (existingMeasure) {
      onModalMessage(`La medida "${measureItem.label}" ya ha sido agregada. Abriendo para editar.`);
      setTriajeActualParaEditar(existingMeasure);
    } else {
      // Si es una medida nueva, inicializa con el label y un nuevo ID, y campos vacíos para el modal
      setTriajeActualParaEditar({
        id: uuidv4(), // Genera un ID único para la nueva medida
        medida: measureItem.label, // Guarda el label original del autocompletado como la medida
        valor: '',
        unidad: '',
      });
    }
    setMostrarDetalleTriajeModal(true); // Abre el modal de detalles
  };

  /**
   * Maneja el guardado de los detalles de la medida de triaje desde el modal.
   * Actualiza la lista de triaje en el estado del componente padre.
   * @param {Object} updatedTriaje - El objeto de triaje con los detalles actualizados.
   */
  const handleSaveTriajeDetails = (updatedTriaje) => {
    const existingIndex = content.findIndex(item => item.id === updatedTriaje.id);
    let updatedList;
    if (existingIndex > -1) {
      // Si la medida ya existe (edición), la actualiza en la lista
      updatedList = [...content];
      updatedList[existingIndex] = updatedTriaje;
    } else {
      // Si es una medida nueva, la añade a la lista
      updatedList = [...content, updatedTriaje];
    }
    onContentChange(updatedList); // Notifica al componente padre el cambio
    setMostrarDetalleTriajeModal(false); // Cierra el modal
    setTriajeActualParaEditar(null); // Limpia el triaje en edición
  };

  /**
   * Elimina una medida de triaje de la lista.
   * @param {string} triajeId - El ID de la medida a eliminar.
   */
  const handleDeleteTriaje = (triajeId) => {
    const updatedList = content.filter(t => t.id !== triajeId);
    onContentChange(updatedList); // Notifica al componente padre el cambio
    onModalMessage('Medida de triaje eliminada.');
  };

  return (
    <div style={Styles.medicalSection}>
      <h3 style={Styles.sectionTitle}>Panel Triaje</h3>
      <AutoCompleteInput
        placeholder="Dicta o escribe una medida (ej: Temperatura, Presión Arterial)..."
        onSelectSuggestion={handleAddTriajeMeasure}
        fetchSuggestions={fetchTriajeSuggestions}
        onModalMessage={onModalMessage} // Pasa la función de mensajes al autocompletado
      />

      {content.length > 0 && (
        <ul style={Styles.structuredList}>
          {content.map((item) => (
            <li key={item.id} style={Styles.bubbleListItemNoAvatar}>
              {/* Contenido principal de la medida de triaje */}
              <div style={Styles.bubbleContentNoAvatar}>
                <div style={Styles.bubbleTopRow}>
                  <span style={Styles.bubbleName}>
                    {item.medida}: {item.valor} {item.unidad}
                  </span>
                  <div style={Styles.bubbleActionsTopRight}> {/* Contenedor para los iconos de acción */}
                    <button
                      style={Styles.bubbleActionButton}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el botón active el li
                        setTriajeActualParaEditar(item);
                        setMostrarDetalleTriajeModal(true);
                      }}
                    >
                      <Pencil size={18} style={Styles.bubbleActionButtonIcon} />
                    </button>
                    <button
                      style={{ ...Styles.bubbleActionButton, ...Styles.bubbleActionButtonDelete }}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el botón active el li
                        handleDeleteTriaje(item.id);
                      }}
                    >
                      <Trash2 size={18} style={Styles.bubbleActionButtonIcon} />
                    </button>
                  </div>
                </div>
                {/* Puedes añadir más detalles aquí si los campos del modal lo permiten */}
                {/* <p style={Styles.bubbleDetails}>
                  Detalle adicional: {item.otroDetalle || 'N/A'}
                </p> */}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Renderiza el modal de detalles de triaje si está visible */}
      {mostrarDetalleTriajeModal && (
        <AtencionMedicaDetalleTriajeModal
          triajeItem={triajeActualParaEditar}
          onClose={() => {
            setMostrarDetalleTriajeModal(false);
            setTriajeActualParaEditar(null); // Limpiar el estado al cerrar
          }}
          onSave={handleSaveTriajeDetails}
          showMessage={onModalMessage} // Pasa la función de mensajes al modal
        />
      )}
    </div>
  );
}

export default AtencionMedicaTriajePanel;
