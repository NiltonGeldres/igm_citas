// src/components/ProgramacionMedica/ProgramacionHoras.js
import React, { useState, useEffect, useRef } from "react";
import CitaService from "../Cita/CitaService";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";

// Importaciones de Chakra UI
import {
  Box,
  Text,
  Spinner,
  Button,
  Flex,
  HStack,
  useToast,
  Heading,
  Center,
  IconButton,
  Tooltip,
  Icon,
} from "@chakra-ui/react";

// Importar iconos de React Icons
import { FaChevronLeft, FaChevronRight, FaRegClock } from "react-icons/fa";

const ProgramacionHoras = ({ idMedico, idEspecialidad, fechaCalendar, handleClickHora, actualizar }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [selectedLocalHour, setSelectedLocalHour] = useState(null);

  useEffect(() => {
    const loadAvailableHours = async () => {
      setSelectedLocalHour(null); // Limpiar selección local al cargar nuevos datos
      setPosts([]); // Limpiar horas anteriores

      if (idMedico && idEspecialidad && fechaCalendar) {
        setLoading(true);
        try {
          const response = await CitaService.getCitaDisponible(idMedico, idEspecialidad, fechaCalendar);
          console.log("data de cupos   :   "+JSON.stringify(response))          
          const fetchedHours = response.data.cita || [];
          setPosts(fetchedHours);

          if (fetchedHours.length === 0) {
            toast({
              title: "No hay horarios",
              description: "No se encontraron horarios disponibles para esta fecha.",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          setPosts([]); // Limpiar las horas en caso de error
          console.error("Error al cargar horarios disponibles:", error);
          let errorMessage = "Error al cargar los horarios. Inténtalo de nuevo.";

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
        setPosts([]);
      }
    };

    loadAvailableHours();
  }, [idMedico, idEspecialidad, fechaCalendar, actualizar, navigate, toast]);

  useEffect(() => {
    const checkScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); 
      }
    };

    checkScrollButtons(); 
    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons); 
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      }
    };
  }, [posts]); 

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleHourButtonClick = (hora, idProgramacion, idServicio) => {
    setSelectedLocalHour(hora); 
    handleClickHora(hora, idProgramacion, idServicio); 
  };

  return (
    <Box>
      <Heading as="h6" size="sm" mb={3} color="gray.700">Horarios Disponibles</Heading>

      {loading ? (
        <Center height="150px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text ml={3} color="blue.600">Cargando horarios...</Text>
        </Center>
      ) : posts.length > 0 ? (
        // Contenedor principal de la fila de horarios y botones de navegación
        // py={2} para un padding vertical consistente en toda la fila
        <Flex  align="center" gap={0} py={2} border="1px solid" borderColor="gray.200" borderRadius="md" bg="white"> 
          {/* Botón de Retroceso */}
          <IconButton
            icon={<FaChevronLeft />}
            onClick={scrollLeft}
            isDisabled={!canScrollLeft}
            aria-label="Retroceder horarios"
            variant="outline"
            colorScheme="gray"
            size="sm"
            height="45px" 
            width="45px" 
            rounded="none" 
            border="none" // Eliminar borde para que el borde del Flex lo envuelva
            bg="white" 
            color="gray.600" 
            _hover={{ bg: 'gray.50' }}
            display={{ base: 'flex', md: 'none' }} 
            sx={{
              '.chakra-button__icon': {
                fontSize: '1rem', 
              },
            }}
          />

          {/* Contenedor de horas con scroll horizontal */}
          <Box
            ref={scrollContainerRef}
            flex="1"
            overflowX="auto"
            whiteSpace="nowrap"
            // pb={2} // Eliminado, el padding vertical ahora está en el Flex padre
            sx={{
              "&::-webkit-scrollbar": { height: "6px" },
              "&::-webkit-scrollbar-track": { background: "gray.50", borderRadius: "10px" },
              "&::-webkit-scrollbar-thumb": { background: "gray.300", borderRadius: "10px" },
              "&::-webkit-scrollbar-thumb:hover": { background: "gray.400" },
              "scrollbar-width": "thin",
              "scrollbar-color": "var(--chakra-colors-gray-300) var(--chakra-colors-gray-50)",
            }}
          >
            {/* HStack para los botones de hora en horizontal */}
            {/* spacing={0} para que los botones estén pegados como en la imagen */}
            {/* py={0} para eliminar cualquier padding vertical que desalinee */}
            <HStack   spacing={10} py={5} minW="max-content"> 
              {posts.map((post) => {
                const isSelected = selectedLocalHour === post.horaInicio;
                return (
                  <Tooltip key={post.idProgramacion || post.horaInicio} label={`Reservar ${post.horaInicio}`} hasArrow>
                    <Button
                      variant="outline" 
                      backgroundColor="#0078f5" 
                      color="white" 
                      size="md"
                      height="45px"
                      minWidth="100px"
                      rounded="none" 
                      border="1px solid" 
                      borderColor="gray.300" 
                      shadow="none" 
                      onClick={() => handleHourButtonClick(post.horaInicio, post.idProgramacion, post.idServicio)}
                      _hover={{
                        backgroundColor: '#082aebff', 
                        borderColor: 'gray.400',
                        transform: 'none', 
                        shadow: 'none', 
                      }}
                      _active={{
                        bg: 'gray.300', 
                        borderColor: 'gray.500',
                      }}
                      // Estilo para el estado seleccionado (borde azul, texto azul, fondo blanco)
                      sx={isSelected ? {
                        borderColor: 'blue.500',
                        color: 'blue.500',
                        bg: 'white',
                        shadow: 'sm', 
                        _hover: {
                          bg: 'blue.50',
                          borderColor: 'blue.600',
                          color: 'blue.600',
                        },
                        _active: {
                          bg: 'blue.100',
                          borderColor: 'blue.700',
                          color: 'blue.700',
                        }
                      } : {}}
                      leftIcon={<Icon as={FaRegClock} boxSize={20} color="gray.500" />} 
                    >
                      {post.horaInicio}
                    </Button>
                  </Tooltip>
                );
              })}
            </HStack>
          </Box>

          {/* Botón de Avance */}
          <IconButton
            icon={<FaChevronRight />}
            onClick={scrollRight}
            isDisabled={!canScrollRight}
            aria-label="Avanzar horarios"
            variant="outline" 
            colorScheme="gray" 
            size="sm" 
            height="45px" 
            width="45px" 
            rounded="none" 
            border="none" // Eliminar borde
            bg="white" 
            color="gray.600" 
            _hover={{ bg: 'gray.50', borderColor: 'gray.400' }}
            display={{ base: 'flex', md: 'none' }} 
            sx={{
              '.chakra-button__icon': {
                fontSize: '1rem', 
              },
            }}
          />
        </Flex>
      ) : (
        <Text mt={4} color="gray.500" textAlign="center">
          {idMedico && idEspecialidad && fechaCalendar ?
            "No hay horarios disponibles para la fecha seleccionada." :
            "Selecciona una fecha para ver los horarios disponibles."
          }
        </Text>
      )}
    </Box>
  );
};

export default ProgramacionHoras;
