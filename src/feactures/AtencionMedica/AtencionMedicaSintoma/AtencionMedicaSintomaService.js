import { apiToUiSintomas, uiToApiSintomas } from './AtencionMedicaSintomaMapper';


export const AtencionMedicaSintomaService = {
  obtenerSintomasRegistrados: (dataAtencionRegistrada) => {
    return apiToUiSintomas(dataAtencionRegistrada);
  },

  obtenerSintomasIniciales: () => {
    return [];
  },

  prepararParaGuardar: (panelSintomas) => {
    return uiToApiSintomas(panelSintomas);
  }
};