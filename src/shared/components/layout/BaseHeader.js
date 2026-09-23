import { useState } from "react";
import { HeartPulse, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationDrawer } from "./NavigationDrawer";


export const BaseHeader = ({ user, bgColor, onLogout, children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getFullName = (profile) => {
    if (!profile) return 'Usuario';
    return profile.nombresUsuario?.toLowerCase().trim() || profile.username || 'Usuario';
  };

  const getInitial = (profile) => {
    const name = getFullName(profile);
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleLogoutInDrawer = () => {
    setIsDrawerOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <>
      <header 
        className="mediflow-header" 
        style={{ 
          background: bgColor || "#0066FF",
          padding: '0 16px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div 
          className="header-top-bar" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          {/* LADO IZQUIERDO: MENÚ HAMBURGUESA + MARCA E ÍCONO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user && (
              <button 
                onClick={() => setIsDrawerOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: '6px',
                  WebkitTapHighlightColor: 'transparent',
                }}
                aria-label="Abrir Menú Principal"
              >
                <Menu size={22} strokeWidth={2.2} />
              </button>
            )}

            <div 
              className="brand-group" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer' 
              }}
              onClick={() => user && setIsDrawerOpen(true)}
            >
              {/* ÍCONO DE SALUD LIMPIO SIN CAJA DE FONDO */}

              <HeartPulse size={24} color="#FFFFFF" strokeWidth={2.3} />
              
              <span 
                className="brand-text" 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: '700', 
                  fontSize: '18px',
                  letterSpacing: '-0.3px',
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
              >
                MiClinica
              </span>
            </div>
          </div>

          {/* LADO DERECHO: AVATAR EN CÍRCULO BLANCO */}
          <div className="header-right-group">
            {user ? (
              <button
                onClick={() => setIsDrawerOpen(true)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  color: '#0066FF',
                  fontWeight: '700',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                  WebkitTapHighlightColor: 'transparent',
                }}
                title={getFullName(user)}
              >
                {getInitial(user)}
              </button>
            ) : (
              <div className="auth-links" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Link to="/login" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  style={{ 
                    color: '#0066FF', 
                    backgroundColor: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none', 
                    fontSize: '13.5px', 
                    fontWeight: '600' 
                  }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO INFERIOR OPCIONAL */}
      {children && (
        <div className="header-bottom-content">
          {children}
        </div>
      )}

      {/* PANEL DESPLEGABLE LATERAL */}
      <NavigationDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        onLogout={handleLogoutInDrawer}
      />
    </>
  );
};