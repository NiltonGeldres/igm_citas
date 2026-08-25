// useDebounceSave.js
import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';

export const useDebounceSave = (data, saveFunction, delay = 2000) => {
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const isFirstRender = useRef(true);

  const debouncedSave = useCallback(
    debounce(async (currentData) => {
      setSaveStatus('saving');
      try {
        await saveFunction(currentData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } catch (error) {
        setSaveStatus('error');
        console.error("Error en persistencia interina automática:", error);
      }
    }, delay),
    [saveFunction, delay]
  );

  useEffect(() => {
    // Evitamos el auto-guardado al instanciar el formulario en blanco
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (data && data.patient?.id) {
      setSaveStatus('saving');
      debouncedSave(data);
    }

    return () => debouncedSave.cancel();
  }, [data, debouncedSave]);

  return saveStatus;
};