import header from "../../../shared/utils/Header";
import axios from "axios";
//import AuthService from "../../../master-data/services/auth.service";
import { AtencionMedicaTriajeMapper } from "./AtencionMedicaTriajeMapper";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_TRIAJE = "/atencion-medica/triaje";
const ES_PRODUCCION = process.env.REACT_APP_NODE_ENV === 'production';

// Mocks puros solo para entornos de desarrollo/pruebas si no hay caché ni datos
const MOCK_DATOS_GLOBALES_TRIAJE = [
  { idTriaje: 50, nombreTriaje: "Peso (kg)", prioridad: 1 },
  { idTriaje: 51, nombreTriaje: "Talla (cm)", prioridad: 2 },
  { idTriaje: 52, nombreTriaje: "Temperatura (°C)", prioridad: 3 },
  { idTriaje: 53, nombreTriaje: "Presión Arterial (mmHg)", prioridad: 4 },
  { idTriaje: 54, nombreTriaje: "Frecuencia Cardíaca (lpm)", prioridad: 5 }
];

const MOCK_TRIAJE_ATENCION_REGISTRADA = [
  { idTriaje: 50, valorTriaje: "60", nombreTriaje: "Peso (kg)" },
  { idTriaje: 51, valorTriaje: "165", nombreTriaje: "Talla (cm)" }
];


// Configuración de visualización por defecto para signos vitales estándar


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
  
  obtenerTriajePorPaciente: (datosGlobalesParam = null) => {
      // 1. Usa el parámetro si se recibe; de lo contrario lee el caché global
      let catalogo = obtenerCatalogoTriajesDesdeCache() || datosGlobalesParam ;
      // 2. Si no hay datos y NO es producción, aplica Fallback de Mock
      if ((!Array.isArray(catalogo) || catalogo.length === 0) && !ES_PRODUCCION) {
        catalogo = MOCK_DATOS_GLOBALES_TRIAJE;
      }

      if (!Array.isArray(catalogo) || catalogo.length === 0) return [];

      // 3. Regla de Negocio: Filtrar prioridades <= 5
      const prioritariosApi = catalogo.filter(item => item.prioridad && item.prioridad == 1);
      const x =AtencionMedicaTriajeMapper.transformarApiALFront(prioritariosApi);
      console.log("TRIAJES "+JSON.stringify(x));
      return x;
    },
    

  /**
   * Obtiene los signos vitales según el flujo del negocio:
   * - Si no hay idAtencion (Primera vez / ATENDER): Genera la estructura inicial predeterminada desde el Catálogo Global.
   * - Si hay idAtencion y el estado es ACTUALIZAR o FIRMADO: Consulta el registro existente en el backend.
   */
  obtenerTriajePorPaciente1: async (idAtencion, accionAgenda = 'ATENDER') => {
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

