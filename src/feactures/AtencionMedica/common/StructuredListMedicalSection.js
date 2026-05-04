// src/components/common/StructuredListMedicalSection.js
import React, { useState } from 'react';
import useVoiceRecognition from '../../../hooks/useVoiceRecognition'; // Importa el hook de voz
import styles from '../../../Styles'; // Importa los estilos globales
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos para los ítems de la lista

/**
 * Componente para una sección de atención médica que gestiona una lista de ítems estructurados.
 * Permite entrada guiada para 'Tratamiento' y texto libre para otros tipos de lista.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.title - El título de la sección (ej. "Panel Tratamientos").
 * @param {Array<object>} props.content - La lista actual de ítems de la sección.
 * @param {function} props.onContentChange - Función para actualizar la lista de ítems en el padre.
 * @param {function} props.onModalMessage - Función para mostrar mensajes en un modal.
 * @param {string} props.sectionType - Tipo de sección para adaptar la interfaz (ej. 'Tratamiento', 'Diagnostico', 'Triaje').
 */
const StructuredListMedicalSection = ({ title, content, onContentChange, onModalMessage, sectionType }) => {
  // Estados para la entrada guiada de Tratamientos
  const [medicamento, setMedicamento] = useState('');
  const [dosis, setDosis] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [dias, setDias] = useState('');

  // Estado para la entrada de texto libre (para Diagnostico, Triaje)
  const [currentDictation, setCurrentDictation] = useState('');

  // Estado para el modal de edición de ítems existentes
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Instancias de useVoiceRecognition para cada campo (si es 'Tratamiento')
  const { startListening: startMed, stopListening: stopMed, isListening: isMedListening, error: medError } = useVoiceRecognition(setMedicamento, onModalMessage);
  const { startListening: startDosis, stopListening: stopDosis, isListening: isDosisListening, error: dosisError } = useVoiceRecognition(setDosis, onModalMessage);
  const { startListening: startFrec, stopListening: stopFrec, isListening: isFrecListening, error: frecError } = useVoiceRecognition(setFrecuencia, onModalMessage);
  const { startListening: startDias, stopListening: stopDias, isListening: isDiasListening, error: diasError } = useVoiceRecognition(setDias, onModalMessage);

  // Instancia de useVoiceRecognition para el dictado general (para Diagnostico, Triaje)
  const { startListening: startGeneral, stopListening: stopGeneral, isListening: isGeneralListening, error: generalError } = useVoiceRecognition(setCurrentDictation, onModalMessage);


  // Función para agregar un nuevo ítem (medicamento o descripción) a la lista
  const handleAddItem = () => {
    if (sectionType === 'Tratamiento') {
      if (!medicamento.trim()) {
        onModalMessage("El nombre del medicamento no puede estar vacío.");
        return;
      }
      const newItem = {
        id: uuidv4(),
        medicamento: medicamento.trim(),
        dosis: dosis.trim(),
        frecuencia: frecuencia.trim(),
        dias: dias.trim(),
      };
      onContentChange([...content, newItem]);
      // Limpiar campos después de agregar
      setMedicamento('');
      setDosis('');
      setFrecuencia('');
      setDias('');
    } else { // Para Diagnostico, Triaje (texto libre)
      if (!currentDictation.trim()) {
        onModalMessage("La descripción no puede estar vacía.");
        return;
      }
      const newItem = {
        id: uuidv4(),
        descripcion: currentDictation.trim(),
      };
      onContentChange([...content, newItem]);
      setCurrentDictation(''); // Limpiar el área de dictado
    }
  };

  const handleSaveEditedItem = () => {
    if (itemToEdit) {
      const updatedList = content.map(item =>
        item.id === itemToEdit.id ? itemToEdit : item
      );
      onContentChange(updatedList);
      setIsEditModalOpen(false);
      setItemToEdit(null);
    }
  };

  const handleDeleteItem = (idToDelete) => {
    const updatedList = content.filter(item => item.id !== idToDelete);
    onContentChange(updatedList);
  };

  const handleEditItem = (item) => {
    setItemToEdit({ ...item }); // Crear una copia para evitar mutación directa del estado
    setIsEditModalOpen(true);
  };

  // Renderizado del modal de edición de ítem
  const renderItemEditModal = () => {
    if (!isEditModalOpen || !itemToEdit) return null;

    const isTratamiento = sectionType === 'Tratamiento';

    return (
      <div style={styles.modalOverlay}>
        <div style={styles.itemEditModalContent}>
          <h3 style={styles.itemEditModalTitle}>Editar Ítem</h3>
          {isTratamiento ? (
            <>
              <label style={styles.itemEditModalLabel}>Medicamento:</label>
              <input
                type="text"
                style={styles.itemEditModalInput}
                value={itemToEdit.medicamento || ''}
                onChange={(e) => setItemToEdit({ ...itemToEdit, medicamento: e.target.value })}
              />
              <label style={styles.itemEditModalLabel}>Dosis:</label>
              <input
                type="text"
                style={styles.itemEditModalInput}
                value={itemToEdit.dosis || ''}
                onChange={(e) => setItemToEdit({ ...itemToEdit, dosis: e.target.value })}
              />
              <label style={styles.itemEditModalLabel}>Frecuencia:</label>
              <input
                type="text"
                style={styles.itemEditModalInput}
                value={itemToEdit.frecuencia || ''}
                onChange={(e) => setItemToEdit({ ...itemToEdit, frecuencia: e.target.value })}
              />
              <label style={styles.itemEditModalLabel}>Días:</label>
              <input
                type="text"
                style={styles.itemEditModalInput}
                value={itemToEdit.dias || ''}
                onChange={(e) => setItemToEdit({ ...itemToEdit, dias: e.target.value })}
              />
            </>
          ) : (
            <>
              <label style={styles.itemEditModalLabel}>Descripción:</label>
              <textarea
                style={styles.itemEditModalInput}
                value={itemToEdit.descripcion || ''}
                onChange={(e) => setItemToEdit({ ...itemToEdit, descripcion: e.target.value })}
                rows="3"
              />
            </>
          )}
          <div style={styles.itemEditModalActions}>
            <button
              style={{ ...styles.itemEditModalButton, ...styles.itemEditModalButtonCancel }}
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              style={{ ...styles.itemEditModalButton, ...styles.itemEditModalButtonSave }}
              onClick={handleSaveEditedItem}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.medicalSection}>
      <h3 style={styles.sectionTitle}>{title}</h3>

      {sectionType === 'Tratamiento' ? (
        // Interfaz para Tratamientos (entrada guiada)
        <>
          <div style={styles.structuredInputContainer}>
            <input
              type="text"
              style={styles.textArea}
              value={medicamento}
              onChange={(e) => setMedicamento(e.target.value)}
              placeholder="Medicamento"
            />
            <button
              onClick={isMedListening ? stopMed : startMed}
              style={isMedListening ? styles.micButtonActive : styles.micButton}
            >
              {isMedListening ? '🛑' : '🎤'}
            </button>
          </div>
          {medError && <p style={styles.errorText}>{medError}</p>}

          <div style={styles.structuredInputContainer}>
            <input
              type="text"
              style={styles.textArea}
              value={dosis}
              onChange={(e) => setDosis(e.target.value)}
              placeholder="Dosis (ej. 400 mg)"
            />
            <button
              onClick={isDosisListening ? stopDosis : startDosis}
              style={isDosisListening ? styles.micButtonActive : styles.micButton}
            >
              {isDosisListening ? '🛑' : '🎤'}
            </button>
          </div>
          {dosisError && <p style={styles.errorText}>{dosisError}</p>}

          <div style={styles.structuredInputContainer}>
            <input
              type="text"
              style={styles.textArea}
              value={frecuencia}
              onChange={(e) => setFrecuencia(e.target.value)}
              placeholder="Frecuencia (ej. cada 8 horas)"
            />
            <button
              onClick={isFrecListening ? stopFrec : startFrec}
              style={isFrecListening ? styles.micButtonActive : styles.micButton}
            >
              {isFrecListening ? '🛑' : '🎤'}
            </button>
          </div>
          {frecError && <p style={styles.errorText}>{frecError}</p>}

          <div style={styles.structuredInputContainer}>
            <input
              type="text"
              style={styles.textArea}
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              placeholder="Días (ej. por 5 días)"
            />
            <button
              onClick={isDiasListening ? stopDias : startDias}
              style={isDiasListening ? styles.micButtonActive : styles.micButton}
            >
              {isDiasListening ? '🛑' : '🎤'}
            </button>
          </div>
          {diasError && <p style={styles.errorText}>{diasError}</p>}

          <button
            style={styles.processButton} // Reutilizamos el estilo de botón
            onClick={handleAddItem}
            disabled={!medicamento.trim() || isMedListening || isDosisListening || isFrecListening || isDiasListening}
          >
            Agregar Medicamento
          </button>
        </>
      ) : (
        // Interfaz para Diagnóstico, Triaje (texto libre con botón de añadir)
        // Nota: Diagnostico ahora usa AutoCompleteInput en MedicalRecordForm.js,
        // por lo que esta rama se usará principalmente para Triaje si es una lista de texto libre.
        <>
          <div style={styles.inputContainer}>
            <textarea
              style={styles.textArea}
              value={currentDictation}
              onChange={(e) => setCurrentDictation(e.target.value)}
              placeholder={`Dicta o escribe un ítem de ${title}...`}
              rows="2"
            />
            <button
              onClick={isGeneralListening ? stopGeneral : startGeneral}
              style={isGeneralListening ? styles.micButtonActive : styles.micButton}
            >
              {isGeneralListening ? '🛑' : '🎤'}
            </button>
          </div>
          {generalError && <p style={styles.errorText}>{generalError}</p>}
          <div style={styles.structuredInputContainer}>
            <button
              style={styles.processButton}
              onClick={handleAddItem}
              disabled={!currentDictation.trim() || isGeneralListening}
            >
              Agregar Ítem
            </button>
          </div>
        </>
      )}

      {/* Lista de ítems ya añadidos */}
      {content.length > 0 && (
        <ul style={styles.structuredList}>
          {content.map((item, index) => (
            <li key={item.id || index} style={styles.structuredListItem}>
              {sectionType === 'Tratamiento' ? (
                <>
                  <span style={styles.listItemText}>
                    <strong>{item.medicamento}</strong>
                    {item.dosis && `, ${item.dosis}`}
                    {item.frecuencia && `, ${item.frecuencia}`}
                    {item.dias && `, ${item.dias}`}
                  </span>
                </>
              ) : (
                <span style={styles.listItemText}>{item.descripcion}</span>
              )}
              <div style={styles.listItemActions}>
                <button
                  style={styles.listItemButton}
                  onClick={() => handleEditItem(item)}
                >
                  Editar
                </button>
                <button
                  style={{ ...styles.listItemButton, ...styles.listItemButtonDelete }}
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {renderItemEditModal()}
    </div>
  );
};

export default StructuredListMedicalSection;

