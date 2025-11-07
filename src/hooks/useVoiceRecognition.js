
// src/hooks/useVoiceRecognition.js
import { useState, useRef, useEffect } from 'react';

/**
 * Hook personalizado para manejar la lógica del reconocimiento de voz.
 * @param {function} onResultCallback - Función a llamar con el texto transcrito.
 * @param {function} onModalMessage - Función para mostrar mensajes en un modal (desde App.js).
 * @returns {object} - Objeto con funciones para iniciar/detener la escucha, estado de escucha y errores.
 */
const useVoiceRecognition = (onResultCallback, onModalMessage) => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("El reconocimiento de voz no es soportado por este navegador.");
      onModalMessage("El reconocimiento de voz no es soportado por este navegador. Por favor, usa un navegador compatible como Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      console.log('Comenzando a escuchar...');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      onResultCallback(transcript);
      console.log('Transcripción:', transcript);
    };

    recognition.onerror = (event) => {
      setError(`Error de reconocimiento de voz: ${event.error}`);
      setIsListening(false);
      console.error('Error de voz:', event.error);
      onModalMessage(`Error de reconocimiento de voz: ${event.error}. Asegúrate de que el micrófono está conectado y los permisos concedidos.`);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Reconocimiento de voz terminado.');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResultCallback, onModalMessage]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        setError("Error al iniciar el reconocimiento de voz. Asegúrate de que el micrófono está disponible y los permisos concedidos.");
        onModalMessage("Error al iniciar el reconocimiento de voz. Asegúrate de que el micrófono está disponible y los permisos concedidos.");
        console.error("Error al iniciar reconocimiento:", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return { startListening, stopListening, isListening, error };
};

export default useVoiceRecognition;
