import header from "../../../shared/utils/Header";
import axios from "axios";
import AuthService from "../../../master-data/services/auth.service";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_TRIAJE = "/atencion-medica/triaje";

// Función auxiliar para extraer el catálogo de triajes del caché global de la API
const obtenerCatalogoTriajesDesdeCache = () => {
  try {
    const stored = sessionStorage.getItem('catalogo_global');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.catalogoTriajes || [];
    }
  } catch (e) {
    console.warn("⚠️ No se pudo leer el catálogo global:", e);
  }
  return [];
};

export const AtencionMedicaTriajeService = {
  
  /**
   * Obtiene los signos vitales según el flujo del negocio:
   * - Si no hay idAtencion (Primera vez / ATENDER): Genera la estructura inicial predeterminada desde el Catálogo Global.
   * - Si hay idAtencion y el estado es ACTUALIZAR o FIRMADO: Consulta el registro existente en el backend.
   */
  obtenerTriajePorPaciente: async (idAtencion, accionAgenda = 'ATENDER') => {
    try {
      // 1. Si es la primera vez (no tiene idAtencion y la acción es ATENDER), generamos el triaje base desde el catálogo
      if (accionAgenda === 'ATENDER' ) {
        const catalogo = obtenerCatalogoTriajesDesdeCache();
        console.log("CATALOGO  "+JSON.stringify(catalogo))
        if (catalogo.length > 0) {
          console.log("⚡ [Primera Atención]: Generando triaje inicial predeterminado desde el Catálogo Global.");
          return catalogo
            .filter(item => item.prioridad == 1) // Registros base predeterminados (Ej: Temperatura, Peso, Talla)
            .map(item => ({
              id: item.idTriaje,
              nombre: item.nombreTriaje,
              unidad: item.um || '',
              checked: true,
              valor: '',
              placeholder: '',
              prioridad: item.prioridad
            }));
        }
      }

      // 2. Si ya fue registrado previamente (tiene idAtencion), consultamos la información ya guardada (para actualizar o cerrado/firmado)
      const response = await axios.post(`${API_URL}${SERVICE_TRIAJE}/${idAtencion}`, {}, { headers: header() });
      const data = response.data;
      return data.signosVitales || data;
      
    } catch (error) {
      console.warn("⚠️ Falló API de triaje, aplicando respaldo del catálogo o datos vacíos:", error);
      
      // Fallback de emergencia si falla la red en una atención nueva
      if (accionAgenda === 'ATENDER') {
        const catalogo = obtenerCatalogoTriajesDesdeCache();
        if (catalogo.length > 0) {
          return catalogo
            .filter(item => item.prioridad <= 3)
            .map(item => ({
              id: item.idTriaje,
              nombre: item.nombreTriaje,
              unidad: item.um || '',
              checked: true,
              valor: '',
              placeholder: '',
              prioridad: item.prioridad
            }));
        }
      }

      return [];
    }
  },

  /**
   * Búsqueda en tiempo real o en caché sobre el catálogo global de triajes
   */
  buscarEnCatalogo: async (textoBusqueda, signosVisiblesActuales = []) => {
    if (!textoBusqueda || textoBusqueda.trim() === '') return [];
    
    const query = textoBusqueda.toLowerCase().trim();
    const nombresYaVisibles = signosVisiblesActuales.map(x => x.nombre.toLowerCase());

    // 1. Búsqueda rápida en la caché del navegador (sessionStorage)
    const catalogo = obtenerCatalogoTriajesDesdeCache();
    const resultadosCache = catalogo
      .filter(item => item.nombreTriaje.toLowerCase().includes(query))
      .map(item => ({ 
        id: item.idTriaje, 
        label: item.nombreTriaje, 
        unidad: item.um, 
        placeholder: '' 
      }))
      .filter(item => !nombresYaVisibles.includes(item.label.toLowerCase()));

    if (resultadosCache.length > 0) return resultadosCache;

    // 2. Respaldo consultando directamente a la API de búsqueda
    try {
        const response = await axios.post(`${API_URL}${SERVICE_TRIAJE}/buscar`, { term: query }, { headers: header() });
        const data = response.data.catalogoTriajes || [];
        return data
            .map(item => ({ id: item.idTriaje, label: item.nombreTriaje, unidad: item.um }))
            .filter(item => !nombresYaVisibles.includes(item.label.toLowerCase()));
    } catch (error) {
        console.warn("⚠️ Error al buscar en API de catálogo:", error);
        return [];
    }
  }
};

export default AtencionMedicaTriajeService;

