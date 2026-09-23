import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import AuthService from '../../master-data/services/auth.service';
import axios from 'axios';
import header from '../../shared/utils/Header';

const API_URL = process.env.REACT_APP_URL_API;
const AuthContext = createContext();
const SERVICE_CATALOGO_INICIAL = "/api/v1/catalogos/init";    

// Tiempos de inactividad en milisegundos
const IDLE_TIMEOUT = 5 * 60 * 1000;      // 5 minutos de inactividad total
const WARNING_TIMEOUT = 3 * 60 * 1000;   // 3 minutos para mostrar la alerta

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

  // Estados para el Modal de Inactividad
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutos (120s)

  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  
  // Referencia para saber si la alerta está visible sin forzar re-renders
  const isWarningVisibleRef = useRef(false);

  useEffect(() => {
    isWarningVisibleRef.current = showIdleWarning;
  }, [showIdleWarning]);

  // -------------------------------------------------------------
  // CARGA DE CATÁLOGOS E HIDRATACIÓN
  // -------------------------------------------------------------
  const cargarCatalogoGlobal = useCallback(async () => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.REACT_APP_NODE_ENV === 'production';
    try {
      let data;
      if (isProduction) {
        const response = await axios.get(
          `${API_URL}${SERVICE_CATALOGO_INICIAL}`, 
          { headers: header() }
        );
        data = response.data.catalogo || response.data;
      } else {
        console.info("🛠️ Usando MOCK_CATALOGO_GLOBAL para desarrollo");
        data = await new Promise((resolve) => setTimeout(() => resolve(MOCK_CATALOGO_GLOBAL), 300));
      }
      setCatalogoGlobal(data);
      sessionStorage.setItem('catalogo_global', JSON.stringify(data));
    } catch (error) {
      console.error("❌ Error al cargar el catálogo inicial:", error);
    }
  }, []);

  const actualizarDatosGlobales = useCallback(async () => {
    try {
      const perfilToken = AuthService.leerPerfil();
      if (perfilToken) {
        try {
          const resData = await AuthService.obtenerDatosGlobales(); 
          const perfilConDatosGlobales = {
            ...perfilToken,    
            nombresUsuario: resData?.nombresUsuario || perfilToken.nombresUsuario,
            nombreEntidad: resData?.nombreEntidad || perfilToken.nombreEntidad,
            email: resData?.email || perfilToken.email,
          };        
          setUser(perfilConDatosGlobales);
        } catch (error) {
          console.error("Fallo la hidratación de datos globales:", error);
          setUser(perfilToken);        
        }
        await cargarCatalogoGlobal();
      } else {
        setUser(null);      
      }
    } catch (err) {
      console.error("Error crítico en actualizarDatosGlobales:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [cargarCatalogoGlobal]);

  useEffect(() => {
    const storedCatalogo = sessionStorage.getItem('catalogo_global');
    if (storedCatalogo) {
      try {
        setCatalogoGlobal(JSON.parse(storedCatalogo));
      } catch (e) {
        sessionStorage.removeItem('catalogo_global');
      }
    }    
    actualizarDatosGlobales();
  }, [actualizarDatosGlobales]);

  // -------------------------------------------------------------
  // CONTROL DE INACTIVIDAD Y EXPIRACIÓN
  // -------------------------------------------------------------
  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken') || localStorage.getItem('user');
    if (!token) return false;

    try {
      const parsedToken = token.startsWith('{') ? JSON.parse(token).jwtToken : token;
      if (!parsedToken) return false;

      const payload = JSON.parse(atob(parsedToken.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return false;
    }
  }, []);

  const logout = useCallback((reason = 'manual') => {
    clearTimers();
    AuthService.logout();
    sessionStorage.removeItem('catalogo_global');
    setUser(null);
    setShowIdleWarning(false);

    window.location.href = `/login?reason=${reason}`;
  }, [clearTimers]);

  const resetIdleTimer = useCallback(() => {
    if (!user) return;

    if (checkTokenExpiration()) {
      logout('expired');
      return;
    }

    clearTimers();
    setShowIdleWarning(false);

    // Timer para mostrar advertencia a los 3 minutos
    warningTimerRef.current = setTimeout(() => {
      setShowIdleWarning(true);
      setRemainingTime(120);

      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_TIMEOUT);

    // Timer para cerrar sesión a los 5 minutos
    idleTimerRef.current = setTimeout(() => {
      logout('idle');
    }, IDLE_TIMEOUT);
  }, [user, checkTokenExpiration, logout, clearTimers]);

  // Listeners de actividad en pantalla
  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    const handleUserActivity = () => {
      // Si la alerta ya está visible, se ignora el movimiento para no ocultar la alerta
      if (isWarningVisibleRef.current) return;
      resetIdleTimer();
    };

    events.forEach((event) => window.addEventListener(event, handleUserActivity));
    resetIdleTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleUserActivity));
      clearTimers();
    };
  }, [user, resetIdleTimer, clearTimers]); // Se removió showIdleWarning de las dependencias

  // -------------------------------------------------------------
  // EXPORTACIÓN DE VALORES
  // -------------------------------------------------------------
  const value = {
    user,
    catalogoGlobal,    
    actualizarDatosGlobales,
    logout,
    resetIdleTimer,
    isLoggedIn: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Modal flotante de Advertencia por Inactividad */}
      {showIdleWarning && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.title}>Sesión a punto de expirar</h3>
            <p style={styles.text}>
              Has estado inactivo. Por seguridad, tu sesión se cerrará automáticamente en:
            </p>
            <div style={styles.countdown}>
              {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
            </div>
            <button onClick={resetIdleTimer} style={styles.button}>
              Continuar Sesión
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '24px 32px',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '420px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    fontFamily: 'sans-serif',
  },
  title: {
    margin: '0 0 12px 0',
    color: '#1e293b',
    fontSize: '1.25rem',
  },
  text: {
    margin: '0 0 16px 0',
    color: '#64748b',
    fontSize: '0.95rem',
  },
  countdown: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ef4444',
    margin: '12px 0 20px 0',
  },
  button: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
  },
};


/*import  { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import AuthService from '../../master-data/services/auth.service';
import axios from 'axios';
import header from '../../shared/utils/Header';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_URL_API;
const AuthContext = createContext();
const SERVICE_CATALOGO_INICIAL = "/api/v1/catalogos/init";      
// Tiempos de inactividad (en milisegundos)
const IDLE_TIMEOUT = 15 * 60 * 1000;      // 15 minutos para cierre total
const WARNING_TIMEOUT = 13 * 60 * 1000;   // 13 minutos para mostrar la advertencia

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

// Estados para el control de inactividad
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutos (120 s)

  const navigate = useNavigate();
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const cargarCatalogoGlobal = useCallback(async () => {
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
  },[]);


  const actualizarDatosGlobales = useCallback(async () => {
      const perfilToken = AuthService.leerPerfil();
      if (perfilToken) {
        try {
          const resData = await AuthService.obtenerDatosGlobales(); 
          const perfilConDatosGlobales = {
            ...perfilToken,    
            nombresUsuario: resData.nombresUsuario,
            nombreEntidad: resData.nombreEntidad,
            email: resData.email,
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
  },[cargarCatalogoGlobal]);

// Carga inicial
  useEffect(() => {
    const storedCatalogo = sessionStorage.getItem('catalogo_global');
    if (storedCatalogo) {
      try {
        setCatalogoGlobal(JSON.parse(storedCatalogo));
      } catch (e) {
        sessionStorage.removeItem('catalogo_global');
      }
    }    
    actualizarDatosGlobales();
  }, [actualizarDatosGlobales]);

// -------------------------------------------------------------
  // LÓGICA DE INACTIVIDAD Y EXPIRACIÓN CORREGIDA
  // -------------------------------------------------------------
  
  const clearTimers = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const logout = useCallback((reason = 'manual') => {
    clearTimers();
    AuthService.logout();
    sessionStorage.removeItem('catalogo_global');
    setUser(null);
    setShowIdleWarning(false);
    navigate('/login', { state: { reason } });
  }, [navigate]);

  // Verificar si el token JWT ya venció
  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // payload.exp viene en segundos, comparamos con Date.now() en milisegundos
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return false; // Si hay algún problema leyendo la estructura, evitamos forzar el logout de inmediato
    }
  }, []);

  // Reiniciar temporizadores de inactividad
  const resetIdleTimer = useCallback(() => {
    // Si no hay usuario autenticado, NO debemos ejecutar la verificación
    if (!user) return;

    // Verificar si el token expiró
    if (checkTokenExpiration()) {
      logout('expired');
      return;
    }

    clearTimers();
    setShowIdleWarning(false);

    // Timer para mostrar advertencia a los 13 minutos
    warningTimerRef.current = setTimeout(() => {
      setShowIdleWarning(true);
      setRemainingTime(120);

      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_TIMEOUT);

    // Timer para el logout tras 15 minutos
    idleTimerRef.current = setTimeout(() => {
      logout('idle');
    }, IDLE_TIMEOUT);
  }, [user, checkTokenExpiration, logout]);

  // Listener para eventos globales (solo activo cuando existe un usuario autenticado)
  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    const handleUserActivity = () => {
      if (!showIdleWarning) {
        resetIdleTimer();
      }
    };

    events.forEach((event) => window.addEventListener(event, handleUserActivity));
    
    // Iniciar temporizador tras confirmar la presencia del usuario
    resetIdleTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleUserActivity));
      clearTimers();
    };
  }, [user, showIdleWarning, resetIdleTimer]);



  const value = {
      user,
      catalogoGlobal,    
      logout,
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
*/
