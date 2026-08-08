// features/AtencionMedica/catalogoInitService.js
import axios from "axios";
import header from "../../shared/utils/Header"; // Ajusta la ruta de tu header según tu estructura

const API_URL = process.env.REACT_APP_URL_API;

// Variable global en memoria para conservar la caché durante la sesión del navegador
let catalogoInitCache = null;

export const getCatalogoInit = async () => {
  // Si ya existe en caché, lo retornamos inmediatamente sin llamada HTTP
  if (catalogoInitCache) {
    console.log("⚡ [Caché Hit] Usando catálogo INTI desde memoria.");
    return catalogoInitCache;
  }

  try {
    console.log("🌐 [API Call] Descargando catálogo INTI por primera vez...");
    const response = await axios.get(`${API_URL}/api/v1/catalogos/init`, { 
      headers: header() 
    });
    
    // Almacenamos el resultado en la variable global de caché
    catalogoInitCache = response.data;
    return catalogoInitCache;
  } catch (error) {
    console.error("❌ Error al obtener el catálogo init:", error);
    throw error;
  }
};