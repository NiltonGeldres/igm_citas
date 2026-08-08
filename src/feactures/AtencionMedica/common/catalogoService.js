// src/features/AtencionMedica/common/catalogoService.js
import axios from "axios";
import header from "../../../shared/utils/Header"; // Ajusta la ruta relativa según tu ubicación exacta

const API_URL = process.env.REACT_APP_URL_API;

// Variable privada en memoria RAM del navegador (sobrevive toda la sesión de la pestaña)
let catalogoCache = null;

export const getCatalogoInit = async () => {
  // Si ya existe en memoria, se retorna de forma instantánea (0ms de red)
  if (catalogoCache) {
    return catalogoCache;
  }

  try {
    const response = await axios.get(`${API_URL}/api/v1/catalogos/init`, {
      headers: header(),
    });
    
    // Guardamos la respuesta en la variable de caché
    catalogoCache = response.data;
    return catalogoCache;
  } catch (error) {
    console.error("Error al obtener el catálogo inicial:", error);
    throw error;
  }
};

// Función útil si en algún flujo necesitas limpiar la caché (ej. cambio de sesión o re-login)
export const clearCatalogoCache = () => {
  catalogoCache = null;
};