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
      PanelTriaje: AtencionMedicaTriajeService.obtenerTriajeInicial(),
      PanelAntecedentes: AtencionMedicaAntecedentesService.obtenerAntecedentesIniciales(),
      PanelSintomas: AtencionMedicaSintomaService.obtenerSintomasIniciales(),
      PanelExamenFisico: AtencionMedicaExamenFisicoService.obtenerExamenFisicoInicial(),
      PanelDiagnostico: AtencionMedicaDiagnosticoService.obtenerDiagnosticosIniciales(),
      PanelPlanTrabajo: AtencionMedicaExamenService.obtenerExamenesIniciales(),  
      PanelMedicacion: [],
      PanelAlta: []
    };
  },

  /**
   * Carga mapeada para ACTUALIZAR ATENCIÓN
   */
/*  cargarPanelesDesdeApi: (dataAtencion) => {
    if (!dataAtencion) return AtencionMedicaSectionsRegistry.cargarPanelesIniciales();

    return {
      PanelTriaje: AtencionMedicaTriajeService.obtenerTriajeRegistrado(dataAtencion),
      PanelAntecedentes: AtencionMedicaAntecedentesService.obtenerAntecedentesRegistrados(dataAtencion),
      PanelSintomas: AtencionMedicaSintomaService.obtenerSintomasRegistrados(dataAtencion),
      PanelExamenFisico: AtencionMedicaExamenFisicoService.obtenerExamenFisicoRegistrado(dataAtencion),
      PanelDiagnostico: AtencionMedicaDiagnosticoService.obtenerDiagnosticosRegistrados(dataAtencion),
      PanelPlanTrabajo: AtencionMedicaExamenService.obtenerExamenesRegistrados(dataAtencion) ,
      PanelMedicacion: dataAtencion.medicacion || [],
      PanelAlta: dataAtencion.alta || []
    };
  }*/
  cargarPanelesDesdeApi: (dataAtencion) => {
    if (!dataAtencion) return AtencionMedicaSectionsRegistry.cargarPanelesIniciales();

    // 1. Extraer y procesar PRIMERO los diagnósticos que YA vienen en la respuesta (dataAtencion)
    const diagnosticosProcesados = AtencionMedicaDiagnosticoService.obtenerDiagnosticosRegistrados(dataAtencion);

    return {
      PanelTriaje: AtencionMedicaTriajeService.obtenerTriajeRegistrado(dataAtencion),
      PanelAntecedentes: AtencionMedicaAntecedentesService.obtenerAntecedentesRegistrados(dataAtencion),
      PanelSintomas: AtencionMedicaSintomaService.obtenerSintomasRegistrados(dataAtencion),
      PanelExamenFisico: AtencionMedicaExamenFisicoService.obtenerExamenFisicoRegistrado(dataAtencion),
      
      // Panel de diagnósticos procesado
      PanelDiagnostico: diagnosticosProcesados,

      // 2. Le pasas 'diagnosticosProcesados' a Exámenes para que pueda hacer el enlace
      PanelPlanTrabajo: AtencionMedicaExamenService.obtenerExamenesRegistrados(dataAtencion, diagnosticosProcesados), 

      PanelMedicacion: dataAtencion.medicacion || [],
      PanelAlta: dataAtencion.alta || []
    };
  } 
};