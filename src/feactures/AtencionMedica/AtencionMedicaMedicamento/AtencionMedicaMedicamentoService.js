// src/components/Medicacion/AtencionMedicaMedicamentoService.js

// URL base de tu API (puedes sacarla de un archivo .env o configurarla globalmente)
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Mantenemos temporalmente los paquetes si aún no vienen del backend, 
// o puedes limpiar esto cuando crees la API de paquetes.
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
   * Busca medicamentos en el catálogo real del backend mediante la API GET.
   * @param {string} query - Término de búsqueda (ej. "LORA")
   * @param {number} idEntidad - ID de la entidad actual (por defecto 2 según tu ejemplo)
   */
  buscarMedicamentosCatalogo: async (query, idEntidad = 2) => {
    try {
      if (!query || query.trim() === '') return [];

      // Construcción de la URL con los parámetros requeridos por tu API
      const url = `${API_BASE_URL}/catalogos/bienes/buscar?idEntidad=${idEntidad}&termino=${encodeURIComponent(query)}&tipoProducto=0&tamanoPagina=10&paginaActual=1`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + token // Descomenta si usas tokens de seguridad
        }
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      const resultadoJson = await response.json();

      // Validamos que la respuesta sea exitosa y contenga la data
      if (resultadoJson.estado === 'EXITO' && Array.isArray(resultadoJson.data)) {
        // 🔄 MAPEO DE DATOS: 
        // Transformamos el JSON del backend al formato que el componente de React espera ({ id, label, ... })
        return resultadoJson.data.map(item => ({
          id: item.idProducto,
          label: item.nombre, // O puedes usar item.nombreComercial según prefieras
          codigo: item.codigo,
          concentracion: item.concentracion,
          formaFarmaceutica: item.formaFarmaceutica,
          presentacion: item.presentacion,
          idViaDefault: item.idViaDefault,
          // Guardamos el objeto original por si el componente necesita propiedades extra
          raw: item 
        }));
      }

      return [];
    } catch (error) {
      console.error("Error al buscar medicamentos en el catálogo:", error);
      return [];
    }
  },

  obtenerPaquetesDisponibles: async () => {
    // Si posteriormente creas una API para los paquetes, la reemplazaras aquí.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CATALOGO_PAQUETES_MEDICACION);
      }, 100);
    });
  }
};

// src/components/Medicacion/AtencionMedicaMedicamentoService.js
/*
const MOCK_CATALOGO_MEDICAMENTOS = [
  { id: 'med1', label: 'Paracetamol 500mg' },
  { id: 'med2', label: 'Ibuprofeno 400mg' },
  { id: 'med3', label: 'Amoxicilina 500mg' },
  { id: 'med4', label: 'Omeprazol 20mg' },
  { id: 'med5', label: 'Loratadina 10mg' },
  { id: 'med6', label: 'Atorvastatina 20mg' },
  { id: 'med7', label: 'Metformina 850mg' },
  { id: 'med8', label: 'Salbutamol 100mcg/dosis Inhalador' }
];

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
  buscarMedicamentosCatalogo: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query) return resolve([]);
        const filtered = MOCK_CATALOGO_MEDICAMENTOS.filter(med =>
          med.label.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 150);
    });
  },

  obtenerPaquetesDisponibles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_CATALOGO_PAQUETES_MEDICACION);
      }, 100);
    });
  }
};

*/