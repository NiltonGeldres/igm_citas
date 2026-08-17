import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../../master-data/services/auth.service';
import axios from 'axios';
import header from '../../shared/utils/Header';

const API_URL = process.env.REACT_APP_URL_API;
const AuthContext = createContext();
const SERVICE_CATALOGO_INICIAL = "/api/v1/catalogos/init";      

// src/components/Catalogos/mockCatalogoGlobal.js

export const MOCK_CATALOGO_GLOBAL = {
  catalogoTriajes: [
    { idTriaje: 53, nombreTriaje: "Frecuencia Cardíaca", um: "lpm", prioridad: 0 },
    { idTriaje: 54, nombreTriaje: "Frecuencia Respiratoria", um: "rpm", prioridad: 0 },
    { idTriaje: 60, nombreTriaje: "Glucosa Capilar", um: "mg/dL", prioridad: 0 },
    { idTriaje: 59, nombreTriaje: "Hemoglobina", um: "g/dL", prioridad: 0 },
    { idTriaje: 56, nombreTriaje: "Perímetro Abdominal", um: "cm", prioridad: 0 },
    { idTriaje: 52, nombreTriaje: "Presión Arterial", um: "mmHg", prioridad: 0 },
    { idTriaje: 55, nombreTriaje: "Saturación de Oxígeno", um: "%", prioridad: 0 },
    { idTriaje: 49, nombreTriaje: "Temperatura", um: "°C", prioridad: 0 },
    { idTriaje: 58, nombreTriaje: "Temperatura Axilar", um: "°C", prioridad: 0 },
    { idTriaje: 57, nombreTriaje: "Índice de Masa Corporal (IMC)", um: "kg/m²", prioridad: 0 },
    { idTriaje: 50, nombreTriaje: "Peso", um: "kg", prioridad: 1 },
    { idTriaje: 51, nombreTriaje: "Talla", um: "cm", prioridad: 1 }
  ],
  catalogoTipoDiagnostico: [
    { idDiagnosticoSubclasificacion: 8, codigo: "B", descripcion: "Causa Basica", idDiagnosticoClasificacion: 4, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 12, codigo: "D", descripcion: "Definitivo", idDiagnosticoClasificacion: 7, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 2, codigo: "D", descripcion: "Definitivo", idDiagnosticoClasificacion: 1, idTipoServicio: 1 },
    { idDiagnosticoSubclasificacion: 6, codigo: "F", descripcion: "Causa Final", idDiagnosticoClasificacion: 4, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 10, codigo: "FP", descripcion: "Causa fetal /perinatal", idDiagnosticoClasificacion: 5, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 7, codigo: "I", descripcion: "Causa Intermedia", idDiagnosticoClasificacion: 4, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 9, codigo: "M", descripcion: "Causa Materna", idDiagnosticoClasificacion: 5, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 1, codigo: "P", descripcion: "Presuntivo", idDiagnosticoClasificacion: 1, idTipoServicio: 1 },
    { idDiagnosticoSubclasificacion: 4, codigo: "P", descripcion: "Principal", idDiagnosticoClasificacion: 3, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 11, codigo: "P", descripcion: "Presuntivo", idDiagnosticoClasificacion: 7, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 13, codigo: "R", descripcion: "Repetido", idDiagnosticoClasificacion: 7, idTipoServicio: 3 },
    { idDiagnosticoSubclasificacion: 3, codigo: "R", descripcion: "Repetido", idDiagnosticoClasificacion: 1, idTipoServicio: 1 },
    { idDiagnosticoSubclasificacion: 5, codigo: "S", descripcion: "Secundario", idDiagnosticoClasificacion: 3, idTipoServicio: 3 }
  ],
  catalogoViasAdministracion: [
    { idViaAdministracion: 10, nombreViaAdministracion: " Ótica", grupoClasificacion: "Tópicas y Locales" },
    { idViaAdministracion: 11, nombreViaAdministracion: " Ótica", grupoClasificacion: "Tópicas y Locales" },
    { idViaAdministracion: 12, nombreViaAdministracion: "Inhalatoria", grupoClasificacion: "Tópicas y Locales" },
    { idViaAdministracion: 7, nombreViaAdministracion: "Intradérmica", grupoClasificacion: "Intradérmica" },
    { idViaAdministracion: 5, nombreViaAdministracion: "Intramuscular", grupoClasificacion: "Intradérmica" },
    { idViaAdministracion: 4, nombreViaAdministracion: "Intravenosa", grupoClasificacion: "Intradérmica" },
    { idViaAdministracion: 9, nombreViaAdministracion: "Oftálmica", grupoClasificacion: "Tópicas y Locales" },
    { idViaAdministracion: 1, nombreViaAdministracion: "Oral", grupoClasificacion: "Enteral" },
    { idViaAdministracion: 3, nombreViaAdministracion: "Rectal", grupoClasificacion: "Enteral" },
    { idViaAdministracion: 6, nombreViaAdministracion: "Subcutánea", grupoClasificacion: "Intradérmica" },
    { idViaAdministracion: 2, nombreViaAdministracion: "Sublingual", grupoClasificacion: "Enteral" },
    { idViaAdministracion: 13, nombreViaAdministracion: "Transdérmica", grupoClasificacion: "Tópicas y Locales" },
    { idViaAdministracion: 8, nombreViaAdministracion: "Tópica / Cutánea", grupoClasificacion: "Tópicas y Locales" },
    { idViaAdministracion: 14, nombreViaAdministracion: "Vaginal", grupoClasificacion: "Tópicas y Locales" }
  ],
  catalogoPaquetesMedicacion: [],
  catalogoPaquetesExamenes: []
};




export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catalogoGlobal, setCatalogoGlobal] = useState([]);
/*
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

*/
    const cargarCatalogoGlobal = async () => {
        // 1. Determinamos el entorno
        const isProduction = process.env.REACT_APP_NODE_ENV === 'production';

        try {
          let data;

          if (isProduction) {
            // 2. Lógica para Producción: Llamada real al backend
            const response = await axios.get(
              `${API_URL}${SERVICE_CATALOGO_INICIAL}`, 
              { headers: header() }
            );
            data = response.data.catalogo || response.data;
            console.log("*** CATALOGO GLOBAL "+JSON.stringify(data))

          } else {
            // 3. Lógica para Desarrollo: Usamos el MOCK con un retraso simulado
            console.info("🛠️ Usando MOCK_CATALOGO_GLOBAL para desarrollo");
            data = await new Promise((resolve) => {
              setTimeout(() => resolve(MOCK_CATALOGO_GLOBAL), 300);
            });
          }

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