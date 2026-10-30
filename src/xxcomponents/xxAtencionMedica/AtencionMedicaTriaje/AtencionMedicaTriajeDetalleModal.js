// src/components/Triaje/AtencionMedicaDetalleTriajeModal.js
import React, { useState, useEffect } from 'react';
import Styles from '../../../Styles'; // Ruta relativa a Styles

/**
 * Modal para añadir o editar los detalles de una medición de triaje.
 * Permite al usuario especificar el valor y la unidad para una medida dada.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Object} props.triajeItem - El objeto de triaje a editar, o null para uno nuevo.
 * @param {function(): void} props.onClose - Función para cerrar el modal.
 * @param {function(Object): void} props.onSave - Función para guardar los detalles del triaje.
 * @param {function(string): void} props.showMessage - Función para mostrar mensajes en el modal principal de la aplicación.
 */
function AtencionMedicaDetalleTriajeModal({ triajeItem, onClose, onSave, showMessage }) {
  // Estados locales para los campos del formulario dentro del modal
  const [medida, setMedida] = useState('');
  const [valor, setValor] = useState('');
  const [unidad, setUnidad] = useState('');

  // Efecto para cargar los datos del triaje cuando el modal se abre para edición
  useEffect(() => {
    if (triajeItem) {
      setMedida(triajeItem.medida || '');
      setValor(triajeItem.valor !== undefined ? String(triajeItem.valor) : '');
      setUnidad(triajeItem.unidad || '');
    } else {
      // Si es una nueva medición, asegurar que los campos estén vacíos
      setMedida('');
      setValor('');
      setUnidad('');
    }
  }, [triajeItem]);

  /**
   * Maneja el guardado de los detalles del triaje.
   * Realiza validaciones básicas antes de llamar a onSave.
   */
  const handleSave = () => {
    if (!valor.trim()) {
      showMessage('Por favor, ingresa un valor para la medida.');
      return;
    }
    if (!unidad.trim()) {
      showMessage('Por favor, selecciona una unidad para la medida.');
      return;
    }

    // Crear el objeto de triaje actualizado
    const updatedTriaje = {
      ...triajeItem, // Mantener el ID y otras propiedades existentes
      medida: medida.trim(),
      valor: valor.trim(),
      unidad: unidad.trim(),
    };

    onSave(updatedTriaje); // Llamar a la función onSave del componente padre
    onClose(); // Cerrar el modal después de guardar
    showMessage('Medida de triaje guardada.');
  };

  // No renderiza el modal si no hay un triajeItem para editar/añadir
  if (!triajeItem) return null;

  // Opciones de unidades comunes para el triaje
  const unitOptions = {
    'Temperatura': ['°C', '°F'],
    'Presión Arterial': ['mmHg'],
    'Frecuencia Cardíaca': ['lpm'],
    'Frecuencia Respiratoria': ['rpm'],
    'Saturación de Oxígeno': ['%'],
    'Peso': ['kg', 'lb'],
    'Talla': ['cm', 'm', 'in'],
    'IMC': ['kg/m²'],
    // Añade más si es necesario
  };

  // Determinar las unidades disponibles basadas en la medida seleccionada
  const availableUnits = unitOptions[medida] || [];

  return (
    <div style={Styles.modalOverlay}>
      <div style={Styles.itemEditModalContent}>
        <h3 style={Styles.itemEditModalTitle}>Detalles de {medida}</h3>

        <label style={Styles.itemEditModalLabel}>
          Medida:
          <input
            type="text"
            value={medida}
            style={Styles.itemEditModalInput}
            readOnly // La medida es solo de lectura, viene del autocompletado
          />
        </label>

        <label style={Styles.itemEditModalLabel}>
          Valor:
          <input
            type="text" // Usar text para permitir flexibilidad (ej. "120/80")
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={Styles.itemEditModalInput}
            placeholder="Ej: 37.5, 120/80, 70"
          />
        </label>

        <label style={Styles.itemEditModalLabel}>
          Unidad:
          <select
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            style={Styles.itemEditModalInput}
          >
            <option value="">Selecciona una unidad</option>
            {availableUnits.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
            {/* Si no hay unidades específicas, o si se necesita una opción "Otros" */}
            {availableUnits.length === 0 && <option value="N/A">N/A</option>}
          </select>
        </label>

        <div style={Styles.itemEditModalActions}>
          <button style={Styles.itemEditModalButtonCancel} onClick={onClose}>Cancelar</button>
          <button style={Styles.itemEditModalButtonSave} onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default AtencionMedicaDetalleTriajeModal;
