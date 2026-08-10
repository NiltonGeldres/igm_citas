// src/components/Medicacion/AtencionMedicaMedicamentoMapper.js

export const AtencionMedicaMedicamentoMapper = {
  /**
   * Mapea la lista de elementos del catálogo de medicamentos/bienes 
   * devuelta por el backend al formato requerido por la interfaz de usuario.
   * @param {Array} apiList - Arreglo de objetos "data" de la respuesta JSON
   * @returns {Array} Arreglo formateado para componentes de UI
   */
  apiToUiCatalogList: (apiList) => {
    if (!Array.isArray(apiList)) return [];

    return apiList.map(item => ({
      id: item.idProducto,
      label: item.nombreComercial || item.nombre,
      codigo: item.codigo,
      concentracion: item.concentracion,
      formaFarmaceutica: item.formaFarmaceutica,
      presentacion: item.presentacion,
      idViaDefault: item.idViaDefault,
      raw: item // Conserva el objeto original por si se requiere en un flujo posterior
    }));
  }
};