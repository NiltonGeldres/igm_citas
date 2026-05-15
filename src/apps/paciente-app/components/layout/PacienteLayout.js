import { BaseHeader } from "../../../../shared/components/layout/BaseHeader";
//import { useAuth } from "../../../../components/context/AuthContext"; // Importante para los datos
import { useAuth } from "../../../../shared/context/AuthContext"; // Importante para los datos

export const PacienteLayout = ({ children , onLogout}) => {
  // Extraemos los datos reales del contexto
  const { user, entidad } = useAuth();

  return (
    <div className="medico-app-container">
      <BaseHeader 
        user={user} 
        entidad={entidad}
        bgColor="linear-gradient(135deg, #0078f5 0%, #0056b3 100%)"
        onLogout={onLogout}
      >
        {/* 2. Este es el 'children' del header, aparecerá debajo del nombre del médico */}
        <div className="header-page-title" style={{ padding: '0 0.5rem 1rem' }}>
          <h4 style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>Mi Agenda</h4>
        </div>
      </BaseHeader>

      {/* 3. Contenido de la página */}
      <main className="medico-main-content">
        {children}
      </main>

    </div>
  );
};

