// src/components/Medicacion/AtencionMedicaMedicamentoMapper.js

export const AtencionMedicaMedicamentoMapper = {
  /**
   * Mapea un elemento de la lista de CABECERAS DE PAQUETES.
   */
  apiToUiPackageItem: (item) => {
    if (!item) return null;

    return {
      id: item.idPaqueteMedicacion || item.idPaquete || item.id,
      label: item.nombrePaquete || item.descripcion || '',
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
    if (!item) return null;

    return {
      id: item.idProducto || item.id,
      label: item.nombreComercial || item.nombre || '',
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
  }
};