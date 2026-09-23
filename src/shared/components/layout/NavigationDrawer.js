import React from 'react';
import { User, Building2, LogOut, X, ShieldCheck, Settings, HelpCircle, ChevronRight } from "lucide-react";

export const NavigationDrawer = ({ isOpen, onClose, user, onLogout }) => {
  if (!isOpen) return null;

  const getFullName = (profile) => {
    if (!profile) return 'Usuario';
    return profile.nombresUsuario?.toLowerCase().trim() || profile.username || 'Usuario';
  };

  const getInitial = (profile) => {
    const name = getFullName(profile);
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        
        {/* CABECERA DEL PERFIL */}
        <div style={styles.profileHeader}>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Cerrar menú">
            <X size={20} />
          </button>

          <div style={styles.avatarBox}>
            <span style={styles.avatarText}>{getInitial(user)}</span>
          </div>

          <div style={styles.userDetails}>
            <h3 style={styles.userName}>{getFullName(user)}</h3>
            <p style={styles.userEmail}>{user?.email || 'Sesión Activa'}</p>
            
            {user?.nombreEntidad && (
              <div style={styles.entityBadge}>
                <Building2 size={13} style={{ flexShrink: 0 }} />
                <span style={styles.entityText}>{user.nombreEntidad}</span>
              </div>
            )}
          </div>
        </div>

        {/* CONTENIDO Y OPCIONES DEL MENÚ */}
        <div style={styles.menuBody}>
          <div style={styles.menuSection}>
            <span style={styles.sectionTitle}>MI CUENTA MÉDICA</span>
            
            <div style={styles.menuItem}>
              <div style={styles.menuItemLeft}>
                <User size={18} color="#0070F3" />
                <span>Perfil Profesional</span>
              </div>
              <ChevronRight size={16} color="#A0AEC0" />
            </div>

            <div style={styles.menuItem}>
              <div style={styles.menuItemLeft}>
                <ShieldCheck size={18} color="#0070F3" />
                <span>Firma Digital & Permisos</span>
              </div>
              <ChevronRight size={16} color="#A0AEC0" />
            </div>
          </div>

          <div style={styles.menuSection}>
            <span style={styles.sectionTitle}>SISTEMA</span>
            
            <div style={styles.menuItem}>
              <div style={styles.menuItemLeft}>
                <Settings size={18} color="#64748B" />
                <span>Configuración General</span>
              </div>
              <ChevronRight size={16} color="#A0AEC0" />
            </div>

            <div style={styles.menuItem}>
              <div style={styles.menuItemLeft}>
                <HelpCircle size={18} color="#64748B" />
                <span>Soporte Técnico</span>
              </div>
              <ChevronRight size={16} color="#A0AEC0" />
            </div>
          </div>
        </div>

        {/* FOOTER CON BOTÓN CERRAR SESIÓN */}
        <div style={styles.drawerFooter}>
          <button style={styles.logoutBtn} onClick={onLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
          <span style={styles.versionTag}>MiClinica v1.1.0</span>
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(3px)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  drawer: {
    width: '82%',
    maxWidth: '310px',
    height: '100%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '6px 0px 24px rgba(0, 0, 0, 0.18)',
    animation: 'slideRight 0.22s ease-out',
  },
  profileHeader: {
    background: 'linear-gradient(135deg, #0070F3 0%, #0051B3 100%)',
    color: '#FFFFFF',
    padding: '20px 18px 22px 18px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  closeBtn: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    background: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBox: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    color: '#0070F3',
    fontWeight: 'bold',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
  },
  avatarText: {
    lineHeight: 1,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  userName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  userEmail: {
    margin: 0,
    fontSize: '12px',
    opacity: 0.85,
  },
  entityBadge: {
    marginTop: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
    width: 'fit-content',
  },
  entityText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '210px',
  },
  menuBody: {
    flex: 1,
    padding: '18px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  menuSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: '0.6px',
    marginBottom: '6px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '11px 8px',
    borderRadius: '8px',
    fontSize: '13.5px',
    color: '#1E293B',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  menuItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '500',
  },
  drawerFooter: {
    padding: '16px 18px',
    borderTop: '1px solid #F1F5F9',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  logoutBtn: {
    width: '100%',
    padding: '11px',
    borderRadius: '8px',
    border: '1px solid #FCA5A5',
    backgroundColor: '#FEF2F2',
    color: '#E11D48',
    fontWeight: '600',
    fontSize: '13.5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  versionTag: {
    textAlign: 'center',
    fontSize: '10.5px',
    color: '#94A3B8',
  }
};