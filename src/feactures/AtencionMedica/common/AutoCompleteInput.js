// src/components/common/AutoCompleteInput.js
import React, { useState, useEffect, useRef } from 'react';
import useVoiceRecognition from '../../../hooks/useVoiceRecognition'; 
import styles from '../../../Styles'; 
import { v4 as uuidv4 } from 'uuid'; 
import { X, Mic, MicOff } from 'lucide-react'; // 💡 Importamos los iconos vectoriales de Lucide

/**
 * Componente de campo de texto con autocompletado y dictado por voz.
 * Muestra una lista de sugerencias basada en la entrada del usuario.
 */
const AutoCompleteInput = ({ label, placeholder, onSelectSuggestion, fetchSuggestions, onModalMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); 
  const inputRef = useRef(null);
  const suggestionsListRef = useRef(null); 

  const { startListening, stopListening, isListening, error: voiceError } = useVoiceRecognition(
    (transcript) => {
      setInputValue(transcript);
      if (transcript.trim()) {
        fetchData(transcript);
      }
    },
    onModalMessage
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.trim()) {
        fetchData(inputValue);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); 

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, fetchSuggestions]); 

  const fetchData = async (query) => {
    try {
      const fetched = await fetchSuggestions(query);
      setSuggestions(fetched);
      setShowSuggestions(fetched.length > 0);
      setHighlightedIndex(-1); 
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

  const handleSelect = (suggestion) => {
    setInputValue(suggestion.label); 
    onSelectSuggestion(suggestion); 
    setSuggestions([]); 
    setShowSuggestions(false); 
    setHighlightedIndex(-1); 
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault(); 
        setHighlightedIndex(prevIndex => (prevIndex + 1) % suggestions.length);
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
        e.preventDefault(); 
        if (highlightedIndex !== -1 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        } else if (inputValue.trim()) {
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
      onSelectSuggestion({ id: uuidv4(), label: inputValue.trim() });
      setInputValue('');
    }
  };

  const handleClearInput = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current.focus(); 
  };

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
        {inputValue && ( 
          <button
            type="button"
            style={styles.clearInputButton}
            onClick={handleClearInput}
            aria-label="Borrar texto"
          >
            <X size={18} color="#94a3b8" /> 
          </button>
        )}
        
        {/* 💡 REDISEÑO: Botón de dictado con iconos de Lucide estilizados y limpios */}
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`hce-mic-trigger-button ${isListening ? 'is-recording' : ''}`}
          style={isListening ? styles.micButtonActive : styles.micButton}
          aria-label={isListening ? "Detener grabación" : "Iniciar grabación"}
        >
          {isListening ? (
            <MicOff size={18} className="hce-mic-icon-pulse" />
          ) : (
            <Mic size={18} />
          )}
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
              onMouseEnter={() => setHighlightedIndex(index)} 
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