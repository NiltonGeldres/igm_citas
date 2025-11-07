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
