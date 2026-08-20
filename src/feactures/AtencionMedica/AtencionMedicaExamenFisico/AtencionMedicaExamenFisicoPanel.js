// src/components/AtencionMedica/AtencionMedicaExamenFisicoPanel.js
import React from 'react';
import Styles from '../../../Styles'; 
import useVoiceRecognition from "../../../hooks/useVoiceRecognition"; 
import { Mic, MicOff, Activity } from 'lucide-react';

/**
 * Componente optimizado para el registro del Examen Físico.
 * Adaptado para gestionar una lista de objetos [{ idExamenFisico, nombreExamenFisico }].
 */
const AtencionMedicaExamenFisicoPanel = ({ content = [], onContentChange, onModalMessage }) => {
  const title = "Examen Físico Dirigido";

  // Asegurar que 'content' sea un arreglo
  const listaExamenFisico = Array.isArray(content) ? content : [];

  // Extraer el texto libre actual (aquel con idExamenFisico o id igual a 0)
  const itemTextoLibre = listaExamenFisico.find(
    (item) => Number(item.idExamenFisico ?? item.id) === 0
  );

  const textoActual = itemTextoLibre
    ? (itemTextoLibre.nombreExamenFisico || itemTextoLibre.descripcion || "")
    : (typeof content === 'string' ? content : "");

  // Emitir la lista actualizada conservando registros con id > 0 (catálogo)
  const actualizarTextoLibre = (nuevoTexto) => {
    const soloCatalogo = listaExamenFisico.filter(
      (item) => Number(item.idExamenFisico ?? item.id) > 0
    );

    let listaActualizada = [...soloCatalogo];

    if (nuevoTexto.trim() !== '') {
      listaActualizada.push({
        idExamenFisico: 0,
        nombreExamenFisico: nuevoTexto
      });
    }

    onContentChange(listaActualizada);
  };

  // Inicialización del Hook de Voz
  const { startListening, stopListening, isListening, error } = useVoiceRecognition(
    (transcript) => {
      const nuevoContenido = textoActual ? `${textoActual} ${transcript}` : transcript;
      actualizarTextoLibre(nuevoContenido);
    },
    onModalMessage
  );

  return (
    <div style={Styles.medicalSection}>
      {/* Cabecera Uniformizada del Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ ...Styles.sectionTitle, margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>
          {title}
        </h3>
        
        {/* Botón de Dictado por Voz en la Cabecera */}
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: isListening ? '#fef2f2' : '#ffffff',
            border: isListening ? '1px solid #fca5a5' : '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '6px 14px',
            color: isListening ? '#ef4444' : '#2563eb',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isListening ? '0 0 8px rgba(239, 68, 68, 0.2)' : 'none'
          }}
        >
          {isListening ? (
            <>
              <MicOff size={14} strokeWidth={2.5} />
              <span style={{ fontWeight: '600' }}>Detener Dictado</span>
            </>
          ) : (
            <>
              <Mic size={14} strokeWidth={2.5} />
              <span>Dictar por voz</span>
            </>
          )}
        </button>
      </div>

      {/* Contenedor del Área de Texto */}
      <div style={{ position: 'relative', width: '100%' }}>
        <textarea
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px 14px',
            borderRadius: '8px',
            border: isListening ? '1.5px solid #f87171' : '1px solid #cbd5e1',
            backgroundColor: isListening ? '#fffdfd' : '#ffffff',
            fontSize: '13px',
            color: '#334155',
            lineHeight: '1.5',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease'
          }}
          value={textoActual}
          onChange={(e) => actualizarTextoLibre(e.target.value)}
          placeholder="Registre la evaluación de sistemas (cabeza, cuello, tórax, abdomen, extremidades), hallazgos patológicos relevantes o constantes vitales anotadas..."
          rows="5"
        />

        {/* Indicador de extensión */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none',
          opacity: 0.6
        }}>
          <Activity size={12} color="#64748b" />
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
            {textoActual ? `${textoActual.length} caracteres` : 'Vacío'}
          </span>
        </div>
      </div>

      {/* Alerta de Errores */}
      {error && (
        <div style={{
          marginTop: '8px',
          padding: '6px 12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '6px',
          color: '#b91c1c',
          fontSize: '11px',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default AtencionMedicaExamenFisicoPanel;