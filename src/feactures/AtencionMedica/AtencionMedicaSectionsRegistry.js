// src/services/AtencionMedicaSectionsRegistry.js

import { AtencionMedicaTriajeService } from './AtencionMedicaTriaje/AtencionMedicaTriajeService';
import { AtencionMedicaAntecedentesService } from './AtencionMedicaAntecedente/AtencionMedicaAntecedentesService';
import { AtencionMedicaSintomaService } from './AtencionMedicaSintoma/AtencionMedicaSintomaService';
import { AtencionMedicaExamenFisicoService } from './AtencionMedicaExamenFisico/AtencionMedicaExamenFisicoService';
import { AtencionMedicaDiagnosticoService } from './AtencionMedicaDiagnostico/AtencionMedicaDiagnosticoService';
import { AtencionMedicaExamenService } from './AtencionMedicaExamen/AtencionMedicaExamenService';


export const AtencionMedicaSectionsRegistry = {
  /**
   * Carga inicial limpia para NUEVA ATENCIÓN
   */
  cargarPanelesIniciales: () => {
    console.log("cargarPanelesIniciales")
    return {
      PanelExamenesAuxiliares: AtencionMedicaExamenService.obtenerExamenesIniciales(),  
      PanelTriaje: AtencionMedicaTriajeService.obtenerTriajeInicial(),
      PanelAntecedentes: AtencionMedicaAntecedentesService.obtenerAntecedentesIniciales(),
      PanelSintomas: AtencionMedicaSintomaService.obtenerSintomasIniciales(),
      PanelExamenFisico: AtencionMedicaExamenFisicoService.obtenerExamenFisicoInicial(),
      PanelDiagnostico: AtencionMedicaDiagnosticoService.obtenerDiagnosticosIniciales(),
      PanelMedicacion: [],
      PanelAlta: []
    };
  },

  /**
   * Carga mapeada para ACTUALIZAR ATENCIÓN
   */
  cargarPanelesDesdeApi: (dataAtencion) => {
    if (!dataAtencion) return AtencionMedicaSectionsRegistry.cargarPanelesIniciales();

    return {
      PanelTriaje: AtencionMedicaTriajeService.obtenerTriajeRegistrado(dataAtencion),
      PanelAntecedentes: AtencionMedicaAntecedentesService.obtenerAntecedentesRegistrados(dataAtencion),
      PanelSintomas: AtencionMedicaSintomaService.obtenerSintomasRegistrados(dataAtencion),
      PanelExamenFisico: AtencionMedicaExamenFisicoService.obtenerExamenFisicoRegistrado(dataAtencion),
      PanelDiagnostico: AtencionMedicaDiagnosticoService.obtenerDiagnosticosRegistrados(dataAtencion),
      PanelMedicacion: dataAtencion.medicacion || [],
      PanelExamenesAuxiliares: AtencionMedicaExamenService.obtenerExamenesRegistrados(dataAtencion) ,
      PanelAlta: dataAtencion.alta || []
    };
  }
};