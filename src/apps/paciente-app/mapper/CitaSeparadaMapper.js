



export const mapperCitaSeparadaApiToReserva = (apiData, prevReserva) => {
  // 1. Validación de entrada principal
  if (!apiData || Object.keys(apiData).length === 0) return prevReserva;

  // 2. Preparación de montos para evitar errores en toFixed()
  const montoNumerico = apiData.precioUnitario || 0;

  return {
    ...prevReserva, // IMPORTANTE: Aquí ya vienen el icono y los estilos previos
    idCitaSeparada: apiData.idCitaSeparada || 0,
    
    // Sincronizamos el Doctor
    doctor: {
      ...prevReserva.doctor,
      id: apiData.idMedico || prevReserva.doctor?.id,
      nombres: apiData.nombreMedico || prevReserva.doctor?.nombres || 'Médico no asignado',
      monto: montoNumerico,
      montoFormateado: `S/ ${montoNumerico.toFixed(2)}`
    },

    // Sincronizamos la Especialidad (sin tocar iconos ni clases de estilo)
    especialidad: {
      ...prevReserva.especialidad,
      idEspecialidad: apiData.idEspecialidad || prevReserva.especialidad?.idEspecialidad,
      descripcionEspecialidad: apiData.nombreEspecialidad || prevReserva.especialidad?.descripcionEspecialidad
    },

    // Datos operativos validados para el flujo de Pago
    hora: apiData.horaInicio || prevReserva.hora || '--:--',
    fechaYYYYMMDD: apiData.fecha || prevReserva.fechaYYYYMMDD,
    precioUnitario: montoNumerico,
    
    // Formateamos el destino para el componente PagoVirtual
    nombreDestino: apiData.numeroCuenta 
      ? `Cuenta: ${apiData.numeroCuenta}` 
      : (prevReserva.nombreDestino || 'Consultar en recepción'),
      
    email: (prevReserva.email || apiData.email || 'vacio'),

    idProgramacion: apiData.idProgramacion || 0,
    
    // IDs de negocio para auditoría
    idUsuario: apiData.idUsuario || 0,
    idPaciente: apiData.idPaciente || 0
  };
};