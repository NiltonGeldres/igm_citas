// src/components/Medicacion/AtencionMedicaMedicamentoDetalleModal.js
import React, { useState, useEffect } from 'react';

function AtencionMedicaMedicamentoDetalleModal({ medication, onClose, onSave, showMessage }) {
  const [dosis, setDosis] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [via, setVia] = useState('');

  useEffect(() => {
    if (medication) {
      setDosis(medication.dosis !== undefined ? String(medication.dosis) : '');
      setFrecuencia(medication.frecuencia !== undefined ? String(medication.frecuencia) : '');
      setPeriodo(medication.periodo !== undefined ? String(medication.periodo) : '');
      setCantidad(medication.cantidad !== undefined ? String(medication.cantidad) : '');
      setVia(medication.via !== undefined ? String(medication.via) : '');
    }
  }, [medication]);

  const handleSave = () => {
    if (!dosis || !frecuencia || !periodo || !cantidad || !via) {
      if (showMessage) showMessage('Por favor, completa todos los campos requeridos para la receta.');
      return;
    }

    const parsedDosis = parseFloat(dosis);
    const parsedFrecuencia = parseInt(frecuencia, 10);
    const parsedPeriodo = parseInt(periodo, 10);
    const parsedCantidad = parseInt(cantidad, 10);

    if (isNaN(parsedDosis) || parsedDosis <= 0) {
      if (showMessage) showMessage('La dosis debe ser un número válido.');
      return;
    }
    if (isNaN(parsedFrecuencia) || parsedFrecuencia <= 0) {
      if (showMessage) showMessage('La frecuencia debe ser mayor a 0 veces al día.');
      return;
    }
    if (isNaN(parsedPeriodo) || parsedPeriodo <= 0) {
      if (showMessage) showMessage('La duración debe ser mayor a 0 días.');
      return;
    }
    if (isNaN(parsedCantidad) || parsedCantidad <= 0) {
      if (showMessage) showMessage('La cantidad total debe ser un número entero.');
      return;
    }

    onSave({
      ...medication,
      dosis: parsedDosis.toString(),
      frecuencia: parsedFrecuencia,
      periodo: parsedPeriodo,
      cantidad: parsedCantidad,
      via: via.trim(),
    });
  };

  if (!medication) return null;

  // ESTILOS EN LÍNEA ADAPTADOS DE FORMA ESTRICTA A LA ESTÉTICA DE "MICLINICA"
  const modalStyles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)', // Sombra esbelta slate-900
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
      backdropFilter: 'blur(2px)'
    },
    content: {
      backgroundColor: '#ffffff', width: '90%', maxWidth: '400px',
      borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    },
    header: {
      backgroundColor: '#0066ff', padding: '14px 16px', // Azul MiClinica
      color: '#ffffff', fontSize: '15px', fontWeight: '600'
    },
    body: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
    label: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569', fontWeight: '600' },
    input: {
      height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1',
      fontSize: '13px', color: '#1e293b', outline: 'none', backgroundColor: '#f8fafc'
    },
    actions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '12px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' },
    btnCancel: { padding: '8px 14px', borderRadius: '20px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#64748b', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
    btnSave: { padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#0066ff', color: '#ffffff', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        {/* Cabecera Azul Homologada */}
        <div style={modalStyles.header}>
          Configurar Receta: {medication.descripcion}
        </div>

        {/* Cuerpo con Inputs estilizados */}
        <div style={modalStyles.body}>
          <label style={modalStyles.label}>
            Vía de Administración
            <input
              type="text"
              value={via}
              onChange={(e) => setVia(e.target.value)}
              style={modalStyles.input}
              placeholder="Ej: Oral, Sublingual, Intravenosa"
            />
          </label>

          <div style={{ display: 'flex', gap: '10px' }}>
            <label style={{ ...modalStyles.label, flex: 1 }}>
              Dosis
              <input
                type="text"
                value={dosis}
                onChange={(e) => setDosis(e.target.value)}
                style={modalStyles.input}
                placeholder="Ej: 1"
              />
            </label>

            <label style={{ ...modalStyles.label, flex: 1 }}>
              Veces al día (Frecuencia)
              <input
                type="number"
                value={frecuencia}
                onChange={(e) => setFrecuencia(e.target.value)}
                style={modalStyles.input}
                placeholder="Ej: 2"
              />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <label style={{ ...modalStyles.label, flex: 1 }}>
              Duración (Días)
              <input
                type="number"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                style={modalStyles.input}
                placeholder="Ej: 7"
              />
            </label>

            <label style={{ ...modalStyles.label, flex: 1 }}>
              Total a Dispensar
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                style={modalStyles.input}
                placeholder="Ej: 14"
              />
            </label>
          </div>
        </div>

        {/* Botones Redondeados */}
        <div style={modalStyles.actions}>
          <button type="button" style={modalStyles.btnCancel} onClick={onClose}>Cancelar</button>
          <button type="button" style={modalStyles.btnSave} onClick={handleSave}>Guardar Receta</button>
        </div>
      </div>
    </div>
  );
}

export default AtencionMedicaMedicamentoDetalleModal;