import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../../master-data/services/auth.service';
import axios from 'axios';
import header from '../../shared/utils/Header';

const API_URL = process.env.REACT_APP_URL_API;
const AuthContext = createContext();
const SERVICE_CATALOGO_INICIAL = "/api/v1/catalogos/init";      

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catalogoGlobal, setCatalogoGlobal] = useState([]);

  const cargarCatalogoGlobal = async () => {
      try {
        // Usamos GET ya que el backend espera una petición @GetMapping
        const response = await axios.get(
          `${API_URL}${SERVICE_CATALOGO_INICIAL}`, 
          { headers: header() }
        );
        const data = response.data.catalogo || response.data;
        setCatalogoGlobal(data);
        sessionStorage.setItem('catalogo_global', JSON.stringify(data));
      } catch (error) {
        console.error("❌ Error al cargar el catálogo inicial:", error);
      }
    };

    const actualizarDatosGlobales = async () => {
      const perfilToken = AuthService.leerPerfil();
      if (perfilToken) {
        try {
          const resData = await AuthService.obtenerDatosGlobales(); 
          const perfilConDatosGlobales = {
            ...perfilToken,    
            nombresUsuario: resData.nombresUsuario,
            nombreEntidad: resData.nombreEntidad,
            email: resData.email,
            idEntidad: resData.idEntidad // Incluido por si necesitas pasar la entidad al catálogo
          };        
        
          setUser(perfilConDatosGlobales);
          // Pasamos el idEntidad del usuario recién hidratado si aplica
          await cargarCatalogoGlobal();

        } catch (error) {
          console.error("Fallo la hidratación de datos globales:", error);
          setUser(perfilToken);        
        }
      } else {
        console.warn("No hay sesión válida para hidratar datos.");
        setUser(null);      
      }
      setLoading(false);
    };

  useEffect(() => {
     const storedCatalogo = sessionStorage.getItem('catalogo_global');
     if (storedCatalogo) {
        setCatalogoGlobal(JSON.parse(storedCatalogo));
     }    
     actualizarDatosGlobales();
  }, []);

  const value = {
    user,
    catalogoGlobal,    
    actualizarDatosGlobales,
    isLoggedIn: !!user,
    loading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};