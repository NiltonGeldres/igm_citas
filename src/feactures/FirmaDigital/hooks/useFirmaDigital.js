import { useState } from "react";

export const useFirmaDigital= () => {
    // ENTIDAD DE CABECERA Y CONTEXTO DEL PACIENTE (Sin arreglos clínicos)
    const [patientData, setPatientData] = useState({
        name: '',
        sex: '',
        age: '',
        id: '',
        hc: '',
        idPaciente: null,
        idCita: null,
        idAtencion: null,
        accionAgenda: 'ATENDER'
    });
    // SECCIONES DE FORMULARIO CLÍNICO (El triaje pertenece exclusivamente a esta estructura)
    const [sectionsData, setSectionsData] = useState({
        PanelTriaje: [], 
        PanelAntecedentes: [],
        PanelExamenFisico: [],
        PanelSintomas: [],
        PanelTratamientos: [],
        PanelDiagnostico: [],
        PanelPlanTrabajo: [],
        PanelMedicacion: [],
        PanelAlta: [],
    });

    return {
        patientData,
        sectionsData
    
    };
}
    