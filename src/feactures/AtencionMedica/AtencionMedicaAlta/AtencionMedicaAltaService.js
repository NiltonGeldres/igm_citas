// src/services/AtencionMedicaAltaService.js

import { apiToUiAlta , uiToApiAlta} from "./AtencionMedicaAltaMapper";
export const AtencionMedicaAltaService = {
  /**
   * Procesa el plan de alta cuando se carga/edita una atención registrada.
   */
  obtenerAltaRegistrada: (dataAtencionRegistrada) => {
    return apiToUiAlta(dataAtencionRegistrada);
  },

  /**
   * Retorna la estructura inicial vacía para una nueva atención.
   */
  obtenerAltaInicial: () => {
    return [];
  },

  /**
   * Prepara la información de alta para el payload que se enviará al guardar la atención.
   */
  prepararParaGuardar: (panelAlta) => {
    return uiToApiAlta(panelAlta);
  }
};