// src/components/AtencionExamen/DetalleExamenModal.js
import React, { useState, useEffect } from 'react';
import Styles from '../../../Styles'; // La ruta a Styles es correcta
//import AutoCompleteInput from '../common/AutoCompleteInput'; // Importa AutoCompleteInput
import AutoCompleteInput from '../common/AutoCompleteInput'; // Ruta relativa a common


/**
 * Modal para introducir los detalles (examen, cantidad, diagnóstico) de un examen.
 * Se reutilizan estilos de modal y de input definidos en Styles.js.
 * @param {Object} props - Las propiedades del componente.
 * @param {Object} props.examenItem - El objeto examen a editar o el esqueleto para uno nuevo.
 * @param {function(): void} props.onClose - Función para cerrar el modal.
 * @param {function(Object): void} props.onSave - Función para guardar los detalles del examen.
 * @param {function(string): void} props.showMessage - Función para mostrar mensajes en el modal principal.
 * @param {Array<Object>} props.diagnosticosDisponibles - Lista de diagnósticos disponibles para el autocompletado.
 */
function AtencionMedicaDetalleExamenModal({ examenItem, onClose, onSave, showMessage, diagnosticosDisponibles }) {
  // Estados para los campos del formulario dentro del modal
  const [examenTexto, setExamenTexto] = useState('');
  const [cantidad, setCantidad] = useState(1); // Valor por defecto 1
  const [diagnosticoAsociado, setDiagnosticoAsociado] = useState('');

  // Sincroniza los estados locales del modal con la prop 'examenItem'
  // Esto permite que el modal se use tanto para añadir como para editar
  useEffect(() => {
    if (examenItem) {
      // Inicializa examenTexto con el 'label' si viene del autocompletado, o con 'examen' si ya es un item guardado
      setExamenTexto(examenItem.label || examenItem.examen || '');
      setCantidad(examenItem.cantidad !== undefined ? parseInt(examenItem.cantidad) : 1);
      setDiagnosticoAsociado(examenItem.diagnostico !== undefined ? String(examenItem.diagnostico) : '');
    }
  }, [examenItem]);

  /**
   * Maneja el guardado de los detalles del examen.
   * Realiza validaciones básicas antes de llamar a onSave.
   */
  const handleSave = () => {
    // Validaciones: examenTexto y diagnosticoAsociado son obligatorios
    if (!examenTexto) {
      showMessage('Por favor, ingresa el nombre del Examen.');
      return;
    }
    if (!diagnosticoAsociado) {
      showMessage('Por favor, selecciona un Diagnóstico Asociado.');
      return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
      showMessage('La cantidad debe ser un número entero positivo.');
      return;
    }

    // Llama a la función onSave del componente padre con los datos actualizados
    onSave({
      ...examenItem, // Mantiene el ID y cualquier otra propiedad original
      examen: examenTexto, // El texto del examen ingresado/seleccionado
      cantidad: cantidad,
      diagnostico: diagnosticoAsociado,
    });
    // No cerramos el modal aquí, el componente padre lo hará después de guardar
  };

  // Función para simular la obtención de sugerencias de diagnósticos para el autocompletado
  const fetchDiagnosticoSuggestions = async (query) => {
    console.log("Obteniendo sugerencias de diagnóstico para examen:", query);
    // Filtra los diagnósticos disponibles pasados como prop
    const filtered = diagnosticosDisponibles.filter(diag =>
      (diag.label || diag.diagnostico).toLowerCase().includes(query.toLowerCase())
    ).map(diag => ({
      id: diag.id,
      label: diag.label || diag.diagnostico // Asegura que siempre haya un 'label'
    }));
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(filtered);
      }, 100); // Pequeño retraso para simular carga
    });
  };

  // Maneja la selección de un diagnóstico del autocompletado
  const handleSelectDiagnostico = (selectedItem) => {
    setDiagnosticoAsociado(selectedItem.label);
  };

  // No renderiza el modal si no hay un examen para editar/añadir
  if (!examenItem) return null;

  return (
    <div style={Styles.modalOverlay}>
      <div style={Styles.itemEditModalContent}>
        <h3 style={Styles.itemEditModalTitle}>Detalles del Examen: {examenItem.label || examenItem.examen}</h3>

        {/* El campo de examen ahora es de solo lectura si viene de una selección de autocompletado,
            o editable si es un nuevo examen que se está creando desde cero. */}
        <label style={Styles.itemEditModalLabel}>
          Examen:
          <input
            type="text"
            value={examenTexto}
            onChange={(e) => setExamenTexto(e.target.value)}
            style={Styles.itemEditModalInput}
            placeholder="Ej: Análisis de sangre"
            readOnly={!!examenItem.label && !examenItem.examen} // Solo lectura si viene de autocomplete y no ha sido guardado
          />
        </label>

        <label style={Styles.itemEditModalLabel}>
          Cantidad:
          <input
            type="number"
            step="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 0)} // Asegura que sea un número
            style={Styles.itemEditModalInput}
            placeholder="Ej: 1"
          />
        </label>

        <AutoCompleteInput
          label="Diagnóstico Asociado:"
          placeholder="Busca un diagnóstico..."
          initialValue={diagnosticoAsociado} // Valor inicial para edición
          onSelectSuggestion={handleSelectDiagnostico}
          fetchSuggestions={fetchDiagnosticoSuggestions}
          onModalMessage={showMessage}
        />

        <div style={Styles.itemEditModalActions}>
          <button style={Styles.itemEditModalButtonCancel} onClick={onClose}>Cancelar</button>
          <button style={Styles.itemEditModalButtonSave} onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default AtencionMedicaDetalleExamenModal;
