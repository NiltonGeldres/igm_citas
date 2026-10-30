// src/components/AtencionDiagnostico/AtencionMedicaDetalleDiagnosticoModal.js
import React, { useState, useEffect } from 'react';
import Styles from '../../../Styles'; // La ruta a Styles es correcta

/**
 * Modal para introducir los detalles (diagnóstico, clasificación, código CIE) de un diagnóstico.
 * Se reutilizan estilos de modal y de input definidos en Styles.js.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.diagnosticoItem - El objeto de diagnóstico a editar, o null para uno nuevo.
 * @param {function(): void} props.onClose - Función para cerrar el modal.
 * @param {function(object): void} props.onSave - Función para guardar los detalles del diagnóstico.
 * @param {function(string): void} props.showMessage - Función para mostrar mensajes en un modal.
 */
function AtencionMedicaDetalleDiagnosticoModal({ diagnosticoItem, onClose, onSave, showMessage }) {
  // Estados para los campos del formulario dentro del modal
  const [diagnosticoTexto, setDiagnosticoTexto] = useState('');
  const [clasificacion, setClasificacion] = useState('');
  const [codigoCIE, setCodigoCIE] = useState(''); // Estado para Código CIE

  // Sincroniza los estados locales del modal con la prop 'diagnosticoItem'
  // Esto permite que el modal se use tanto para añadir como para editar
  useEffect(() => {
    if (diagnosticoItem) {
      setDiagnosticoTexto(diagnosticoItem.diagnostico !== undefined ? String(diagnosticoItem.diagnostico) : '');
      setClasificacion(diagnosticoItem.clasificacion !== undefined ? String(diagnosticoItem.clasificacion) : '');
      setCodigoCIE(diagnosticoItem.codigoCIE !== undefined ? String(diagnosticoItem.codigoCIE) : ''); // Cargar el nuevo campo
    } else {
      // Si es un nuevo diagnóstico, asegurar que los campos estén vacíos
      setDiagnosticoTexto('');
      setClasificacion('');
      setCodigoCIE('');
    }
  }, [diagnosticoItem]);

  /**
   * Maneja el guardado de los detalles del diagnóstico.
   * Realiza validaciones básicas antes de llamar a onSave.
   */
  const handleSave = () => {
    // Validaciones básicas
    if (!diagnosticoTexto.trim()) {
      showMessage('Por favor, completa el campo "Diagnóstico".');
      return;
    }
    if (!clasificacion.trim()) {
      showMessage('Por favor, selecciona una "Clasificación".');
      return;
    }
    // La validación de 6 caracteres para codigoCIE ha sido eliminada.
    // Ahora se permite cualquier longitud para el código CIE.

    // Llama a la función onSave del componente padre con los datos actualizados
    onSave({
      ...diagnosticoItem, // Mantiene el ID y la descripción original del autocompletado
      diagnostico: diagnosticoTexto.trim(), // El texto del diagnóstico ingresado
      clasificacion: clasificacion.trim(),
      codigoCIE: codigoCIE.trim().toUpperCase(), // Guardar el código CIE en mayúsculas
    });
    onClose(); // Cerrar el modal después de guardar
  };

  // No renderiza el modal si no hay un diagnóstico para editar/añadir
  if (!diagnosticoItem) return null;

  return (
    <div style={Styles.modalOverlay}>
      <div style={Styles.itemEditModalContent}>
        <h3 style={Styles.itemEditModalTitle}>Detalles del Diagnóstico: {diagnosticoItem.label || diagnosticoItem.descripcion}</h3>

        <label style={Styles.itemEditModalLabel}>
          Diagnóstico:
          <input
            type="text"
            value={diagnosticoTexto}
            onChange={(e) => setDiagnosticoTexto(e.target.value)}
            style={Styles.itemEditModalInput}
            placeholder="Ej: Neumonía Bacteriana"
          />
        </label>

        <label style={Styles.itemEditModalLabel}>
          Clasificación:
          <select
            value={clasificacion}
            onChange={(e) => setClasificacion(e.target.value)}
            style={Styles.itemEditModalInput}
          >
            <option value="">Selecciona una clasificación</option>
            <option value="primario">Primario</option>
            <option value="secundario">Secundario</option>
          </select>
        </label>

        <label style={Styles.itemEditModalLabel}>
          Código CIE:
          <input
            type="text"
            value={codigoCIE}
            onChange={(e) => setCodigoCIE(e.target.value)}
            // Eliminado: maxLength={6}
            style={Styles.itemEditModalInput}
            placeholder="Ej: A00.00" // Ejemplo de formato CIE
          />
        </label>

        <div style={Styles.itemEditModalActions}>
          <button style={Styles.itemEditModalButtonCancel} onClick={onClose}>Cancelar</button>
          <button style={Styles.itemEditModalButtonSave} onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default AtencionMedicaDetalleDiagnosticoModal;
