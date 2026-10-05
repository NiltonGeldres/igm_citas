import React, { useState, useMemo } from 'react';
import { X, Search, FileText, AlertTriangle, CheckCircle2, Pill, Activity, ExternalLink, Stethoscope, FileCheck } from 'lucide-react';
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

  // Normalizar lista de atenciones (Soporta si viene array directo o si pasa el JSON completo con .atenciones)
  const listaAtenciones = useMemo(() => {
    if (Array.isArray(historiaClinicaData)) return historiaClinicaData;
    if (historiaClinicaData && Array.isArray(historiaClinicaData.atenciones)) return historiaClinicaData.atenciones;
    return [];
  }, [historiaClinicaData]);

  // 1. Extraer lista de especialidades únicas para el filtro
  const especialidadesUnicas = useMemo(() => {
    const setEsp = new Set();
    listaAtenciones.forEach(item => {
      const esp = item?.nombreEspecialidad || item?.especialidad;
      if (esp) setEsp.add(esp);
    });
    return Array.from(setEsp);
  }, [listaAtenciones]);

  // 2. Filtrado por texto y especialidad
  const atencionesFiltradas = useMemo(() => {
    return listaAtenciones.filter(atencion => {
      if (!atencion) return false;
      const espName = atencion.nombreEspecialidad || atencion.especialidad || '';
      const matchEsp = especialidadFiltro === 'TODAS' || espName === especialidadFiltro;

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchEsp;

      const medico = (atencion.nombreMedicoIngreso || atencion.medico || '').toLowerCase();
      const especialidad = espName.toLowerCase();
      
      // Diagnósticos search
      const dxs = Array.isArray(atencion.diagnosticos) 
        ? atencion.diagnosticos.map(d => `${d.codigoCIE} ${d.descripcion}`).join(' ').toLowerCase() 
        : (atencion.diagnostico || '').toLowerCase();

      // Síntomas / Anamnesis search
      const sintomas = Array.isArray(atencion.sintomas)
        ? atencion.sintomas.map(s => s.nombreSintoma).join(' ').toLowerCase()
        : (atencion.anamnesis || '').toLowerCase();

      return matchEsp && (medico.includes(term) || dxs.includes(term) || sintomas.includes(term) || especialidad.includes(term));
    });
  }, [listaAtenciones, searchTerm, especialidadFiltro]);

  // Formateador de fecha amigable
  const formatFecha = (fechaRaw) => {
    if (!fechaRaw) return '—';
    try {
      const fecha = new Date(fechaRaw);
      return fecha.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaRaw;
    }
  };

  if (!isOpen) return null;

  // Normalizar datos de paciente
  const infoPaciente = patientData || historiaClinicaData?.patientData || {};
  const listaAlertas = Array.isArray(alertasMedicas) ? alertasMedicas : [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '680px',
      backgroundColor: '#f8fafc',
      zIndex: 1100,
      boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      {/* HEADER PRINCIPAL */}
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
              H.C. {infoPaciente?.hc || infoPaciente?.id || '—'}
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
            <span><strong>Paciente:</strong> {formatCapitalize(infoPaciente?.nombre || infoPaciente?.name || '—')}</span>
            <span><strong>Edad:</strong> {infoPaciente?.edad ? (typeof infoPaciente.edad === 'number' ? `${infoPaciente.edad} Años` : infoPaciente.edad) : '—'}</span>
            {infoPaciente?.sexo && <span><strong>Sexo:</strong> {infoPaciente.sexo}</span>}
            {infoPaciente?.dni && <span><strong>DNI:</strong> {infoPaciente.dni}</span>}
            {infoPaciente?.grupoSanguineo && <span><strong>G. Sanguíneo:</strong> {infoPaciente.grupoSanguineo}</span>}
          </div>

          {/* ALERTAS / RAM / ANTECEDENTES DESTACADOS */}
          {(listaAlertas.length > 0 || infoPaciente?.ram) && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {infoPaciente?.ram && (
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
                  <AlertTriangle size={12} /> RAM: {infoPaciente.ram}
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

      {/* LISTADO DE ATENCIONES */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {atencionesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '13px' }}>
            No se encontraron atenciones registradas que coincidan con la búsqueda.
          </div>
        ) : (
          atencionesFiltradas.map((item, index) => {
            // Mapeo unificado de variables según estructura JSON de la API
            const fechaAtencion = item.fechaAtencion || item.tsIngreso || item.fecha;
            const medico = item.nombreMedicoIngreso || item.medico || 'Médico no especificado';
            const especialidad = item.nombreEspecialidad || item.especialidad || 'Consulta Externa';
            const servicio = item.nombreServicio ? ` (${item.nombreServicio})` : '';
            
            // Unificación de Triajes / Signos vitales
            const listaTriajes = Array.isArray(item.triajes) 
              ? item.triajes 
              : Array.isArray(item.signosVitales) 
                ? item.signosVitales.map(sv => ({ nombreTriaje: sv.label, valorTriaje: sv.value })) 
                : [];

            // Unificación de Medicamentos / Receta
            const listaMedicamentos = Array.isArray(item.medicacion) 
              ? item.medicacion 
              : Array.isArray(item.receta) ? item.receta : [];

            // Unificación de Indicaciones de Alta / Tratamiento
            const indicacionesAlta = Array.isArray(item.alta) && item.alta.length > 0 
              ? item.alta.map(a => a.nombreAlta).join(', ') 
              : (typeof item.tratamiento === 'string' ? item.tratamiento : null);

            // Rutas PDF (Prioridad a Firmados)
            const pdfHistoria = item.pdfRutaHistoriaFirmado || item.pdfRutaHistoria || item.pdfHistoria;
            const pdfReceta = item.pdfRutaRecetaFirmado || item.pdfRutaReceta || item.pdfReceta;
            const pdfOrdenes = item.pdfRutaOrdenesFirmado || item.pdfRutaOrdenes || item.pdfOrdenes;

            return (
              <div key={item.idAtencion || item.idCita || index} style={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                padding: '14px',
                position: 'relative'
              }}>

                {/* INDICADOR LATERAL */}
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
                      {formatFecha(fechaAtencion)} • {item.nombreEntidad || item.origenAtencion || 'CONSULTA EXTERNA'}
                    </span>
                    <h3 style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      {especialidad}{servicio} — <span style={{ color: '#334155', fontWeight: '600' }}>{medico}</span>
                    </h3>
                  </div>

                  {item.estadoFirma && (
                    <span style={{
                      backgroundColor: item.estadoFirma === 'FIRMADO' ? '#dcfce7' : '#fef3c7',
                      color: item.estadoFirma === 'FIRMADO' ? '#15803d' : '#b45309',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FileCheck size={12} /> {item.estadoFirma}
                    </span>
                  )}
                </div>

                {/* SIGNOS VITALES / TRIAJE */}
                {listaTriajes.length > 0 && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    gap: '14px',
                    fontSize: '12px',
                    color: '#475569',
                    marginBottom: '10px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <Activity size={14} color="#0284c7" />
                    {listaTriajes.map((sv, idx) => (
                      <span key={idx}><strong>{sv.nombreTriaje}:</strong> {sv.valorTriaje}</span>
                    ))}
                  </div>
                )}

                {/* DIAGNÓSTICOS */}
                <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: '10px', lineHeight: '1.4' }}>
                  {Array.isArray(item.diagnosticos) && item.diagnosticos.length > 0 ? (
                    <div>
                      <strong style={{ color: '#0f172a' }}>Diagnóstico(s):</strong>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                        {item.diagnosticos.map((dx, dxIdx) => (
                          <li key={dxIdx}>
                            <span style={{ fontWeight: '700', color: '#0284c7' }}>[{dx.codigoCIE}]</span> {dx.descripcion} 
                            {dx.nombreSubclasificacion && <em style={{ color: '#64748b', fontSize: '11.5px' }}> ({dx.nombreSubclasificacion})</em>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : item.diagnostico ? (
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      Dx: {item.diagnostico} {item.codigoCie10 && `(${item.codigoCie10})`}
                    </div>
                  ) : null}

                  {/* SÍNTOMAS / EXAMEN FÍSICO / ANAMNESIS */}
                  {((Array.isArray(item.sintomas) && item.sintomas.length > 0) || item.anamnesis) && (
                    <div style={{ marginTop: '6px', color: '#475569', fontSize: '12px' }}>
                      <strong>Síntomas / Anamnesis:</strong>{' '}
                      {Array.isArray(item.sintomas)
                        ? item.sintomas.map(s => s.nombreSintoma).join(', ')
                        : item.anamnesis}
                    </div>
                  )}

                  {Array.isArray(item.examenFisico) && item.examenFisico.length > 0 && (
                    <div style={{ marginTop: '4px', color: '#475569', fontSize: '12px' }}>
                      <strong>Examen Físico:</strong> {item.examenFisico.map(ef => ef.nombreExamenFisico).join(', ')}
                    </div>
                  )}
                </div>

                {/* DETALLE DE RECETA / MEDICAMENTOS */}
                {listaMedicamentos.length > 0 && (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #dcfce7',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '12px',
                    color: '#166534',
                    marginBottom: '10px'
                  }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#15803d' }}>
                      <Pill size={14} /> Medicamentos Recetados:
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      {listaMedicamentos.map((med, mIdx) => (
                        <li key={mIdx} style={{ marginBottom: '4px' }}>
                          <strong>{med.nombreProducto || med.medicamento || (typeof med === 'string' ? med : '')}</strong>
                          {med.indicaciones && <span style={{ color: '#166534' }}> — {med.indicaciones}</span>}
                          {med.nombreFrecuenciaDosis && (
                            <span style={{ fontSize: '11px', color: '#15803d', display: 'block' }}>
                              Frecuencia: {med.nombreFrecuenciaDosis} | Vía: {med.nombreViaAdministracion || 'Oral'}
                            </span>
                          )}
                          {med.dosis && <span style={{ color: '#166534' }}> — {med.dosis}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* EXÁMENES AUXILIARES / ÓRDENES */}
                {Array.isArray(item.examenesAuxiliares) && item.examenesAuxiliares.length > 0 && (
                  <div style={{
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #e0f2fe',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '12px',
                    color: '#0369a1',
                    marginBottom: '10px'
                  }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#0284c7' }}>
                      <Stethoscope size={14} /> Exámenes Auxiliares Solicitados:
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      {item.examenesAuxiliares.map((ex, eIdx) => (
                        <li key={eIdx}>
                          <strong>{ex.nombreProducto || ex.nombre}</strong> {ex.codigo && `(Cód: ${ex.codigo})`}
                          {ex.observacion && <span style={{ color: '#0369a1' }}> — {ex.observacion}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* TRATAMIENTO PRESCRITO / INDICACIONES DE ALTA */}
                {indicacionesAlta && (
                  <div style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '12px',
                    color: '#92400e',
                    marginBottom: '12px'
                  }}>
                    <strong style={{ display: 'block', marginBottom: '2px', color: '#b45309' }}>
                      Indicaciones / Alta:
                    </strong>
                    {indicacionesAlta}
                  </div>
                )}

                {/* BOTONES DE ACCIÓN Y DOCUMENTOS PDF */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {pdfHistoria && (
                      <a
                        href={pdfHistoria}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#0284c7',
                          fontSize: '11px',
                          fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={12} /> PDF Historia
                      </a>
                    )}
                    {pdfReceta && (
                      <a
                        href={pdfReceta}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#16a34a',
                          fontSize: '11px',
                          fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={12} /> PDF Receta
                      </a>
                    )}
                    {pdfOrdenes && (
                      <a
                        href={pdfOrdenes}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#d97706',
                          fontSize: '11px',
                          fontWeight: '600',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={12} /> PDF Órdenes
                      </a>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {((Array.isArray(item.sintomas) && item.sintomas.length > 0) || item.anamnesis) && onCopiarAnamnesis && (
                      <button
                        type="button"
                        onClick={() => {
                          const texto = Array.isArray(item.sintomas) 
                            ? item.sintomas.map(s => s.nombreSintoma).join(', ') 
                            : item.anamnesis;
                          onCopiarAnamnesis(texto);
                        }}
                        style={{
                          backgroundColor: '#f0f9ff',
                          color: '#0369a1',
                          border: '1px solid #bae6fd',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Copiar Anamnesis
                      </button>
                    )}

                    {listaMedicamentos.length > 0 && onCopiarReceta && (
                      <button
                        type="button"
                        onClick={() => onCopiarReceta(listaMedicamentos)}
                        style={{
                          backgroundColor: '#f0fdf4',
                          color: '#15803d',
                          border: '1px solid #bbf7d0',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + Copiar Receta
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
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