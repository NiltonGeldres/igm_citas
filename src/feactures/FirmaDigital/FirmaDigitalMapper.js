// FirmaDigitalMapper.js
export const FirmaDigitalMapper = {
  uiToApiRequest: (patientData = {}, sectionsData = {}, contextoUsuario = {}) => {
    return {
      atencionId: patientData.idAtencion,
      citaId: patientData.idCita,
      pacienteId: patientData.idPaciente,
      usuarioFirma: contextoUsuario.usuario || '',
      datosClinicos: {
        triaje: sectionsData.PanelTriaje || [],
        antecedentes: sectionsData.PanelAntecedentes || [],
        examenFisico: sectionsData.PanelExamenFisico || [],
        sintomas: sectionsData.PanelSintomas || [],
        tratamientos: sectionsData.PanelTratamientos || [],
        diagnosticos: sectionsData.PanelDiagnostico || [],
        planTrabajo: sectionsData.PanelPlanTrabajo || [],
        medicacion: sectionsData.PanelMedicacion || [],
        alta: sectionsData.PanelAlta || [],
      },
      fechaFirma: new Date().toISOString(),
    };
  }
};

export default FirmaDigitalMapper;