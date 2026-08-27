import { v4 as uuidv4 } from 'uuid';

export const AtencionMedicaTriajeMapper = {
  
  /**
   * Transforma datos del Backend/Catálogo a la estructura del Frontend
   * Únicamente datos puros de dominio: { id, nombre, valor, unidad, prioridad }
   */
  transformarApiALFront: (apiData) => {
    if (!Array.isArray(apiData) || apiData.length === 0) {
      return [];
    }

    return apiData.map(item => {
      const idReal = item.idTriaje ?? item.idSignoVital ?? item.id;
      const nombreReal = item.nombreTriaje ?? item.medida ?? item.nombremedida ?? item.nombre ?? '';
      const unidadReal = item.um ?? item.unidad ?? '---';
      const valorReal = item.valorTriaje ?? item.valor ?? '';

      return {
        id: idReal !== undefined && idReal !== null ? idReal : uuidv4(),
        nombre: nombreReal,
        valor: valorReal !== undefined && valorReal !== null ? String(valorReal) : '',
        unidad: unidadReal,
        prioridad: item.prioridad !== undefined ? Number(item.prioridad) : 0
      };
    }).sort((a, b) => {
      if (b.prioridad !== a.prioridad) {
        return b.prioridad - a.prioridad; // Muestra prioridad 1 arriba
      }
      return Number(a.id) - Number(b.id);
    });
  },

  /**
   * Mapea un ítem individual retornado por la búsqueda para AutoCompleteInput
   */
  mapItemApiToFront: (item) => {
    if (!item) return null;

    const idReal = item.idTriaje ?? item.idSignoVital ?? item.id;
    const nombreReal = item.nombreTriaje ?? item.medida ?? item.nombre ?? '';
    const unidadReal = item.um ?? item.unidad ?? '---';

    return {
      id: idReal !== undefined && idReal !== null ? idReal : uuidv4(),
      label: nombreReal,
      nombre: nombreReal,
      valor: '',
      unidad: unidadReal,
      prioridad: item.prioridad !== undefined ? Number(item.prioridad) : 0
    };
  },

  /**
   * Mapea los datos modificados hacia el Payload JSON del Backend
   */
  transformarFrontAApi: (idCita, idPaciente, frontData) => {
    if (!Array.isArray(frontData)) return [];

    return frontData
      .filter(item => item.valor !== undefined && item.valor !== null && String(item.valor).trim() !== '') 
      .map(item => ({
        idCita: idCita || null,
        idPaciente: idPaciente || null,
        idTriaje: typeof item.id === 'number' || !isNaN(Number(item.id)) ? Number(item.id) : null,
        nombreTriaje: item.nombre,
        valor: String(item.valor).trim(),
        um: item.unidad,
        prioridad: item.prioridad
      }));
  }
};

/*import { v4 as uuidv4 } from 'uuid';

const CONFIG_PARAMETROS = {
  'temperatura': { unidad: '°C', placeholder: '36.5', prioridad: 1 },
  'presión arterial': { unidad: 'mmHg', placeholder: '120/80', prioridad: 2 },
  'frecuencia cardíaca': { unidad: 'lpm', placeholder: '75', prioridad: 3 },
  'frecuencia respiratoria': { unidad: 'rpm', placeholder: '18', prioridad: 4 },
  'saturación de oxígeno': { unidad: '%', placeholder: '98', prioridad: 5 },
  'peso': { unidad: 'kg', placeholder: '70.0', prioridad: 6 },
  'talla': { unidad: 'cm', placeholder: '165', prioridad: 7 },
  'imc': { unidad: 'kg/m²', placeholder: '24.2', prioridad: 8 },
  'glucosa': { unidad: 'mg/dL', placeholder: '90', prioridad: 9 },
  'dolor': { unidad: 'Escala', placeholder: '0-10', prioridad: 10 }
};

export const AtencionMedicaTriajeMapper = {
  
  transformarApiALFront: (apiData) => {
    // Inicializamos el Top 5 básico vacío que requiere la UI
    const top5Base = [
      { id: uuidv4(), medida: 'Temperatura', valor: '', unidad: '°C', isTop5: true, prioridad: 1 },
      { id: uuidv4(), medida: 'Presión Arterial', valor: '', unidad: 'mmHg', isTop5: true, prioridad: 2 },
      { id: uuidv4(), medida: 'Frecuencia Cardíaca', valor: '', unidad: 'lpm', isTop5: true, prioridad: 3 },
      { id: uuidv4(), medida: 'Frecuencia Respiratoria', valor: '', unidad: 'rpm', isTop5: true, prioridad: 4 },
      { id: uuidv4(), medida: 'Saturación de Oxígeno', valor: '', unidad: '%', isTop5: true, prioridad: 5 },
    ];

    if (!Array.isArray(apiData) || apiData.length === 0) {
      return top5Base;
    }

    const itemsProcesados = apiData.map(item => {
      const nombreNormalizado = (item.medida || '').toLowerCase().trim();
      const config = CONFIG_PARAMETROS[nombreNormalizado] || { unidad: item.unidad || '---', prioridad: item.prioridad || 99 };
      
      return {
        id: item.idSignoVital || uuidv4(),
        medida: item.medida,
        valor: item.valor || '',
        unidad: config.unidad,
        isTop5: config.prioridad <= 5,
        prioridad: item.prioridad || config.prioridad
      };
    });

    // Cruzar información para rellenar los valores del Top 5 base
    const listaFinal = top5Base.map(baseItem => {
      const coincidencia = itemsProcesados.find(p => p.medida.toLowerCase() === baseItem.medida.toLowerCase());
      return coincidencia ? coincidencia : baseItem;
    });

    // Capturar parámetros extra (Prioridad 6 o mayor)
    const adicionales = itemsProcesados.filter(p => p.prioridad > 5);
    
    return [...listaFinal, ...adicionales].sort((a, b) => a.prioridad - b.prioridad);
  },

  transformarFrontAApi: (idCita, idPaciente, frontData) => {
    if (!Array.isArray(frontData)) return [];

    return frontData
      .filter(item => item.valor !== undefined && item.valor.toString().trim() !== '') 
      .map(item => ({
        idCita: idCita || null,
        idPaciente: idPaciente,
        idSignoVital: String(item.id).startsWith('v-') ? item.id : null, 
        medida: item.medida,
        valor: item.valor.toString().trim(),
        unidad: item.unidad,
        prioridad: item.prioridad
      }));
  }
};
*/