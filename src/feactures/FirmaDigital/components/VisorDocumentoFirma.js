export const VisorDocumentoFirma = ({ pasoActual, atencion }) => {
  if (!atencion) return null;
  const estaBloqueadoEnPaso2 = pasoActual === 2 && atencion.estado !== 'FIRMADO';

  return (
    <div className="fd-panel-viewer">
      <div className="fd-viewer-tag">
        VISTA PREVIA BORRADOR: {atencion.nombreArchivo}
      </div>

      {estaBloqueadoEnPaso2 ? (
        <div className="fd-locked-preview">
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔒</div>
          <h4 style={{ color: '#fca5a5', margin: '0 0 8px 0' }}>VISUALIZACIÓN NO DISPONIBLE</h4>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
            Este documento no ha sido detectado en la carpeta de salida <code style={{ color: '#fde047' }}>C:\ReFirma\Salida</code>.
          </p>
        </div>
      ) : (
        <div className="fd-document-paper">
          <div>
            <div className="fd-doc-header">
              <div>
                <h2 className="fd-doc-title">INFORME DE ATENCIÓN MÉDICA</h2>
                <span className="fd-doc-meta">IGM Salud - Clínica Privada</span>
              </div>
              <span className="fd-doc-meta">Fecha: {atencion.fecha}</span>
            </div>

            <div className="fd-doc-content">
              <p><strong>PACIENTE:</strong> {atencion.pacienteNombre} (DNI: {atencion.dni})</p>
              <p><strong>ANAMNESIS:</strong> {atencion.anamnesis}</p>
              <p><strong>DIAGNÓSTICO:</strong> {atencion.diagnostico}</p>
              <p><strong>TRATAMIENTO:</strong> {atencion.tratamiento}</p>
            </div>
          </div>

          <div>
            {pasoActual === 3 && atencion.estado === 'FIRMADO' ? (
              <div className="fd-stamp-box signed">
                <span style={{ fontWeight: 'bold', color: '#166534', fontSize: '12px', display: 'block' }}>FIRMADO DIGITALMENTE</span>
                <span style={{ fontSize: '11px', color: '#15803d', display: 'block' }}>Dr. Nilton Cesar Geldres Cayo</span>
                <span style={{ fontSize: '10px', color: '#16a34a', display: 'block' }}>Estándar PAdES / PKI RENIEC</span>
              </div>
            ) : (
              <div className="fd-stamp-box pending">
                <span style={{ fontWeight: 'bold', color: '#075985', fontSize: '12px', display: 'block' }}>PENDIENTE DE FIRMA</span>
                <span style={{ fontSize: '11px', color: '#0284c7', display: 'block' }}>Documento Borrador Temp - Sin validez legal</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};