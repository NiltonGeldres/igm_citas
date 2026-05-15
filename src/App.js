import { Routes, Route, Navigate,  useNavigate} from "react-router-dom";
import {useAuth} from "../src/shared//context/AuthContext"
//import { useAuth } from "./components/context/AuthContext";
import { BaseHeader } from "./shared/components/layout/BaseHeader";
import { MedicoRouter } from "./apps/medicos-app/routes/MedicoRouter";
//import Login from "./components/Login/Login";
import Login from "../src/shared/components/Login";
import Signup from "./shared/components/Signup";
import AuthService from "./master-data/services/auth.service";
import PacientePage from "./apps/paciente-app/pages/PacientePage";

function App() {
  const { user, loading } = useAuth();
  const Authority = user?.rol; 
  const navigate = useNavigate();

  if (loading) return <div className="loading-screen">Cargando MediFlow...</div>;
    const logOut = () => {
    AuthService.logout(); // Limpia sessionStorage
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
//          (Authority === 4 ? <Navigate to="/med/agenda" replace /> : <Navigate to="/paciente/citas" replace />)
        } />

        {/* 3. MUNDO MÉDICO: El MedicoRouter ya incluye el Layout con el BaseHeader completo */}
        <Route path="/med/*" element={
          user?.rol === 'Medicos' ? <MedicoRouter onLogout={logOut}/> : <Navigate to="/login" replace />
//          user?.idRol === 4 ? <MedicoRouter onLogout={logOut}/> : <Navigate to="/login" replace />
        } />

         {/* 4. MUNDO PACIENTE */}
        <Route path="/paciente/*" element={
          user?.rol === 'Usuarios' ? <PacientePage onLogout={logOut}/> : <Navigate to="/login" replace />
//          user?.idRol === 2 ? <PacientePage onLogout={logOut}/> : <Navigate to="/login" replace />
        } />

        {/* 5. COMODÍN: Cualquier otra ruta vuelve al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;




 