/**
 * Formatea cadenas a Title Case para presentación en UI.
 */
const formatTitleCase = (str) => {
  if (!str) return '';
  const cleanStr = String(str).trim().toLowerCase();
  return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1);
};

export const AtencionMedicaExamenMapper = {
  /**
   * Convierte la lista plana de "examenesAuxiliares" recibida desde la API al formato de UI.
   * Agrupa registros por `idProducto` reconsolidando los diagnósticos asociados.
   */
  apiToUiExamenes(examenesApi = [], listaDiagnosticosDisponibles = []) {
    if (!Array.isArray(examenesApi) || examenesApi.length === 0) return [];

    const agrupadosMap = new Map();

    examenesApi.forEach((item) => {
      const idProd = item.idProducto;
      const nombreFormateado = formatTitleCase(item.nombreProducto || item.observacion || '');

      // Resolver la clave o código del diagnóstico asociado (CIE-10 / id)
      let dxCodigo = null;
      if (item.idDiagnostico) {
        const dxEncontrado = listaDiagnosticosDisponibles.find(
          (d) => String(d.idDiagnostico || d.id) === String(item.idDiagnostico)
        );
        dxCodigo = dxEncontrado ? (dxEncontrado.codigoCIE || dxEncontrado.codigo) : String(item.idDiagnostico);
      }

      if (!agrupadosMap.has(idProd)) {
        agrupadosMap.set(idProd, {
          id: idProd,
          label: nombreFormateado,
          examen: nombreFormateado,
          codigoExamen: item.codigoProducto || item.codigo || 'S/C',
          tipoExamen: String(item.idPuntoCarga || '1'),
          cantidad: item.cantidad || 1,
          observacion: item.observacion || '',
          diagnosticosAsociados: dxCodigo ? [dxCodigo] : []
        });
      } else {
        const existente = agrupadosMap.get(idProd);
        if (dxCodigo && !existente.diagnosticosAsociados.includes(dxCodigo)) {
          existente.diagnosticosAsociados.push(dxCodigo);
        }
      }
    });

    return Array.from(agrupadosMap.values());
  },

  /**
   * Convierte los ítems del Plan de Trabajo de la UI a la estructura plana `examenesAuxiliares` para el Backend API.
   * Si un examen tiene N diagnósticos vinculados, genera N entradas en el arreglo.
   */
  uiToApiExamenes(uiExamenes = [], listaDiagnosticosDisponibles = []) {
    if (!Array.isArray(uiExamenes) || uiExamenes.length === 0) return [];

    const payloadApi = [];

    uiExamenes.forEach((item) => {
      const idProductoNum = Number(item.idProducto || item.id) || 0;
      const idPuntoCargaNum = Number(item.tipoExamen || item.idPuntoCarga) || 1;
      const cantidadNum = Number(item.cantidad) || 1;

      if (Array.isArray(item.diagnosticosAsociados) && item.diagnosticosAsociados.length > 0) {
        item.diagnosticosAsociados.forEach((codCie) => {
          const dxEncontrado = listaDiagnosticosDisponibles.find(
            (d) => (d.codigoCIE || d.codigo) === codCie
          );

          payloadApi.push({
            cantidad: cantidadNum,
            idProducto: idProductoNum,
            observacion: item.observacion || '',
            idPuntoCarga: idPuntoCargaNum,
            idDiagnostico: dxEncontrado ? Number(dxEncontrado.idDiagnostico || dxEncontrado.id) : null,
            nombreProducto: item.label || item.examen || '',
            descripcionDiagnostico: dxEncontrado ? (dxEncontrado.label || dxEncontrado.diagnostico) : ''
          });
        });
      } else {
        payloadApi.push({
          cantidad: cantidadNum,
          idProducto: idProductoNum,
          observacion: item.observacion || item.label || item.examen || '',
          idPuntoCarga: idPuntoCargaNum,
          idDiagnostico: null,
          nombreProducto: item.label || item.examen || '',
          descripcionDiagnostico: ''
        });
      }
    });

    return payloadApi;
  },

  apiToUiPackageList(packages) {
    if (!Array.isArray(packages)) return [];
    return packages.map((pkg) => ({
      idPaqueteExamen: pkg.idPaqueteExamen || pkg.idPaquete || pkg.id,
      nombrePaquete: formatTitleCase(pkg.nombrePaquete || pkg.nombre || '')
    }));
  },

  apiToUiCatalogList(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => {
      const nombreFormateado = formatTitleCase(
        item.nombreProducto || item.nombre || item.nombreServicio || item.label || ''
      );
      return {
        id: item.idProducto || item.idServicio || item.id,
        label: nombreFormateado,
        examen: nombreFormateado,
        codigoExamen: item.codigoProducto || item.codigo || item.codigoServicio || 'S/C',
        tipoExamen: item.idPuntoCarga !== undefined ? String(item.idPuntoCarga) : '1',
        precioVenta: item.precioVenta || 0.00,
        diagnosticosAsociados: []
      };
    });
  }
};