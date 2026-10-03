import { useState, useMemo } from 'react';
import { X, Search, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCapitalize } from '../utils/textFormatter';

export default function AtencionMedicaHistoriaClinicaDrawer({
  isOpen,
  onClose,
  patientData,
  historiaClinicaData = [],
  alertasMedicas = [],
  onCopiarAnamnesis,
  onCopiarReceta
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [especialidadFiltro, setEspecialidadFiltro] = useState('TODAS');

  // 1. Extraer lista de especialidades únicas para el filtro (protegido contra null)
  const especialidadesUnicas = useMemo(() => {
    const setEsp = new Set();
    const listaData = Array.isArray(historiaClinicaData) ? historiaClinicaData : [];

    listaData.forEach(item => {
      if (item?.especialidad) setEsp.add(item.especialidad);
    });
    return Array.from(setEsp);
  }, [historiaClinicaData]);

  // 2. Filtrado por texto y especialidad (protegido contra null)
  const atencionesFiltradas = useMemo(() => {
    const listaData = Array.isArray(historiaClinicaData) ? historiaClinicaData : [];

    return listaData.filter(atencion => {
      if (!atencion) return false;
      const matchEsp = especialidadFiltro === 'TODAS' || atencion.especialidad === especialidadFiltro;

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchEsp;

      const matchMedico = atencion.medico?.toLowerCase().includes(term);
      const matchDx = atencion.diagnostico?.toLowerCase().includes(term) || atencion.codigoCie10?.toLowerCase().includes(term);
      const matchSintomas = atencion.anamnesis?.toLowerCase().includes(term);
      const matchEspecialidad = atencion.especialidad?.toLowerCase().includes(term);

      return matchEsp && (matchMedico || matchDx || matchSintomas || matchEspecialidad);
    });
  }, [historiaClinicaData, searchTerm, especialidadFiltro]);

  // 3. LA VALIDACIÓN DE APERTURA VA DESPUÉS DE DECLARAR TODOS LOS HOOKS
  if (!isOpen) return null;

  const listaAlertas = Array.isArray(alertasMedicas) ? alertasMedicas : [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '650px',
      backgroundColor: '#f8fafc',
      zIndex: 1100,
      boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      {/* HEADER PRINCIPAL OSCURO */}
      <div style={{ backgroundColor: '#005b70', color: '#ffffff', padding: '16px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#38bdf8" />
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '0.3px' }}>
              HISTORIA CLÍNICA ELECTRÓNICA
            </h2>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              H.C. {patientData?.hc || patientData?.id || '—'}
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* DATOS DEL PACIENTE Y BADGES DE ALERTAS */}
        <div style={{ fontSize: '13px', color: '#e0f2fe', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <span><strong>Paciente:</strong> {formatCapitalize(patientData?.name || patientData?.nombre || '—')}</span>
            <span><strong>Edad:</strong> {patientData?.edad || '—'}</span>
            {patientData?.dni && <span><strong>DNI:</strong> {patientData.dni}</span>}
            {patientData?.grupoSanguineo && <span><strong>G. Sanguíneo:</strong> {patientData.grupoSanguineo}</span>}
          </div>

          {/* ALERTAS / RAM / ANTECEDENTES DESTACADOS */}
          {(listaAlertas.length > 0 || patientData?.ram) && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {patientData?.ram && (
                <span style={{
                  backgroundColor: '#991b1b',
                  color: '#fef2f2',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertTriangle size={12} /> RAM: {patientData.ram}
                </span>
              )}
              {listaAlertas.map((alerta, idx) => (
                <span key={idx} style={{
                  backgroundColor: alerta?.tipo === 'RAM' ? '#991b1b' : '#065f46',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {alerta?.tipo === 'RAM' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                  {alerta?.descripcion}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
          <input
            type="text"
            placeholder="Buscar por diagnóstico, médico o síntoma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px 7px 32px',
              fontSize: '12.5px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              outline: 'none'
            }}
          />
        </div>

        <select
          value={especialidadFiltro}
          onChange={(e) => setEspecialidadFiltro(e.target.value)}
          style={{
            padding: '7px 10px',
            fontSize: '12.5px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="TODAS">Todas las Especialidades</option>
          {especialidadesUnicas.map((esp, i) => (
            <option key={i} value={esp}>{esp}</option>
          ))}
        </select>
      </div>

      {/* CONTENIDO SCROLLABLE - LISTADO DE ATENCIONES */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {atencionesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '13px' }}>
            No se encontraron atenciones registradas que coincidan con la búsqueda.
          </div>
        ) : (
          atencionesFiltradas.map((item, index) => (
            <div key={item.idAtencion || index} style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              padding: '14px',
              position: 'relative'
            }}>

              {/* PUNTO DE LÍNEA DE TIEMPO LATERAL */}
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '-6px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? '#0284c7' : '#cbd5e1'
              }} />

              {/* CABECERA DE LA CARD DE ATENCIÓN */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                    {item.fecha} • {item.origenAtencion || 'CONSULTA EXTERNA'}
                  </span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                    {item.especialidad} — <span style={{ color: '#334155', fontWeight: '600' }}>{item.medico}</span>
                  </h3>
                </div>

                {item.codigoCie10 && (
                  <span style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    CIE-10: {item.codigoCie10}
                  </span>
                )}
              </div>

              {/* GRID COMPACTO DE SIGNOS VITALES */}
              {item.signosVitales && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  display: 'flex',
                  gap: '16px',
                  fontSize: '12px',
                  color: '#475569',
                  marginBottom: '10px',
                  flexWrap: 'wrap'
                }}>
                  {item.signosVitales.pa && <span><strong>P.A.:</strong> {item.signosVitales.pa}</span>}
                  {item.signosVitales.fc && <span><strong>F.C.:</strong> {item.signosVitales.fc}</span>}
                  {item.signosVitales.temp && <span><strong>Temp:</strong> {item.signosVitales.temp}</span>}
                  {item.signosVitales.spo2 && <span><strong>SpO2:</strong> {item.signosVitales.spo2}</span>}
                  {item.signosVitales.imc && <span><strong>IMC:</strong> {item.signosVitales.imc}</span>}
                </div>
              )}

              {/* DIAGNÓSTICO Y CUADRO CLÍNICO */}
              <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: '10px', lineHeight: '1.4' }}>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>
                  Dx: {item.diagnostico}
                </div>
                {item.anamnesis && (
                  <div style={{ marginTop: '2px', color: '#64748b' }}>
                    {item.anamnesis}
                  </div>
                )}
              </div>

              {/* TRATAMIENTO PRESCRITO DESTACADO */}
              {item.tratamiento && (
                <div style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '12px',
                  color: '#92400e',
                  marginBottom: '12px'
                }}>
                  <strong style={{ display: 'block', marginBottom: '2px', color: '#b45309' }}>
                    Tratamiento prescrito:
                  </strong>
                  {item.tratamiento}
                </div>
              )}

              {/* BOTONES DE COPIADO RÁPIDO */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                {item.anamnesis && onCopiarAnamnesis && (
                  <button
                    type="button"
                    onClick={() => onCopiarAnamnesis(item.anamnesis)}
                    style={{
                      backgroundColor: '#f0f9ff',
                      color: '#0369a1',
                      border: '1px solid #bae6fd',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    + Copiar a Anamnesis
                  </button>
                )}

                {item.receta && onCopiarReceta && (
                  <button
                    type="button"
                    onClick={() => onCopiarReceta(item.receta)}
                    style={{
                      backgroundColor: '#f0fdf4',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    + Copiar Receta a Consulta Actual
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* FOOTER PRINCIPAL */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Mostrando {atencionesFiltradas.length} atenciones anteriores
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            backgroundColor: '#f1f5f9',
            color: '#334155',
            border: 'none',
            padding: '7px 16px',
            borderRadius: '6px',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Cerrar
        </button>
      </div>

    </div>
  );
}