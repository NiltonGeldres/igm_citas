import { Calendar as CalendarIcon } from "lucide-react";
import { MedicoFooter } from './MedicoFooter'; // <-- AQUÍ LO IMPORTAMOS
import { BaseHeader } from "../../../../shared/components/layout/BaseHeader";


export const MedicoLayout = ({ children, nombreMedico }) => {
  return (
    <div className="medico-app-container">
      {/* Header con Degradado */}
    

      {/* Contenido de la página (Agenda, Facturación, etc.) */}
      <main className="medico-main-content">
        {children}
      </main>

      {/* Footer Fijo llamado como componente */}
      <MedicoFooter /> 
    </div>
  );
};