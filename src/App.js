import { Routes, Route, Navigate,  useNavigate} from "react-router-dom";
import { useAuth } from "./components/context/AuthContext";
import { BaseHeader } from "./shared/components/layout/BaseHeader";
import { MedicoRouter } from "./apps/medicos-app/routes/MedicoRouter";
import Login from "./components/Login/Login";
//import Signup from "./components/Login/Signup";
import Signup from "./shared/components/Signup";


//import CitaV2 from "./components/Cita/CitaV2";
import AuthService from "./master-data/services/auth.service";
//import { useState } from "react";
import PacientePage from "./apps/paciente-app/pages/PacientePage";
function App() {
  // Extraemos todo del contexto (ya no necesitamos estados locales ni useEffects aquí)
  const { user, loading } = useAuth();
  const Authority = user?.rol; // Usamos el rol que viene del perfil decodificado
  const navigate = useNavigate();
  //const [userName, setUserName] = useState(undefined);
  //const [userProfileData, setUserProfileData] = useState(null); 

  if (loading) return <div className="loading-screen">Cargando MediFlow...</div>;

  const logOut = () => {
  AuthService.logout(); // Limpia sessionStorage

  //setUserProfileData(null);    
  navigate("/login");
};

  return (
    <div className="App" style={{ minHeight: '100vh', backgroundColor: "#f8f9fa" }}>
      <Routes>
        {/* 1. RUTAS PÚBLICAS: Usamos el BaseHeader básico (sin datos de usuario) */}
        <Route path="/login" element={
          <>
            <BaseHeader /> 
            <Login />
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <BaseHeader />
            <Signup />
          </>
        } />

        {/* 2. REDIRECCIÓN INICIAL: El "Semáforo" de roles */}
        <Route path="/" element={
          !user ? <Navigate to="/login" replace /> : 
          (Authority === 'Medicos' ? <Navigate to="/med/agenda" replace /> : <Navigate to="/paciente/citas" replace />)
        } />

        {/* 3. MUNDO MÉDICO: El MedicoRouter ya incluye el Layout con el BaseHeader completo */}
        <Route path="/med/*" element={
          user?.rol === 'Medicos' ? <MedicoRouter onLogout={logOut}/> : <Navigate to="/login" replace />
        } />

         {/* 4. MUNDO PACIENTE */}
        <Route path="/paciente/*" element={
          user?.rol === 'Usuarios' ? <PacientePage onLogout={logOut}/> : <Navigate to="/login" replace />
        } />

        {/* 5. COMODÍN: Cualquier otra ruta vuelve al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;




 