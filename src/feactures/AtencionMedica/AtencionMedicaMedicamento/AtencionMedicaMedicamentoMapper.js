// src/components/Medicacion/AtencionMedicaMedicamentoMapper.js
const formatTitleCase = (str) => {
  if (!str) return '';
  const cleanStr = String(str).trim().toLowerCase();
  return cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1);
};


export const AtencionMedicaMedicamentoMapper = {
  
  /**
   * Mapea un medicamento REGISTRADO (receta previa de una atención a modificar).
   */
  apiToUiRegisteredItem: (item, listaDiagnosticos = []) => {
    if (!item) return null;

    // Resolver vinculación con el diagnóstico
    const idDxOrigen = item.idDiagnostico || item.idDiagnosticoAsociado;
    const dxEncontrado = listaDiagnosticos.find(
      (d) => String(d.id || d.idDiagnostico) === String(idDxOrigen)
    );
    const idDxFinal = dxEncontrado 
      ? (dxEncontrado.idDiagnostico || dxEncontrado.id) 
      : (idDxOrigen || null);

    const nombreRaw = item.indicaciones || item.nombreProducto || item.descripcion || item.label || '';

    return {
      ...item,
      // Key/ID único para la UI
      id: item.idDetalleAtencionMedicamento || item.id || `med-${item.idProducto}-${Date.now()}`,
      
      // IDs Clave
      idProducto: item.idProducto || item.id_producto || item.idMedicamento,
      idDiagnostico: idDxFinal,

      // Texto formateado
      descripcion: formatTitleCase(nombreRaw),

      // Mapeo seguro de campos de BD a la UI
      dosis: item.cantidadDosis !== undefined ? String(item.cantidadDosis) : (item.dosis || '1'),
      frecuencia: item.idFrecuenciaDosis !== undefined ? item.idFrecuenciaDosis : (item.frecuencia || 24),
      periodo: item.cantidadPeriodo !== undefined ? item.cantidadPeriodo : (item.periodo || 7),
      cantidad: item.cantidadTotal !== undefined ? item.cantidadTotal : (item.cantidad || 1),

      // Vía de Administración
      idViaAdministracion: item.idViaAdministracion || item.idVia || item.idViaDefault || null,
      via: item.nombreViaAdministracion || item.via || 'Oral'
    };
  },

  /**
   * Mapea el listado de medicamentos REGISTRADOS.
   */
  apiToUiRegisteredList: (apiList, listaDiagnosticos = []) => {
    if (!Array.isArray(apiList)) return [];
    return apiList
      .map(item => AtencionMedicaMedicamentoMapper.apiToUiRegisteredItem(item, listaDiagnosticos))
      .filter(Boolean);
  },

  /**
   * Mapea un elemento de la lista de CABECERAS DE PAQUETES.
   */
  apiToUiPackageItem: (item) => {
    if (!item) return null;
      const nombreRaw = item.nombrePaquete ;
    return {
      id: item.idPaqueteMedicacion || item.idPaquete || item.id,
      label: formatTitleCase(nombreRaw),
    };
  },

  /**
   * Mapea el arreglo de CABECERAS DE PAQUETES.
   */
  apiToUiPackageList: (apiList) => {
    if (!Array.isArray(apiList)) return [];
    return apiList.map(item => AtencionMedicaMedicamentoMapper.apiToUiPackageItem(item));
  },



  /**
   * Mapea un PRODUCTO/MEDICAMENTO dentro del detalle.
   */
  apiToUiCatalogItem: (item) => {
    console.log("MEDICAMENTO ITEM "+JSON.stringify(item))
    if (!item) return null;
      const nombreRaw = item.nombreComercial || item.nombre || '';
      const labelFormateado = formatTitleCase(nombreRaw);

    return {
      id: item.idProducto ,
      idProducto: item.idProducto ,
      label: labelFormateado,
      codigo: item.codigo || '',
      concentracion: item.concentracion || '',
      formaFarmaceutica: item.formaFarmaceutica || '',
      presentacion: item.presentacion || '',
      idViaDefault: item.idViaDefault ?? null,
      dosisDefault: item.dosis || '',
      frecuenciaDefault: item.frecuencia || '',
      duracionDiasDefault: item.duracionDias || null,
      cantidadPredefinida: item.cantidadPredefinida || 1,
      raw: item
    };
  },

  /**
   * Mapea la lista de PRODUCTOS/MEDICAMENTOS.
   */
  apiToUiCatalogList: (apiList) => {
    if (!Array.isArray(apiList)) return [];
    return apiList.map(item => AtencionMedicaMedicamentoMapper.apiToUiCatalogItem(item));
  },



};