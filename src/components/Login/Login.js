
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "./services/auth.service";
// import { jwtDecode } from "jwt-decode"; // No se usa directamente aquí
import Styles from '../../Styles'; // Importa tus estilos globales
import MessageModal from '../AtencionMedica/common/MessageModal'; // Importa el nuevo componente MessageModal
import { jwtDecode } from "jwt-decode";
import UsuarioService from "../Usuario/UsuarioService"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const [showErrorModal, setShowErrorModal] = useState(false); // Estado para el modal de error
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const [usuarioData, setUsuarioData] = useState({
        id_usuario          : 0,
        username            :"",        
        password            :"",
        email               :"",
        estado              :"" ,
        apellido_paterno    :"",
        apellido_materno    :"",
        primer_nombre       :"",
        segundo_nombre      :"r",
        numero_celular      :"",
        id_sexo             :"",
        id_tipo_documento   :"",
        numero_documento    :"",
        fecha_alta          :"",
        fecha_baja          :"",
        fecha_modificacion  :""
      });    

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        await AuthService.login(email, password)
        .then(() => {
          
            UsuarioService.leerUsuario()
            navigate("/private");
            window.location.reload();
          }
        ,(error) => {
            AuthService.logout();
            navigate("/login");
            window.location.reload();          
            alert("Comuniquese con el soporte tecnico: "+error)
          });
    } catch (err) {
        AuthService.logout();
        navigate("/login");
        window.location.reload();          
        alert("Comuniquese con el soporte tecnico: "+err)
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


