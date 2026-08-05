
// src/components/Medicacion/AtencionMedicaMedicamentoService.js
import axios from "axios";
//import header from "../../shared/utils/Header";
import header from "../../../shared/utils/Header";

const API_URL = process.env.REACT_APP_URL_API;
const SERVICE__BIENES_BUSCAR = `${API_URL}/api/v1/catalogos/bienes/buscar`;

// Constantes de paginación predeterminadas para solicitudes a la API
const PAGINACION_DEFAULT = {
  PAGINA_ACTUAL: 1,
  TAMANO_PAGINA: 10,
  TIPO_PRODUCTO: 0,
};

// Paquetes temporales (pueden ser reemplazados posteriormente por endpoint de backend)
const MOCK_CATALOGO_PAQUETES_MEDICACION = [
  {
    id: 'pkg-med-01',
    nombrePaquete: 'Esquema Erradicación H. Pylori',
    medicamentosAsociados: [
      { id: 'med-p1', descripcion: 'Omeprazol 20mg', dosis: '20.0', frecuencia: 2, periodo: 14, cantidad: 28, via: 'Oral' },
      { id: 'med-p2', descripcion: 'Amoxicilina 500mg', dosis: '1000.0', frecuencia: 2, periodo: 14, cantidad: 56, via: 'Oral' },
      { id: 'med-p3', descripcion: 'Ciprofloxacino 500mg', dosis: '500.0', frecuencia: 2, periodo: 14, cantidad: 28, via: 'Oral' }
    ]
  },
  {
    id: 'pkg-med-02',
    nombrePaquete: 'Sintomático Respiratorio Adulto',
    medicamentosAsociados: [
      { id: 'med-s1', descripcion: 'Paracetamol 500mg', dosis: '500.0', frecuencia: 3, periodo: 3, cantidad: 9, via: 'Oral' },
      { id: 'med-s2', descripcion: 'Loratadina 10mg', dosis: '10.0', frecuencia: 1, periodo: 5, cantidad: 5, via: 'Oral' }
    ]
  }
];

export const AtencionMedicaMedicamentoService = {
  /**
   * Busca medicamentos en el catálogo real del backend mediante Axios y GET.
   * @param {string} query - Término de búsqueda (ej. "LORA")
   * @param {number} [idEntidadOverride] - ID de entidad opcional (si no se provee, intenta obtenerlo de la variable global de sesión)
   */
  buscarMedicamentosCatalogo: async (query, idEntidadOverride) => {
    try {
      if (!query || query.trim() === '') return [];

      // Recuperación de la entidad global o uso del parámetro provisto (ej. usuario logueado)
      // Ajusta según cómo almacenes la variable global de sesión en tu app (ej. localStorage o store global)
      const entidadGlobal = idEntidadOverride || 
                            (typeof window !== 'undefined' && window.idEntidadGlobal) || 
                            JSON.parse(localStorage.getItem('usuario') || '{}').idEntidad || 2;

      const params = {
        idEntidad: entidadGlobal,
        termino: query.trim(),
        tipoProducto: PAGINACION_DEFAULT.TIPO_PRODUCTO,
        tamanoPagina: PAGINACION_DEFAULT.TAMANO_PAGINA,
        paginaActual: PAGINACION_DEFAULT.PAGINA_ACTUAL,
      };

      // Solicitud HTTP utilizando Axios y los headers globales configurados
      const response = await axios.get(SERVICE__BIENES_BUSCAR, {
        params,
        headers: header() // Integración con la utilidad de cabeceras y tokens del sistema
      });

      const resultadoJson = response.data;

      // Validamos la estructura del JSON devuelto por la API
      if (resultadoJson && resultadoJson.estado === 'EXITO' && Array.isArray(resultadoJson.data)) {
        // Mapeo adaptado al formato que consumen los componentes de interfaz (React Select / Listas)
        return resultadoJson.data.map(item => ({
          id: item.idProducto,
          label: item.nombreComercial || item.nombre,
          codigo: item.codigo,
          concentracion: item.concentracion,
          formaFarmaceutica: item.formaFarmaceutica,
          presentacion: item.presentacion,
          idViaDefault: item.idViaDefault,
          raw: item // Objeto original intacto para cualquier requerimiento posterior
        }));
      }

      return [];
    } catch (error) {
      console.error("Error al buscar medicamentos en el catálogo:", error);
      return [];
    }
  },

  obtenerPaquetesDisponibles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CATALOGO_PAQUETES_MEDICACION);
      }, 100);
    });
  }
};