import React, { useState, useEffect } from 'react';

export const VisorDocumentoFirma = ({ pasoActual, atencion }) => {
  const [cargandoPdf, setCargandoPdf] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);

  // Obtiene la base pública real desde tu .env (igual que VisorPdfGCS)
  const baseUrl = process.env.REACT_APP_URL_ARCHIVOS || '';

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

  // Determinar qué propiedad trae la ruta según el estado (Borrador o Firmado)
  const rutaRelativa = atencion?.rutaPdfFirmado || atencion?.rutaPdfBorrador || atencion?.rutaPdf;
  const urlAbsoluta = obtenerUrlCompleta(rutaRelativa);

  // Resetear estados al cambiar de atención seleccionada
  useEffect(() => {
    if (atencion) {
      setCargandoPdf(true);
      setErrorCarga(false);
    }
  }, [atencion?.id, urlAbsoluta]);

  if (!atencion) {
    return (
      <div style={styles.contenedorVacio}>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Selecciona una atención médica de la lista para previsualizar el documento PDF.
        </p>
      </div>
    );
  }

  const manejarIframeCargado = () => {
    setCargandoPdf(false);
  };

  const manejarErrorIframe = () => {
    setCargandoPdf(false);
    setErrorCarga(true);
  };

  return (
    <div style={styles.cardContenedor}>
      {/* Cabecera del Visor */}
      <div style={styles.headerVisor}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={styles.tituloPaciente}>{atencion.pacienteNombre}</h2>
            <span style={styles.badgeHc}>H.C. / DNI: {atencion.dni}</span>
          </div>
          <p style={styles.subtituloDetalle}>
            {atencion.especialidad || 'Especialidad'} — {atencion.servicio || 'Servicio'} | Fecha: {atencion.fecha}
          </p>
        </div>

        {/* Acciones Rápidas */}
        {urlAbsoluta && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a
              href={urlAbsoluta}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.botonExterno}
              title="Abrir PDF en pestaña nueva"
            >
              ↗ Abrir en navegador
            </a>
          </div>
        )}
      </div>

      {/* Indicadores de Estado de Firma */}
      <div style={styles.barraMetadata}>
        <span style={styles.metaLabel}>Archivo:</span>
        <code style={styles.metaValue}>{atencion.nombreArchivo || `atencion_${atencion.id}.pdf`}</code>
        
        <span style={{ margin: '0 8px', color: '#334155' }}>|</span>

        <span style={styles.metaLabel}>Estado actual:</span>
        <span style={{
          ...styles.badgeEstado,
          backgroundColor: atencion.estado === 'FIRMADO' ? '#065f46' : '#854d0e',
          color: atencion.estado === 'FIRMADO' ? '#a7f3d0' : '#fef08a'
        }}>
          {atencion.estado}
        </span>

        {atencion.hashFirmaDigital && (
          <>
            <span style={{ margin: '0 8px', color: '#334155' }}>|</span>
            <span style={styles.metaLabel}>Hash:</span>
            <code style={styles.metaValue}>{atencion.hashFirmaDigital.substring(0, 16)}...</code>
          </>
        )}
      </div>

      {/* Área del Visor de PDF */}
      <div style={styles.contenedorIframe}>
        {!urlAbsoluta ? (
          <div style={styles.overlayError}>
            <p style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '8px' }}>
              Sin ruta de PDF registrada
            </p>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
              La atención no cuenta con un archivo asociado en la base de datos.
            </p>
          </div>
        ) : (
          <>
            {cargandoPdf && (
              <div style={styles.overlayCarga}>
                <p style={{ color: '#38bdf8', fontSize: '13px', margin: 0 }}>
                  Cargando documento PDF...
                </p>
              </div>
            )}

            {errorCarga ? (
              <div style={styles.overlayError}>
                <p style={{ color: '#f87171', fontWeight: 'bold', marginBottom: '8px' }}>
                  No se pudo visualizar el PDF.
                </p>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '16px' }}>
                  Verifica que la variable <code style={{ color: '#38bdf8' }}>REACT_APP_URL_ARCHIVOS</code> esté apuntando al servidor o bucket R2 correcto.
                </p>
                <a href={urlAbsoluta} target="_blank" rel="noreferrer" style={styles.botonDescargaFallback}>
                  Abrir enlace directo
                </a>
              </div>
            ) : (
              <iframe
                key={urlAbsoluta}
                src={urlAbsoluta}
                title={`PDF Atención ${atencion.id}`}
                style={styles.iframePdf}
                onLoad={manejarIframeCargado}
                onError={manejarErrorIframe}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Estilos integrados
const styles = {
  cardContenedor: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '620px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  contenedorVacio: {
    backgroundColor: '#0f172a',
    border: '1px border-dashed #1e293b',
    borderRadius: '8px',
    padding: '48px',
    textAlign: 'center',
    height: '100%'
  },
  headerVisor: {
    padding: '12px 16px',
    borderBottom: '1px solid #1e293b',
    backgroundColor: '#090d16',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tituloPaciente: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#f8fafc'
  },
  badgeHc: {
    fontSize: '11px',
    color: '#38bdf8',
    backgroundColor: '#0c4a6e',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  subtituloDetalle: {
    margin: '4px 0 0 0',
    fontSize: '11px',
    color: '#94a3b8'
  },
  barraMetadata: {
    padding: '6px 16px',
    backgroundColor: '#020617',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px'
  },
  metaLabel: {
    color: '#64748b',
    marginRight: '6px'
  },
  metaValue: {
    color: '#cbd5e1',
    fontFamily: 'monospace'
  },
  badgeEstado: {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  botonExterno: {
    fontSize: '11px',
    color: '#38bdf8',
    textDecoration: 'none',
    border: '1px solid #0284c7',
    padding: '4px 10px',
    borderRadius: '4px',
    backgroundColor: '#0c4a6e'
  },
  contenedorIframe: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1e293b',
    minHeight: '500px'
  },
  iframePdf: {
    width: '100%',
    height: '100%',
    border: 'none',
    minHeight: '520px'
  },
  overlayCarga: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f172a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5
  },
  overlayError: {
    padding: '32px',
    textAlign: 'center',
    backgroundColor: '#0f172a',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonDescargaFallback: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: '600'
  }
};