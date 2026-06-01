// src/components/common/AutoCompleteInput.js
import React, { useState, useEffect, useRef } from 'react';
import useVoiceRecognition from '../../../hooks/useVoiceRecognition'; // Importa el hook de voz
import styles from '../../../Styles'; // Importa los estilos globales
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos si se añade texto libre
import { X } from 'lucide-react'; // Importar X de Lucide React (para el botón de borrar)

/**
 * Componente de campo de texto con autocompletado y dictado por voz.
 * Muestra una lista de sugerencias basada en la entrada del usuario.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.label - Etiqueta para el campo de entrada.
 * @param {string} props.placeholder - Texto de marcador de posición para el campo.
 * @param {function} props.onSelectSuggestion - Función a llamar cuando se selecciona una sugerencia.
 * Recibe el objeto de la sugerencia seleccionada.
 * @param {function} props.fetchSuggestions - Función asíncrona para obtener sugerencias.
 * Recibe el texto de entrada y debe devolver un Array de objetos
 * con propiedades 'id' y 'label'.
 * @param {function} props.onModalMessage - Función para mostrar mensajes en un modal.
 */
const AutoCompleteInput = ({ label, placeholder, onSelectSuggestion, fetchSuggestions, onModalMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Para navegación con teclado
  const inputRef = useRef(null);
  const suggestionsListRef = useRef(null); // Referencia a la lista de sugerencias

  // Hook de reconocimiento de voz para el campo de entrada
  const { startListening, stopListening, isListening, error: voiceError } = useVoiceRecognition(
    (transcript) => {
      setInputValue(transcript);
      // Disparar la búsqueda de sugerencias inmediatamente después del dictado
      if (transcript.trim()) {
        fetchData(transcript);
      }
    },
    onModalMessage
  );

  // Debounce para el fetching de sugerencias
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.trim()) {
        fetchData(inputValue);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // Debounce de 300ms para evitar llamadas excesivas a la API

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, fetchSuggestions]); // Dependencias: inputValue y fetchSuggestions

  const fetchData = async (query) => {
    try {
      const fetched = await fetchSuggestions(query);
      setSuggestions(fetched);
      setShowSuggestions(fetched.length > 0);
      setHighlightedIndex(-1); // Resetear el índice resaltado al obtener nuevas sugerencias
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      onModalMessage("Error al cargar sugerencias.");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * Maneja la selección de una sugerencia de la lista.
   * Cierra la lista de sugerencias después de la selección.
   * @param {Object} suggestion - La sugerencia seleccionada.
   */
  const handleSelect = (suggestion) => {
    setInputValue(suggestion.label); // Muestra la sugerencia seleccionada en el input
    onSelectSuggestion(suggestion); // Notifica al componente padre
    setSuggestions([]); // Limpia las sugerencias
    setShowSuggestions(false); // <--- ESTA LÍNEA CIERRA LA LISTA DE SUGERENCIAS
    setHighlightedIndex(-1); // Resetea el índice
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); // Prevenir el desplazamiento de la página
        setHighlightedIndex(prevIndex => (prevIndex + 1) % suggestions.length);
        // Asegurarse de que el elemento resaltado sea visible
        if (suggestionsListRef.current) {
          const item = suggestionsListRef.current.children[highlightedIndex + 1];
          if (item) item.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prevIndex => (prevIndex - 1 + suggestions.length) % suggestions.length);
        if (suggestionsListRef.current) {
          const item = suggestionsListRef.current.children[highlightedIndex - 1];
          if (item) item.scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault(); // Prevenir el envío de formulario
        if (highlightedIndex !== -1 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        } else if (inputValue.trim()) {
          // Si no hay sugerencias resaltadas pero hay texto en el input,
          // se podría considerar agregar el texto actual como un nuevo ítem.
          onSelectSuggestion({ id: uuidv4(), label: inputValue.trim() });
          setInputValue('');
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    } else if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      // Si no hay sugerencias pero hay texto, agregar como nuevo elemento
      onSelectSuggestion({ id: uuidv4(), label: inputValue.trim() });
      setInputValue('');
    }
  };

  /**
   * Maneja el clic en el botón de borrar el texto del input.
   */
  const handleClearInput = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current.focus(); // Vuelve a enfocar el input
  };

  // Cierra las sugerencias al hacer clic fuera del input o la lista
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsListRef.current && !suggestionsListRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={styles.autocompleteContainer}>
      <label style={styles.autocompleteLabel}>{label}</label>
      <div style={styles.autocompleteInputWrapper}>
        <input
          ref={inputRef}
          type="text"
          style={styles.autocompleteInput}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls="autocomplete-suggestions"
          aria-expanded={showSuggestions}
        />
        {inputValue && ( // Mostrar el botón de borrar solo si hay texto
          <button
            style={styles.clearInputButton}
            onClick={handleClearInput}
            aria-label="Borrar texto"
          >
            <X size={20} /> {/* Icono de 'X' */}
          </button>
        )}
        <button
          onClick={isListening ? stopListening : startListening}
          style={isListening ? styles.micButtonActive : styles.micButton}
          aria-label={isListening ? "Detener grabación" : "Iniciar grabación"}
        >
          {isListening ? '🛑' : '🎤'}
        </button>
      </div>
      {voiceError && <p style={styles.errorText}>{voiceError}</p>}

      {showSuggestions && suggestions.length > 0 && (
        <ul id="autocomplete-suggestions" role="listbox" style={styles.autocompleteSuggestionsList} ref={suggestionsListRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id || index}
              role="option"
              aria-selected={index === highlightedIndex}
              style={{
                ...styles.autocompleteSuggestionItem,
                ...(index === highlightedIndex ? styles.autocompleteSuggestionItemHighlighted : {})
              }}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)} // Resaltar al pasar el ratón
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
