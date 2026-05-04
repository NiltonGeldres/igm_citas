import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../Login/services/auth.service';
import EntidadService from '../Entidad/EntidadService';

// 1. Creamos el almacén de datos (Contexto)
const AuthContext = createContext();

// 2. Creamos el "Proveedor" que envolverá a la App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [entidad, setEntidad] = useState(null);
  const [loading, setLoading] = useState(true);

  const actualizarDatosGlobales = async () => {
    const perfil = AuthService.leerPerfil();
    if (perfil) {
      setUser(perfil);
      try {
        // Obtenemos la entidad desde tu servicio existente
        const res = await EntidadService.getEntidad();
        setEntidad(res.data); 
      } catch (error) {
        console.error("Error al cargar entidad en Contexto", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    actualizarDatosGlobales();
  }, []);

  // Definimos qué funciones y datos exponemos a toda la App
  const value = {
    user,
    entidad,
    actualizarDatosGlobales,
    isLoggedIn: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Seguridad: Si alguien intenta usar useAuth fuera del Provider, dará un error claro
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  
  return context;
};