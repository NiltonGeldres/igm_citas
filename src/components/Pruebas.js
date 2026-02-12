

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


/*..........................................

//export default ProgramacionHorarioPersonal:

/**
 // Dentro de export default function ProgramacionHorarioIndividual() { ...

// Función para obtener y formatear la data del servidor al estado del calendario
const cargarDatosPrevios = useCallback(async () => {
    setEstadoGuardado('guardando'); // Reutilizamos el estado para mostrar carga
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    const idEspecialidad = 1; // Obtener de tus filtros
    const idMedico = 1;       // Obtener de tu sesión o filtros
    try {
        const res = await ProgramacionHorarioIndividualService.getProgramacionMedicoMesBlanco(mes, anio, idEspecialidad, idMedico);
        if (res.data) {


            // Suponiendo que res.data viene en formato { "2024-05-01": ["turno1"], ... }
            // Si el JSON viene diferente, aquí debes mapearlo al formato de tu estado
            const dataConFormato = mapearAFormatoCalendario(res.data)
            setHorarioCalendario(dataConFormato);
        }
    } catch (error) {
        console.error("Error al cargar programación previa:", error);
    } finally {
        setEstadoGuardado(null);
    }
}, [fechaActual]);

const mapearAFormatoCalendario = (data) => {
    return data; 
}


// Efecto para cargar datos cada vez que la fecha (mes/año) cambia
useEffect(() => {
    cargarDatosPrevios();
}, [cargarDatosPrevios]);



// Actualizar la función guardarHorario para que sea real
const guardarHorario = useCallback(async (datosNuevos) => {
    setEstadoGuardado('guardando');
    
    try {
        // Aquí llamarías a tu servicio de GUARDADO (no al de carga "Blanco")
        // await ProgramacionService.guardar(datosNuevos);
        
        console.log("Datos a enviar:", datosNuevos);
        
        setEstadoGuardado('guardado');
        setTimeout(() => setEstadoGuardado(null), 2000);
    } catch (error) {
        setEstadoGuardado(null);
        alert("Error al guardar");
    }
}, []);


    const alternarTurnoMasivo = useCallback((turnoId) => {
        setTurnosMasivosSeleccionados(prev =>
            prev.includes(turnoId) ? prev.filter(id => id !== turnoId) : [...prev, turnoId]
        );
    }, []);
    

 */

    /*....................................................................*/

    /*    
        const cargarProgramacionCompleta = useCallback(async () => {
            // 1. Preparar parámetros desde el estado
            const mes = fechaActual.getMonth() + 1;
            const anio = fechaActual.getFullYear();
            const idEspecialidad = 9; // idealmente usar estado
            const idMedico = 1762;    // idealmente usar estado
            setEstadoGuardado('cargando'); // Feedback visual de carga
    
            try {
                // 2. Llamada al Service (Axios)
                const res = await ProgramacionHorarioIndividualService.obtenerProgramacionMesBlanco(
                    mes, anio, idEspecialidad, idMedico
                );
                // 3. El "Doble Data": res.data (Axios) -> .data (Java Wrapper)
                const envoltorioBack = res.data; 
                const listaRaw = envoltorioBack?.programacionMedicaDiaResponse;
                if (envoltorioBack && Array.isArray(listaRaw)) {
                    // A. Guardamos el "envoltorio" completo (totalRegistros, numeroPagina, etc.)
                    // Esto es lo que usaremos después para el guardado simétrico.
                    setEnvoltorioOriginal(envoltorioBack);
    
                    // B. Transformamos los días a Modelos Funcionales con getClaveCalendario()
                    const modelosProcesados = listaRaw.map(item => modelarDia(item));
                    setDatosOriginalesBackend(modelosProcesados);
    
                    // C. Generamos el mapa visual para el calendario React { "2026-08-01": ["1"] }
                    // Usamos los modelos ya procesados para aprovechar sus métodos internos
                    const mapaParaUI = modelosProcesados.reduce((acc, dia) => {
                        const clave = dia.getClaveCalendario();
                        // Si el turno es 0 lo mostramos como 'libre', si no, el ID como string
                        acc[clave] = dia.idTurno !== 0 ? [String(dia.idTurno)] : ['libre'];
                        return acc;
                    }, {});
    
                    setHorarioCalendario(mapaParaUI);
                    
                    console.log("Programación modelada con éxito:", envoltorioBack);
                }
            } catch (error) {
                console.error("Error al cargar programación médica:", error);
            } finally {
                setEstadoGuardado(null);
            }
        }, [fechaActual]); // Se dispara cuando cambias el mes en el calendario
    */

{
  "fecha":"12022026",
  "idEspecialidad":"9",
  "idServicio":"1",
  "idMedico":"1762",
  "programacion":[
    {
      "id":1,
      "idProgramacion":412,
      "horaInicio":null,
      "horaFin":null,
      "dia":1,
      "diaSemana":"DO",
      "fecha":"20260201",
      "tiempoPromedioAtencion":0,
      "idServicio":1,
      "idEspecialidad":9,
      "idMedico":1762,
      "idDepartamento":0,
      "idTurno":1,
      "descripcionTurno":"Mañana",
      "color":"lightgreen"
    },
    {

    },
     
    
    {
    "fecha": "12022026",
    "idEspecialidad": "9",
    "idServicio": "1",
    "idMedico": "1762",
    "programacion": [
        {
            "id": 1,
            "idProgramacion": 412,
            "horaInicio": "",
            "horaFin": "",
            "dia": 1,
            "diaSemana": "DO",
            "fecha": "20260201",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 2,
            "idProgramacion": 413,
            "horaInicio": "",
            "horaFin": "",
            "dia": 2,
            "diaSemana": "LU",
            "fecha": "20260202",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 3,
            "idProgramacion": 414,
            "horaInicio": "",
            "horaFin": "",
            "dia": 3,
            "diaSemana": "MA",
            "fecha": "20260203",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 4,
            "idProgramacion": 415,
            "horaInicio": "",
            "horaFin": "",
            "dia": 4,
            "diaSemana": "MI",
            "fecha": "20260204",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 5,
            "idProgramacion": 416,
            "horaInicio": "",
            "horaFin": "",
            "dia": 5,
            "diaSemana": "JU",
            "fecha": "20260205",
            "tiempoPromedioAtencion": 0,
            "idServicio": 1,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": "Mañana",
            "color": "lightgreen"
        },
        {
            "id": 6,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 6,
            "diaSemana": "VI",
            "fecha": "20260206",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 1,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 7,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 7,
            "diaSemana": "SA",
            "fecha": "20260207",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 8,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 8,
            "diaSemana": "DO",
            "fecha": "20260208",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 9,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 9,
            "diaSemana": "LU",
            "fecha": "20260209",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 10,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 10,
            "diaSemana": "MA",
            "fecha": "20260210",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 11,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 11,
            "diaSemana": "MI",
            "fecha": "20260211",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 12,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 12,
            "diaSemana": "JU",
            "fecha": "20260212",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 13,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 13,
            "diaSemana": "VI",
            "fecha": "20260213",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 14,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 14,
            "diaSemana": "SA",
            "fecha": "20260214",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 15,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 15,
            "diaSemana": "DO",
            "fecha": "20260215",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 16,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 16,
            "diaSemana": "LU",
            "fecha": "20260216",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 17,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 17,
            "diaSemana": "MA",
            "fecha": "20260217",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 18,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 18,
            "diaSemana": "MI",
            "fecha": "20260218",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 19,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 19,
            "diaSemana": "JU",
            "fecha": "20260219",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 20,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 20,
            "diaSemana": "VI",
            "fecha": "20260220",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 21,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 21,
            "diaSemana": "SA",
            "fecha": "20260221",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 22,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 22,
            "diaSemana": "DO",
            "fecha": "20260222",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 23,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 23,
            "diaSemana": "LU",
            "fecha": "20260223",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 24,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 24,
            "diaSemana": "MA",
            "fecha": "20260224",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 25,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 25,
            "diaSemana": "MI",
            "fecha": "20260225",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 26,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 26,
            "diaSemana": "JU",
            "fecha": "20260226",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 27,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 27,
            "diaSemana": "VI",
            "fecha": "20260227",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        },
        {
            "id": 28,
            "idProgramacion": 0,
            "horaInicio": "",
            "horaFin": "",
            "dia": 28,
            "diaSemana": "SA",
            "fecha": "20260228",
            "tiempoPromedioAtencion": 0,
            "idServicio": 0,
            "idEspecialidad": 9,
            "idMedico": 1762,
            "idDepartamento": 0,
            "idTurno": 0,
            "descripcionTurno": null,
            "color": null
        }
    ],
    "usuario": "macuna"
}