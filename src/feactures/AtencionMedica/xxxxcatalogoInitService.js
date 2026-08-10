/*// features/AtencionMedica/catalogoInitService.js
import axios from "axios";
import header from "../../shared/utils/Header"; // Ajusta la ruta de tu header según tu estructura

const API_URL = process.env.REACT_APP_URL_API;

// Variable global en memoria para conservar la caché durante la sesión del navegador
let catalogoInitCache = null;
let currentIdEntidad = null; // Para controlar si cambia de entidad en la misma sesión

export const getCatalogoInit = async (idEntidad) => {
  // Si no pasas idEntidad, intentamos advertirlo
  if (!idEntidad) {
    console.warn("⚠️ [Catálogo Init] Se solicitó el catálogo sin especificar un idEntidad.");
  }

  // Si ya existe en caché Y corresponde a la misma entidad, lo retornamos inmediatamente
  if (catalogoInitCache && currentIdEntidad === idEntidad) {
    console.log("⚡ [Caché Hit] Usando catálogo INTI desde memoria para la entidad:", idEntidad);
    return catalogoInitCache;
  }

  try {
    console.log("🌐 [API Call] Descargando catálogo INTI para la entidad:", idEntidad);
    
    // Al ser un método @GetMapping con un objeto request, axios envía los parámetros por Query Params (?idEntidad=...)
    const response = await axios.get(`${API_URL}/api/v1/catalogos/init`, { 
      headers: header(),
      params: { idEntidad } // 👈 Aquí se inyecta el idEntidad requerido por CatalogoInitRequest
    });
    
    // Almacenamos el resultado y la entidad actual en memoria
    catalogoInitCache = response.data;
    currentIdEntidad = idEntidad;
    
    return catalogoInitCache;
  } catch (error) {
    console.error("❌ Error al obtener el catálogo init:", error);
    throw error;
  }
};

// Función para limpiar la caché si es necesario
export const clearCatalogoCache = () => {
  catalogoInitCache = null;
  currentIdEntidad = null;
};
*/