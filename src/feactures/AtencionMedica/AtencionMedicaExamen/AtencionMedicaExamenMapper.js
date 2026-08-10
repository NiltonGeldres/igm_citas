// src/components/AtencionMedicaExamenMapper.js

export const AtencionMedicaExamenMapper = {
  apiToLocal(apiData) {
    if (!Array.isArray(apiData)) return [];
    return apiData.map(item => ({
      id: item.id || item.idProducto || item.idProcedimiento || Math.random().toString(),
      label: item.nombre || item.label || item.examen || item.nombreProcedimiento || '',
      examen: item.nombre || item.label || item.examen || item.nombreProcedimiento || '',
      codigoExamen: item.codigo || item.codigoExamen || item.codigoProcedimiento || item.codigoCpt || 'S/C',
      tipoExamen: item.tipoServicio !== undefined ? String(item.tipoServicio) : (item.tipoExamen || item.categoria || ''),
      diagnosticosAsociados: Array.isArray(item.diagnosticosAsociados) ? item.diagnosticosAsociados : []
    }));
  },

  localToApi(localData) {
    if (!Array.isArray(localData)) return [];
    return localData.map(item => ({
      idProducto: item.id,
      nombre: item.examen || item.label,
      codigo: item.codigoExamen,
      tipoServicio: item.tipoExamen ? Number(item.tipoExamen) : 1,
      diagnosticosAsociados: item.diagnosticosAsociados
    }));
  },

  // Aliases requeridos por el Service actual
  apiToUiCatalogList(apiData) {
    return this.apiToLocal(apiData);
  },

  apiToUiRecordList(apiData) {
    return this.apiToLocal(apiData);
  }
};