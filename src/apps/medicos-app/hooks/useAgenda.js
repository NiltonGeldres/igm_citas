import { useState, useEffect, useCallback } from 'react';
import { agendaService } from '../services/agendaService';

export const useAgenda = (idMedico, fechaSeleccionada) => {
  const [citados, setCitados] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarAgenda = useCallback(async () => {
    if (!idMedico) return;
    setLoading(true);
    try {
      const data = await agendaService.getAgendaPorMedico(idMedico, fechaSeleccionada);
      setCitados(data);
    } catch (error) {
      setCitados([]);
    } finally {
      setLoading(false);
    }
  }, [fechaSeleccionada, idMedico]);

  useEffect(() => {
    cargarAgenda();
  }, [cargarAgenda]);

  return { citados, loading, refresh: cargarAgenda };
};