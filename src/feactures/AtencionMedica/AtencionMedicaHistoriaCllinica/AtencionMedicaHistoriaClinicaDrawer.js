import React, { useState, useMemo } from 'react';
import { 
  X, Search, FileText, AlertTriangle, CheckCircle2, 
  ExternalLink, FileCheck 
} from 'lucide-react';

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

  // Normalizar lista de atenciones
  const listaAtenciones = useMemo(() => {
    if (Array.isArray(historiaClinicaData)) return historiaClinicaData;
    if (historiaClinicaData && Array.isArray(historiaClinicaData.atenciones)) return historiaClinicaData.atenciones;
    return [];
  }, [historiaClinicaData]);

  // Extraer lista de especialidades únicas
  const especialidadesUnicas = useMemo(() => {
    const setEsp = new Set();
    listaAtenciones.forEach(item => {
      const esp = item?.nombreEspecialidad || item?.especialidad;
      if (esp) setEsp.add(esp);
    });
    return Array.from(setEsp);
  }, [listaAtenciones]);

  // Filtrado por texto y especialidad
  const atencionesFiltradas = useMemo(() => {
    return listaAtenciones.filter(atencion => {
      if (!atencion) return false;
      const espName = atencion.nombreEspecialidad || atencion.especialidad || '';
      const matchEsp = especialidadFiltro === 'TODAS' || espName === especialidadFiltro;

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchEsp;

      const medico = (atencion.nombreMedicoIngreso || atencion.medico || '').toLowerCase();
      const especialidad = espName.toLowerCase();
      
      const dxs = Array.isArray(atencion.diagnosticos) 
        ? atencion.diagnosticos.map(d => `${d.codigoCIE || d.codigo} ${d.descripcion}`).join(' ').toLowerCase() 
        : (atencion.diagnostico || '').toLowerCase();

      const sintomas = Array.isArray(atencion.sintomas)
        ? atencion.sintomas.map(s => s.nombreSintoma).join(' ').toLowerCase()
        : (atencion.anamnesis || '').toLowerCase();

      return matchEsp && (medico.includes(term) || dxs.includes(term) || sintomas.includes(term) || especialidad.includes(term));
    });
  }, [listaAtenciones, searchTerm, especialidadFiltro]);

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

  // Formateador robusto para Antecedentes
  const renderAntecedentes = (antecedentes) => {
    if (!antecedentes) return <span style={emptyTextStyle}>Sin antecedentes registrados</span>;

    if (Array.isArray(antecedentes)) {
      if (antecedentes.length === 0) return <span style={emptyTextStyle}>Sin antecedentes registrados</span>;
      return (
        <span style={{ color: '#334155' }}>
          {antecedentes.map((ant) => {
            if (typeof ant === 'object' && ant !== null) {
              return ant.nombreAntecedente || ant.descripcion || ant.nombre || JSON.stringify(ant);
            }
            return String(ant);
          }).join(', ')}
        </span>
      );
    }

    if (typeof antecedentes === 'object') {
      return (
        <span style={{ color: '#334155' }}>
          {antecedentes.nombreAntecedente || antecedentes.descripcion || antecedentes.nombre || '—'}
        </span>
      );
    }

    return <span style={{ color: '#334155' }}>{String(antecedentes)}</span>;
  };

  if (!isOpen) return null;

  const infoPaciente = patientData || historiaClinicaData?.patientData || {};
  const listaAlertas = Array.isArray(alertasMedicas) ? alertasMedicas : [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      height: '100vh',
      width: '100%',
      maxWidth: '720px',
      backgroundColor: '#f8fafc',
      zIndex: 1100,
      boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      color: '#334155',
      overflow: 'hidden'
    }}>

      {/* HEADER PRINCIPAL */}
      <div style={{ backgroundColor: '#006699', color: '#ffffff', padding: '14px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#e0f2fe" />
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
              HISTORIA CLÍNICA ELECTRÓNICA
            </h2>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              H.C. {infoPaciente?.hc || infoPaciente?.id || infoPaciente?.numeroHistoria || '—'}
            </span>
          </div>

          <button
            onClick={onClose}
            type="button"
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* DATOS DEL PACIENTE */}
        <div style={{ fontSize: '12px', color: '#e0f2fe', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <span><strong style={{ color: '#ffffff' }}>Paciente:</strong> {infoPaciente?.nombre || infoPaciente?.name || '—'}</span>
            <span><strong style={{ color: '#ffffff' }}>Edad:</strong> {infoPaciente?.edad ? (typeof infoPaciente.edad === 'number' ? `${infoPaciente.edad} años` : infoPaciente.edad) : '—'}</span>
            {infoPaciente?.sexo && <span><strong style={{ color: '#ffffff' }}>Sexo:</strong> {infoPaciente.sexo}</span>}
            {infoPaciente?.dni && <span><strong style={{ color: '#ffffff' }}>DNI:</strong> {infoPaciente.dni}</span>}
          </div>

          {(listaAlertas.length > 0 || infoPaciente?.ram) && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
              {infoPaciente?.ram && (
                <span style={{ backgroundColor: '#991b1b', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={12} /> RAM: {infoPaciente.ram}
                </span>
              )}
              {listaAlertas.map((alerta, idx) => (
                <span key={idx} style={{ backgroundColor: alerta?.tipo === 'RAM' ? '#991b1b' : '#065f46', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {alerta?.tipo === 'RAM' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                  {alerta?.descripcion}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div style={{ padding: '10px 16px', backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1', display: 'flex', gap: '12px', flexShrink: 0 }}>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <Search size={15} color="#64748b" style={{ position: 'absolute', left: '10px' }} />
          <input
            type="text"
            placeholder="Buscar por diagnóstico, médico o síntoma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '6px 10px 6px 32px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>

        <select
          value={especialidadFiltro}
          onChange={(e) => setEspecialidadFiltro(e.target.value)}
          style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }}
        >
          <option value="TODAS">Todas las Especialidades</option>
          {especialidadesUnicas.map((esp, i) => (
            <option key={i} value={esp}>{esp}</option>
          ))}
        </select>
      </div>

      {/* CONTENEDOR CON SCROLL ACTIVO (flex: 1, minHeight: 0, overflowY: auto) */}
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        overflowY: 'auto', 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px' 
      }}>
        {atencionesFiltradas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '13px' }}>
            No se encontraron atenciones registradas.
          </div>
        ) : (
          atencionesFiltradas.map((item, index) => {
            const fechaAtencion = item.fechaAtencion || item.tsIngreso || item.fecha;
            const medico = item.nombreMedicoIngreso || item.medico || 'Médico no especificado';
            const especialidad = item.nombreEspecialidad || item.especialidad || 'Consulta Externa';
            const servicio = item.nombreServicio ? ` (${item.nombreServicio})` : '';

            const listaTriajes = Array.isArray(item.triajes) 
              ? item.triajes 
              : Array.isArray(item.signosVitales) 
                ? item.signosVitales.map(sv => ({ nombreTriaje: sv.label || sv.nombreTriaje, valorTriaje: sv.value || sv.valorTriaje })) 
                : [];

            const listaMedicamentos = Array.isArray(item.medicacion) 
              ? item.medicacion 
              : Array.isArray(item.receta) ? item.receta : [];

            const listaExamenes = Array.isArray(item.examenesAuxiliares) 
              ? item.examenesAuxiliares 
              : Array.isArray(item.planTrabajo) ? item.planTrabajo : [];

            const indicacionesAlta = Array.isArray(item.alta) && item.alta.length > 0 
              ? item.alta.map(a => a.nombreAlta || a.descripcion).join(', ') 
              : (typeof item.tratamiento === 'string' ? item.tratamiento : item.indicacionesAlta || null);

            const pdfHistoria = item.pdfRutaHistoriaFirmado || item.pdfRutaHistoria || item.pdfHistoria;
            const pdfReceta = item.pdfRutaRecetaFirmado || item.pdfRutaReceta || item.pdfReceta;
            const pdfOrdenes = item.pdfRutaOrdenesFirmado || item.pdfRutaOrdenes || item.pdfOrdenes;

            return (
              <div key={item.idAtencion || item.idCita || index} style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                flexShrink: 0
              }}>

                {/* ENCABEZADO DE TARJETA */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#006699', textTransform: 'uppercase' }}>
                      {formatFecha(fechaAtencion)} • {item.nombreEntidad || item.origenAtencion || 'CONSULTA EXTERNA'}
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginTop: '1px' }}>
                      {especialidad}{servicio} — <span style={{ color: '#0369a1', fontWeight: '600' }}>{medico}</span>
                    </div>
                  </div>

                  {item.estadoFirma && (
                    <span style={{
                      backgroundColor: item.estadoFirma === 'FIRMADO' ? '#f0fdf4' : '#fffbeb',
                      color: item.estadoFirma === 'FIRMADO' ? '#166534' : '#b45309',
                      border: `1px solid ${item.estadoFirma === 'FIRMADO' ? '#bbf7d0' : '#fef08a'}`,
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

                {/* DETALLE DE LA ATENCIÓN */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: '2px' }}>
                    DETALLE DE INFORMACIÓN REGISTRADA
                  </div>

                  {/* TRIAJE / SIGNOS VITALES */}
                  <div style={itemRowStyle}>
                    <CheckMarkIcon />
                    <div style={{ fontSize: '13px' }}>
                      <strong style={{ color: '#0f172a' }}>Triaje / Signos Vitales: </strong>
                      {listaTriajes.length > 0 ? (
                        <span style={{ color: '#334155' }}>
                          {listaTriajes.map((sv) => `${sv.nombreTriaje}: ${sv.valorTriaje}`).join(' | ')}
                        </span>
                      ) : (
                        <span style={emptyTextStyle}>Sin registros</span>
                      )}
                    </div>
                  </div>

                  {/* ANTECEDENTES */}
                  <div style={itemRowStyle}>
                    <CheckMarkIcon />
                    <div style={{ fontSize: '13px' }}>
                      <strong style={{ color: '#0f172a' }}>Antecedentes: </strong>
                      {renderAntecedentes(item.antecedentes)}
                    </div>
                  </div>

                  {/* SÍNTOMAS / ANAMNESIS */}
                  <div style={itemRowStyle}>
                    <CheckMarkIcon />
                    <div style={{ fontSize: '13px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>Síntomas / Anamnesis: </strong>
                          <span style={{ color: '#334155' }}>
                            {Array.isArray(item.sintomas) && item.sintomas.length > 0
                              ? item.sintomas.map(s => s.nombreSintoma).join(', ')
                              : (typeof item.anamnesis === 'string' ? item.anamnesis : 'Sin síntomas registrados')}
                          </span>
                        </div>
                        {((Array.isArray(item.sintomas) && item.sintomas.length > 0) || item.anamnesis) && onCopiarAnamnesis && (
                          <button
                            type="button"
                            onClick={() => {
                              const texto = Array.isArray(item.sintomas) 
                                ? item.sintomas.map(s => s.nombreSintoma).join(', ') 
                                : item.anamnesis;
                              onCopiarAnamnesis(texto);
                            }}
                            style={copyButtonStyle}
                          >
                            + Copiar Anamnesis
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* EXAMEN FÍSICO */}
                  <div style={itemRowStyle}>
                    <CheckMarkIcon />
                    <div style={{ fontSize: '13px' }}>
                      <strong style={{ color: '#0f172a' }}>Examen Físico: </strong>
                      <span style={{ color: '#334155' }}>
                        {Array.isArray(item.examenFisico) && item.examenFisico.length > 0
                          ? item.examenFisico.map(ef => ef.nombreExamenFisico || ef.descripcion).join(', ')
                          : (typeof item.examenFisico === 'string' ? item.examenFisico : 'Sin examen físico registrado')}
                      </span>
                    </div>
                  </div>

                  {/* DIAGNÓSTICOS */}
                  <div style={itemRowStyle}>
                    <CheckMarkIcon />
                    <div style={{ fontSize: '13px', width: '100%' }}>
                      <strong style={{ color: '#0f172a' }}>Diagnósticos (CIE-10):</strong>
                      <div style={{ marginTop: '2px', paddingLeft: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {Array.isArray(item.diagnosticos) && item.diagnosticos.length > 0 ? (
                          item.diagnosticos.map((dx, dxIdx) => (
                            <div key={dxIdx} style={{ color: '#334155' }}>
                              <strong style={{ color: '#0f172a' }}>({dx.codigoCIE || dx.codigo || 'CIE'})</strong> {dx.descripcion} {dx.nombreSubclasificacion ? `- [${dx.nombreSubclasificacion}]` : ''}
                            </div>
                          ))
                        ) : item.diagnostico ? (
                          <div style={{ color: '#334155' }}>
                            <strong style={{ color: '#0f172a' }}>({item.codigoCie10 || 'Dx'})</strong> {item.diagnostico}
                          </div>
                        ) : (
                          <span style={emptyTextStyle}>Sin diagnósticos registrados</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ÓRDENES / EXÁMENES AUXILIARES */}
                  <div style={itemRowStyle}>
                    <CheckMarkIcon />
                    <div style={{ fontSize: '13px', width: '100%' }}>
                      <strong style={{ color: '#0f172a' }}>Órdenes / Exámenes Auxiliares:</strong>
                      <div style={{ marginTop: '2px', paddingLeft: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {listaExamenes.length > 0 ? (
                          listaExamenes.map((ex, eIdx) => (
                            <div key={eIdx} style={{ color: '#334155' }}>
                              {ex.nombreProducto || ex.nombre || ex.descripcion} {(ex.codigoCie || ex.codigo) ? `[${ex.codigoCie || ex.codigo}]` : ''} {ex.observacion ? `— ${ex.observacion}` : ''}
                            </div>
                          ))
                        ) : (
                          <span style={emptyTextStyle}>Sin órdenes registradas</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TRATAMIENTO / PRESCRIPCIÓN */}
                  <div style={itemRowStyle}>
                    <CheckMarkIcon />
                    <div style={{ fontSize: '13px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#0f172a' }}>Tratamiento / Prescripción:</strong>
                        {listaMedicamentos.length > 0 && onCopiarReceta && (
                          <button
                            type="button"
                            onClick={() => onCopiarReceta(listaMedicamentos)}
                            style={{ ...copyButtonStyle, backgroundColor: '#006699', color: '#ffffff', border: 'none' }}
                          >
                            + Copiar Receta
                          </button>
                        )}
                      </div>
                      <div style={{ marginTop: '2px', paddingLeft: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {listaMedicamentos.length > 0 ? (
                          listaMedicamentos.map((med, mIdx) => (
                            <div key={mIdx} style={{ color: '#334155' }}>
                              <strong style={{ color: '#0f172a' }}>{med.nombreProducto || med.medicamento || (typeof med === 'string' ? med : '')}</strong>
                              {' - '}
                              <span style={{ color: '#475569' }}>
                                Dosis: {med.dosis || med.nombreDosis || '1'} ({med.nombreViaAdministracion || med.via || 'Oral'}) 
                                {med.nombreFrecuenciaDosis ? ` cada ${med.nombreFrecuenciaDosis}` : ''}
                                {med.duracion ? ` por ${med.duracion}` : ''}
                              </span>
                              {med.indicaciones && <span style={{ color: '#64748b' }}> — Indicaciones: {med.indicaciones}</span>}
                            </div>
                          ))
                        ) : (
                          <span style={emptyTextStyle}>Sin prescripción médica</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ALTA / RECOMENDACIONES */}
                  <div style={itemRowStyle}>
                    <CheckMarkIcon />
                    <div style={{ fontSize: '13px' }}>
                      <strong style={{ color: '#0f172a' }}>Alta / Recomendaciones: </strong>
                      <span style={{ color: '#334155' }}>
                        {indicacionesAlta || 'Sin recomendaciones adicionales'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* PIE DE TARJETA - ENLACES A DOCUMENTOS PDF */}
                {(pdfHistoria || pdfReceta || pdfOrdenes) && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    padding: '8px 16px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                  }}>
                    {pdfHistoria && (
                      <a href={pdfHistoria} target="_blank" rel="noopener noreferrer" style={pdfLinkStyle}>
                        <ExternalLink size={13} /> PDF Historia
                      </a>
                    )}
                    {pdfReceta && (
                      <a href={pdfReceta} target="_blank" rel="noopener noreferrer" style={pdfLinkStyle}>
                        <ExternalLink size={13} /> PDF Receta
                      </a>
                    )}
                    {pdfOrdenes && (
                      <a href={pdfOrdenes} target="_blank" rel="noopener noreferrer" style={pdfLinkStyle}>
                        <ExternalLink size={13} /> PDF Órdenes
                      </a>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* FOOTER FIJO */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Mostrando {atencionesFiltradas.length} atenciones registradas
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            backgroundColor: '#f1f5f9',
            color: '#334155',
            border: '1px solid #cbd5e1',
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cerrar
        </button>
      </div>

    </div>
  );
}

// ICONO SVG
function CheckMarkIcon() {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#16a34a" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      style={{ flexShrink: 0, marginTop: '2px' }}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

// ESTILOS DE APOYO
const itemRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px'
};

const emptyTextStyle = {
  color: '#94a3b8',
  fontStyle: 'italic'
};

const copyButtonStyle = {
  backgroundColor: '#e0f2fe',
  color: '#0369a1',
  border: '1px solid #bae6fd',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer'
};

const pdfLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  color: '#006699',
  fontSize: '11.5px',
  fontWeight: '600',
  textDecoration: 'none'
};