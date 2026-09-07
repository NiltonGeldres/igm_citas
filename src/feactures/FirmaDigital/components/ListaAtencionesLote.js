export const ListaAtencionesLote = ({ 
  pasoActual, 
  atenciones, 
  atencionSeleccionada, 
  alSeleccionarAtencion, 
  alAccionarBotonPaso 
}) => {
  return (
    <div className="fd-panel-list">
      <div className="fd-panel-header">
        <span className="fd-panel-title">
          {pasoActual === 1 && 'ATENCIONES DISPONIBLES'}
          {pasoActual === 2 && 'ESTADO DE LA CARPETA SALIDA'}
          {pasoActual === 3 && 'CONFIRMACIÓN DE LOTE FIRMADO'}
        </span>
        <span className="fd-count-tag">
          {atenciones.filter(a => a.estado === 'DESCARGADO' || a.estado === 'FIRMADO').length} Listos
        </span>
      </div>

      <button
        type="button"
        onClick={alAccionarBotonPaso}
        className={`fd-action-btn paso-${pasoActual}`}
      >
        {pasoActual === 1 && '📥 Descargar PDFs a C:\\ReFirma\\Entrada'}
        {pasoActual === 2 && '💻 Cargar / Abrir ReFirma PC'}
        {pasoActual === 3 && '🚀 Confirmar Guardado'}
      </button>

      <div className="fd-items-scroll">
        {atenciones.map((item) => {
          const esSeleccionado = atencionSeleccionada?.id === item.id;
          const esPendientePaso1 = pasoActual === 1 && item.estado === 'PENDIENTE';
          const esOmitidoPaso2 = pasoActual === 2 && item.estado !== 'FIRMADO';

          return (
            <div
              key={item.id}
              onClick={() => !esPendientePaso1 && alSeleccionarAtencion(item)}
              className={`fd-item-card ${esSeleccionado ? 'selected' : ''} ${item.estado === 'FIRMADO' ? 'firmado' : ''} ${esOmitidoPaso2 ? 'omitido' : ''} ${esPendientePaso1 ? 'disabled' : ''}`}
            >
              <div className="fd-item-body">
                <input type="checkbox" checked={item.seleccionado} readOnly disabled={esPendientePaso1} />
                <div>
                  <div className="fd-patient-name">{item.pacienteNombre}</div>
                  <div className="fd-file-name">{item.nombreArchivo}</div>
                  <div className={`fd-item-status ${item.estado === 'FIRMADO' ? 'ok' : 'info'}`}>
                    {item.estado === 'FIRMADO' && '✓ Detectado en Salida (Vista Habilitada)'}
                    {item.estado === 'DESCARGADO' && '✓ Descargado en C:\\ReFirma\\Entrada'}
                    {item.estado === 'PENDIENTE' && '⌛ Pendiente de descarga'}
                    {esOmitidoPaso2 && '🚫 No detectado en Salida (Vista Bloqueada)'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};