// src/components/AtencionExamen/AtencionMedicaExamenMapper.js

/**
 * Función auxiliar para formatear texto en MAYÚSCULAS o minúsculas a Title Case (Primera letra en mayúscula).
 * Ejemplo: "EXAMEN COMPLETO DE ORINA" -> "Examen completo de orina"
 */
const formatTitleCase = (str) => {
  if (!str) return '';
  const cleanStr = String(str).trim().toLowerCase();
  return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1);
};

export const AtencionMedicaExamenMapper = {
  /**
   * Mapea y aplica formato Title Case a la lista de paquetes para los <select> de la UI.
   */
  apiToUiPackageList(packages) {
    if (!Array.isArray(packages)) return [];
    return packages.map(pkg => {
      const nombreRaw = pkg.nombrePaquete || pkg.nombre || '';
      return {
        idPaqueteExamen: pkg.idPaqueteExamen || pkg.idPaquete || pkg.id,
        nombrePaquete: formatTitleCase(nombreRaw)
      };
    });
  },

  /**
   * Mapea los exámenes/servicios recibidos de la API (catálogo o detalle de paquete)
   * formateando la descripción para la presentación en la interfaz.
   */
  apiToUiCatalogList(items) {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
      const nombreRaw = item.nombre || item.nombreServicio || item.label || '';
      const nombreFormateado = formatTitleCase(nombreRaw);

      return {
        id: item.idProducto || item.idServicio || item.id || Math.random().toString(),
        label: nombreFormateado,
        examen: nombreFormateado,
        codigoExamen: item.codigo || item.codigoServicio || item.codMinsa || 'S/C',
        tipoExamen: item.tipoServicio !== undefined ? String(item.tipoServicio) : '1',
        precioVenta: item.precioVenta || 0.00,
        diagnosticosAsociados: Array.isArray(item.diagnosticosAsociados) ? item.diagnosticosAsociados : []
      };
    });
  },

  /**
   * Convierte los datos formateados de la UI de regreso a la estructura requerida por la API.
   */
  localToApi(localData) {
    if (!Array.isArray(localData)) return [];
    return localData.map(item => ({
      idProducto: item.id,
      nombre: item.examen || item.label,
      codigo: item.codigoExamen,
      tipoServicio: item.tipoExamen ? Number(item.tipoExamen) : 1,
      diagnosticosAsociados: item.diagnosticosAsociados || []
    }));
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