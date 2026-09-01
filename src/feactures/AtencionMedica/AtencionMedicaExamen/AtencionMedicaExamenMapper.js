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
 /* 
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
          (d) => String(d.id) === String(item.idDiagnostico)
        );
  //      dxCodigo = dxEncontrado ? (dxEncontrado.codigoCIE || dxEncontrado.codigo) : String(item.idDiagnostico);
        console.log("dxEncontrado   "+JSON.stringify(dxEncontrado))
        dxCodigo = dxEncontrado ? (dxEncontrado.id || dxEncontrado.codigo) : String(item.idDiagnostico);
        console.log("dxCodigo  "+JSON.stringify(dxCodigo))
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

 */

  apiToUiExamenes(examenesApi = [], listaDiagnosticosDisponibles = []) {
    if (!Array.isArray(examenesApi) || examenesApi.length === 0) return [];

    const agrupadosMap = new Map();

    examenesApi.forEach((item) => {
      const idProd = item.idProducto || item.id;
      const nombreFormateado = formatTitleCase(
        item.label || item.examen || item.nombreProducto ||  ''
      );

      // 1. Extraer el ID numérico del diagnóstico (prioriza diagnosticosAsociados[0] y luego idDiagnostico)
      const idDxRelacion = Array.isArray(item.diagnosticosAsociados) && item.diagnosticosAsociados.length > 0
        ? item.diagnosticosAsociados[0]
        : (item.idDiagnostico || null);

      // 2. COMPARACIÓN: Buscar en la lista de diagnósticos usando EXCLUSIVAMENTE el ID
      let dxEncontrado = null;
      if (idDxRelacion) {
        dxEncontrado = listaDiagnosticosDisponibles.find(
          (d) => String(d.idDiagnostico || d.id) === String(idDxRelacion)
        );
      }

      // 3. RENDERIZADO UI: Extraer el codigoCIE del diagnóstico encontrado para la vista
      const codigoCIEParaUI = dxEncontrado 
        ? (dxEncontrado.codigoCIE || dxEncontrado.codigo) 
        : (item.codigoCIE || '');

      const idDxFinal = dxEncontrado 
        ? (dxEncontrado.idDiagnostico || dxEncontrado.id) 
        : idDxRelacion;

      // 4. Construcción del contrato para el Panel
      if (!agrupadosMap.has(idProd)) {
        agrupadosMap.set(idProd, {
          id: idProd,
          idProducto: idProd,
          label: nombreFormateado,
          examen: nombreFormateado,
          codigoExamen: item.codigoExamen || item.codigoProducto || item.codigo || 'S/C',
          tipoExamen: String(item.tipoExamen || item.idPuntoCarga || '1'),
          cantidad: item.cantidad || 1,
          observacion: item.observacion || '',
          
          // Datos de Vinculación y Renderizado
          idDiagnostico: idDxFinal ? Number(idDxFinal) : null, // ID para la relación/lógica
          codigoCIE: codigoCIEParaUI,                          // Código CIE para pintar en el badge
          diagnosticosAsociados: idDxFinal ? [Number(idDxFinal)] : []
        });
      } else {
        const existente = agrupadosMap.get(idProd);
        if (idDxFinal && !existente.diagnosticosAsociados.includes(Number(idDxFinal))) {
          existente.diagnosticosAsociados.push(Number(idDxFinal));
        }
        if (!existente.idDiagnostico && idDxFinal) {
          existente.idDiagnostico = Number(idDxFinal);
          existente.codigoCIE = codigoCIEParaUI;
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