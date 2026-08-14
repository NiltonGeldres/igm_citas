
// src/components/Medicacion/AtencionMedicaMedicamentoService.js
import axios from "axios";
import header from "../../../shared/utils/Header";
import { AtencionMedicaMedicamentoMapper } from './AtencionMedicaMedicamentoMapper';

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_BIENES_BUSCAR = `${API_URL}/api/v1/catalogos/bienes/buscar`;

const PAGINACION_DEFAULT = {
  PAGINA_ACTUAL: 1,
  TAMANO_PAGINA: 30,
  TIPO_PRODUCTO: 0,
  ID_ENTIDAD_DEFAULT: 2,
};

// =========================================================================
// 🔬 MOCKS DE DESARROLLO
// =========================================================================
const MOCK_CATALOGO_PAQUETES_MEDICACION = [
  {
    id: 'pkg-med-01',
    nombrePaquete: 'Esquema Erradicación H. Pylori',
    medicamentosAsociados: [
      { 
        id: 'med-p1', 
        descripcion: 'Omeprazol 20mg', 
        dosis: '20.0', 
        frecuencia: 2, 
        periodo: 14, 
        cantidad: 28, 
        via: 'Oral' },



      { id: 'med-p2', descripcion: 'Amoxicilina 500mg', dosis: '1000.0', frecuencia: 2, periodo: 14, cantidad: 56, via: 'Oral' }
    ]
  }
];

const MOCK_CATALOGO_BUSQUEDA = [
  { idProducto: 2001, codigo: "MED001", nombreComercial: "Omeprazol 20mg", concentracion: "20mg", formaFarmaceutica: "Cápsula", presentacion: "Caja x 100" },
  { idProducto: 2002, codigo: "MED002", nombreComercial: "Amoxicilina 500mg", concentracion: "500mg", formaFarmaceutica: "Tableta", presentacion: "Caja x 50" },
  { idProducto: 2003, codigo: "MED003", nombreComercial: "Loratadina 10mg", concentracion: "10mg", formaFarmaceutica: "Tableta", presentacion: "Caja x 30" }
];

// =========================================================================
// 📡 CORE DEL SERVICIO
// =========================================================================
export const AtencionMedicaMedicamentoService = {

  obtenerPaquetesDisponibles: async () => {
    const isProduction = process.env.REACT_APP_NODE_ENV === 'production';

    if (isProduction) {
      return []; // O llamada a API de paquetes si estuviera disponible
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_CATALOGO_PAQUETES_MEDICACION);
        }, 100);
      });
    }
  },

  buscarMedicamentosCatalogo: async (query, idEntidadOverride) => {
    const isProduction = process.env.REACT_APP_NODE_ENV === 'production';
    const cleanQuery = (query || '').trim();

    if (!cleanQuery) return [];

    const entidadGlobal = idEntidadOverride || 
                          (typeof window !== 'undefined' && window.idEntidadGlobal) || 
                          JSON.parse(localStorage.getItem('usuario') || '{}').idEntidad || 
                          PAGINACION_DEFAULT.ID_ENTIDAD_DEFAULT;

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
          return AtencionMedicaMedicamentoMapper.apiToUiCatalogList(resultadoJson.data);
        }

        return [];
      } catch (error) {
        console.error("❌ Error al buscar medicamentos en el catálogo (Producción):", error);
        return [];
      }
    } else {
      // Modo Desarrollo: Filtra los mocks locales
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtrados = MOCK_CATALOGO_BUSQUEDA.filter(item =>
            item.nombreComercial.toLowerCase().includes(cleanQuery.toLowerCase()) ||
            item.codigo.toLowerCase().includes(cleanQuery.toLowerCase())
          );
          resolve(AtencionMedicaMedicamentoMapper.apiToUiCatalogList(filtrados));
        }, 200);
      });
    }
  }
};
