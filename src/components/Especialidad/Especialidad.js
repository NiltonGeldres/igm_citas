// src/components/Especialidad/Especialidad.js
import React, { useState, useEffect } from "react";
import EspecialidadService from "./EspecialidadService";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service";

// Importaciones de Chakra UI
import {
  Select,      // Reemplaza Form.Select
  FormLabel,   // Reemplaza FormLabel
  Box,         // Contenedor general
  Spinner,     // Para el indicador de carga
  Flex,        // Para centrar el spinner
  Text,        // Para mensajes de texto
  useToast,    // Para notificaciones
} from "@chakra-ui/react";

const Especialidad = ({ valueEspecialidad, textEspecialidad }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast(); // Inicializa el hook de toast

  useEffect(() => {
    const LoadData = async () => { // Usamos async/await para un manejo de promesas más limpio
      setLoading(true);
      try {
        // Asumiendo que EspecialidadService.getXUsuario() es la llamada correcta
        const response = await EspecialidadService.getXUsuario(); 
        if (response && response.data && response.data.especialidad) {
          setPosts(response.data.especialidad);
        } else {
          setPosts([]); // Asegurarse de que sea un array vacío si no hay datos
          toast({
            title: "Sin especialidades",
            description: "No se encontraron especialidades disponibles.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        setPosts([]); // Limpiar especialidades en caso de error
        console.error("Error al cargar especialidades:", error.response || error);
        let errorMessage = "Error al cargar las especialidades. Inténtalo de nuevo.";

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
    };

    LoadData();
  }, [navigate, toast]); // Dependencias del useEffect

  // Función para manejar el cambio de selección
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const selectedText = e.target.options[e.target.selectedIndex].text;
    valueEspecialidad(selectedValue); // Pasa el ID de la especialidad al padre
    textEspecialidad(selectedText);   // Pasa la descripción al padre
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="md"
        />
        <Text ml={3} color="blue.600">Cargando especialidades...</Text>
      </Flex>
    );
  }

  return (
    <Box>
      {/* <FormLabel htmlFor="especialidad-select" mb={2}>Especialidad</FormLabel> */}
      <Select
        id="especialidad-select" // ID para asociar con FormLabel si se usa
        placeholder="Selecciona una Especialidad" // Texto por defecto
        onChange={handleSelectChange}
        size="lg" // Tamaño más grande para mejor tacto en móvil
        variant="filled" // Estilo de relleno para el select
        colorScheme="blue" // Esquema de color
        borderRadius="md" // Bordes redondeados
        shadow="sm" // Sombra sutil
        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }} // Estilo al enfocar
      >
        {posts.map(post => (
          <option key={post.idEspecialidad} value={post.idEspecialidad}>
            {post.descripcionEspecialidad}
          </option>
        ))}
      </Select>
      {posts.length === 0 && !loading && (
        <Text mt={2} color="red.500" fontSize="sm">No hay especialidades disponibles.</Text>
      )}
    </Box>
  );
};

export default Especialidad;
