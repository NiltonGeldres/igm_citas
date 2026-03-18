export const MedicoMapper = {
  toEntity(raw) {
    if (!raw) return null;
    return {
      id: raw.idMedico,
      nombres: raw.nombres, 
      monto: raw.preciounitario, 
    };
  }
};