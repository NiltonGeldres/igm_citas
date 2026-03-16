import { useState, useEffect, useCallback } from 'react';
import agendaService from '../services/agendaService';

export const useAgenda = (idMedico, fechaSeleccionada) => {
  const [citados, setCitados] = useState([]);
  const [loading, setLoading] = useState(true);
      console.log("CITADOS    "+idMedico+fechaSeleccionada)
  const cargarAgenda = useCallback(async () => {
    if (!idMedico || !fechaSeleccionada) return;
    setLoading(true);
//    const params = mapearAgendaRequest(idMedico, fechaSeleccionada);

    try {
      const data = await agendaService.getAgendaPorMedico(idMedico,fechaSeleccionada);
      setCitados(data);
      console.log("CITADOS    "+JSON.stringify(data))
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