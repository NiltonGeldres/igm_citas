// src/services/AtencionMedicaSectionsRegistry.js

import { AtencionMedicaTriajeService } from './AtencionMedicaTriaje/AtencionMedicaTriajeService';
import { AtencionMedicaAntecedentesService } from './AtencionMedicaAntecedente/AtencionMedicaAntecedentesService';
import { AtencionMedicaSintomaService } from './AtencionMedicaSintoma/AtencionMedicaSintomaService';
import { AtencionMedicaExamenFisicoService } from './AtencionMedicaExamenFisico/AtencionMedicaExamenFisicoService';
import { AtencionMedicaDiagnosticoService } from './AtencionMedicaDiagnostico/AtencionMedicaDiagnosticoService';


export const AtencionMedicaSectionsRegistry = {
  /**
   * Carga inicial limpia para NUEVA ATENCIÓN
   */
  cargarPanelesIniciales: () => {
    return {
      PanelTriaje: AtencionMedicaTriajeService.obtenerTriajeInicial(),
      PanelAntecedentes: AtencionMedicaAntecedentesService.obtenerAntecedentesIniciales(),
      PanelSintomas: AtencionMedicaSintomaService.obtenerSintomasIniciales(),
      PanelExamenFisico: AtencionMedicaExamenFisicoService.obtenerExamenFisicoInicial(),
      PanelDiagnostico: AtencionMedicaDiagnosticoService.obtenerDiagnosticosIniciales(),
      PanelMedicacion: [],
      PanelExamenesAuxiliares: [],
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
      PanelExamenesAuxiliares: dataAtencion.examenesAuxiliares || [],
      PanelAlta: dataAtencion.alta || []
    };
  }
};