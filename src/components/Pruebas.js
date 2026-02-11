

// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AuthService from "./components/Login/services/auth.service";
import Login from "./components/Login/Login";
import Usuario from "./components/Usuario/Usuario"; 
import UsuarioService from "./services/usuario.service"; 
import { jwtDecode } from "jwt-decode"; 

// Importaciones de Chakra UI
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Box, Flex, Button, Text, Link as ChakraLink, HStack, Spacer } from '@chakra-ui/react';

// Definir un tema básico para Chakra UI (puedes expandirlo)
const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50', 
        color: 'gray.800',
      },
    },
  },
});

function App() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null); 
  const [userId, setUserId] = useState(null); 
  const [userRoles, setUserRoles] = useState([]); 
  const [userProfileData, setUserProfileData] = useState(null); 

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser(); 
    if (currentUser && currentUser.jwtToken) { 
      setAuthUser(currentUser);
      try {
        const decodedToken = jwtDecode(currentUser.jwtToken);
        setUserId(decodedToken.userId); 
        setUserRoles(decodedToken.roles || []); 

        const storedProfile = sessionStorage.getItem("userProfile");
        if (storedProfile) {
          setUserProfileData(JSON.parse(storedProfile));
        } else {
          const usernameFromToken = decodedToken.sub; 
          if (usernameFromToken) {
            UsuarioService.leerUsuario(usernameFromToken)
              .then(response => {
                setUserProfileData(response.data);
                sessionStorage.setItem("userProfile", JSON.stringify(response.data));
              })
              .catch(error => {
                console.error("Error al recargar perfil en App.js:", error);
              });
          }
        }
      } catch (e) {
        console.error("Error decoding token on app load:", e);
        AuthService.logout(); 
        navigate("/login");
      }
    }
  }, [navigate]);

  const logOut = () => {
    AuthService.logout(); 
    setAuthUser(null);
    setUserId(null);
    setUserRoles([]); 
    setUserProfileData(null);
    navigate("/login");
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" display="flex" flexDirection="column"> {/* Contenedor principal para layout de columna */}
        {/* Barra de navegación o header */}
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          wrap="wrap"
          padding={4}
          bg="blue.600"
          color="white"
          boxShadow="md"
          width="full" // Ocupa todo el ancho
        >
          <Flex align="center" mr={5}>
            <Heading as="h1" size={{ base: "sm", md: "md" }} letterSpacing={"-.1rem"}> {/* Tamaño de título responsivo */}
              <ChakraLink onClick={() => navigate("/")} _hover={{ textDecoration: 'none' }}>
                Mi App Médica
              </ChakraLink>
            </Heading>
          </Flex>

          {/* Menú de navegación (oculto en móvil, visible en desktop) */}
          <HStack 
            spacing={{ base: 2, md: 4 }} // Espaciado responsivo
            display={{ base: "none", md: "flex" }} // Ocultar en móvil, mostrar en desktop
            alignItems="center"
          >
            {authUser ? (
              <>
                <Text fontSize={{ base: "sm", md: "md" }}> {/* Tamaño de texto responsivo */}
                  Bienvenido, {userProfileData?.primer_nombre || authUser.username || 'Usuario'}
                </Text>
                <Button variant="ghost" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }} onClick={() => navigate("/profile")}>
                  Mi Perfil
                </Button>
                {userRoles?.includes("ROLE_DOCTOR") && (
                  <Button variant="ghost" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }} onClick={() => navigate("/doctor-dashboard")}>
                    Dashboard Médico
                  </Button>
                )}
                {userRoles?.includes("ROLE_PATIENT") && (
                  <Button variant="ghost" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }} onClick={() => navigate("/patient-dashboard")}>
                    Dashboard Paciente
                  </Button>
                )}
                <Button colorScheme="red" size={{ base: "sm", md: "md" }} onClick={logOut}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" colorScheme="whiteAlpha" size={{ base: "sm", md: "md" }} onClick={() => navigate("/login")}>
                  Iniciar Sesión
                </Button>
                <Button colorScheme="green" size={{ base: "sm", md: "md" }} onClick={() => navigate("/signup")}>
                  Registrarse
                </Button>
              </>
            )}
          </HStack>
          
          {/* Botón de menú para móvil (visible solo en móvil) */}
          {/* Implementar un menú hamburguesa aquí si es necesario */}
          <Box display={{ base: "block", md: "none" }}>
            {/* Aquí iría un icono de hamburguesa y un componente de menú desplegable */}
            <Text color="white">Menú</Text> {/* Placeholder */}
          </Box>
        </Flex>

        {/* Contenido principal que se expande */}
        <Box flex="1" p={{ base: 2, md: 4 }}> {/* Padding responsivo y flex-grow */}
          <Routes>
            <Route path="/" element={<Text p={4}>Página de Inicio Pública</Text>} />
            <Route 
              path="/login" 
              element={
                <Login 
                  setAuthUser={setAuthUser}
                  setUserId={setUserId}
                  setUserRoles={setUserRoles}
                  setUserProfileData={setUserProfileData} 
                />
              } 
            />
            <Route path="/signup" element={<Text p={4}>Página de Registro</Text>} />

            {/* Rutas Protegidas */}
            {userId && userRoles && userRoles.length > 0 && (
              <>
                <Route 
                  path="/profile" 
                  element={<Usuario userId={userId} userRoles={userRoles} usuarioDataPrincipal={userProfileData} setUserProfileData={setUserProfileData} />} 
                />
                {userRoles?.includes("ROLE_DOCTOR") && (
                  <Route path="/doctor-dashboard" element={<Text p={4}>Dashboard Médico (Protegido)</Text>} />
                )}
                {userRoles?.includes("ROLE_PATIENT") && (
                  <Route path="/patient-dashboard" element={<Text p={4}>Dashboard Paciente (Protegido)</Text>} />
                )}
                <Route path="/private" element={<Text p={4}>Contenido Privado General (Protegido)</Text>} />
              </>
            )}
            <Route path="*" element={<Text p={4}>Página no encontrada o no autorizado.</Text>} />
          </Routes>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;

/*.....................................................................*/
   //  console.log("todos los turnos fuera Useffec:  "+JSON.stringify(TODOS_LOS_TURNOS))
  /*  const guardarHorario = useCallback((datosNuevos) => {
        console.log("GUARDAR ===> "+JSON.stringify(datosNuevos));
        setEstadoGuardado('guardando');
        setTimeout(() => {
            setEstadoGuardado('guardado');
            setTimeout(() => setEstadoGuardado(null), 2000);
        }, 600);
    }, []);
*/



/**................................................................... 
 * 
     const cargarProgramacionCompleta = useCallback(async () => {
        // 1. Preparar parámetros (estos vendrían de tus estados de filtros)
        const mes = fechaActual.getMonth() + 1;
        const anio = fechaActual.getFullYear();
        const idEspecialidad = 9; // id de ejemplo
        const idMedico = 1762;    // id de 
        
        console.log("DATA BLANCO cargarProgramacionCompleta   "+ mes+anio)

        setEstadoGuardado('guardando ');

        try {
            // 2. Llamada al Service
            const res = await ProgramacionHorarioIndividualService.getProgramacionMedicoMesBlanco(
                mes, anio, idEspecialidad, idMedico
            );
              console.log("DATA BLANCO "+JSON.stringify(res))

            if (res.data && Array.isArray(res.data)) {
                // 3. TRANSFORMACIÓN A MODELOS (La clave del éxito)
                // Convertimos cada objeto plano del JSON en un "Modelo Funcional"
                console.log("DATA BLANCO "+JSON.stringify(res.data))
                const modelosProcesados = res.data.map(item => crearProgramacionHorarioDia(item));

                // 4. ACTUALIZAR ESTADOS
                // Guardamos la lista completa de modelos (los 31 días)
                setDatosOriginalesBackend(modelosProcesados);

                // Generamos el mapa visual para el calendario { "2026-05-01": ["1"] }
                const mapaParaUI = mapearListaAUI(res.data);
                setHorarioCalendario(mapaParaUI);
                
                console.log("Datos cargados y modelados correctamente.");
            }
        } catch (error) {
            console.error("Error al obtener la programación del médico:", error);
        } finally {
            setEstadoGuardado(null);
        }
    }, [fechaActual]); 

    // Disparador automático al cambiar de mes/año
    useEffect(() => {
        cargarProgramacionCompleta();
    }, [cargarProgramacionCompleta]);

    const prepararDatosParaEnvio = (horarioUI, plantillaOriginal) => {
        // Recorremos la plantilla original (los 31 días que el backend nos envió)
        return plantillaOriginal.map(diaOriginal => {
            // 1. Obtenemos la clave de este día (ej: "2026-05-01")
            const clave = diaOriginal.getClaveCalendario();
            // 2. Buscamos qué seleccionó el usuario en el calendario de React
            const seleccionUI = horarioUI[clave]; // Devuelve ['1'], ['2'] o ['libre']
            // 3. Determinamos el ID del turno (0 si es libre)
            const nuevoIdTurno = (seleccionUI && seleccionUI[0] !== 'libre') 
                ? seleccionUI[0] 
                : 0;
            // 4. Usamos nuestro "Setter Inmutable" para crear el objeto actualizado
            const diaActualizado = actualizarTurnoEnDia(diaOriginal, nuevoIdTurno);
            // 5. IMPORTANTE: El backend no necesita la función 'getClaveCalendario'
            // Extraemos solo los datos puros (data transfer object)
            const { getClaveCalendario, ...datosLimpios } = diaActualizado;
            return datosLimpios;
        });
    };

    const guardarHorario = useCallback(async () => {
        setEstadoGuardado('guardando');
        try {
            // Generamos el array final de 31 objetos perfectamente modelados
            const datosFinales = prepararDatosParaEnvio(horarioCalendario, datosOriginalesBackend);

            console.log("JSON listo para la API:", datosFinales);
            // Llamada al servicio (POST / PUT)
            const respuesta = await ProgramacionHorarioIndividualService.guardarProgramacionMes(datosFinales);
            if (respuesta.status === 200) {
                setEstadoGuardado('guardado');
                // Opcional: Recargar datos del servidor para confirmar
                // cargarProgramacionExistente();
            }
        } catch (error) {
            console.error("Error al sincronizar con el backend:", error);
            setEstadoGuardado(null);
            alert("Hubo un error al guardar la programación.");
        } finally {
            // Quitamos el mensaje de "Guardado" después de 3 segundos
            setTimeout(() => setEstadoGuardado(null), 3000);
        }
    }, [horarioCalendario, datosOriginalesBackend]);
 
 */


    /**........................................................................... */
            // Estado para simular la programación actual de turnos en el calendario (Day: [Shift IDs])
            /*const [calendarSchedule, setCalendarSchedule] = useState({
                '3': ['morning', 'afternoon'],
                '15': ['morning', 'afternoon', 'evening'],
            });*/
