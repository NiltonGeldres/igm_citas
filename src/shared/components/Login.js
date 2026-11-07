import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import AuthService from "../../master-data/services/auth.service";

import Styles from '../../Styles'; // Importa tus estilos globales

import MessageModal from '../utils/MessageModal'; // Importa el nuevo componente MessageModal

import {useAuth } from "../context/AuthContext"



const Login = () => {

  const navigate = useNavigate();

  const { actualizarDatosGlobales } = useAuth();    

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false); // Estado para el indicador de carga

  const [showErrorModal, setShowErrorModal] = useState(false); // Estado para el modal de error

  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error





  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

       const response =  await AuthService.login(email, password);

      if (response && (response.jwtToken || response.token)) {

      //   if (response.jwtToken) {

              await actualizarDatosGlobales(); // <--- ESTO LLENA EL HEADER AL INSTANTE

              //navigate("/");

              navigate("/", { replace: true });              

       }        

       //  window.location.reload();

    } catch (err) {

        const statusCode = err.response?.status;

       

        let mensajeParaUsuario = "";



        if (statusCode === 401) {

            mensajeParaUsuario = "La contraseña o el correo son incorrectos. Por favor, verifica tus datos.";

        } else if (statusCode === 403) {

            mensajeParaUsuario = "Tu cuenta está desactivada o no tienes permisos para acceder. Contacta al administrador.";

        } else if (statusCode === 404) {

            mensajeParaUsuario = "El usuario ingresado no existe.";

        } else if (statusCode >= 500) {

            mensajeParaUsuario = "Tenemos problemas con nuestro servidor. Inténtalo más tarde.";

        } else {

            mensajeParaUsuario = "No se pudo conectar con el servidor. Revisa tu conexión a internet.";

        }



        setErrorMessage(mensajeParaUsuario);

        setShowErrorModal(true);

        AuthService.logout(); // Limpiamos por seguridad

    } finally {

        setLoading(false);

    }

};



  return (

    <div style={Styles.loginContainer}>

      <form onSubmit={handleLogin} style={Styles.loginForm}>

        <h3 style={Styles.loginTitle}>Iniciar Sesión</h3>



        <input

          placeholder="Nombre de Usuario"

          value={email}

          onChange={(e) => setEmail(e.target.value.trim())}

          style={Styles.loginInput}

          required

        />

        <input

          type="password"

          placeholder="Contraseña"

          value={password}

          onChange={(e) => setPassword(e.target.value)}

          style={Styles.loginInput}

          required // Campo requerido

        />



        <button type="submit" style={Styles.loginButton} disabled={loading}>

          {loading ? "Cargando..." : "Ingresar"}

        </button>





        <p style={Styles.loginSignupText}>

          ¿No tienes una cuenta?{" "}

          <Link to="/signup" style={Styles.loginSignupLink}>

            Regístrate aquí

          </Link>

        </p>

        <p style={Styles.loginSignupTextVersion}>

          Miclinica v.1.1 {" "}

        </p>

      </form>



      {}

      {showErrorModal && (

        <MessageModal

          message={errorMessage}

          onClose={() => setShowErrorModal(false)}

          type="error"

        />

      )}

    </div>

  );

};

export default Login; 



/*

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../master-data/services/auth.service";
import Styles from '../../Styles'; 
import MessageModal from '../utils/MessageModal'; 
import { useAuth } from "../context/AuthContext";
//import { solicitarAccesoCarpeta } from "../../../hooks/useFileSystemRefirma"; // <--- Tu función de carpetas
import { solicitarAccesoCarpeta } from "../../feactures/FirmaDigital/hooks/useFileSystemRefirma"; // <--- Tu función de carpetas
const Login = () => {
  const navigate = useNavigate();
  const { actualizarDatosGlobales, setDirEntrada, setDirSalida } = useAuth(); // Asumiendo que guardas los handles en tu AuthContext
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Nuevo estado para controlar si debemos mostrar el modal de ReFirma tras el login
  const [showReFirmaModal, setShowReFirmaModal] = useState(false);
  const [entradaTemp, setEntradaTemp] = useState(null);
  const [salidaTemp, setSalidaTemp] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (response && (response.jwtToken || response.token)) {
        await actualizarDatosGlobales(); 
        
        // INTERCEPCIÓN DE SEGURIDAD: 
        // Antes de dejarlo pasar al Home, exigimos enlazar las carpetas de ReFirma para este turno.
        setShowReFirmaModal(true);
      }
    } catch (err) {
      const statusCode = err.response?.status;
      let mensajeParaUsuario = "";

      if (statusCode === 401) {
        mensajeParaUsuario = "La contraseña o el correo son incorrectos. Por favor, verifica tus datos.";
      } else if (statusCode === 403) {
        mensajeParaUsuario = "Tu cuenta está desactivada o no tienes permisos para acceder. Contacta al administrador.";
      } else if (statusCode === 404) {
        mensajeParaUsuario = "El usuario ingresado no existe.";
      } else if (statusCode >= 500) {
        mensajeParaUsuario = "Tenemos problemas con nuestro servidor. Inténtalo más tarde.";
      } else {
        mensajeParaUsuario = "No se pudo conectar con el servidor. Revisa tu conexión a internet.";
      }

      setErrorMessage(mensajeParaUsuario);
      setShowErrorModal(true);
      AuthService.logout(); 
    } finally {
      setLoading(false);
    }
  };

  // Funciones para enlazar carpetas desde el modal de login
  const handleSelectEntrada = async () => {
    const handle = await solicitarAccesoCarpeta('entrada');
    if (handle) setEntradaTemp(handle);
  };

  const handleSelectSalida = async () => {
    const handle = await solicitarAccesoCarpeta('salida');
    if (handle) setSalidaTemp(handle);
  };

  const handleFinalizarConfiguracionReFirma = () => {
    if (entradaTemp && salidaTemp) {
      // Guardamos en el contexto global de autenticación/sesión
      setDirEntrada(entradaTemp);
      setDirSalida(salidaTemp);
      
      // Ahora sí, enviamos al médico a su panel de atenciones
      navigate("/", { replace: true });
    }
  };

  return (
    <div style={Styles.loginContainer}>
      <form onSubmit={handleLogin} style={Styles.loginForm}>
        <h3 style={Styles.loginTitle}>Iniciar Sesión</h3>

        <input
          placeholder="Nombre de Usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          style={Styles.loginInput}
          required 
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={Styles.loginInput}
          required 
        />

        <button type="submit" style={Styles.loginButton} disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        <p style={Styles.loginSignupText}>
          ¿No tienes una cuenta?{" "}
          <Link to="/signup" style={Styles.loginSignupLink}>
            Regístrate aquí
          </Link>
        </p>
        <p style={Styles.loginSignupTextVersion}>
          Miclinica v.1.1 {" "}
        </p>
      </form>

      {// Modal de Error de Credenciales /}
      {showErrorModal && (
        <MessageModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
          type="error"
        />
      )}

      {// MODAL OBLIGATORIO DE CONFIGURACIÓN DE REFIRMA AL INICIAR SESIÓN /}
      {showReFirmaModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 text-slate-800">
            <div className="text-center space-y-1">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center text-2xl">
                🔏
              </div>
              <h3 className="font-bold text-lg">Enlace con ReFirma</h3>
              <p className="text-xs text-slate-500">
                Configure sus carpetas de intercambio para este turno de atención.
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <p className="font-semibold text-slate-700">Carpeta de Entrada</p>
                  <p className="text-[10px] text-slate-400">ReFirma lee los borradores de aquí</p>
                </div>
                <button
                  type="button"
                  onClick={handleSelectEntrada}
                  className={`px-3 py-1.5 rounded-md font-medium ${entradaTemp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-600 text-white'}`}
                >
                  {entradaTemp ? '✓ Vinculada' : 'Seleccionar'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <p className="font-semibold text-slate-700">Carpeta de Salida</p>
                  <p className="text-[10px] text-slate-400">ReFirma deposita los firmados aquí</p>
                </div>
                <button
                  type="button"
                  onClick={handleSelectSalida}
                  className={`px-3 py-1.5 rounded-md font-medium ${salidaTemp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-600 text-white'}`}
                >
                  {salidaTemp ? '✓ Vinculada' : 'Seleccionar'}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
              ℹ️ Ubique la carpeta correspondiente en sus documentos o accesos rápidos.
            </div>

            <button
              type="button"
              disabled={!entradaTemp || !salidaTemp}
              onClick={handleFinalizarConfiguracionReFirma}
              className={`w-full py-3 rounded-xl font-medium text-xs shadow-md transition-all ${
                entradaTemp && salidaTemp 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Comenzar Atenciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

*/