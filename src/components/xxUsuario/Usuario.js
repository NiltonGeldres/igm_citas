// src/components/Usuario/Usuario.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Login/services/auth.service"; // Para manejar el logout en caso de 403
import UsuarioService from "../Usuario/UsuarioService"; // Tu servicio de usuario

// Importaciones de Chakra UI
import {
  Box,
  Text,
  Heading,
  Spinner,
  Flex,
  VStack,
  HStack,
  useToast,
  Divider,
  Icon,
  Center,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select, // Para el select de sexo
  IconButton, // Para el botón de atrás
} from "@chakra-ui/react";

// Importar iconos de React Icons
import {
  FaArrowLeft,
  FaUserMd,
  FaUserInjured,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaStethoscope,
  FaMoneyBillWave,
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
  FaSave, // Icono para guardar
  FaEdit, // Icono para editar
} from "react-icons/fa";

// El componente Usuario ahora recibe el perfil completo como una prop
const Usuario = ({ userId, userRoles, usuarioDataPrincipal, setUserProfileData }) => {
  const navigate = useNavigate();
  const toast = useToast();

  // Usamos un estado interno para los datos del formulario de edición
  // Se inicializa con usuarioDataPrincipal o con un objeto vacío si no hay datos
  const [usuarioData, setUsuarioData] = useState(usuarioDataPrincipal || {
    id_usuario: 0,
    username: "",
    email: "",
    estado: "",
    apellido_paterno: "",
    apellido_materno: "",
    primer_nombre: "",
    segundo_nombre: "",
    numero_celular: "",
    id_sexo: "",
    id_tipo_documento: "",
    numero_documento: "",
    fecha_alta: "",
    fecha_baja: "",
    fecha_modificacion: ""
    // Campos adicionales para médico/paciente si vienen en usuarioDataPrincipal
    // medicoId: null, specialtyDescription: "", presentation: "", preciounitario: 0,
    // pacienteId: null, birthDate: "",
  });
  const [loading, setLoading] = useState(false); // Para el spinner de actualización
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo edición

  // Sincronizar el estado interno con la prop inicial
  // Esto es crucial para que el formulario se actualice si la prop usuarioDataPrincipal cambia (ej. al recargar App.js)
  useEffect(() => {
    if (usuarioDataPrincipal) {
      setUsuarioData(usuarioDataPrincipal);
    }
  }, [usuarioDataPrincipal]);

  // Determinar el rol principal para la visualización
  const isDoctor = userRoles?.includes("ROLE_DOCTOR");
  const isPatient = userRoles?.includes("ROLE_PATIENT");

  // Función para formatear nombres completos
  const getFullName = (profile) => {
    if (!profile) return "N/A";
    const primerNombre = profile.primer_nombre || '';
    const segundoNombre = profile.segundo_nombre || '';
    const apellidoPaterno = profile.apellido_paterno || '';
    const apellidoMaterno = profile.apellido_materno || '';
    
    return [primerNombre, segundoNombre, apellidoPaterno, apellidoMaterno]
      .filter(Boolean) // Elimina cadenas vacías o null
      .join(' ');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuarioData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Llama al servicio de actualización
      const response = await UsuarioService.actualizaUsuario(usuarioData);
      
      // Actualiza el estado global en App.js con los nuevos datos
      setUserProfileData(response.data); 
      setUsuarioData(response.data); // Sincroniza el estado local también

      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han guardado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false); // Salir del modo edición
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      let errorMessageText = "Error al actualizar el perfil. Inténtalo de nuevo.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessageText = error.response.data.message;
      }
      toast({
        title: "Error de actualización",
        description: errorMessageText,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      if (error.response && error.response.status === 403) {
        AuthService.logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Si los datos no se han cargado (ej. acceso directo a /profile sin login previo o refresco sin persistencia en App.js)
  // Muestra un mensaje amigable en lugar de un error.
  if (!usuarioDataPrincipal) {
    return (
      <Center minH="300px">
        <Box p={5} bg="yellow.100" color="yellow.700" borderRadius="md" textAlign="center">
          <Icon as={FaInfoCircle} w={6} h={6} mb={2} />
          <Text fontWeight="bold">Perfil no disponible.</Text>
          <Text>Por favor, inicia sesión para ver tu perfil.</Text>
          <Button mt={4} colorScheme="blue" onClick={() => navigate("/login")}>Ir a Login</Button>
        </Box>
      </Center>
    );
  }

  // Usamos usuarioData para renderizar los campos editables
  const userProfile = usuarioData; // Renombrar para claridad en el JSX

  return (
    <Box p={6} shadow="lg" borderWidth="1px" borderRadius="lg" bg="white" maxW="md" mx="auto" my={8}>
      <VStack spacing={4} align="stretch">
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <IconButton
            icon={<FaArrowLeft />}
            onClick={() => navigate(-1)}
            aria-label="Volver atrás"
            variant="ghost"
            colorScheme="gray"
            size="md"
            rounded="full"
          />
          <Heading as="h2" size="xl" textAlign="center" color="blue.800" flex="1">
            Mi Perfil
          </Heading>
          <IconButton
            icon={isEditing ? <FaSave /> : <FaEdit />}
            onClick={isEditing ? handleUpdateProfile : () => setIsEditing(true)}
            aria-label={isEditing ? "Guardar cambios" : "Editar perfil"}
            colorScheme={isEditing ? "green" : "blue"}
            size="md"
            rounded="full"
            isLoading={loading}
          />
        </Flex>
        
        <Divider />

        <form onSubmit={handleUpdateProfile}>
          <VStack spacing={4} align="stretch">
            {/* Sección de Identificación Básica */}
            <HStack spacing={3} alignItems="center">
              <Icon as={isDoctor ? FaUserMd : FaUserInjured} w={6} h={6} color="blue.500" />
              <Text fontSize="xl" fontWeight="semibold" color="gray.800">
                {getFullName(userProfile)}
              </Text>
            </HStack>
            <FormControl>
              <FormLabel>Nombre de usuario</FormLabel>
              <Input
                name="username"
                value={userProfile.username || ''}
                onChange={handleInputChange}
                isDisabled={true} // Nombre de usuario suele no ser editable
                variant="filled"
              />
            </FormControl>
            <FormControl>
              <FormLabel>ID de Usuario</FormLabel>
              <Input
                name="id_usuario"
                value={userProfile.id_usuario || ''}
                isDisabled={true}
                variant="filled"
              />
            </FormControl>
            
            {/* Información de Contacto */}
            <Heading as="h3" size="md" mt={4} color="gray.700">Contacto</Heading>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={userProfile.email || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
                variant={isEditing ? "outline" : "filled"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Celular</FormLabel>
              <Input
                name="numero_celular"
                type="tel"
                value={userProfile.numero_celular || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
                variant={isEditing ? "outline" : "filled"}
              />
            </FormControl>
            
            {/* Información de Documento y Sexo */}
            <Heading as="h3" size="md" mt={4} color="gray.700">Detalles Personales</Heading>
            <FormControl>
              <FormLabel>Tipo de Documento</FormLabel>
              <Input
                name="id_tipo_documento"
                value={userProfile.id_tipo_documento || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
                variant={isEditing ? "outline" : "filled"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Número de Documento</FormLabel>
              <Input
                name="numero_documento"
                value={userProfile.numero_documento || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
                variant={isEditing ? "outline" : "filled"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Sexo</FormLabel>
              <Select
                name="id_sexo"
                value={userProfile.id_sexo || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
                variant={isEditing ? "outline" : "filled"}
              >
                <option value="">Seleccione sexo</option>
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
              </Select>
            </FormControl>

            {/* Fechas de Gestión (solo lectura) */}
            <Heading as="h3" size="md" mt={4} color="gray.700">Gestión de Cuenta</Heading>
            <FormControl>
              <FormLabel>Fecha de Alta</FormLabel>
              <Input name="fecha_alta" value={userProfile.fecha_alta || 'No especificada'} isDisabled={true} variant="filled" />
            </FormControl>
            {userProfile.fecha_baja && (
              <FormControl>
                <FormLabel>Fecha de Baja</FormLabel>
                <Input name="fecha_baja" value={userProfile.fecha_baja} isDisabled={true} variant="filled" />
              </FormControl>
            )}
            {userProfile.fecha_modificacion && (
              <FormControl>
                <FormLabel>Última Modificación</FormLabel>
                <Input name="fecha_modificacion" value={userProfile.fecha_modificacion} isDisabled={true} variant="filled" />
              </FormControl>
            )}
            
            {/* Información Específica del Rol (solo lectura, asumiendo que vienen del backend) */}
            {isDoctor && (
              <Box>
                <Divider my={4} />
                <Heading as="h3" size="md" color="gray.700">Información del Médico</Heading>
                <FormControl>
                  <FormLabel>ID Médico</FormLabel>
                  <Input value={userProfile.medicoId || 'N/A'} isDisabled={true} variant="filled" />
                </FormControl>
                <FormControl>
                  <FormLabel>Especialidad</FormLabel>
                  <Input value={userProfile.specialtyDescription || 'No especificado'} isDisabled={true} variant="filled" />
                </FormControl>
                <FormControl>
                  <FormLabel>Presentación</FormLabel>
                  <Input value={userProfile.presentation || 'No especificada'} isDisabled={true} variant="filled" />
                </FormControl>
                <FormControl>
                  <FormLabel>Precio Consulta</FormLabel>
                  <Input value={`S/. ${userProfile.preciounitario ? userProfile.preciounitario.toFixed(2) : 'N/A'}`} isDisabled={true} variant="filled" />
                </FormControl>
              </Box>
            )}

            {isPatient && (
              <Box>
                <Divider my={4} />
                <Heading as="h3" size="md" color="gray.700">Información del Paciente</Heading>
                <FormControl>
                  <FormLabel>ID Paciente</FormLabel>
                  <Input value={userProfile.pacienteId || 'N/A'} isDisabled={true} variant="filled" />
                </FormControl>
                <FormControl>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <Input value={userProfile.birthDate || 'No especificada'} isDisabled={true} variant="filled" />
                </FormControl>
              </Box>
            )}
            
            {/* Botón de guardar solo visible en modo edición */}
            {isEditing && (
              <Button
                type="submit"
                colorScheme="green"
                width="full"
                mt={6}
                isLoading={loading}
                loadingText="Guardando..."
                leftIcon={<Icon as={FaSave} />}
              >
                Guardar Cambios
              </Button>
            )}
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Usuario;
