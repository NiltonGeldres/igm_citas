/**
 * Mapper para el panel de Diagnósticos (CIE-10).
 */

export const AtencionMedicaDiagnosticoMapper = {

  /**
   * Mapea un elemento individual proveniente de la API (Catálogo o Atencion Registrada) a la UI.
   */
  apiToUiItem: (item) => {
    if (!item) return null;
      console.log("MAPPER CONTENIDO DIAGNOSTICO ITEM  "+JSON.stringify(item))

    return {
      // Garantizamos id único y legible para React
      id: Number(item.idDiagnostico ?? 0),
      label: item.descripcion || item.descripcionCie || item.label || '',
      diagnostico: item.descripcion || item.descripcionCie || '',
      codigoCIE: item.codigoCie || item.codigoAlfa || item.codigoCIE || 'S/C',
      // Soporta tanto ID numérico de subclasificación como String previa
      clasificacion: item.idSubclasificacion ?? item.clasificacion ?? '',
      idDiagnosticoSubclasificacion: item.idSubclasificacion 
    };
  },

  /**
   * 1. De API a FRONT (Lectura al abrir atención o buscar catálogo)
   */
  apiToUiCatalogList: (apiList) => {
    if (!Array.isArray(apiList)) return [];
    return apiList.map(AtencionMedicaDiagnosticoMapper.apiToUiItem).filter(Boolean);
  },

  apiToUiRecordList: (dataAtencion) => {
    // Si recibe el objeto global de atención médica
    const lista = Array.isArray(dataAtencion) 
      ? dataAtencion 
      : (dataAtencion?.diagnosticos || []);
      console.log("MAPPER CONTENIDO DIAGNOSTICO "+JSON.stringify(lista))

    return lista.map(AtencionMedicaDiagnosticoMapper.apiToUiItem).filter(Boolean);
  },

  /**
   * 2. De FRONT a API (Escritura / Guardado a la BD)
   */
  uiToApiDiagnosticos: (panelDiagnosticos) => {
    if (!Array.isArray(panelDiagnosticos)) return [];

    return panelDiagnosticos.map(item => ({
      idDiagnostico: Number(item.id ?? 0),
      codigoCie: item.codigoCIE || '',
      descripcionCie: item.label || item.diagnostico || '',
      idDiagnosticoSubclasificacion: item.clasificacion ? Number(item.clasificacion) : null
    }));
  }
};

/*
// src/components/AtencionMedicaDiagnostico/AtencionMedicaDiagnosticoMapper.js

export const AtencionMedicaDiagnosticoMapper = {
  

   // Transforma un registro crudo de la API (catálogo o registro guardado)
   //* a la estructura única y estandarizada que consume la interfaz de usuario.

  apiToUiItem: (apiItem) => {
    if (!apiItem) return null;
    
    return {
      // Usamos el ID de la API directamente mapeado para mantener la persistencia relacional
      id: apiItem.idDiagnostico?.toString() || '', 
//      id: apiItem.idDiagnosticoApi?.toString() || '', 
      label: apiItem.descripcion || '',
//      label: apiItem.descripcionCie || '',
      diagnostico: apiItem.descripcionCie || '',
//      codigoCIE: apiItem.codigoAlfa || '',
      codigoCIE: apiItem.codigoCie || '',
      clasificacion: apiItem.clasificacion || '' // Si es catálogo vendrá "", si está guardado vendrá su tipo
    };
  },

  
   //* Transforma listas de ítems del catálogo de búsqueda (AutoComplete).
     apiToUiCatalogList: (apiList) => {
    if (!Array.isArray(apiList)) return [];
    return apiList.map(AtencionMedicaDiagnosticoMapper.apiToUiItem).filter(Boolean);
  },

  
  // * Transforma listas de registros clínicos ya guardados en la HCE del paciente.
  
  apiToUiRecordList: (apiList) => {
    if (!Array.isArray(apiList)) return [];
    return apiList.map(AtencionMedicaDiagnosticoMapper.apiToUiItem).filter(Boolean);
  }
};
*/