/**
 * Mapper para el panel de Síntomas (Anamnesis / Enfermedad Actual).
 */

// 1. De API a FRONT (Lectura / Carga)
export const apiToUiSintomas = (dataAtencion) => {
  if (!dataAtencion || !Array.isArray(dataAtencion.sintomas)) {
    return [];
  }

  return dataAtencion.sintomas.map(item => ({
    idSintoma: Number(item.idSintoma ?? item.id ?? 0),
    nombreSintoma: item.nombreSintoma || item.descripcion || ''
  }));
};

// 2. De FRONT a API (Escritura / Guardado)
export const uiToApiSintomas = (panelSintomas) => {
  if (!Array.isArray(panelSintomas)) {
    return [];
  }

  return panelSintomas.map(item => ({
    idSintoma: Number(item.idSintoma ?? item.id ?? 0),
    nombreSintoma: item.nombreSintoma || item.descripcion || ''
  }));
};