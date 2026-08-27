import { apiToUiExamenFisico, uiToApiExamenFisico } from './AtencionMedicaExamenFisicoMapper';

export const AtencionMedicaExamenFisicoService = {
  obtenerExamenFisicoRegistrado: (dataAtencionRegistrada) => {
    return apiToUiExamenFisico(dataAtencionRegistrada);
  },

  obtenerExamenFisicoInicial: () => {
    return [];
  },

  prepararParaGuardar: (panelExamenFisico) => {
    return uiToApiExamenFisico(panelExamenFisico);
  }
};