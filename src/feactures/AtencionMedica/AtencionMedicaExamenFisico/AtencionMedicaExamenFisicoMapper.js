/**
 * Mapper para el panel de Examen Físico.
 */

// 1. De API a FRONT (Lectura / Carga)
export const apiToUiExamenFisico = (dataAtencion) => {
  if (!dataAtencion || !Array.isArray(dataAtencion.examenFisico)) {
    return [];
  }

  return dataAtencion.examenFisico.map(item => ({
    idExamenFisico: Number(item.idExamenFisico ?? item.id ?? 0),
    nombreExamenFisico: item.nombreExamenFisico || item.descripcion || ''
  }));
};

// 2. De FRONT a API (Escritura / Guardado)
export const uiToApiExamenFisico = (panelExamenFisico) => {
  if (!Array.isArray(panelExamenFisico)) {
    return [];
  }

  return panelExamenFisico.map(item => ({
    idExamenFisico: Number(item.idExamenFisico ?? item.id ?? 0),
    nombreExamenFisico: item.nombreExamenFisico || item.descripcion || ''
  }));
};