// src/feactures/AtencionMedica/utils/textFormatter.js

/**
 * Convierte cualquier cadena de texto a formato de Nombre Propio / Título.
 * Ejemplo: "JUAN PEREZ" o "juan perez" -> "Juan Perez"
 * @param {string} str - Cadena a transformar
 * @returns {string} Cadena formateada
 */
export const formatCapitalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

