import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext'; 

function AtencionMedicaMedicamentoDetalleModal({ medication, onClose, onSave, showMessage }) {
  const { catalogoGlobal } = useAuth();
  
  const [dosis, setDosis] = useState('');
  const [idFrecuencia, setIdFrecuencia] = useState(''); // 👈 Guarda el ID de la frecuencia seleccionada
  const [periodo, setPeriodo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [idVia, setIdVia] = useState('');
  
  const viasAdministracion = catalogoGlobal?.catalogoViasAdministracion || [];
  const frecuenciasCatalogo = catalogoGlobal?.catalogoFrecuencias || [];

  useEffect(() => {
    if (medication) {
      setDosis(medication.dosis !== undefined ? String(medication.dosis) : '');
      setPeriodo(medication.periodo !== undefined ? String(medication.periodo) : '');
      setCantidad(medication.cantidad !== undefined ? String(medication.cantidad) : '');
      setIdVia(medication.idViaAdministracion || medication.idVia || medication.via || '');

      // Asigna el ID de frecuencia si ya existe o intenta buscarlo por coincidencia numérica
      const freqExistente = medication.idFrecuenciaDosis || medication.idFrecuencia || medication.frecuencia;
      if (freqExistente) {
        // Si el valor numérico coincide con un factorDiario o id, seleccionamos el item correspondiente
        const encontrada = frecuenciasCatalogo.find(
          f => String(f.idFrecuenciaDosis) === String(freqExistente) || String(f.factorDiario) === String(freqExistente)
        );
        setIdFrecuencia(encontrada ? String(encontrada.idFrecuenciaDosis) : String(freqExistente));
      } else {
        setIdFrecuencia('');
      }
    }
  }, [medication, frecuenciasCatalogo]);

  // 🟢 Cálculo automático del Total a Dispensar en tiempo real
  useEffect(() => {
    if (!dosis || !idFrecuencia || !periodo) return;

    const parsedDosis = parseFloat(dosis);
    const parsedPeriodo = parseInt(periodo, 10);
    const freqObj = frecuenciasCatalogo.find(f => String(f.idFrecuenciaDosis) === String(idFrecuencia));
    const factorDiario = freqObj ? freqObj.factorDiario : 1;

    if (isNaN(parsedDosis) || isNaN(parsedPeriodo) || parsedDosis <= 0 || parsedPeriodo <= 0) return;

    // Regla de cálculo: Jarabes (líquidos) vs Medicamentos Sólidos (tabletas)
    const esLiquido = medication?.esLiquido || medication?.unidadDosis === 'ml';
    const contenidoEnvaseMl = medication?.contenidoEnvaseMl || 120; // Tamaño por defecto del frasco

    if (esLiquido) {
      const totalMl = parsedDosis * factorDiario * parsedPeriodo;
      const frascosCalculados = Math.ceil(totalMl / contenidoEnvaseMl);
      setCantidad(String(frascosCalculados));
    } else {
      const totalUnidades = Math.ceil(parsedDosis * factorDiario * parsedPeriodo);
      setCantidad(String(totalUnidades));
    }
  }, [dosis, idFrecuencia, periodo, medication, frecuenciasCatalogo]);

  const handleSave = () => {
    if (!dosis || !idFrecuencia || !periodo || !cantidad || !idVia) {
      if (showMessage) showMessage('Por favor, completa todos los campos requeridos para la receta.');
      return;
    }

    const parsedDosis = parseFloat(dosis);
    const parsedPeriodo = parseInt(periodo, 10);
    const parsedCantidad = parseInt(cantidad, 10);
    const parsedIdVia = parseInt(idVia, 10);
    const parsedIdFrecuencia = parseInt(idFrecuencia, 10);

    if (isNaN(parsedDosis) || parsedDosis <= 0) {
      if (showMessage) showMessage('La dosis debe ser un número válido mayor a 0.');
      return;
    }
    if (isNaN(parsedPeriodo) || parsedPeriodo <= 0) {
      if (showMessage) showMessage('La duración debe ser mayor a 0 días.');
      return;
    }
    if (isNaN(parsedCantidad) || parsedCantidad <= 0) {
      if (showMessage) showMessage('La cantidad total debe ser un número entero mayor a 0.');
      return;
    }

    const viaObjeto = viasAdministracion.find(
      (v) => String(v.idViaAdministracion) === String(idVia)
    );

    const frecuenciaObjeto = frecuenciasCatalogo.find(
      (f) => String(f.idFrecuenciaDosis) === String(idFrecuencia)
    );

    onSave({
      ...medication, 
      idProducto: medication.idProducto || medication.id,
      dosis: parsedDosis.toString(),
      idFrecuenciaDosis: parsedIdFrecuencia,
      frecuencia: frecuenciaObjeto ? frecuenciaObjeto.factorDiario : 1, // Envia el factor numérico para retrocompatibilidad
      frecuenciaEtiqueta: frecuenciaObjeto ? frecuenciaObjeto.nombreFrecuenciaDosis : '',
      periodo: parsedPeriodo,
      cantidad: parsedCantidad,
      idViaAdministracion: parsedIdVia, 
      via: viaObjeto ? viaObjeto.nombreViaAdministracion.trim() : 'Oral'
    });
  };

  if (!medication) return null;

  const modalStyles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
      backdropFilter: 'blur(2px)'
    },
    content: {
      backgroundColor: '#ffffff', width: '90%', maxWidth: '440px',
      borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    },
    header: {
      backgroundColor: '#0066ff', padding: '14px 16px',
      color: '#ffffff', fontSize: '15px', fontWeight: '600'
    },
    body: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
    label: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569', fontWeight: '600' },
    input: {
      height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1',
      fontSize: '13px', color: '#1e293b', outline: 'none', backgroundColor: '#f8fafc', width: '100%', boxSizing: 'border-box'
    },
    select: {
      height: '36px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1',
      fontSize: '13px', color: '#1e293b', outline: 'none', backgroundColor: '#f8fafc', width: '100%', boxSizing: 'border-box', cursor: 'pointer'
    },
    actions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '12px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' },
    btnCancel: { padding: '8px 14px', borderRadius: '20px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#64748b', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
    btnSave: { padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: '#0066ff', color: '#ffffff', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          Configurar Receta: {medication.descripcion}
        </div>

        <div style={modalStyles.body}>
          {/* Vía de Administración */}
          <label style={modalStyles.label}>
            Vía de Administración
            <select
              value={idVia}
              onChange={(e) => setIdVia(e.target.value)}
              style={modalStyles.select}
            >
              <option value="">-- Seleccione Vía de Administración --</option>
              {viasAdministracion.map((itemVia) => (
                <option 
                  key={itemVia.idViaAdministracion} 
                  value={itemVia.idViaAdministracion}
                >
                  {itemVia.nombreViaAdministracion} ({itemVia.grupoClasificacion})
                </option>
              ))}
            </select>
          </label>

          {/* Dosis y Frecuencia */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <label style={{ ...modalStyles.label, flex: 1 }}>
              Dosis
              <input
                type="number"
                step="0.1"
                value={dosis}
                onChange={(e) => setDosis(e.target.value)}
                style={modalStyles.input}
                placeholder="Ej: 1"
              />
            </label>

            <label style={{ ...modalStyles.label, flex: 1 }}>
              Frecuencia
              <select
                value={idFrecuencia}
                onChange={(e) => setIdFrecuencia(e.target.value)}
                style={modalStyles.select}
              >
                <option value="">-- Frecuencia --</option>
                {frecuenciasCatalogo.map((freq) => (
                  <option key={freq.idFrecuenciaDosis} value={freq.idFrecuenciaDosis}>
                    {freq.nombreFrecuenciaDosis}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Duración y Total a Dispensar */}
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
                style={{ ...modalStyles.input, backgroundColor: '#f1f5f9', fontWeight: 'bold', color: '#0284c7' }}
                placeholder="Ej: 14"
              />
            </label>
          </div>
        </div>

        <div style={modalStyles.actions}>
          <button type="button" style={modalStyles.btnCancel} onClick={onClose}>Cancelar</button>
          <button type="button" style={modalStyles.btnSave} onClick={handleSave}>Guardar Receta</button>
        </div>
      </div>
    </div>
  );
}

export default AtencionMedicaMedicamentoDetalleModal;