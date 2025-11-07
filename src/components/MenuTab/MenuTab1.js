// src/components/MenuTab2.js
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service"; // Mantener si necesitas el nombre de usuario

// Importa los iconos de Lucide React
import { Users, FileText, Receipt, Calendar } from 'lucide-react';
import Styles from '../../Styles'; // Importa los estilos globales

const MenuTab1 = () => {
  const navigate = useNavigate();
  const USERNAME = AuthService.getCurrentUsername(); // Puedes usarlo para mostrar el nombre de usuario si lo deseas

  return (
    <div style={Styles.menuTab2Container}>
      {/* Contenedor de iconos de navegación */}
      <div style={Styles.iconNavigationGrid}>
        {/* Botón para "Citados" */}
        <button
          style={Styles.iconNavigationButton}
          onClick={() => navigate('/Cita')} // Navega a la ruta /citados
          aria-label="Ver Pacientes Citados"
        >
          <Users size={Styles.iconNavigationIconSize} style={Styles.iconNavigationIcon} />
          <span style={Styles.iconNavigationText}>Nueva Cita</span>
        </button>

        {/* Botón para "Atenciones" */}
        <button
          style={Styles.iconNavigationButton}
          onClick={() => navigate('/CitaSeparada')} // Navega a la ruta /atenciones
          aria-label="Registrar Atenciones Médicas"
        >
          <FileText size={Styles.iconNavigationIconSize} style={Styles.iconNavigationIcon} />
          <span style={Styles.iconNavigationText}>Mis Citas</span>
        </button>

        {/* Botón para "Facturación" */}
        <button
          style={Styles.iconNavigationButton}
          onClick={() => navigate('/Usuario')} // Navega a la ruta /facturacion
          aria-label="Acceder a Facturación"
        >
          <Receipt size={Styles.iconNavigationIconSize} style={Styles.iconNavigationIcon} />
          <span style={Styles.iconNavigationText}>Datos Personales</span>
        </button>

      </div>

      {/* Este componente ya NO renderiza el contenido de las secciones directamente.
          El contenido se renderizará a través de las rutas definidas en App.js. */}
      {/* <div style={Styles.menuTab2Content}></div> */}
    </div>
  );
};

export default MenuTab1;

/*
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab,Row,Col, Container,FormLabel } from "react-bootstrap";
import CitaSeparada from "../CitaSeparada/CitaSeparada";
import Cita from "../Cita/Cita";
import Usuario from "../Login/Usuario";
import AuthService from "../Login/services/auth.service";

const MenuTab1 = () => {
 const [loading, setLoading]  = useState(false);
 const navigate = useNavigate();
 const  USERNAME = AuthService.getCurrentUsername();
 const [actualizaCitas, setActualizaCitas] = useState(false);

return (

 <div>

    <Tabs id="tabs" justify   defaultActiveKey="adicional"  className=" App-tab mb-3 p-0 " >
        <Tab eventKey="1" title="Citas">
        <Cita ></Cita>
      </Tab>

        <Tab eventKey="2" title="Mis Citas" >
            <CitaSeparada ></CitaSeparada>
          <br></br>
        </Tab>

      <Tab eventKey="3" title="Datos">
      <Usuario ></Usuario>
      </Tab>
    </Tabs> 
 </div>

)

}

export default MenuTab1;

*/