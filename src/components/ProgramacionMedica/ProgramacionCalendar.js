
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";
import ProgramacionMedicaService from "./ProgramacionMedicaService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Col } from "react-bootstrap";

const ProgramacionCalendar = ({idMedico,idEspecialidad,handleChangeCalendar}) => {
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();
    const [diaProgramado, setDiaProgramado] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [fechaCitas, setFechaCitas] = useState('');

    useEffect(() => {
        const LoadData = ()=>{
            if (idMedico !=''  &&  idEspecialidad!='') {                
                setLoading(true);
                ProgramacionMedicaService.getDias(idMedico,idEspecialidad)
                .then((response) => {
                    console.log(JSON.stringify(response.data.programacionMedica))
                        if (response.data.programacionMedica) {
                            let dias= [];
                            response.data.programacionMedica.map(post => {
                                dias.push(new Date(post.fechaDate))
                            })
                            setDiaProgramado(dias);
                            setFechaCitas('')
                        } else { 
                            setDiaProgramado([]) ;
                            setFechaCitas('')
                        }
                        setLoading(false);
                },(error) => {
                    setDiaProgramado([])
                    setFechaCitas('')
                    if (error.response && error.response.status === 403) {
                        AuthService.logout();
                        navigate("/login");
                        window.location.reload();
                    } 
                });
             } else { 
                setDiaProgramado([]);
                setFechaCitas('')
            }
        };
        LoadData() ;
    }, [idMedico,idEspecialidad]);

    if (loading) {
        return <h4>Loading Programacion...</h4>;
    }    
  return (
    
        <>
            <Col>
                <h6>Seleccionar la Fecha</h6>                    
                    <DatePicker 
                            inline
                            includeDates={diaProgramado}
                            dateFormat="dd/MM/yyyy"
                            selected={startDate} 
                            onChange={handleChangeCalendar}
                         />
            </Col>                         
         </>
    )
}
export default ProgramacionCalendar;



/*
// src/components/ProgramacionMedica/ProgramacionCalendar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";
import ProgramacionMedicaService from "./ProgramacionMedicaService";

// Importaciones de Chakra UI
import {
  Box,
  Text,
  Spinner, // Para el indicador de carga
  useToast, // Para notificaciones
  Flex,     // Para centrar el spinner
  Heading   // Para el título
} from "@chakra-ui/react";

// Importa react-datepicker y su CSS (el tuyo personalizado)
import DatePicker from "react-datepicker";
import "../../styles/react-datepicker-chakra.css"; // ¡Asegúrate de que la ruta sea correcta!

const ProgramacionCalendar = ({ idMedico, idEspecialidad, handleChangeCalendar }) => {
  const navigate = useNavigate();
  const toast = useToast(); // Inicializa el hook de toast

  const [loading, setLoading] = useState(false);
  const [diaProgramado, setDiaProgramado] = useState([]); // Días que tienen programación
  const [selectedDate, setSelectedDate] = useState(null); // Fecha actualmente seleccionada en el calendario

  // Efecto para cargar los días programados cuando cambian idMedico o idEspecialidad
  useEffect(() => {
    const loadProgrammedDays = async () => {
      // Reiniciar la fecha seleccionada cuando cambian médico/especialidad
      setSelectedDate(null);
      handleChangeCalendar(null); // Notificar al padre que la fecha ha sido reiniciada

      if (idMedico && idEspecialidad) { // Asegúrate de que ambos estén seleccionados
        setLoading(true);
        try {
          const response = await ProgramacionMedicaService.getDias(idMedico, idEspecialidad);
          if (response && response.data && response.data.programacionMedica) {
            const dias = response.data.programacionMedica.map(post => new Date(post.fechaDate));
            setDiaProgramado(dias);
            // Si hay días disponibles, selecciona el primer día programado por defecto
            if (dias.length > 0) {
              const firstAvailableDate = dias[0];
              setSelectedDate(firstAvailableDate);
              handleChangeCalendar(firstAvailableDate); // Notificar al padre
            } else {
              toast({
                title: "Sin programación",
                description: "No hay días programados para este médico y especialidad.",
                status: "info",
                duration: 5000,
                isClosable: true,
              });
            }
          } else {
            setDiaProgramado([]);
            toast({
              title: "Sin programación",
              description: "No se encontraron días programados.",
              status: "info",
              duration: 5000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error("Error al cargar días programados:", error);
          setDiaProgramado([]);
          setSelectedDate(null); // Asegurarse de que no haya fecha seleccionada en caso de error
          handleChangeCalendar(null); // Notificar al padre que la fecha ha sido reiniciada

          let errorMessage = "Error al cargar la programación. Inténtalo de nuevo.";
          if (error.response && error.response.status === 403) {
            errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
            AuthService.logout();
            navigate("/login");
          }
          toast({
            title: "Error de Carga",
            description: errorMessage,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      } else {
        // Si no hay médico o especialidad seleccionados, limpiar días programados
        setDiaProgramado([]);
        setSelectedDate(null);
        handleChangeCalendar(null);
      }
    };

    loadProgrammedDays();
  }, [idMedico, idEspecialidad, navigate, toast, handleChangeCalendar]); // Dependencias del useEffect

  // Función para manejar el cambio de fecha en el DatePicker
  const handleDateChange = (date) => {
    setSelectedDate(date);
    handleChangeCalendar(date); // Notifica al componente padre
  };

  return (
    <Box>
      <Heading as="h6" size="sm" mb={3} color="gray.700">Selecciona una Fecha Disponible</Heading>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text ml={3} color="blue.600">Cargando programación...</Text>
        </Flex>
      ) : (
        <DatePicker
          inline // Muestra el calendario directamente
          selected={selectedDate} // La fecha seleccionada
          onChange={handleDateChange} // Manejador de cambio
          includeDates={diaProgramado} // Solo permite seleccionar estas fechas
          dateFormat="dd/MM/yyyy"
          minDate={new Date()} // Opcional: No permitir fechas pasadas
          // Puedes añadir más props de react-datepicker para personalización:
          // showDisabledMonthNavigation // Muestra meses deshabilitados
          // filterDate={(date) => date.getDay() !== 6 && date.getDay() !== 0} // Ejemplo: deshabilitar fines de semana
        />
      )}
      {!loading && diaProgramado.length === 0 && (idMedico && idEspecialidad) && (
        <Text mt={4} color="red.500" textAlign="center">
          No hay fechas disponibles para este médico y especialidad.
        </Text>
      )}
    </Box>
  );
};

export default ProgramacionCalendar;



*/

