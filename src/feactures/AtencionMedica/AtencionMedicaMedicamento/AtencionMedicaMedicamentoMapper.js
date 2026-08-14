// src/components/Medicacion/AtencionMedicaMedicamentoMapper.js

export const AtencionMedicaMedicamentoMapper = {
  /**
   * Mapea un elemento individual del catálogo de medicamentos/bienes.
   * @param {Object} item - Objeto proveniente de la API o del Mock.
   * @returns {Object|null} Objeto formateado para la UI.
   */
  apiToUiCatalogItem: (item) => {
    if (!item) return null;

    return {
      id: item.idProducto,
      label: item.nombreComercial || item.nombre || '',
      codigo: item.codigo || '',
      concentracion: item.concentracion || '',
      formaFarmaceutica: item.formaFarmaceutica || '',
      presentacion: item.presentacion || '',
      idViaDefault: item.idViaDefault ?? null,
      
      // Conserva el objeto original por si se requiere en un flujo posterior
      raw: item
    };
  },

  /**
   * Mapea la lista de elementos devuelta por el backend al formato requerido por la UI.
   * @param {Array} apiList - Arreglo de objetos "data" de la respuesta JSON.
   * @returns {Array} Arreglo formateado para componentes de UI.
   */
  apiToUiCatalogList: (apiList) => {
    // 🛡️ Mantiene la validación en el Mapper para evitar fallos con .map()
    if (!Array.isArray(apiList)) return [];

    return apiList.map(item => AtencionMedicaMedicamentoMapper.apiToUiCatalogItem(item));
  }
};

