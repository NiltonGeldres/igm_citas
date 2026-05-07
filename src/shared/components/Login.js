
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
       if (response.jwtToken) {
              await actualizarDatosGlobales(); // <--- ESTO LLENA EL HEADER AL INSTANTE
              navigate("/");
       }        
         window.location.reload();
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
         // type="email" // Usar type="email" para mejor validación nativa
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={Styles.loginInput}
          required // Campo requerido
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
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
       const response =  await AuthService.login(email, password);
       if (response.jwtToken) {
           console.log("response.jwtToken  "+response.jwtToken)
              await actualizarDatosGlobales(); // <--- ESTO LLENA EL HEADER AL INSTANTE
              navigate("/");
       }        
        window.location.reload();

    } catch (err) {
        const statusCode = err.response?.status;
        const serverMessage = err.response?.data?.message; // Si tu API devuelve un mensaje
        console.log("Error Login   "+err.response)

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
*/

