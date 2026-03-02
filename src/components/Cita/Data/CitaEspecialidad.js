import { Baby, HeartPulse, Sparkles, Venus, Bone, Stethoscope } from 'lucide-react';
/**
 * DICCIONARIO DE IDENTIDAD VISUAL
 * Aquí definimos lo que la base de datos no conoce: iconos y temas de color.
 * Usamos los IDs que vienen de tu base de datos como llaves.
 */
const CONFIG_VISUAL_ESPECIALIDADES = {
  'PED': { icono: <Baby size={24} />, colorFondo: 'bg-blue-100', colorTexto: 'text-blue-700' },
  'CAR': { icono: <HeartPulse size={24} />, colorFondo: 'bg-red-100', colorTexto: 'text-red-700' },
  'DER': { icono: <Sparkles size={24} />, colorFondo: 'bg-orange-100', colorTexto: 'text-orange-700' },
  'GIN': { icono: <Venus size={24} />, colorFondo: 'bg-purple-100', colorTexto: 'text-purple-700' },
  'TRA': { icono: <Bone size={24} />, colorFondo: 'bg-emerald-100', colorTexto: 'text-emerald-700' },
  'default': { icono: <Stethoscope size={24} />, colorFondo: 'bg-slate-100', colorTexto: 'text-slate-700' }
};

/**
 * ADAPTADOR PARA ESPECIALIDADES
 * @param {Array} apiData - El array de especialidades crudo de la API
 * @returns {Array} - Array de especialidades con campos de UI inyectados
 */
export const transformarEspecialidades = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((item) => {
    // Buscamos la configuración visual por ID o usamos el default
    const uiConfig = CONFIG_VISUAL_ESPECIALIDADES[item.idEspecialidad] || CONFIG_VISUAL_ESPECIALIDADES.default;

    return {
      // 1. Conservamos la data original
      ...item,

      // 2. Mapeo de nombres (por si la API cambia los nombres de los campos)
      idEspecialidad: item.idEspecialidad,
      descripcionEspecialidad: item.descripcionEspecialidad || 'Especialidad sin nombre',
      
      // 3. Formateo de negocio
      //precio: item.montoEspecialidad || 0,
      //precioEtiqueta: `S/ ${(item.montoEspecialidad || 0).toFixed(2)}`,

      // 4. Inyección de propiedades de Presentación
      icono: uiConfig.icono,
      claseEstilo: `${uiConfig.colorFondo} ${uiConfig.colorTexto} font-medium px-3 py-1 rounded-full`,
      
      // 5. Lógica condicional de UI
      //requierePreparacion: item.montoEspecialidad > 100, // Ejemplo de lógica basada en data
    };
  });
};

/**
 * UTILIDAD DE BÚSQUEDA RÁPIDA
 * Convierte el array transformado en un objeto indexado para acceso directo
 */
export const indexarEspecialidades = (especialidadesTransformadas) => {
  return especialidadesTransformadas.reduce((acc, esp) => {
    acc[esp.idEspecialidad] = esp;
    return acc;
  }, {});
};