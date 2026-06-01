// src/components/AtencionDiagnostico/AtencionMedicaDiagnostico.js
import React, { useState } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; // Ruta relativa a common
import DetalleDiagnosticoModal from './AtencionMedicaDetalleDiagnosticoModal'; // Ruta relativa al modal en la misma carpeta
import Styles from '../../../Styles'; // Ruta relativa a Styles
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react'; // Importar iconos de Lucide React

/**
 * Componente independiente para gestionar la sección de Diagnóstico.
 * Incluye la búsqueda de diagnósticos con autocompletado,
 * la adición de detalles (diagnóstico, clasificación) a través de un modal,
 * y la visualización/edición/eliminación de los diagnósticos en una lista.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Array<Object>} props.content - La lista actual de diagnósticos (PanelDiagnostico).
 * @param {function(Array<Object>): void} props.onContentChange - Función para actualizar la lista de diagnósticos en el padre.
 * @param {function(string): void} props.onModalMessage - Función para mostrar mensajes en el modal principal de la aplicación.
 */
function AtencionMedicaDiagnostico({ content, onContentChange, onModalMessage }) {
  // Estado para controlar la visibilidad y el diagnóstico a editar en el modal de detalles
  const [mostrarDetalleDiagnosticoModal, setMostrarDetalleDiagnosticoModal] = useState(false);
  const [diagnosticoActualParaEditar, setDiagnosticoActualParaEditar] = useState(null);

  // --- Función para simular la obtención de sugerencias de diagnósticos ---
  // En un proyecto real, esta función haría una llamada a una API
  const fetchDiagnosisSuggestions = async (query) => {
    console.log("Obteniendo sugerencias de diagnóstico para:", query);
    const mockDiagnoses = [
      { id: 'diag1', label: 'Diabetes Mellitus Tipo 2', codigoCIE: 'E11.9' },
      { id: 'diag2', label: 'Hipertensión Arterial', codigoCIE: 'I10.X' },
      { id: 'diag3', label: 'Gripe Común', codigoCIE: 'J11.1' },
      { id: 'diag4', label: 'Bronquitis Aguda', codigoCIE: 'J20.9' },
      { id: 'diag5', label: 'Migraña Crónica', codigoCIE: 'G43.9' },
      { id: 'diag6', label: 'Dermatitis Atópica', codigoCIE: 'L20.9' },
      { id: 'diag7', label: 'Neumonía Bacteriana', codigoCIE: 'J18.9' },
      { id: 'diag8', label: 'Anemia Ferropénica', codigoCIE: 'D50.9' },
      { id: 'diag9', label: 'Gastritis Crónica', codigoCIE: 'K29.5' },
      { id: 'diag10', label: 'Asma', codigoCIE: 'J45.9' },
      { id: 'diag11', label: 'Hiperlipidemia', codigoCIE: 'E78.5' },
    ];
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = mockDiagnoses.filter(diag =>
          diag.label.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 200); // Simula un retraso de red
    });
  };

  /**
   * Maneja la selección de un diagnóstico del autocompletado.
   * Abre el modal de detalles para que el usuario ingrese el diagnóstico y la clasificación.
   * Si el diagnóstico ya existe, lo carga para edición.
   * @param {Object} diagnosisItem - El diagnóstico seleccionado del autocompletado (solo tiene id y label).
   */
  const handleAddDiagnosis = (diagnosisItem) => {
    // Buscar si el diagnóstico ya existe en la lista por su 'label' original del autocompletado
    const existingDiagnosis = content.find(item => item.label === diagnosisItem.label);

    if (existingDiagnosis) {
      onModalMessage(`El diagnóstico "${diagnosisItem.label}" ya ha sido agregado. Abriendo para editar.`);
      setDiagnosticoActualParaEditar(existingDiagnosis);
    } else {
      // Si es un diagnóstico nuevo, inicializa con el label y un nuevo ID, y campos vacíos para el modal
      setDiagnosticoActualParaEditar({
        id: uuidv4(), // Genera un ID único para el nuevo diagnóstico
        label: diagnosisItem.label, // Guarda el label original del autocompletado
        diagnostico: diagnosisItem.label, // Inicializa el campo de texto del modal con el label
        clasificacion: '',
        codigoCIE: diagnosisItem.codigoCIE || '', // Inicializa el nuevo campo codigoCIE
      });
    }
    setMostrarDetalleDiagnosticoModal(true); // Abre el modal de detalles
  };

  /**
   * Maneja el guardado de los detalles del diagnóstico desde el modal.
   * Actualiza la lista de diagnósticos en el estado del componente padre.
   * @param {Object} updatedDiagnosis - El objeto diagnóstico con los detalles actualizados.
   */
  const handleSaveDiagnosisDetails = (updatedDiagnosis) => {
    const existingIndex = content.findIndex(item => item.id === updatedDiagnosis.id);
    let updatedList;
    if (existingIndex > -1) {
      // Si el diagnóstico ya existe (edición), lo actualiza en la lista
      updatedList = [...content];
      updatedList[existingIndex] = updatedDiagnosis;
    } else {
      // Si es un diagnóstico nuevo, lo añade a la lista
      updatedList = [...content, updatedDiagnosis];
    }
    onContentChange(updatedList); // Notifica al componente padre el cambio
    setMostrarDetalleDiagnosticoModal(false); // Cierra el modal
    setDiagnosticoActualParaEditar(null); // Limpia el diagnóstico en edición
  };

  /**
   * Elimina un diagnóstico de la lista.
   * @param {string} diagnosisId - El ID del diagnóstico a eliminar.
   */
  const handleDeleteDiagnosis = (diagnosisId) => {
    const updatedList = content.filter(diag => diag.id !== diagnosisId);
    onContentChange(updatedList); // Notifica al componente padre el cambio
    onModalMessage('Diagnóstico eliminado.');
  };

  return (
    <div style={Styles.medicalSection}>
      <h3 style={Styles.sectionTitle}>Panel Diagnóstico</h3>
      <AutoCompleteInput
        placeholder="Dicta o escribe un diagnóstico..."
        onSelectSuggestion={handleAddDiagnosis}
        fetchSuggestions={fetchDiagnosisSuggestions}
        onModalMessage={onModalMessage} // Pasa la función de mensajes al autocompletado
      />

      {content.length > 0 && (
        <ul style={Styles.structuredList}>
          {content.map((item) => (
            <li key={item.id} style={Styles.bubbleListItemNoAvatar}>
              {/* Contenido principal del diagnóstico */}
              <div style={Styles.bubbleContentNoAvatar}>
                <div style={Styles.bubbleTopRow}>
                  <span style={Styles.bubbleName}>
                    {item.label || item.diagnostico}
                    {item.codigoCIE && ` (${item.codigoCIE})`} {/* Mostrar Código CIE */}
                  </span>
                  <div style={Styles.bubbleActionsTopRight}> {/* Contenedor para los iconos de acción */}
                    <button
                      style={Styles.bubbleActionButton}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el botón active el li
                        setDiagnosticoActualParaEditar(item);
                        setMostrarDetalleDiagnosticoModal(true);
                      }}
                    >
                      <Pencil size={18} style={Styles.bubbleActionButtonIcon} />
                    </button>
                    <button
                      style={{ ...Styles.bubbleActionButton, ...Styles.bubbleActionButtonDelete }}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic en el botón active el li
                        handleDeleteDiagnosis(item.id);
                      }}
                    >
                      <Trash2 size={18} style={Styles.bubbleActionButtonIcon} />
                    </button>
                  </div>
                </div>
                <p style={Styles.bubbleDetails}>
                  Clasificación: {item.clasificacion || 'N/A'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Renderiza el modal de detalles de diagnóstico si está visible */}
      {mostrarDetalleDiagnosticoModal && (
        <DetalleDiagnosticoModal
          diagnosticoItem={diagnosticoActualParaEditar}
          onClose={() => {
            setMostrarDetalleDiagnosticoModal(false);
            setDiagnosticoActualParaEditar(null); // Limpiar el estado al cerrar
          }}
          onSave={handleSaveDiagnosisDetails}
          showMessage={onModalMessage} // Pasa la función de mensajes al modal
        />
      )}
    </div>
  );
}

export default AtencionMedicaDiagnostico;
