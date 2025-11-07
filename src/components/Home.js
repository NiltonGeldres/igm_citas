// src/components/Home.js
import React from "react";

const Home = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: '#007bff', fontSize: '2.5em', marginBottom: '15px' }}>Bienvenido a Nuestro Sistema Médico</h1>
      <p style={{ color: '#555', fontSize: '1.2em', maxWidth: '600px', lineHeight: '1.6' }}>
        Ofrecemos soluciones integrales para la gestión de pacientes, atención médica, facturación y programación.
        Nuestro objetivo es optimizar tus procesos y mejorar la calidad del servicio.
      </p>
      <p style={{ color: '#777', fontSize: '1em', marginTop: '20px' }}>
        Inicia sesión para acceder a todas las funcionalidades.
      </p>
      {/* Puedes añadir más contenido de marketing aquí */}
    </div>
  );
};

export default Home;
