import React from 'react';

export function VisorPdfGCS({ urlPdfFirmado, titulo = "Vista previa del Documento PDF" }) {
  // Obtiene la base pública de R2 desde .env
  const baseUrl = process.env.REACT_APP_URL_ARCHIVOS || '';
  console.log("BASE DE ARCHIVOS   "+baseUrl) 

  // Función para transformar la ruta relativa a URL absoluta válida
  const obtenerUrlCompleta = (path) => {
    if (!path) return null;
    
    // Si la URL ya empieza con http:// o https://, la deja tal cual
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Limpia la barra inicial del path si existe para evitar doble barra "//"
    const pathLimpia = path.startsWith('/') ? path.substring(1) : path;
    
    // Limpia la barra final de la URL base si existe
    const baseLimpia = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;

    return `${baseLimpia}/${pathLimpia}`;
  };

  const urlAbsoluta = obtenerUrlCompleta(urlPdfFirmado);

  if (!urlAbsoluta) {
    return (
      <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
        <p style={{ color: '#64748b', margin: 0 }}>No hay documento PDF disponible para previsualizar.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '650px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <iframe
        src={urlAbsoluta}
        width="100%"
        height="100%"
        title={titulo}
        style={{ border: 'none' }}
      />
    </div>
  );
}