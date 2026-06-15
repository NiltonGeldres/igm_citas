// src/components/AtencionExamen/AtencionMedicaExamenMapper.js

export const AtencionMedicaExamenMapper = {
  apiToLocal(apiData) {
    if (!Array.isArray(apiData)) return [];
    return apiData.map(item => ({
      id: item.id || item.idProcedimiento || Math.random().toString(),
      label: item.label || item.examen || item.nombreProcedimiento || '',
      examen: item.label || item.examen || item.nombreProcedimiento || '',
      codigoProcedimiento: item.codigoProcedimiento || item.codigoCpt || 'S/C',
      tipoExamen: item.tipoExamen || item.categoria || '',
      diagnosticosAsociados: Array.isArray(item.diagnosticosAsociados) ? item.diagnosticosAsociados : []
    }));
  },

  localToApi(localData) {
    if (!Array.isArray(localData)) return [];
    return localData.map(item => ({
      id: item.id,
      nombreProcedimiento: item.examen || item.label,
      codigoCpt: item.codigoProcedimiento,
      categoria: item.tipoExamen,
      diagnosticosAsociados: item.diagnosticosAsociados
    }));
  }
};