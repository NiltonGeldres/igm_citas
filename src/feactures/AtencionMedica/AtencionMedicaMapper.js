// src/mappers/AtencionMedicaMapper.js

export const AtencionMedicaMapper = {
  uiToApiRequest: (patientData = {}, sectionsData = {}, contextoUsuario = {}) => {
    
    // Extracción de triaje (de sectionsData o patientData)
    const listaTriajeOriginal = Array.isArray(sectionsData.triaje) && sectionsData.triaje.length > 0
      ? sectionsData.triaje
      : (Array.isArray(patientData.triaje) ? patientData.triaje : []);

    return {
      idAtencion: patientData.idAtencion ? Number(patientData.idAtencion) : null,
      idPaciente: Number(patientData.id || patientData.idPaciente) || 0,
      idCuentaAtencion: Number(patientData.idCuentaAtencion) || 1,
      idServicio: Number(patientData.idServicio) || 1,
      idEspecialidad: Number(patientData.idEspecialidad) || 2, // 👈 Se agrega idEspecialidad
      idEstadoAtencion: Number(patientData.idEstadoAtencion) || 3,
      estadoFirma: patientData.estadoFirma || "PENDIENTE",
      origenRegistroUsuario: "MEDICO_WEB_APP",
      idMedicoIngreso: Number(contextoUsuario.idMedico) || 2,
      idEntidad: Number(contextoUsuario.idEntidad) || 2,
      idUsuarioRegistro: Number(contextoUsuario.idUsuario) || 12,

      // 1. Llave plural exigida por la API: "triajes"
      triajes: listaTriajeOriginal.map((t) => ({
        idTriaje: Number(t.idTriaje || t.id) || 1,
        valorTriaje: String(t.valorTriaje ?? t.valor ?? "")
      })),

      // 2. Antecedentes usando "nombreAntecedente"
      antecedentes: (sectionsData.PanelAntecedentes || []).map((a, i) => ({
        idAntecedente: Number(a.idAntecedente || a.id) || 0,
        nombreAntecedente: a.nombreAntecedente || a.descripcion || a.texto || null
      })),

      // 3. Síntomas usando "nombreSintoma"
      sintomas: (sectionsData.PanelSintomas || []).map((s, i) => ({
        idSintoma: Number(s.idSintoma || s.id) || 0,
        nombreSintoma: s.nombreSintoma || s.descripcion || s.texto || null
      })),

      // 4. Examen Físico usando "nombreExamenFisico"
      examenFisico: (sectionsData.PanelExamenFisico || []).map((ef, i) => ({
        idExamenFisico: Number(ef.idExamenFisico || ef.id) || 0,
        nombreExamenFisico: ef.nombreExamenFisico || ef.descripcion || ef.texto || null
      })),

      // Diagnósticos
      diagnosticos: (sectionsData.PanelDiagnostico || []).map((d, index) => ({
        idDiagnostico: Number(d.idDiagnostico || d.idCie10 || d.id) || 1,
        idDiagnosticoOrden: index + 1,
        idSubclasificacion: Number(d.idSubclasificacion || 1)
      })),

      // Exámenes Auxiliares
      examenesAuxiliares: (sectionsData.PanelPlanTrabajo || []).map((e, i) => ({
        idPuntoCarga: Number(e.idPuntoCarga) || 1,
        idProducto: Number(e.idProducto || e.idExamen || e.id) || (i + 1),
        cantidad: Number(e.cantidad) || 1,
        observacion: e.observacion || e.examen || "",
        idDiagnostico: Number(e.idDiagnostico) || 1
      })),

      // Medicación
      medicacion: (sectionsData.PanelTratamientos || []).map((m, i) => ({
        idAlmacen: Number(m.idAlmacen) || 1,
        idProducto: Number(m.idProducto || m.idMedicamento || m.id) || (i + 1),
        cantidadDosis: Number(m.dosis || m.cantidadDosis) || 1,
        idUmDosis: Number(m.idUmDosis) || 1,
        idFrecuenciaDosis: Number(m.frecuencia || m.idFrecuenciaDosis) || 1,
        cantidadPeriodo: Number(m.periodo || m.cantidadPeriodo) || 1,
        idViaAdministracion: Number(m.via || m.idViaAdministracion) || 1,
        cantidadTotal: Number(m.cantidad || m.cantidadTotal) || 1,
        idDiagnostico: Number(m.idDiagnostico) || 1,
        indicaciones: m.indicaciones || m.descripcion || ""
      })),

      // 5. Alta usando "nombreAlta"
      alta: (sectionsData.PanelAlta || []).map((alt, i) => ({
        idAlta: Number(alt.idAlta || alt.id) || 0,
        nombreAlta: alt.nombreAlta || alt.descripcion || alt.texto || null
      }))
    };
  }
};

export default AtencionMedicaMapper;