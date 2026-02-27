import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AuthService from "./components/Login/services/auth.service";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import Home from "./components/Home"; // Página de marketing pública
import Private from "./components/Private"; // Componente que gestiona el dashboard según el rol
import CitaV2 from "./components/Cita/CitaV2";
//import "bootstrap/dist/css/bootstrap.min.css"; // Mantener si usas estilos de Bootstrap

// Importa los componentes de las secciones que tendrán sus propias rutas
//import MedicalRecordForm from "./components/AtencionMedica/MedicalRecordForm";
import AtencionMedicaForm from "./components/AtencionMedica/AtencionMedicaForm";
import CitaSeparada from "./components/CitaSeparada/CitaSeparada"; // Asumiendo que esta es la página de "Citados"
import Cita from "./components/Cita/Cita"; // Asumiendo que esta es la página de "Citados"
import Usuario from "./components/Usuario/Usuario"; // Asumiendo que esta es la página de "Citados"
import Facturacion from "./components/Facturacion/Facturacion";
import ProgramacionHorarioIndividual from "./components/ProgramacionHorarioIndividual/ProgramacionHorarioIndividual";
import { jwtDecode } from "jwt-decode"; 
import UsuarioService from '../src/components/Usuario/UsuarioService'
import ProgramacionHorario from "./components/ProgramacionHorario/ProgramacionHorario";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [userId, setUserId] = useState(null); 
  const [userRoles, setUserRoles] = useState([]); 
  const [userProfileData, setUserProfileData] = useState(null); 

  // Función auxiliar para obtener el nombre completo del perfil
  const getFullNameForHeader = (profile) => {
    if (!profile) return 'Usuario'; // Fallback si no hay perfil
    
    const primerNombre = profile.primer_nombre || '';
    const apellidoPaterno = profile.apellido_paterno || '';
    const apellidoMaterno = profile.apellido_materno || '';

    // Concatenar y limpiar espacios extra
    const fullName = `${primerNombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();

    // Si el nombre completo está vacío después de la concatenación, usar el username
    return fullName || profile.username || 'Usuario';
  };


  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.jwtToken) {
      setCurrentUser(user);
    
      try {
        const decodedToken = jwtDecode(user.jwtToken);
        setUserId(decodedToken.userId); 
        setUserRoles(decodedToken.roles || []); 
        const storedProfile = sessionStorage.getItem("userProfile");
        if (storedProfile) {
          setUserProfileData(JSON.parse(storedProfile));
        } 
        else {
          const usernameFromToken = decodedToken.sub; 
          if (usernameFromToken) {
            UsuarioService.leerUsuario(usernameFromToken)
              .then(response => {
                setUserProfileData(response.data);
                sessionStorage.setItem("userProfile", JSON.stringify(response.data));
              })
              .catch(error => {
                console.error("Error al recargar perfil en App.js:", error);
              });
          }
        }
      } catch (e) {
        console.error("Error decoding token on app load:", e);
        AuthService.logout(); 
        navigate("/login");
      }
 //           
    }
  }, [navigate]);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(null);
//    setUserName(null);
    setUserProfileData(null);    
    navigate("/login");

  AuthService.logout(); // Llama al servicio para limpiar sessionStorage
    
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: "rgb(0, 120, 245)" }} className="navbar navbar-expand navbar-dark">
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            {currentUser ? (
              <Link style={{ color: "white" }} to={"/private"} className="nav-link">
                Inicio
              </Link>
            ) : (
              <Link style={{ color: "white" }} to={"/home"} className="nav-link">
                Home
              </Link>
            )}
          </li>

          {currentUser && userProfileData && (
            <li className="nav-item">
              <span style={{ color: "white", padding: '8px 12px', display: 'block' }}>
                 {getFullNameForHeader(userProfileData)}
              </span>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ms-auto">
            <li className="nav-item">
              <a style={{ color: "white" }} href="/login" className="nav-link" onClick={logOut}>
                Logout
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link style={{ color: "white" }} to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link style={{ color: "white" }} to={"/signup"} className="nav-link">
                Sign up
              </Link>
            </li>
          </div>
        )}
      </nav>

      {/* Este div principal ahora tiene un paddingTop para compensar la navbar superior.
          La altura de la navbar (Styles.navbar) es aproximadamente 60px. */}
      <div style={{ flexGrow: 1, width: '100%', paddingTop: '60px' }}>
        <Routes>
          <Route path="/home" element={<CitaV2/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} setUserName={setUserName} />} />
          <Route path="/signup" element={<Signup/>} />

          {currentUser ? (
            <>
              <Route path="/" element={<Private />} />
              <Route path="/private" element={<Private />} />
              <Route path="/atenciones" element={<AtencionMedicaForm />} />
              <Route path="/citados" element={<CitaSeparada />} />
              <Route path="/facturacion" element={<Facturacion />} />
              <Route path="/programacion" element={<ProgramacionHorario/>} />
              <Route path="/programacionI" element={<ProgramacionHorarioIndividual/>} />
              <Route path="/Cita" element={<Cita/>} />
              <Route path="/CitaSeparada" element={<CitaSeparada />} />
              <Route path="/Usuario" element={<Usuario/>} />
              <Route path="/CitaV2" element={<CitaV2/>} />
              <Route path="*" element={<Private />} />
            </>
          ) : (
            <Route path="*" element={<Login setCurrentUser={setCurrentUser} setUserName={setUserName} />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
