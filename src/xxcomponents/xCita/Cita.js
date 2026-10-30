
// src/components/Cita/Cita.js
import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";
import Swal from "sweetalert2";

// Importaciones de Chakra UI
import {
  Box,
  Button,
  Text,
  Heading,
  Spinner,
  useToast,
  VStack,
  HStack,
  Flex,
  Container,
  FormLabel,
  Divider,
} from "@chakra-ui/react";

import Medico from "../Medico/Medico";
import ProgramacionCalendar from "../ProgramacionMedica/ProgramacionCalendar";
import ProgramacionHoras from "../ProgramacionMedica/ProgramacionHoras";
import FormatDate from "../Maestros/FormatDate";
import CitaService from "../Cita/CitaService";
import CitaSeparadaService from "../CitaSeparada/CitaSeparadaService";
import EspecialidadTodos from "../Especialidad/EspecialidadesTodos";

// --- Reducer para gestionar el estado de la cita ---
const initialState = {
  idEspecialidad: '',
  descripcionEspecialidad: '',
  idMedico: '',
  nombreMedico: '',
  precioUnitario: 0,
  fechaCalendar: null,
  horaInicio: "",
  idProgramacion: 0,
  idServicio: 0,
  idCitaBloqueada: 0,
  loading: false,
  error: null,
};

function citaReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'RESET_FORM':
      return { ...initialState };
    case 'SET_BLOCKED_ID':
      return { ...state, idCitaBloqueada: action.payload };
    case 'CLEAR_BLOCKED_ID':
      return { ...state, idCitaBloqueada: 0 };
    default:
      throw new Error(`Acción no soportada: ${action.type}`);
  }
}

const Cita = ({ modoCita = "paciente", medicoIdPreseleccionado, especialidadIdPreseleccionada }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(citaReducer, initialState);
  const toast = useToast();

  const {
    idEspecialidad, descripcionEspecialidad, idMedico, nombreMedico,
    precioUnitario, fechaCalendar, horaInicio, idProgramacion,
    idServicio, idCitaBloqueada, loading, error
  } = state;

  let timerInterval;

  useEffect(() => {
    if (modoCita === "medico" && medicoIdPreseleccionado && especialidadIdPreseleccionada) {
      dispatch({ type: 'SET_FIELD', field: 'idMedico', value: medicoIdPreseleccionado });
      dispatch({ type: 'SET_FIELD', field: 'idEspecialidad', value: especialidadIdPreseleccionada });
    }
  }, [modoCita, medicoIdPreseleccionado, especialidadIdPreseleccionada]);

  useEffect(() => {
    return () => {
      if (idCitaBloqueada !== 0) {
        CitaService.getEliminarCitaBloqueada(idCitaBloqueada)
          .then(() => console.log('Bloqueo de cita liberado al desmontar el componente.'))
          .catch(err => console.error('Error al liberar bloqueo al desmontar:', err));
      }
    };
  }, [idCitaBloqueada]);

  const handleBloquearCita = async (hora, idProg, idServ) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    if (modoCita === "paciente" && idCitaBloqueada !== 0) {
      try {
        await CitaService.getEliminarCitaBloqueada(idCitaBloqueada);
        console.log(`Bloqueo anterior (ID: ${idCitaBloqueada}) liberado.`);
        dispatch({ type: 'CLEAR_BLOCKED_ID' });
      } catch (err) {
        console.error("Error al intentar liberar bloqueo anterior:", err);
        toast({
          title: "Advertencia",
          description: "No se pudo liberar un bloqueo anterior. Podría haber un conflicto.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    }

    if (!idMedico || !idEspecialidad || !fechaCalendar) {
      dispatch({ type: 'SET_ERROR', payload: "Por favor, selecciona especialidad, médico y fecha antes de elegir la hora." });
      dispatch({ type: 'SET_LOADING', payload: false });
      toast({
        title: "Datos Incompletos",
        description: "Selecciona una especialidad, un médico y una fecha en el calendario.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    dispatch({ type: 'SET_FIELD', field: 'horaInicio', value: hora });
    dispatch({ type: 'SET_FIELD', field: 'idProgramacion', value: idProg });
    dispatch({ type: 'SET_FIELD', field: 'idServicio', value: idServ });

    let newBlockedId = 0;
    if (modoCita === "paciente") {
      try {
        const response = await CitaService.getCitaBloquear(hora, fechaCalendar, idMedico);
        newBlockedId = response.data.idCitaBloqueada;
        dispatch({ type: 'SET_BLOCKED_ID', payload: newBlockedId });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (err) {
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_ERROR', payload: `Error al bloquear la cita: ${err.message}.` });
        toast({
          title: "Error al Bloquear Horario",
          description: "El horario seleccionado no pudo ser reservado. Puede que ya esté ocupado o haya un problema. Inténtalo de nuevo.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        if (err.response && err.response.status === 403) {
          AuthService.logout();
          navigate("/login");
        }
        return;
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }

    mensajemostrarAlerta(hora, newBlockedId);
  };
  const CitaSeparadaCrear = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      if (modoCita === "medico") {
        await CitaSeparadaService.getCitaSeparadaCrear(
          fechaCalendar, horaInicio, horaInicio, 0, idMedico, idEspecialidad,
          idServicio, idProgramacion, 0, precioUnitario
        );
        toast({
          title: "Cita Asignada!",
          description: "La cita ha sido asignada al paciente directamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

      } else {
        await CitaSeparadaService.getCitaSeparadaCrear(
          fechaCalendar, horaInicio, horaInicio, 0, idMedico, idEspecialidad,
          idServicio, idProgramacion, 0, precioUnitario
        );
        toast({
          title: "Cita Creada!",
          description: "La cita ha sido reservada con éxito.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      dispatch({ type: 'RESET_FORM' });

    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: `Error al separar la cita: ${err.message}.` });
      toast({
        title: "Error al Crear Cita",
        description: "Hubo un problema al finalizar la reserva de la cita. Por favor, inténtalo de nuevo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      if (err.response && err.response.status === 403) {
        AuthService.logout();
        navigate("/login");
      }
    }
  };
  const mensajemostrarAlerta = (hora, currentBlockedId) => {
    const title = modoCita === "medico" ? "Confirmar Asignación de Cita" : "Confirmar Cita";
    const htmlContent = modoCita === "medico" ?
      `¿Está seguro de **asignar** esta cita para: <b>${nombreMedico || 'No seleccionado'}</b> para el: <b>${FormatDate.format_fecha(fechaCalendar)}</b> a las: <b>${hora}</b>?` :
      `¿Estás seguro de crear una cita con: <b>${nombreMedico || 'No seleccionado'}</b> para el: <b>${FormatDate.format_fecha(fechaCalendar)}</b> a las: <b>${hora}</b>?<br/>Tienes <b></b> segundos para confirmar.`;

    Swal.fire({
      icon: "question",
      title: title,
      html: htmlContent,
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: "Sí, confirmar",
      denyButtonText: "No, cancelar",
      timer: modoCita === "paciente" ? 60000 : undefined,
      timerProgressBar: modoCita === "paciente",
      didOpen: () => {
        if (modoCita === "paciente") {
            const timer = Swal.getPopup().querySelector("b");
            if (timer) {
                timerInterval = setInterval(() => {
                    timer.textContent = `${Math.ceil(Swal.getTimerLeft() / 1000)}`;
                }, 1000);
            }
        }
      },
      willClose: () => {
        if (modoCita === "paciente") {
            clearInterval(timerInterval);
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await CitaSeparadaCrear();
      } else {
        if (modoCita === "paciente" && currentBlockedId !== 0) {
          try {
            await CitaService.getEliminarCitaBloqueada(currentBlockedId);
            dispatch({ type: 'CLEAR_BLOCKED_ID' });
            toast({
              title: "Selección Cancelada",
              description: "El horario ha sido liberado.",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          } catch (err) {
            console.error("Error al liberar bloqueo al cancelar:", err);
            toast({
              title: "Error",
              description: "No se pudo liberar el horario. Por favor, recarga la página.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        } else {
          toast({
            title: "Selección Cancelada",
            description: "No se realizó ninguna acción.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    });
  };
  const valueEspecialidad = val => {
    dispatch({ type: 'SET_FIELD', field: 'idEspecialidad', value: val });
    dispatch({ type: 'SET_FIELD', field: 'idMedico', value: '' });
    dispatch({ type: 'SET_FIELD', field: 'fechaCalendar', value: null });
  };
  const textEspecialidad = txt => {
    dispatch({ type: 'SET_FIELD', field: 'descripcionEspecialidad', value: txt });
  };
  const valueMedico = val => {
    dispatch({ type: 'SET_FIELD', field: 'idMedico', value: val });
    dispatch({ type: 'SET_FIELD', field: 'fechaCalendar', value: null });
  };
  const textMedico = txt => {
    dispatch({ type: 'SET_FIELD', field: 'nombreMedico', value: txt });
  };
  const precioUnitarioSel = val => {
    dispatch({ type: 'SET_FIELD', field: 'precioUnitario', value: val });
  };
  const handleChangeCalendar = date => {
    dispatch({ type: 'SET_FIELD', field: 'fechaCalendar', value: date ? FormatDate.format_yyyymmdd(date) : null });
  };
  const handleClickHora = (hora, idProgramacionSel, idServicioSel) => {
    handleBloquearCita(hora, idProgramacionSel, idServicioSel);
  };

  return (
    <Container maxW="container.md" p={4}>
      {loading && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="rgba(255, 255, 255, 0.8)"
          justify="center"
          align="center"
          zIndex="overlay"
          direction="column"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text mt={4} fontSize="lg" color="blue.700" fontWeight="bold">Cargando...</Text>
        </Flex>
      )}

      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center" mb={4} color="blue.800">
          {modoCita === "medico" ? "Asignar Cita Médica" : "Reservar Cita Médica"}
        </Heading>

        {error && (
          <Box p={3} bg="red.100" color="red.700" borderRadius="md">
            <Text fontWeight="bold">Error:</Text>
            <Text>{error}</Text>
          </Box>
        )}

        {/* Sección de Especialidad (solo si es modo paciente) */}
        {modoCita === "paciente" && (
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
            <FormLabel fontSize="lg" fontWeight="semibold" mb={2}>1. Selecciona tu Especialidad</FormLabel>
            <EspecialidadTodos
              valueEspecialidad={valueEspecialidad}
              textEspecialidad={textEspecialidad}
            />
          </Box>
        )}

        {/* Sección de Médico (solo si es modo paciente) */}
        {modoCita === "paciente" && (
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
            <FormLabel fontSize="lg" fontWeight="semibold" mb={2}>2. Elige tu Médico</FormLabel>
            <Medico
              idEspecialidad={idEspecialidad}
              valueMedico={valueMedico}
              textMedico={textMedico}
              precioUnitario={precioUnitarioSel}
            />
            <HStack mt={4} justifyContent="flex-end">
              <Text fontWeight="bold" fontSize="md" color="gray.700">
                Precio Consulta: <Text as="span" color="green.600">S/. {precioUnitario.toFixed(2)}</Text>
              </Text>
            </HStack>
          </Box>
        )}

        {/* Separador si el modo es médico (para indicar que la especialidad/médico ya están seleccionados) */}
        {modoCita === "medico" && (
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          </Box>
        )}

        {/* Sección de Calendario */}
        <Box flex="1" p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <ProgramacionCalendar
            idMedico={idMedico}
            idEspecialidad={idEspecialidad}
            handleChangeCalendar={handleChangeCalendar}
          />
        </Box>



        {/* Sección de Horas Disponibles (Ahora debajo del calendario) */}
        <Box flex="1" p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
          <ProgramacionHoras
            idMedico={idMedico}
            idEspecialidad={idEspecialidad}
            fechaCalendar={fechaCalendar}
            handleClickHora={handleClickHora}
            actualizar={idCitaBloqueada !== 0 || loading}
          />
        </Box>
      </VStack>
    </Container>
  );
};

export default Cita;
