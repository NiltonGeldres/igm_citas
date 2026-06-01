// src/components/AtencionMedica/AtencionMedicaMedicamento/AtencionMedicaMedicamentoDetalleModal.js
import React, { useState, useEffect } from 'react';
import Styles from '../../../Styles'; // La ruta a Styles es correcta

/**
 * Modal para introducir los detalles (dosis, frecuencia, cantidad, vía) de un medicamento.
 * Se reutilizan estilos de modal y de input definidos en Styles.js.
 */
function AtencionMedicaMedicamentoDetalleModal({ medication, onClose, onSave, showMessage }) {
  // Estados para los campos del formulario dentro del modal
  const [dosis, setDosis] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [via, setVia] = useState(''); // Estado para la Vía


  // Sincroniza los estados locales del modal con la prop 'medication'
  // Esto permite que el modal se use tanto para añadir como para editar
  useEffect(() => {
    if (medication) {
      setDosis(medication.dosis !== undefined ? String(medication.dosis) : '');
      setFrecuencia(medication.frecuencia !== undefined ? String(medication.frecuencia) : '');
      setCantidad(medication.cantidad !== undefined ? String(medication.cantidad) : '');
      setVia(medication.via !== undefined ? String(medication.via) : ''); // Sincroniza la Vía
    }
  }, [medication]);

  /**
   * Maneja el guardado de los detalles del medicamento.
   * Realiza validaciones básicas antes de llamar a onSave.
   */
  const handleSave = () => {
    // Validaciones básicas
    if (!dosis || !frecuencia || !cantidad || !via) { // Añadida validación para 'via'
      showMessage('Por favor, completa todos los campos: Dosis, Frecuencia, Cantidad y Vía.');
      return;
    }

    const parsedDosis = parseFloat(dosis);
    const parsedFrecuencia = parseInt(frecuencia);
    const parsedPeriodo = parseInt(periodo);
    const parsedCantidad = parseInt(cantidad);

    if (isNaN(parsedDosis) || parsedDosis <= 0) {
      showMessage('La dosis debe ser un número positivo (ej. 500.0).');
      return;
    }
    if (isNaN(parsedFrecuencia) || parsedFrecuencia <= 0) {
      showMessage('La frecuencia debe ser un número entero positivo (ej. 2).');
      return;
    }
    if (isNaN(parsedPeriodo) || parsedPeriodo <= 0) {
      showMessage('La frecuencia debe ser un número entero positivo (ej. 2).');
      return;
    }
    if (isNaN(parsedCantidad) || parsedCantidad <= 0) {
      showMessage('La cantidad debe ser un número entero positivo (ej. 30).');
      return;
    }

    // Llama a la función onSave del componente padre con los datos actualizados
    onSave({
      ...medication, // Mantiene el ID y la descripción del medicamento
      dosis: parsedDosis.toFixed(1), // Asegura un decimal
      frecuencia: parsedFrecuencia,
      periodo: parsedPeriodo,
      cantidad: parsedCantidad,
      via: via, // INCLUIDO: el nuevo campo Vía
    });
    // No cerramos el modal aquí, el componente padre lo hará después de guardar
  };

  // No renderiza el modal si no hay un medicamento para editar/añadir
  if (!medication) return null;

  return (
    <div style={Styles.modalOverlay}>
      <div style={Styles.itemEditModalContent}>
        <h3 style={Styles.itemEditModalTitle}>Detalles del Medicamento: {medication.descripcion}</h3>

        <label style={Styles.itemEditModalLabel}>
          Dosis:
          <input
            type="number"
            step="0.1" // Permite un decimal
            value={dosis}
            onChange={(e) => setDosis(e.target.value)}
            style={Styles.itemEditModalInput}
            placeholder="Ej: 500.0"
          />
        </label>

        <label style={Styles.itemEditModalLabel}>
          Frecuencia (veces al día):
          <input
            type="number"
            step="1"
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value)}
            style={Styles.itemEditModalInput}
            placeholder="Ej: 2"
          />
        </label>

        <label style={Styles.itemEditModalLabel}>
          Periodo (Total de Dias):
          <input
            type="number"
            step="1"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            style={Styles.itemEditModalInput}
            placeholder="Ej: 2"
          />
        </label>

        <label style={Styles.itemEditModalLabel}>
          Cantidad:
          <input
            type="number"
            step="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            style={Styles.itemEditModalInput}
            placeholder="Ej: 30"
          />
        </label>

        {/* NUEVO CAMPO: Vía */}
        <label style={Styles.itemEditModalLabel}>
          Vía:
          <input
            type="text"
            value={via}
            onChange={(e) => setVia(e.target.value)}
            style={Styles.itemEditModalInput}
            placeholder="Ej: Oral, Intravenosa"
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

export default AtencionMedicaMedicamentoDetalleModal;
