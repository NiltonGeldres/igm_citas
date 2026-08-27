// src/mappers/antecedentesMapper.js

/**
 * Transforma la respuesta de la API al formato de estado UI que requiere AtencionMedicaAntecedentesPanel.
 * Espera un array de objetos con idAntecedente y nombreAntecedente.
 */
export const apiToUiAntecedentes = (dataAtencion) => {
  if (!dataAtencion) return [];

  const antecedentesApi = dataAtencion.antecedentes;

  // Si viene un array, nos aseguramos de dar la estructura correcta
  if (Array.isArray(antecedentesApi)) {
    return antecedentesApi.map(item => ({
      idAntecedente: item.idAntecedente ?? item.id ?? 0,
      nombreAntecedente: item.nombreAntecedente || item.descripcion || ""
    }));
  }

  // Si viniera como texto plano (caso defensivo)
  if (typeof antecedentesApi === 'string' && antecedentesApi.trim() !== '') {
    return [{ idAntecedente: 0, nombreAntecedente: antecedentesApi }];
  }

  return [];
};

/**
 * Prepara la estructura de antecedentes requerida para enviar en el DTO a la API.
 */
export const uiToApiAntecedentes = (panelAntecedentes) => {
  if (!Array.isArray(panelAntecedentes)) return [];

  return panelAntecedentes.map(item => ({
    idAntecedente: Number(item.idAntecedente ?? item.id ?? 0),
    nombreAntecedente: item.nombreAntecedente || item.descripcion || ""
  }));
};