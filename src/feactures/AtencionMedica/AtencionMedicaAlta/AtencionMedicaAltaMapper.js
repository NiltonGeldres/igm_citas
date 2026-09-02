
// src/components/AtencionMedica/AtencionMedicaAltaMapper.js

/**
 * Transforma la respuesta de la API al formato de estado UI que requiere AtencionMedicaAltaPanel.
 * Espera un array de objetos [{ idAlta, descripcionAlta }] o un campo de texto en dataAtencion.
 */
export const apiToUiAlta = (dataAtencion) => {
  if (!dataAtencion) return [];

  const altaApi = dataAtencion.planAlta || dataAtencion.alta || dataAtencion.indicacionesAlta;

  // Si viene un array de items
  if (Array.isArray(altaApi)) {
    return altaApi.map(item => ({
      idAlta: Number(item.idAlta ?? item.id ?? 0),
      descripcionAlta: item.descripcionAlta || item.descripcion || item.nombreAlta || ""
    }));
  }

  // Si viniera como string o texto plano desde la API
  if (typeof altaApi === 'string' && altaApi.trim() !== '') {
    return [{ idAlta: 0, descripcionAlta: altaApi }];
  }

  // Fallback defensivo por si viene directo en un objeto
  if (altaApi && typeof altaApi === 'object' && !Array.isArray(altaApi)) {
    return [{
      idAlta: Number(altaApi.idAlta ?? altaApi.id ?? 0),
      descripcionAlta: altaApi.descripcionAlta || altaApi.descripcion || ""
    }];
  }

  return [];
};

/**
 * Prepara la estructura del plan de alta requerida para enviar en el DTO a la API.
 */
export const uiToApiAlta = (panelAlta) => {
  if (!Array.isArray(panelAlta)) return [];

  return panelAlta.map(item => ({
    idAlta: Number(item.idAlta ?? item.id ?? 0),
    descripcionAlta: item.descripcionAlta || item.descripcion || ""
  }));
};