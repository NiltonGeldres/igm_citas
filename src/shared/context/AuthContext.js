import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../../master-data/services/auth.service';
//import EntidadService from '../../master-data/services/EntidadService';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const actualizarDatosGlobales = async () => {
    const perfilToken = AuthService.leerPerfil();
    if (perfilToken) {
      try {
        const resData = await AuthService.obtenerDatosGlobales(); 
        console.log("Datos frescos desde API:", resData);
        const perfilConDatosGlobales = {
          ...perfilToken,     
          nombresUsuario: resData.nombresUsuario,
          nombreEntidad: resData.nombreEntidad,
          email: resData.email         
        };        
        
        console.log("Estado Global Hidratado:", perfilConDatosGlobales);
        setUser(perfilConDatosGlobales);

      } catch (error) {
        console.error("Fallo la hidratación de datos globales:", error);
      setUser(perfilToken);        
      }
    } else {
      console.warn("No hay sesión válida para hidratar datos.");
    }
    
    setLoading(false);
};

  useEffect(() => {
    actualizarDatosGlobales();
  }, []);

  const value = {
    user,
//    entidad,
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

/*
const actualizarDatosGlobales = async () => {
    const perfilToken = AuthService.leerPerfil();
    
    if (perfilToken) {
      try {
        // 1. IMPORTANTE: Agrega los paréntesis () para ejecutar la función
        const resData = await AuthService.obtenerDatosGlobales(); 
        
        console.log("Respuesta de API:", resData);

        // 2. ERROR DE LÓGICA: No uses el estado 'datos' aquí. 
        // setState es asíncrono. Usa 'resData' que es la variable fresca.
        const datosGlobalesCompletos = {
          ...perfilToken,     
          nombreUsuario: resData.nombreUsuario, // Usamos resData directamente
          nombreEntidad: resData.nombreEntidad,
          email: resData.email         
        };        
        
        console.log("Datos Combinados:", datosGlobalesCompletos);
        
        // 3. Ahora sí actualizamos los estados
        setDatos(resData); 
        setUser(datosGlobalesCompletos);

      } catch (error) {
        console.error("Error al cargar datos globales:", error);
      }
    }
    setLoading(false);
};
*/

/*
  const actualizarDatosGlobales = async () => {
    const perfil = AuthService.leerPerfil();
    console.log("PERFIL   "+JSON.stringify(perfil))
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

  */
  /*
  const actualizarDatosGlobales = async () => {
    const perfil = AuthService.leerPerfil();
    if (perfil) {
      setUser(perfil);
      try {
        // Obtenemos la entidad desde tu servicio existente
        const res = await AuthService.obtenerDatosGlobales(); 
        //const res = await EntidadService.getEntidad();
        setEntidad(res.data); 
      } catch (error) {
        console.error("Error al cargar entidad en Contexto", error);
      }
    }
    setLoading(false);
  };
*/
  