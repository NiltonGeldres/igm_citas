// src/components/Medicacion/AtencionMedicaMedicamentoService.js
import axios from "axios";
import header from "../../../shared/utils/Header";
import { AtencionMedicaMedicamentoMapper } from './AtencionMedicaMedicamentoMapper';
import AuthService from "../../../master-data/services/auth.service";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_BIENES_BUSCAR = API_URL + "/api/v1/catalogos/bienes/buscar";
const SERVICE_PAQUETE_DETALLE = API_URL + "/api/v1/catalogos/bienes/paquete/detalle";

const PAGINACION_DEFAULT = {
  PAGINA_ACTUAL: 1,
  TAMANO_PAGINA: 30,
  TIPO_PRODUCTO: 0,
  ID_ENTIDAD_DEFAULT: 2
};

// =========================================================================
// 🚀 CACHÉ EN MEMORIA DEL FRONTEND
// =========================================================================
const cacheBusquedaIndividual = new Map();
const cacheDetallePaquetes = new Map();

// =========================================================================
// 🔬 MOCKS DE DESARROLLO
// =========================================================================

const MOCK_LISTA_PAQUETES = [
  { idPaqueteMedicacion: 'pkg-med-01', nombrePaquete: 'Esquema Erradicación H. Pylori Mockito ' },
  { idPaqueteMedicacion: 'pkg-med-02', nombrePaquete: 'Soporte Básico Urología Mockito ' }
];

const MOCK_DETALLE_PAQUETE_RESPONSE = {
  'pkg-med-01': [
    { idProducto: 7253, nombre: 'Omeprazol 20mg Mockito ', codigo: '06519', dosis: '20.0', frecuencia: 'C/12H', duracionDias: 14, cantidadPredefinida: 28 },
    { idProducto: 5288, nombre: 'Amoxicilina 500mg Mockito ', codigo: '04415', dosis: '1000.0', frecuencia: 'C/12H', duracionDias: 14, cantidadPredefinida: 56 }
  ],
  'pkg-med-02': [
    { idProducto: 962, nombre: 'EQUIPO DE VENOCLISIS UNI Mockito ', codigo: '10929', dosis: '', frecuencia: '', duracionDias: null, cantidadPredefinida: 1 }
  ]
};

const MOCK_CATALOGO_BUSQUEDA = [
  { idProducto: 2001, codigo: "MED001", nombreComercial: "Omeprazol 20mg Mockito ", concentracion: "20mg", formaFarmaceutica: "Cápsula", presentacion: "Caja x 100" },
  { idProducto: 2002, codigo: "MED002", nombreComercial: "Amoxicilina 500mg Mockito ", concentracion: "500mg", formaFarmaceutica: "Tableta", presentacion: "Caja x 50" },
  { idProducto: 2003, codigo: "MED003", nombreComercial: "Loratadina 10mg Mockito ", concentracion: "10mg", formaFarmaceutica: "Tableta", presentacion: "Caja x 30" }
];

// =========================================================================
// ⚙️ FUNCIONES AUXILIARES
// =========================================================================

const obtenerCatalogoPaquetesDesdeCache = () => {
  try {
    const stored = sessionStorage.getItem('catalogo_global');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.catalogoPaquetesMedicacion || parsed?.paquetes || [];
    }
  } catch (e) {
    console.warn("⚠️ No se pudo leer el catálogo global desde sessionStorage:", e);
  }
  return [];
};

// =========================================================================
// 📦 PROCESO 1: PAQUETES DE MEDICACIÓN (CON CACHÉ)
// =========================================================================

const obtenerListaPaquetes = async () => {
  const isProduction = process.env.REACT_APP_NODE_ENV === 'production';

  if (!isProduction) {
    return AtencionMedicaMedicamentoMapper.apiToUiPackageList(MOCK_LISTA_PAQUETES);
  }

  const paquetesCache = obtenerCatalogoPaquetesDesdeCache();
  return AtencionMedicaMedicamentoMapper.apiToUiPackageList(paquetesCache);
};

const obtenerProductosPorPaquete = async (idPaquete) => {
  if (!idPaquete) return [];

  const idKey = String(idPaquete);

  // ⚡ 1. Verificar Caché en Frontend
  if (cacheDetallePaquetes.has(idKey)) {
    return cacheDetallePaquetes.get(idKey);
  }

  const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
  let resultado = [];

  if (!isProduction) {
    const productosRaw = MOCK_DETALLE_PAQUETE_RESPONSE[idKey] || [];
    resultado = AtencionMedicaMedicamentoMapper.apiToUiCatalogList(productosRaw);
  } else {
    try {
      const response = await axios.get(SERVICE_PAQUETE_DETALLE, {
        params: { idPaquete: idKey },
        headers: header()
      });

      let resultadoJson = response.data;
      if (typeof resultadoJson === 'string') {
        try { resultadoJson = JSON.parse(resultadoJson); } catch (e) {}
      }

      const listaProductos = Array.isArray(resultadoJson) 
        ? resultadoJson 
        : (resultadoJson?.data || resultadoJson?.items || []);

      resultado = AtencionMedicaMedicamentoMapper.apiToUiCatalogList(listaProductos);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        AuthService.logout();
        window.location.href = "/login";
      }
      console.error(`❌ Error al obtener detalle del paquete ${idKey}:`, error);
      return [];
    }
  }

  // ⚡ 2. Guardar en Caché
  cacheDetallePaquetes.set(idKey, resultado);
  return resultado;
};

// =========================================================================
// 🔍 PROCESO 2: BÚSQUEDA POR NOMBRE (CON CACHÉ)
// =========================================================================

const buscarMedicamentosCatalogo = async (query, idEntidadOverride) => {
  const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
  const cleanQuery = (query || '').trim();

  if (!cleanQuery) return [];

  const entidadGlobal = idEntidadOverride || 
                        (typeof window !== 'undefined' && window.idEntidadGlobal) || 
                        JSON.parse(localStorage.getItem('usuario') || '{}').idEntidad || 
                        PAGINACION_DEFAULT.ID_ENTIDAD_DEFAULT;

  // Clave única para la memoria asociando Entidad + Término de búsqueda
  const cacheKey = `${entidadGlobal}_${cleanQuery.toLowerCase()}`;

  // ⚡ 1. Verificar Caché en Frontend
  if (cacheBusquedaIndividual.has(cacheKey)) {
    return cacheBusquedaIndividual.get(cacheKey);
  }

  let resultado = [];

  if (isProduction) {
    try {
      const params = {
        idEntidad: entidadGlobal,
        termino: cleanQuery,
        tipoProducto: PAGINACION_DEFAULT.TIPO_PRODUCTO,
        tamanoPagina: PAGINACION_DEFAULT.TAMANO_PAGINA,
        paginaActual: PAGINACION_DEFAULT.PAGINA_ACTUAL,
      };

      const response = await axios.get(SERVICE_BIENES_BUSCAR, {
        params,
        headers: header()
      });

      const resultadoJson = response.data;
      if (resultadoJson && resultadoJson.estado === 'EXITO' && Array.isArray(resultadoJson.data)) {
        resultado = AtencionMedicaMedicamentoMapper.apiToUiCatalogList(resultadoJson.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        AuthService.logout();
        window.location.href = "/login";
      }
      console.error("❌ Error al buscar medicamentos en el catálogo (Producción):", error);
      return [];
    }
  } else {
    // Modo Desarrollo: Filtra los mocks locales
    resultado = await new Promise((resolve) => {
      setTimeout(() => {
        const filtrados = MOCK_CATALOGO_BUSQUEDA.filter(item =>
          item.nombreComercial.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          item.codigo.toLowerCase().includes(cleanQuery.toLowerCase())
        );
        resolve(AtencionMedicaMedicamentoMapper.apiToUiCatalogList(filtrados));
      }, 200);
    });
  }

  // ⚡ 2. Guardar en Caché tras la primera respuesta
  cacheBusquedaIndividual.set(cacheKey, resultado);

  return resultado;
};

// Limpieza manual de caché cuando cambie la sesión/entidad si es requerido
const limpiarCacheLocal = () => {
  cacheBusquedaIndividual.clear();
  cacheDetallePaquetes.clear();
};

export const AtencionMedicaMedicamentoService = {
  obtenerListaPaquetes,
  obtenerProductosPorPaquete,
  buscarMedicamentosCatalogo,
  limpiarCacheLocal
};

