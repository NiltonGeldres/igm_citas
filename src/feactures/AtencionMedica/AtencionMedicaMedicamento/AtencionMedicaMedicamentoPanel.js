// src/components/Medicacion/AtencionMedicaMedicamentoPanel.js
import React, { useState, useEffect } from 'react';
import AutoCompleteInput from '../common/AutoCompleteInput'; 
import AtencionMedicaMedicamentoDetalleModal from './AtencionMedicaMedicamentoDetalleModal'; 
import Styles from '../../../Styles'; 
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react'; 
import { AtencionMedicaMedicamentoService } from './AtencionMedicaMedicamentoService';

function AtencionMedicaMedicamentoPanel({ content = [], onContentChange, onModalMessage }) {
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState('INDIVIDUAL'); // 'INDIVIDUAL' o 'PAQUETE'
  const [mostrarDetalleMedicamentoModal, setMostrarDetalleMedicamentoModal] = useState(false);
  const [medicamentoActualParaEditar, setMedicamentoActualParaEditar] = useState(null);
  const [paquetesDisponibles, setPaquetesDisponibles] = useState([]);

  // 🔄 CAMBIO 1: Carga de lista de paquetes alineada a la nueva función del servicio
  useEffect(() => {
    const cargarPaquetes = async () => {
      const pkgs = await AtencionMedicaMedicamentoService.obtenerListaPaquetes();
      setPaquetesDisponibles(pkgs);
    };
    cargarPaquetes();
  }, []);

  const fetchMedicationSuggestions = async (query) => {
    return await AtencionMedicaMedicamentoService.buscarMedicamentosCatalogo(query);
  };

  // CAMINO A: SELECCIÓN INDIVIDUAL (Abre el Modal)
  const handleAddMedication = (medicationItem) => {
    const existingMed = content.find(item => item.descripcion === medicationItem.label);
    if (existingMed) {
      if (onModalMessage) onModalMessage(`El medicamento "${medicationItem.label}" ya fue agregado. Editando posología.`);
      setMedicamentoActualParaEditar(existingMed);
    } else {
      setMedicamentoActualParaEditar({
        id: uuidv4(),
        descripcion: medicationItem.label,
        dosis: medicationItem.dosisDefault || '',
        frecuencia: medicationItem.frecuenciaDefault || '',
        periodo: medicationItem.duracionDiasDefault || '',
        cantidad: medicationItem.cantidadPredefinida || '',
        via: medicationItem.idViaDefault || '',
      });
    }
    setMostrarDetalleMedicamentoModal(true);
  };

  // 🔄 CAMBIO 2: Manejador asíncrono para cargar el detalle del paquete al seleccionar
  const handleCargarPaquete = async (e) => {
    const paqueteId = e.target.value;
    if (!paqueteId) return;

    const paqueteSeleccionado = paquetesDisponibles.find(pkg => String(pkg.id) === String(paqueteId));
    if (!paqueteSeleccionado) return;

    // Obtención asíncrona de medicamentos asociados
    const medicamentosAsociados = await AtencionMedicaMedicamentoService.obtenerProductosPorPaquete(paqueteId);

    let nuevosAgregados = 0;
    const listaActualizada = [...content];

    medicamentosAsociados.forEach(medItem => {
      const nombreMed = medItem.label;
      const yaExiste = listaActualizada.some(item => item.descripcion.toLowerCase() === nombreMed.toLowerCase());
      
      if (!yaExiste) {
        listaActualizada.push({
          id: uuidv4(),
          descripcion: nombreMed,
          dosis: medItem.dosisDefault || '',
          frecuencia: medItem.frecuenciaDefault || '',
          periodo: medItem.duracionDiasDefault || '',
          cantidad: medItem.cantidadPredefinida || '',
          via: medItem.idViaDefault || ''
        });
        nuevosAgregados++;
      }
    });

    onContentChange(listaActualizada);
    setMostrarBuscador(false);
    e.target.value = ""; // Reset del dropdown

    if (onModalMessage && nuevosAgregados > 0) {
      onModalMessage(`Se inyectaron ${nuevosAgregados} medicamentos del paquete "${paqueteSeleccionado.label}".`);
    }
  };

  const handleSaveMedicationDetails = (updatedMedication) => {
    const existingIndex = content.findIndex(item => item.id === updatedMedication.id);
    let updatedList = [...content];
    if (existingIndex > -1) {
      updatedList[existingIndex] = updatedMedication;
    } else {
      updatedList.push(updatedMedication);
    }
    onContentChange(updatedList);
    setMostrarDetalleMedicamentoModal(false);
    setMedicamentoActualParaEditar(null);
    setMostrarBuscador(false);
  };

  const handleDeleteMedication = (medicationId) => {
    const updatedList = content.filter(med => med.id !== medicationId);
    onContentChange(updatedList);
    if (onModalMessage) onModalMessage('Medicamento eliminado del tratamiento.');
  };

  return (
    <div style={Styles.medicalSection}>
      {/* Cabecera Uniforme */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ ...Styles.sectionTitle, margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
          Tratamiento / Medicación
        </h3>
        
        <button
          type="button"
          onClick={() => setMostrarBuscador(!mostrarBuscador)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: mostrarBuscador ? '#f1f5f9' : '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '6px 14px',
            color: '#1d4ed8',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          {mostrarBuscador ? 'Cerrar opciones' : 'Añadir medicamento o receta'}
        </button>
      </div>

      {/* Caja de Herramientas Apilada Verticalmente */}
      {mostrarBuscador && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px', 
          marginBottom: '16px', 
          backgroundColor: '#f8fafc',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          {/* Tabs superiores */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setTipoBusqueda('INDIVIDUAL')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: tipoBusqueda === 'INDIVIDUAL' ? '#e0f2fe' : 'transparent',
                color: tipoBusqueda === 'INDIVIDUAL' ? '#0369a1' : '#64748b'
              }}
            >
              💊 Fármaco Individual
            </button>
            <button
              type="button"
              onClick={() => setTipoBusqueda('PAQUETE')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: tipoBusqueda === 'PAQUETE' ? '#e0f2fe' : 'transparent',
                color: tipoBusqueda === 'PAQUETE' ? '#0369a1' : '#64748b'
              }}
            >
              📦 Cargar Receta Preconfigurada
            </button>
          </div>

          {/* Renderizado del buscador según Tab activo */}
          {tipoBusqueda === 'INDIVIDUAL' ? (
            <div>
              <AutoCompleteInput
                placeholder="Busque el medicamento (Ej: Paracetamol, Amoxicilina)..."
                onSelectSuggestion={handleAddMedication}
                fetchSuggestions={fetchMedicationSuggestions}
                onModalMessage={onModalMessage} 
                style={{ padding: '6px 12px', height: '34px', fontSize: '13px' }} 
              />
            </div>
          ) : (
            <div>
              <select
                onChange={handleCargarPaquete}
                defaultValue=""
                style={{
                  width: '100%',
                  height: '34px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>-- Seleccione un Paquete Farmacológico --</option>
                {/* 🔄 CAMBIO 3: Renderizado usando pkg.label en lugar de propiedades directas del backend */}
                {paquetesDisponibles.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Lista Estricta optimizada en espacio */}
      {content.length > 0 && (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#ffffff' }}>
          {content.map((item, index) => (
            <div 
              key={item.id} 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 14px',
                borderBottom: index === content.length - 1 ? 'none' : '1px solid #e2e8f0',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMedicamentoActualParaEditar(item);
                    setMostrarDetalleMedicamentoModal(true);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#3b82f6' }}
                >
                  <Pencil size={15} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMedication(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#f87171' }}
                >
                  <Trash2 size={15} strokeWidth={2.5} />
                </button>
                <div style={{
                  backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '600', fontSize: '11px',
                  padding: '2px 5px', borderRadius: '4px', minWidth: '18px', textAlign: 'center', border: '1px solid #e2e8f0'
                }}>
                  {index + 1}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600', lineHeight: '1.2' }}>
                  {item.descripcion}
                </div>
                
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '1px 5px', borderRadius: '4px', border: '1px solid #bbf7d0', fontWeight: '500', textTransform: 'capitalize' }}>
                    Vía: {item.via || 'N/A'}
                  </span>
                  <span style={{ fontSize: '11px', backgroundColor: '#eff6ff', color: '#2563eb', padding: '1px 5px', borderRadius: '4px', border: '1px solid #bfdbfe', fontWeight: '500' }}>
                    Dosis: {item.dosis || 'N/A'}
                  </span>
                  <span style={{ fontSize: '11px', backgroundColor: '#fff7ed', color: '#ea580c', padding: '1px 5px', borderRadius: '4px', border: '1px solid #ffedd5', fontWeight: '500' }}>
                    Cada: {item.frecuencia ? `Cada ${Math.round(24 / item.frecuencia)} hrs` : 'N/A'} ({item.frecuencia || 0} v/d)
                  </span>
                  <span style={{ fontSize: '11px', backgroundColor: '#f3e8ff', color: '#9333ea', padding: '1px 5px', borderRadius: '4px', border: '1px solid #e9d5ff', fontWeight: '500' }}>
                    Durante: {item.periodo || '0'} días
                  </span>
                  <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: '600' }}>
                    Total: Disp. {item.cantidad || 0} und.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalles Operativo */}
      {mostrarDetalleMedicamentoModal && (
        <AtencionMedicaMedicamentoDetalleModal
          medication={medicamentoActualParaEditar}
          onClose={() => {
            setMostrarDetalleMedicamentoModal(false);
            setMedicamentoActualParaEditar(null);
          }}
          onSave={handleSaveMedicationDetails}
          showMessage={onModalMessage}
        />
      )}
    </div>
  );
}

export default AtencionMedicaMedicamentoPanel;