export const ListaAtencionesLote = ({
  pasoActual,
  atenciones,
  atencionSeleccionada,
  alSeleccionarAtencion,
  alAccionarBotonPaso
}) => {
  return (
    <div style={{
      backgroundColor: '#1b2433',
      border: '1px solid #2d3848',
      borderRadius: '8px',
      padding: '16px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffffff' }}>
          {pasoActual === 1 && 'PENDIENTE_DE_FIRMA'}
          {pasoActual === 2 && 'CARPETA SALIDA'}
          {pasoActual === 3 && 'LOTE CONFIRMADO'}
        </span>
        <span style={{ backgroundColor: '#b45309', color: '#fef3c7', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textAlign: 'right' }}>
          Lotes<br />3 / 15 Max
        </span>
      </div>

      <button
        type="button"
        onClick={alAccionarBotonPaso}
        style={{
          width: '100%',
          backgroundColor: '#00a3e0',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px',
          fontWeight: 'bold',
          fontSize: '12px',
          cursor: 'pointer',
          marginBottom: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        📥 PASO 1: Descargar Lote (.ZIP)
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        {atenciones.map((item) => {
          const esSeleccionado = atencionSeleccionada?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => alSeleccionarAtencion(item)}
              style={{
                backgroundColor: '#131c2a',
                border: esSeleccionado ? '2px solid #00a3e0' : '1px solid #243049',
                borderRadius: '6px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <input type="checkbox" checked={item.seleccionado} readOnly style={{ marginTop: '3px' }} />
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff' }}>{item.pacienteNombre}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                  HC: {item.dni} | Atenc: #{item.id}
                </div>
                <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>{item.nombreArchivo}</div>
                <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold', marginTop: '2px' }}>(PDF Borrador R2)</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};