// src/components/AtencionExamen/AtencionMedicaExamenMapper.js

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
      idProducto: item.id || item.idServicio,
      nombre: item.examen || item.label,
      codigo: item.codigoExamen,
      tipoServicio: item.tipoExamen ? Number(item.tipoExamen) : 1,
      diagnosticosAsociados: item.diagnosticosAsociados || []
    }));
  },

  // Mapeo específico para los ítems devueltos por el backend al consultar el detalle de un paquete de servicios
  paqueteDetalleToUi(items) {
    if (!Array.isArray(items)) return [];
    return items.map(item => ({
      id: item.idServicio || item.idProducto || item.id,
      label: item.nombreServicio || item.nombre || item.label,
      examen: item.nombreServicio || item.nombre || item.label,
      codigoExamen: item.codigoServicio || item.codigo || 'S/C',
      tipoExamen: item.tipoServicio !== undefined ? String(item.tipoServicio) : '1',
      diagnosticosAsociados: []
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

/*
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
*/