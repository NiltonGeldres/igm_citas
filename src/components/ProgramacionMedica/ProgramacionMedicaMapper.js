export const ProgramacionMedicaMapper = {
  /**
   * Transforma el objeto crudo de la API a una entidad interna limpia
   * @param {Object} raw - Objeto proveniente del array de la API
   */
  toEntity(raw) {
    if (!raw) return null;
    return {
      idProgramacionMedica: raw.idProgramacionMedica,
      fecha: raw.fecha,                 // Ejemplo: "20260302"
      fechaDate: raw.fechaDate,         // Ejemplo: "2026/03/02"
      horaInicio: raw.horaInicio,       // Ejemplo: "14:00"
      horaFin: raw.horaFin,             // Ejemplo: "18:00"
      tiempoPromedioAtencion: raw.tiempoPromedioAtencion, // Ejemplo: 15
      
      // Metadatos adicionales que podrían ser útiles
      idTurno: raw.idTurno,
      nombreServicio: raw.nombreServicio,
      codigoServicio: raw.codigoServicio,
      idProgramacionMedicaCabecera: raw.idProgramacionMedicaCabecera
    };
  },
  /**
   * Procesa una lista completa de programaciones
   * @param {Array} rawList - Array de objetos de la API
   */
  toEntityList(rawList) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(item => this.toEntity(item));
  }
};


