export const EspecialidadMapper = {
  toEntity(raw) {
    if (!raw) return null;
    return {
      idEspecialidad: raw.idEspecialidad,
      descripcionEspecialidad: raw.descripcionEspecialidad, 
    };
  }
};

