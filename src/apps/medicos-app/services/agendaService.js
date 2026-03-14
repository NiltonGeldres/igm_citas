// src/components/Cita/CitaService.js
import header from "../../../shared/utils/Header";
import axios from "axios";
const API_URL = process.env.REACT_APP_URL_API;
const SERVICE_MEDICO_CITA_DIARIA = "/citas/medico-diaria"; 

export const agendaService = () =>{
        alert("Hola")
    const  getAgendaPorMedico = (idMedico, fecha) => {
        console.log("Solicitando agenda diaria del médico: " + idMedico + " para la fecha: " + fecha);
        return axios.get(API_URL + SERVICE_MEDICO_CITA_DIARIA, {
            headers: header(),
            params: {
                idMedico: idMedico,
                fecha: fecha
            }

        }).catch(function (error) {
            if (error.response) {
                console.log("Error de respuesta:", error.response.status);
            } else {
                console.log("Error de conexión:", error.message);
            }
            throw error; 
        });
    };



};
//export default agendaService;


/*
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

*/