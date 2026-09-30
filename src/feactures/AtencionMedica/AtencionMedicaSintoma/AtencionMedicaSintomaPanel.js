// src/components/AtencionMedica/AtencionMedicaSintomasPanel.js
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import Styles from '../../../Styles'; 
import useVoiceRecognition from "../../../hooks/useVoiceRecognition"; 
import { Mic, MicOff, HeartPulse } from 'lucide-react';

/**
 * Componente optimizado para el registro de Síntomas Principales / Motivo de Consulta.
 * Adaptado para gestionar una lista de objetos [{ idSintoma, nombreSintoma }].
 */
const AtencionMedicaSintomasPanel = ({ 
  content = [], 
  onContentChange, 
  onModalMessage 
}) => {
  const title = "Enfermedad Actual / Síntomas Principales / Motivo de Consulta";
  const textareaRef = useRef(null);

  // 1. Memorizar la lista normalizada para evitar recalculaciones innecesarias
  const listaSintomas = useMemo(() => {
    return Array.isArray(content) ? content : [];
  }, [content]);

  // 2. Extraer el texto libre actual (aquel con idSintoma o id igual a 0)
  const itemTextoLibre = useMemo(() => {
    return listaSintomas.find(
      (item) => Number(item.idSintoma ?? item.id) === 0
    );
  }, [listaSintomas]);

  const textoActual = useMemo(() => {
    if (itemTextoLibre) {
      return itemTextoLibre.nombreSintoma || itemTextoLibre.descripcion || "";
    }
    return typeof content === 'string' ? content : "";
  }, [itemTextoLibre, content]);

  // 3. Emitir la lista actualizada conservando registros con id > 0 (catálogo)
  const actualizarTextoLibre = useCallback((nuevoTexto) => {
    const soloCatalogo = listaSintomas.filter(
      (item) => Number(item.idSintoma ?? item.id) > 0
    );

    const listaActualizada = [...soloCatalogo];

    if (nuevoTexto.trim() !== '') {
      listaActualizada.push({
        idSintoma: 0,
        nombreSintoma: nuevoTexto
      });
    }

    onContentChange(listaActualizada);
  }, [listaSintomas, onContentChange]);

  // 4. Inicialización del Hook de Voz
  const { startListening, stopListening, isListening, error } = useVoiceRecognition(
    (transcript) => {
      const nuevoContenido = textoActual 
        ? `${textoActual.trim()} ${transcript}` 
        : transcript;
      actualizarTextoLibre(nuevoContenido);
    },
    onModalMessage
  );

  // Auto-ajuste de altura dinámico (teclado, dictado o datos precargados)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [textoActual]);

  const handleInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div style={Styles.medicalSection}>
      {/* Cabecera Uniformizada del Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <label style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#475569', 
          letterSpacing: '0.025em'
        }}>
          {title}
        </label>

        {/* Botón de Dictado por Voz Compacto */}
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: isListening ? '#fef2f2' : '#ffffff',
            border: isListening ? '1px solid #fca5a5' : '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '2px 8px',
            color: isListening ? '#ef4444' : '#2563eb',
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: isListening ? '0 0 6px rgba(239, 68, 68, 0.2)' : 'none'
          }}
        >
          {isListening ? (
            <>
              <MicOff size={12} strokeWidth={2.5} className="animate-pulse" />
              <span style={{ fontWeight: '600' }}>Detener</span>
            </>
          ) : (
            <>
              <Mic size={12} strokeWidth={2.5} />
              <span>Dictar</span>
            </>
          )}
        </button>
      </div>

      {/* Contenedor del Área de Texto Compacta */}
      <div style={{ position: 'relative', width: '100%' }}>
        <textarea
          ref={textareaRef}
          rows={1}
          style={{
            width: '100%',
            minHeight: '38px',
            padding: '6px 45px 6px 10px',
            borderRadius: '6px',
            border: isListening ? '1.5px solid #f87171' : '1px solid #cbd5e1',
            backgroundColor: isListening ? '#fffdfd' : '#f8fafc',
            fontSize: '12px',
            color: '#1e293b',
            lineHeight: '1.4',
            outline: 'none',
            resize: 'none',
            overflowY: 'hidden',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s ease, background-color 0.15s ease'
          }}
          onInput={handleInput}
          value={textoActual}
          onChange={(e) => actualizarTextoLibre(e.target.value)}
          placeholder="Escriba o dicte los signos y síntomas cardinales referidos por el paciente (ej: cefalea, alzas térmicas, dolor abdominal...)"
        />

        {/* Indicador visual de caracteres dentro del campo */}
        <div style={{
          position: 'absolute',
          bottom: '6px',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          pointerEvents: 'none',
          opacity: 0.5
        }}>
          <HeartPulse size={10} color="#64748b" />
          <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '500' }}>
            {textoActual ? `${textoActual.length}` : '0'}
          </span>
        </div>
      </div>

      {/* Manejo de Errores de Micrófono */}
      {error && (
        <div style={{
          marginTop: '4px',
          padding: '4px 8px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '4px',
          color: '#b91c1c',
          fontSize: '10.5px',
          fontWeight: '500'
        }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
};

export default AtencionMedicaSintomasPanel;