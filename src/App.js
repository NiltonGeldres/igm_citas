import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AuthService from "./components/Login/services/auth.service";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import Home from "./components/Home"; // Página de marketing pública
import Private from "./components/Private"; // Componente que gestiona el dashboard según el rol
import CitaV2 from "./components/Cita/CitaV2";
import AtencionMedicaForm from "./components/AtencionMedica/AtencionMedicaForm";
import CitaSeparada from "./components/CitaSeparada/CitaSeparada"; // Asumiendo que esta es la página de "Citados"
import Cita from "./components/Cita/Cita"; // Asumiendo que esta es la página de "Citados"
import Usuario from "./components/Usuario/Usuario"; // Asumiendo que esta es la página de "Citados"
import Facturacion from "./components/Facturacion/Facturacion";
import ProgramacionHorarioIndividual from "./components/ProgramacionHorarioIndividual/ProgramacionHorarioIndividual";
import ProgramacionHorario from "./components/ProgramacionHorario/ProgramacionHorario";
import EntidadService from "./components/Entidad/EntidadService";
import { cargarConfiguracionEntidades } from "./components/Entidad/EntidadData";
import { obtenerEntidad, ENTIDAD } from "./components/Entidad/EntidadData"; 
import { Stethoscope, User, Building2, LogOut, LayoutDashboard, Calendar, Users, CreditCard, Clock } from "lucide-react";

function App() {

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [userProfileData, setUserProfileData] = useState(null); 
  const [userEntidadData, setUserEntidadData] = useState(false);

  const getFullNameForHeader = (profile) => {
    if (!profile) return 'Usuario'; // Fallback si no hay perfil
    const usuarioNombres = profile.usuarioNombres.toLowerCase() || '';
    const fullName = `${usuarioNombres}`.trim();
    return fullName || profile.username || 'Usuario';
  };
  const getEntidadForHeader = (e) => {
    const nombre= e.nombre;
    return nombre;;
  };



  useEffect(() => {
//    const user = AuthService.getCurrentUser();
    const perfil = AuthService.leerPerfil();
    if (perfil) {
      try {
        setCurrentUser(perfil);
        setUserProfileData(perfil);
        /*  Nombre de Entidad*/
        setTimeout(() => {
            EntidadService.getEntidad().then(res => {
            cargarConfiguracionEntidades(res.data);
            const Entidad  = obtenerEntidad();
            setUserEntidadData(Entidad)
            });

         // setEntidadNombre("Clínica San Pablo - Sede Central");
        }, 1000);

      } catch (e) {
        console.error("Error al procesar el token:", e);
      }
    }

  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(null);
//    setUserName(null);
    setUserProfileData(null);    
    navigate("/login");

  AuthService.logout(); // Llama al servicio para limpiar sessionStorage
    
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' ,color:"white" }}>
      <nav style={{ 
        backgroundColor: "rgb(0, 120, 245)", 
        padding: "10px 20px", 
        display: "flex", 
        alignItems: "center", 
        color: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
         }} className="navbar navbar-expand navbar-dark">
        <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary rounded-3 p-2 text-white shadow-sm d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
            <Stethoscope size={22} />
          </div>
          <span >MediFlow</span>
        </div>

          {currentUser && userProfileData && (
            <div style={{ 
              marginLeft: "16px", 
              paddingLeft: "16px", 
              borderLeft: "1px solid rgba(255,255,255,0.3)", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px"  }}>
                <User size={14} />
                <span style={{ fontWeight: "600", fontSize: "14px", lineHeight: "1.2" ,textTransform: "Capitalize"}}>
                  {getFullNameForHeader(userProfileData)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                <Building2 size={12} />
                <span style={{ 
                  fontSize: "10px", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px", 
                  color: "rgba(255,255,255,0.8)", 
                  fontWeight: "500" 
                }}>
                  {getEntidadForHeader(userEntidadData)}
                </span>
              </div>
            </div>
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
              <Route path="/CitaV2" element={<CitaV2 />} />
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




/*
//        setUserProfileData(perfil);
        // Simulación de la API de Entidad (Context-aware)
        setTimeout(() => {
            EntidadService.getEntidad().then(res => {
                cargarConfiguracionEntidades(res.data);
                const entidadesParaEstado = Object.values(ENTIDADES);
              setEntidadesCargados(entidadesParaEstado);
              setEntidadNombre(ENTIDADES.nombre);
//              alert("Datos API "+entidadesCargados.nombre+ "   ---" +JSON.stringify(entidadesCargados))
            });

         // setEntidadNombre("Clínica San Pablo - Sede Central");
        }, 1000);
  */
/*
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
*/


          //   const primerNombre = profile.primer_nombre || '';
          //   const apellidoPaterno = profile.apellido_paterno || '';
          //   const apellidoMaterno = profile.apellido_materno || '';

              // Concatenar y limpiar espacios extra
              //const fullName = `${primerNombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
          //  const fullName = `${primerNombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();

              // Si el nombre completo está vacío después de la concatenación, usar el username


              //   alert("Entidad  "+JSON.stringify(Entidad)+ "   NOMBRE  "+Entidad.nombre)
//                setEntidadNombre("Entidad nombre "+Entidad.nombre);
//                const entidadesParaEstado = Object.values(ENTIDAD);
//                setEntidadesCargados(entidadesParaEstado);



/*
          {currentUser && userProfileData && (
            <li className="nav-item">
              <span style={{ color: "white", padding: '8px 12px', display: 'block' }}>
                 {getFullNameForHeader(userProfileData)}
                 {getEntidadForHeader(userEntidadData)}
              </span>
              <span style={{ color: "white", padding: '8px 12px', display: 'block' }}>
              </span>
            </li>
          )}

*/


/**
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
 */