import { Stethoscope, User, Building2 } from "lucide-react";

export const BaseHeader = ({ userName, entityName, bgColor = "rgb(0, 120, 245)", children }) => {
  return (
    <header className="mediflow-header" style={{ background: bgColor }}>
      <div className="header-top-bar">
        
        {/* LADO IZQUIERDO: LOGO */}
        <div className="brand-section">
          <div className="brand-icon">
            <Stethoscope size={22} />
          </div>
          <span className="brand-name">MediFlow</span>
        </div>

        {/* LADO DERECHO: USUARIO Y ENTIDAD */}
        {userName && (
          <div className="user-profile-info">
            <div className="user-name">
              <User size={14} />
              <span>{userName}</span>
            </div>
            
            {/* AQUÍ ESTABA EL ERROR: El bloque de entidad necesitaba su propio div */}
            {entityName && (
              <div>  
                <Building2 size={12} />
                <span>{entityName}</span>
              </div>
            )}
          </div>
        )}
        
      </div> {/* Cierre de header-top-bar */}

      {/* Contenido extra (Título de la página) */}
      {children}
    </header>
  );
};