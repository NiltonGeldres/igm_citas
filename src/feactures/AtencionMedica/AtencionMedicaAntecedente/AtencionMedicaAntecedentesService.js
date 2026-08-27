// src/services/AtencionMedicaAntecedentesService.js
import { apiToUiAntecedentes, uiToApiAntecedentes } from '../mappers/antecedentesMapper';

export const AtencionMedicaAntecedentesService = {
  /**
   * Procesa los antecedentes cuando se carga/edita una atención registrada.
   */
  obtenerAntecedentesRegistrados: (dataAtencionRegistrada) => {
    return apiToUiAntecedentes(dataAtencionRegistrada);
  },

  /**
   * Retorna la estructura inicial vacía para una nueva atención.
   */
  obtenerAntecedentesIniciales: () => {
    return [];
  },

  /**
   * Prepara los antecedentes para el payload que se enviará al guardar.
   */
  prepararParaGuardar: (panelAntecedentes) => {
    return uiToApiAntecedentes(panelAntecedentes);
  }
};