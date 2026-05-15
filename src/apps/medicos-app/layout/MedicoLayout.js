import { MedicoFooter } from './MedicoFooter';
import { BaseHeader } from '../../../shared/components/layout/BaseHeader';
import { useAuth } from '../../../shared/context/AuthContext';
//import { useAuth } from '../../../components/context/AuthContext';
export const MedicoLayout = ({ children , onLogout}) => {
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

      <MedicoFooter /> 
    </div>
  );
};

/*
import { Calendar as CalendarIcon } from "lucide-react";
import { MedicoFooter } from './MedicoFooter'; // <-- AQUÍ LO IMPORTAMOS
import { BaseHeader } from "../../../../shared/components/layout/BaseHeader";


export const MedicoLayout = ({ children, nombreMedico }) => {
  return (
    <div className="medico-app-container">
         <div className="header-page-title" style={{ padding: '0 1.5rem 1rem' }}>
          <h4 style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>Mi Agenda</h4>
        <BaseHeader/>
        </div>
      <main className="medico-main-content">
        {children}
      </main>

      <MedicoFooter /> 
    </div>
  );
};

*/