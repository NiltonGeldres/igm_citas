export const agendaService = {
  getAgendaPorMedico: async (idMedico, fecha) => {
    // Simulación de API
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: 1, horainicio: "08:00", nombres: "JUAN PEREZ GARCIA", servicioNombre: "CARDIOLOGÍA", pagado: true, atendido: true },
      { id: 2, horainicio: "08:30", nombres: "MARIA LOPEZ SOSA", servicioNombre: "MEDICINA INTERNA", pagado: true, atendido: false },
      { id: 3, horainicio: "09:00", nombres: "CARLOS RUIZ DIAZ", servicioNombre: "CARDIOLOGÍA", pagado: false, atendido: false },
    ];
  }
};