// src/mappers/AtencionMedicaMapper.js

export const AtencionMedicaMapper = {
  uiToApiRequest: (patientData = {}, sectionsData = {}, contextoUsuario = {}) => {
    
    // Extracción de triaje (de sectionsData o patientData)
    const listaTriajeOriginal = Array.isArray(sectionsData.triaje) && sectionsData.triaje.length > 0
      ? sectionsData.triaje
      : (Array.isArray(patientData.triaje) ? patientData.triaje : []);

    // Función auxiliar para procesar colecciones y purgar elementos nulos o vacíos
    const procesarColeccion = (lista, keyId, keyTexto) => {
      if (!Array.isArray(lista)) return [];

      return lista
        .map((item) => {
          const idVal = Number(item[keyId] ?? item.id) || 0;
          
          // 👈 FIX: Agregamos item.descripcionAlta y evaluamos dinámicamente item[`descripcion${...}`]
          const textoRaw = item[keyTexto] 
                        ?? item.descripcionAlta 
                        ?? item.descripcion 
                        ?? item.texto 
                        ?? "";
                        
          const textoLimpio = typeof textoRaw === 'string' ? textoRaw.trim() : "";

          return {
            [keyId]: idVal,
            [keyTexto]: idVal === 0 ? (textoLimpio || null) : null
          };
        })
        .filter((item) => !(item[keyId] === 0 && !item[keyTexto]));
    };
return {
      idAtencion: patientData.idAtencion ? Number(patientData.idAtencion) : null,
      idPaciente: Number(patientData.idPaciente || patientData.id) || 0,
      idCuentaAtencion: Number(patientData.idCuentaAtencion) || 1,
      idServicio: Number(patientData.idServicio) || 1,
      
      // 👈 AGREGAR ESTA LÍNEA OBLIGATORIAMENTE:
      idEspecialidad: Number(patientData.idEspecialidad || contextoUsuario.idEspecialidad) || 2,
      
      idEstadoAtencion: Number(patientData.idEstadoAtencion) || 3,
      estadoFirma: patientData.estadoFirma || "PENDIENTE",
      origenRegistroUsuario: "MEDICO_WEB_APP",
      idMedicoIngreso: Number(contextoUsuario.idMedico) || 2,
      idEntidad: Number(contextoUsuario.idEntidad) || 2,
      idUsuarioRegistro: Number(contextoUsuario.idUsuario) || 12,

      triajes: (sectionsData.triaje || []).map((t) => ({
        idTriaje: Number(t.idTriaje || t.id) || 1,
        valorTriaje: String(t.valorTriaje ?? t.valor ?? "")
      })),

      // Triajes
      triajes: listaTriajeOriginal.map((t) => ({
        idTriaje: Number(t.idTriaje || t.id) || 1,
        valorTriaje: String(t.valorTriaje ?? t.valor ?? "")
      })),

      // Listas sanitizadas
      antecedentes: procesarColeccion(sectionsData.PanelAntecedentes, 'idAntecedente', 'nombreAntecedente'),
      sintomas: procesarColeccion(sectionsData.PanelSintomas, 'idSintoma', 'nombreSintoma'),
      examenFisico: procesarColeccion(sectionsData.PanelExamenFisico, 'idExamenFisico', 'nombreExamenFisico'),
      
      // 👈 FIX: Se invoca con 'descripcionAlta' para hacer match directo con tu estado de React
      alta: procesarColeccion(sectionsData.PanelAlta, 'idAlta', 'nombreAlta'),

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
      }))
    };
  }
};

export default AtencionMedicaMapper;