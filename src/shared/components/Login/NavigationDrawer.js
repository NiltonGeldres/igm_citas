// src/shared/components/NavigationDrawer.js
import React from 'react';
import { useAuth } from '../../shared/context/AuthContext'; // Ajusta la ruta a tu AuthContext

const NavigationDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawerContainer} onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Perfil (Estilo BCP / BBVA) */}
        <div style={styles.profileHeader}>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
          
          <div style={styles.avatarCircle}>
            {user?.nombresUsuario ? user.nombresUsuario.charAt(0).toUpperCase() : 'M'}
          </div>
          
          <div style={styles.userInfo}>
            <h4 style={styles.userName}>{user?.nombresUsuario || 'Usuario'}</h4>
            <p style={styles.userEmail}>{user?.email || 'Sin correo registrado'}</p>
            {user?.nombreEntidad && (
              <span style={styles.entityBadge}>
                🏥 {user.nombreEntidad}
              </span>
            )}
          </div>
        </div>

        {/* Menú de opciones */}
        <div style={styles.menuContent}>
          <div style={styles.menuGroup}>
            <p style={styles.menuTitle}>CUENTA Y CLINICA</p>
            <div style={styles.menuItem}>
              <span>👤 Mi Perfil Profesional</span>
            </div>
            <div style={styles.menuItem}>
              <span>🏥 Configuración de Entidad</span>
            </div>
          </div>

          <div style={styles.menuGroup}>
            <p style={styles.menuTitle}>SISTEMA</p>
            <div style={styles.menuItem}>
              <span>⚙️ Ajustes de Aplicación</span>
            </div>
            <div style={styles.menuItem}>
              <span>❓ Soporte Técnico</span>
            </div>
          </div>
        </div>

        {/* Footer con opción de Logout y Versión */}
        <div style={styles.drawerFooter}>
          <button style={styles.logoutButton} onClick={handleLogout}>
            <span style={{ marginRight: '8px' }}>🚪</span> Cerrar Sesión
          </button>
          <p style={styles.versionText}>MiClinica v1.1.0</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    width: '82%',
    maxWidth: '320px',
    height: '100%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0px 16px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.25s ease-out',
  },
  profileHeader: {
    backgroundColor: '#0066FF',
    color: '#FFFFFF',
    padding: '24px 20px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '20px',
    cursor: 'pointer',
  },
  avatarCircle: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    color: '#0066FF',
    fontWeight: 'bold',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  userName: {
    margin: 0,
    fontSize: '17px',
    fontWeight: '600',
  },
  userEmail: {
    margin: 0,
    fontSize: '12px',
    opacity: 0.85,
  },
  entityBadge: {
    marginTop: '6px',
    display: 'inline-block',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
  },
  menuContent: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  menuGroup: {
    marginBottom: '24px',
  },
  menuTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#8A94A6',
    marginBottom: '10px',
    letterSpacing: '0.5px',
  },
  menuItem: {
    padding: '12px 0',
    borderBottom: '1px solid #F0F2F5',
    fontSize: '14px',
    color: '#333333',
    cursor: 'pointer',
  },
  drawerFooter: {
    padding: '20px',
    borderTop: '1px solid #F0F2F5',
  },
  logoutButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #FF4D4F',
    backgroundColor: '#FFF2F0',
    color: '#FF4D4F',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#A0AEC0',
    marginTop: '12px',
    marginBottom: 0,
  }
};

export default NavigationDrawer;