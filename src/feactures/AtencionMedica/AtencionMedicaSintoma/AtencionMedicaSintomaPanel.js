// src/components/AtencionMedica/AtencionMedicaSintomasPanel.js
import React from 'react';
import Styles from '../../../Styles'; 
import useVoiceRecognition from "../../../hooks/useVoiceRecognition"; 
import { Mic, MicOff, HeartPulse } from 'lucide-react'; // Icono semántico ideal para sintomatología

/**
 * Componente optimizado para el registro de Síntomas Principales / Motivo de Consulta.
 * Sincroniza y persiste reactivamente en tiempo real con la DataPaciente global.
 */
const AtencionMedicaSintomasPanel = ({ content = '', onContentChange, onModalMessage }) => {
  const title = "Enfermedad Actual / Síntomas Principales / Motivo de Consulta";

  // Inicialización del Hook de Voz con concatenación inteligente
  const { startListening, stopListening, isListening, error } = useVoiceRecognition(
    (transcript) => {
      // Une el dictado al texto previo para evitar sobreescrituras accidentales
      const nuevoContenido = content ? `${content} ${transcript}` : transcript;
      onContentChange(nuevoContenido);
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
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Escriba o dicte los signos y síntomas cardinales referidos por el paciente (ej: cefalea, alzas térmicas, dolor abdominal difuso...)"
          rows="5"
        />

        {/* Indicador de extensión discreto */}
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
          <HeartPulse size={12} color="#64748b" />
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>
            {content ? `${content.length} caracteres` : 'Vacío'}
          </span>
        </div>
      </div>

      {/* Alerta de Errores del Web Speech API */}
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

export default AtencionMedicaSintomasPanel;