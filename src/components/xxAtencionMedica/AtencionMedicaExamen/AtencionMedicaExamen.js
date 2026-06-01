// src/components/AtencionExamen/AtencionMedicaExamen.js
import React, { useState } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; // Ruta relativa a common
import DetalleAtencionExamenModal from './AtencionMedicaDetalleExamenModal'; // Ruta relativa al modal en la misma carpeta
import Styles from '../../../Styles'; // Ruta relativa a Styles
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react'; // Importar iconos de Lucide React


/**
 * Componente independiente para gestionar la sección de Exámenes.
 * Incluye la búsqueda de exámenes con autocompletado,
 * la adición de detalles (examen, cantidad, diagnóstico) a través de un modal,
 * y la visualización/edición/eliminación de los exámenes en una lista.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Array<Object>} props.content - La lista actual de exámenes (PanelPlanTrabajo).
 * @param {function(Array<Object>): void} props.onContentChange - Función para actualizar la lista de exámenes en el padre.
 * @param {function(string): void} props.onModalMessage - Función para mostrar mensajes en el modal principal de la aplicación.
 * @param {Array<Object>} props.diagnosticosDisponibles - Lista de diagnósticos disponibles para el autocompletado en el modal.
 */
function AtencionMedicaExamen({ content, onContentChange, onModalMessage, diagnosticosDisponibles }) {
  // Estado para controlar la visibilidad y el examen a editar en el modal de detalles
  const [mostrarDetalleExamenModal, setMostrarDetalleExamenModal] = useState(false);
  const [examenActualParaEditar, setExamenActualParaEditar] = useState(null);

  // --- Función para simular la obtención de sugerencias de exámenes ---
  // En un proyecto real, esta función haría una llamada a una API
  const fetchExamenSuggestions = async (query) => {
    console.log("Obteniendo sugerencias de examen para:", query);
    const mockExams = [
      { id: 'exam1', label: 'Análisis de Sangre Completo' },
      { id: 'exam2', label: 'Análisis de Orina' },
      { id: 'exam3', label: 'Radiografía de Tórax' },
      { id: 'exam4', label: 'Electrocardiograma (ECG)' },
      { id: 'exam5', label: 'Ecografía Abdominal' },
      { id: 'exam6', label: 'Resonancia Magnética Cerebral' },
      { id: 'exam7', label: 'Prueba de Glucosa en Sangre' },
      { id: 'exam8', label: 'Cultivo de Garganta' },
      { id: 'exam9', label: 'Prueba de Función Hepática' },
      { id: 'exam10', label: 'Endoscopia Digestiva Alta' },
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = mockExams.filter(exam =>
          exam.label.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 200); // Simula un retraso de red
    });
  };

  /**
   * Maneja la selección de un examen del autocompletado.
   * Abre el modal de detalles para que el usuario ingrese cantidad y diagnóstico.
   * Si el examen ya existe, lo carga para edición.
   * @param {Object} examenItem - El examen seleccionado del autocompletado (solo tiene id y label).
   */
  const handleAddExamen = (examenItem) => {
    // Buscar si el examen ya existe en la lista por su 'label' original del autocompletado
    const existingExamen = content.find(item => item.label === examenItem.label || item.examen === examenItem.label);

    if (existingExamen) {
      onModalMessage(`El examen "${examenItem.label}" ya ha sido agregado. Abriendo para editar.`);
      setExamenActualParaEditar(existingExamen);
    } else {
      // Si es un examen nuevo, inicializa con el label y un nuevo ID, y campos vacíos para el modal
      setExamenActualParaEditar({
        id: uuidv4(), // Genera un ID único para el nuevo examen
        label: examenItem.label, // Guarda el label original del autocompletado
        examen: examenItem.label, // Inicializa el campo de texto del modal con el label
        cantidad: 1, // Valor por defecto
        diagnostico: '', // Vacío, debe ser seleccionado en el modal
      });
    }
    setMostrarDetalleExamenModal(true); // Abre el modal de detalles
  };

  /**
   * Maneja el guardado de los detalles del examen desde el modal.
   * Actualiza la lista de exámenes en el estado del componente padre.
   * @param {Object} updatedExamen - El objeto examen con los detalles actualizados.
   */
  const handleSaveExamenDetails = (updatedExamen) => {
    const existingIndex = content.findIndex(item => item.id === updatedExamen.id);
    let updatedList;
    if (existingIndex > -1) {
      // Si el examen ya existe (edición), lo actualiza en la lista
      updatedList = [...content];
      updatedList[existingIndex] = updatedExamen;
    } else {
      // Si es un examen nuevo, lo añade a la lista
      updatedList = [...content, updatedExamen];
    }
    onContentChange(updatedList); // Notifica al componente padre el cambio
    setMostrarDetalleExamenModal(false); // Cierra el modal
    setExamenActualParaEditar(null); // Limpia el examen en edición
    onModalMessage('Examen guardado con éxito.');
  };

  /**
   * Elimina un examen de la lista.
   * @param {string} examenId - El ID del examen a eliminar.
   */
  const handleDeleteExamen = (examenId) => {
    const updatedList = content.filter(ex => ex.id !== examenId);
    onContentChange(updatedList); // Notifica al componente padre el cambio
    onModalMessage('Examen eliminado.');
  };

  return (
    <div style={Styles.medicalSection}>
      <h3 style={Styles.sectionTitle}>Panel Exámenes</h3>
      <AutoCompleteInput
        label="Buscar y Añadir Examen"
        placeholder="Dicta o escribe un examen..."
        onSelectSuggestion={handleAddExamen}
        fetchSuggestions={fetchExamenSuggestions}
        onModalMessage={onModalMessage} // Pasa la función de mensajes al autocompletado
      />

      {content.length > 0 && (
        <ul style={Styles.structuredList}>
          {content.map((item) => (
            <li key={item.id} style={Styles.bubbleListItemNoAvatar}>
              {/* Contenido principal del examen */}
              <div style={Styles.bubbleContentNoAvatar}>
                <div style={Styles.bubbleTopRow}>
                  <span style={Styles.bubbleName}>{item.label || item.examen}</span>
                  <div style={Styles.bubbleActionsTopRight}> {/* Contenedor para los iconos de acción */}
                    <button
                      style={Styles.bubbleActionButton}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el botón active el li
                        setExamenActualParaEditar(item);
                        setMostrarDetalleExamenModal(true);
                      }}
                    >
                      <Pencil size={18} style={Styles.bubbleActionButtonIcon} />
                    </button>
                    <button
                      style={{ ...Styles.bubbleActionButton, ...Styles.bubbleActionButtonDelete }}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el botón active el li
                        handleDeleteExamen(item.id);
                      }}
                    >
                      <Trash2 size={18} style={Styles.bubbleActionButtonIcon} />
                    </button>
                  </div>
                </div>
                <p style={Styles.bubbleDetails}>
                  Cantidad: {item.cantidad || 'N/A'} | Diagnóstico Asociado: {item.diagnostico || 'N/A'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Renderiza el modal de detalles de examen si está visible */}
      {mostrarDetalleExamenModal && (
        <DetalleAtencionExamenModal
          examenItem={examenActualParaEditar}
          onClose={() => {
            setMostrarDetalleExamenModal(false);
            setExamenActualParaEditar(null); // Limpiar el estado al cerrar
          }}
          onSave={handleSaveExamenDetails}
          showMessage={onModalMessage}
          diagnosticosDisponibles={diagnosticosDisponibles} // Pasa los diagnósticos al modal
        />
      )}
    </div>
  );
}

export default AtencionMedicaExamen;
