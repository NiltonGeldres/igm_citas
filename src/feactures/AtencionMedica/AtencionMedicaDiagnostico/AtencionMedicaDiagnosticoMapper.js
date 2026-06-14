// src/components/AtencionMedicaDiagnostico/AtencionMedicaDiagnosticoMapper.js

export const AtencionMedicaDiagnosticoMapper = {
  
  /**
   * Transforma un registro crudo de la API (catálogo o registro guardado)
   * a la estructura única y estandarizada que consume la interfaz de usuario.
   */
  apiToUiItem: (apiItem) => {
    if (!apiItem) return null;
    
    return {
      // Usamos el ID de la API directamente mapeado para mantener la persistencia relacional
      id: apiItem.idDiagnosticoApi?.toString() || '', 
      label: apiItem.descripcionCie || '',
      diagnostico: apiItem.descripcionCie || '',
      codigoCIE: apiItem.codigoAlfa || '',
      clasificacion: apiItem.clasificacion || '' // Si es catálogo vendrá "", si está guardado vendrá su tipo
    };
  },

  /**
   * Transforma listas de ítems del catálogo de búsqueda (AutoComplete).
   */
  apiToUiCatalogList: (apiList) => {
    if (!Array.isArray(apiList)) return [];
    return apiList.map(AtencionMedicaDiagnosticoMapper.apiToUiItem).filter(Boolean);
  },

  /**
   * Transforma listas de registros clínicos ya guardados en la HCE del paciente.
   */
  apiToUiRecordList: (apiList) => {
    if (!Array.isArray(apiList)) return [];
    return apiList.map(AtencionMedicaDiagnosticoMapper.apiToUiItem).filter(Boolean);
  }
};