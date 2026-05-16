import { Stethoscope, User, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

//export const BaseHeader = ({ user, entidad, bgColor, onLogout, children }) => {
export const BaseHeader = ({ user,  bgColor, onLogout, children }) => {
//console.log("User in  BaseHeader"+JSON.stringify(user))
  // Lógica de formateo de nombre
  const getFullName = (profile) => {
    if (!profile) return 'Usuario';
//    return profile.usuarioNombres?.toLowerCase().trim() || profile.username || 'Usuario';
    return profile.nombresUsuario?.toLowerCase().trim() || profile.username || 'Usuario';
  };


  return (
    <header className="mediflow-header" style={{ background: bgColor || "rgb(0, 120, 245)" }}>
      {/* FILA PRINCIPAL: LOGO + INFO + LOGOUT */}
      <div className="header-top-bar">
        
        {/* GRUPO IZQUIERDO: LOGO Y DATOS */}
        <div className="header-left-group">
          {/* Logo MediFlow */}
          <div className="brand-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
            <div className="brand-icon-box">
              <Stethoscope size={22} />
            </div>
            <span  className="brand-text"  >MiClinica</span>
          </div>

          {/* Separador y Datos del Usuario */}
          {user && (
            <div>
              {/* Fila 1: Usuario */}
              <div className="info-row">
                <User size={14} />
                <span className="user-name-text" >
                  {getFullName(user)}
                </span>
              </div>
              
              {/* Fila 2: Entidad */}
              {user && (
                <div className="info-row" >                  
                  <Building2 size={12} />
                    <span className="entity-name-text">{user.nombreEntidad} </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* GRUPO DERECHO: ACCIONES */}
        <div className="header-right-group">
          {user ? (
            <button 
              onClick={onLogout} 
              style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}
            >
              Logout
            </button>
          ) : (
            <div className="auth-links" style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Login</Link>
              <Link to="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Sign up</Link>
            </div>
          )}
        </div>
      </div>

      {/* CONTENIDO INFERIOR: TÍTULO DE PÁGINA (Children) */}
    </header>
  );
};

/**
 * 
   {children && (
        <div className="header-bottom-content" style={{ marginTop: '15px' }}>
          {children}
        </div>
      )}
    
 */