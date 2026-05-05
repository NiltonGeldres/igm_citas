// src/components/MenuTab2.js
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service"; // Mantener si necesitas el nombre de usuario

// Importa los iconos de Lucide React
import { Users, FileText, Receipt, Calendar } from 'lucide-react';
import Styles from '../../Styles'; // Importa los estilos globales

const MenuTab2 = () => {
  const navigate = useNavigate();
  const USERNAME = AuthService.getCurrentUsername(); // Puedes usarlo para mostrar el nombre de usuario si lo deseas

  return (
    <div style={Styles.menuTab2Container}>
      {/* Contenedor de iconos de navegación */}
      <div style={Styles.iconNavigationGrid}>
        {/* Botón para "Citados" */}
        <button
          style={Styles.iconNavigationButton}
          onClick={() => navigate('/citados')} // Navega a la ruta /citados
          aria-label="Ver Pacientes Citados"
        >
          <Users size={Styles.iconNavigationIconSize} style={Styles.iconNavigationIcon} />
          <span style={Styles.iconNavigationText}>Citados</span>
        </button>

        {/* Botón para "Atenciones" */}
        <button
          style={Styles.iconNavigationButton}
          onClick={() => navigate('/atenciones')} // Navega a la ruta /atenciones
          aria-label="Registrar Atenciones Médicas"
        >
          <FileText size={Styles.iconNavigationIconSize} style={Styles.iconNavigationIcon} />
          <span style={Styles.iconNavigationText}>Atenciones</span>
        </button>

        {/* Botón para "Facturación" */}
        <button
          style={Styles.iconNavigationButton}
          onClick={() => navigate('/facturacion')} // Navega a la ruta /facturacion
          aria-label="Acceder a Facturación"
        >
          <Receipt size={Styles.iconNavigationIconSize} style={Styles.iconNavigationIcon} />
          <span style={Styles.iconNavigationText}>Facturación</span>
        </button>

        {/* Botón para "Programación" */}
        <button
          style={Styles.iconNavigationButton}
          onClick={() => navigate('/programacion')} // Navega a la ruta /programacion
          aria-label="Gestionar Programación Médica"
        >
          <Calendar size={Styles.iconNavigationIconSize} style={Styles.iconNavigationIcon} />
          <span style={Styles.iconNavigationText}>Programación</span>
        </button>
        {/* Botón para "Programación" */}
        <button
          style={Styles.iconNavigationButton}
          onClick={() => navigate('/programacionI')} // Navega a la ruta /programacion
          aria-label="Gestionar Programación Médica I"
        >
          <Calendar size={Styles.iconNavigationIconSize} style={Styles.iconNavigationIcon} />
          <span style={Styles.iconNavigationText}>Programación I</span>
        </button>
      </div>

      {/* Este componente ya NO renderiza el contenido de las secciones directamente.
          El contenido se renderizará a través de las rutas definidas en App.js. */}
      {/* <div style={Styles.menuTab2Content}></div> */}
    </div>
  );
};

export default MenuTab2;
