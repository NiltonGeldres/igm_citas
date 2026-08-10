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

/*

// AtencionMedicaTriajeService.js

// 🧪 MOCKUP A: El backend devuelve N cantidad de registros base iniciales activos (Ejm: 3 registros)
const MOCK_RESPONSE_NO_ATENDIDO = [
  { id: 1, nombre: 'Temperatura', unidad: '°C', checked: true, valor: '', placeholder: '36.5', prioridad: 1 },
  { id: 2, nombre: 'Peso', unidad: 'kg', checked: true, valor: '', placeholder: '70.0', prioridad: 6 },
  { id: 3, nombre: 'Talla', unidad: 'cm', checked: true, valor: '', placeholder: '165', prioridad: 7 },
];

// 🧪 MOCKUP B: Si trae datos guardados de una atención previa, expone su lista histórica completa
const MOCK_RESPONSE_ATENDIDO = [
  { id: 1, nombre: 'Temperatura', unidad: '°C', checked: true, valor: '37.2', placeholder: '36.5', prioridad: 1 },
  { id: 2, nombre: 'Peso', unidad: 'kg', checked: true, valor: '68.5', placeholder: '70.0', prioridad: 6 },
  { id: 3, nombre: 'Talla', unidad: 'cm', checked: true, valor: '158', placeholder: '165', prioridad: 7 },
  { id: 4, nombre: 'Presión Arterial', unidad: 'mmHg', checked: true, valor: '130/85', placeholder: '120/80', prioridad: 2 },
  { id: 5, nombre: 'Frecuencia Cardíaca', unidad: 'lpm', checked: true, valor: '82', placeholder: '75', prioridad: 3 },
  { id: 6, nombre: 'Frecuencia Respiratoria', unidad: 'rpm', checked: true, valor: '19', placeholder: '18', prioridad: 4 },
  { id: 7, merge: 'Saturación de Oxígeno', nombre: 'Saturación de Oxígeno', unidad: '%', checked: true, valor: '97', placeholder: '98', prioridad: 5 },
];

// 🧪 MOCKUP C: Catálogo Maestro unificado con IDs fijos de la institución
const MOCK_CATALOGO_BUSQUEDA = [
  { id: 1, nombre: 'Temperatura', unidad: '°C', placeholder: '36.5' },
  { id: 2, nombre: 'Peso', unidad: 'kg', placeholder: '70.0' },
  { id: 3, nombre: 'Talla', unidad: 'cm', placeholder: '165' },
  { id: 4, nombre: 'Presión Arterial', unidad: 'mmHg', placeholder: '120/80' },
  { id: 5, nombre: 'Frecuencia Cardíaca', unidad: 'lpm', placeholder: '75' },
  { id: 6, nombre: 'Frecuencia Respiratoria', unidad: 'rpm', placeholder: '18' },
  { id: 7, nombre: 'Saturación de Oxígeno', unidad: '%', placeholder: '98' },
  { id: 8, nombre: 'Perímetro Abdominal', unidad: 'cm', placeholder: '85' },
  { id: 9, nombre: 'Índice de Masa Corporal (IMC)', unidad: 'kg/m²', placeholder: '24.2' },
  { id: 10, nombre: 'Temperatura Axilar', unidad: '°C', placeholder: '36.2' },
  { id: 11, nombre: 'Hemoglobina', unidad: 'g/dL', placeholder: '13.5' },
  { id: 12, nombre: 'Glucosa Capilar', unidad: 'mg/dL', placeholder: '95' }
];

export const AtencionMedicaTriajeService = {
  obtenerTriajePorPaciente: async (idPaciente, accionAgenda = 'ATENDER') => {
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      try {
        const response = await fetch(`/api/atencion-medica/triaje/${idPaciente}`);
        if (!response.ok) throw new Error("Error HTTP");
        const data = await response.json();
        return data.signosVitales || data;
      } catch (error) {
        console.error("⚠️ Falló API, usando fallback:", error);
        return JSON.parse(JSON.stringify(MOCK_RESPONSE_NO_ATENDIDO));
      }
    } else {
      return JSON.parse(JSON.stringify(accionAgenda === 'ACTUALIZAR' ? MOCK_RESPONSE_ATENDIDO : MOCK_RESPONSE_NO_ATENDIDO));
    }
  },

  buscarEnCatalogo: async (textoBusqueda, signosVisiblesActuales = []) => {
    if (!textoBusqueda || textoBusqueda.trim() === '') return [];
    
    const isProduction = process.env.NODE_ENV === 'production';
    const query = textoBusqueda.toLowerCase().trim();
    
    // 🛡️ CONTROL ANTI-DUPLICADOS: Mapeamos los nombres de los parámetros activos en pantalla
    const nombresYaVisibles = signosVisiblesActuales.map(x => x.nombre.toLowerCase());

    if (isProduction) {
      try {
        const response = await fetch(`/api/atencion-medica/triaje/buscar?term=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data
          .map(item => ({ id: item.id, label: item.nombre, unidad: item.unidad, placeholder: item.placeholder }))
          .filter(item => !nombresYaVisibles.includes(item.label.toLowerCase()));
      } catch (error) {
        return [];
      }
    } else {
      return MOCK_CATALOGO_BUSQUEDA
        .filter(item => item.nombre.toLowerCase().includes(query))
        .map(item => ({ 
          id: item.id, 
          label: item.nombre, 
          unidad: item.unidad, 
          placeholder: item.placeholder 
        }))
        // Quita de la lista de resultados de búsqueda lo que ya se está mostrando en la pantalla
        .filter(item => !nombresYaVisibles.includes(item.label.toLowerCase()));
    }
  }
};

*/