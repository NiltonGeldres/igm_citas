import React, { useState, useEffect } from 'react';

function AtencionMedicaDetalleTriajeModal({ triajeItem, onClose, onSave, showMessage }) {
  const [medida, setMedida] = useState('');
  const [valor, setValor] = useState('');
  const [unidad, setUnidad] = useState('');

  useEffect(() => {
    if (triajeItem) {
      setMedida(triajeItem.medida || '');
      setValor(triajeItem.valor !== undefined ? String(triajeItem.valor) : '');
      setUnidad(triajeItem.unidad || '');
    } else {
      setMedida('');
      setValor('');
      setUnidad('');
    }
  }, [triajeItem]);

  const handleSave = () => {
    if (!valor.trim()) {
      showMessage('Por favor, ingresa un valor para la medida.');
      return;
    }
    if (!unidad.trim()) {
      showMessage('Por favor, selecciona una unidad para la medida.');
      return;
    }

    const updatedTriaje = {
      ...triajeItem,
      medida: medida.trim(),
      valor: valor.trim(),
      unidad: unidad.trim(),
    };

    onSave(updatedTriaje);
    onClose();
    showMessage('Medida de triaje guardada.');
  };

  if (!triajeItem) return null;

  const unitOptions = {
    'Temperatura': ['°C', '°F'],
    'Presión Arterial': ['mmHg'],
    'Frecuencia Cardíaca': ['lpm'],
    'Frecuencia Respiratoria': ['rpm'],
    'Saturación de Oxígeno': ['%'],
    'Peso': ['kg', 'lb'],
    'Talla': ['cm', 'm', 'in'],
    'IMC': ['kg/m²'],
    'Glucosa en Sangre': ['mg/dL'],
  };

  const availableUnits = unitOptions[medida] || [];

  return (
    <div className="modal-overlay-hce">
      <div className="modal-content-hce">
        <h3 className="modal-title-hce">Detalles de {medida}</h3>

        <div className="modal-form-group-hce">
          <label className="modal-label-hce">Medida:</label>
          <input
            type="text"
            value={medida}
            className="modal-input-hce"
            readOnly
          />
        </div>

        <div className="modal-form-group-hce">
          <label className="modal-label-hce">Valor:</label>
          <input
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="modal-input-hce"
            placeholder="Ej: 37.5, 120/80, 70"
            autoFocus
          />
        </div>

        <div className="modal-form-group-hce">
          <label className="modal-label-hce">Unidad:</label>
          <select
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            className="modal-select-hce"
          >
            <option value="">Selecciona una unidad</option>
            {availableUnits.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
            {availableUnits.length === 0 && <option value="N/A">N/A</option>}
          </select>
        </div>

        <div className="modal-actions-hce">
          <button className="modal-btn-cancel-hce" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-btn-save-hce" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AtencionMedicaDetalleTriajeModal;