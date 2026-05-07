//import header from "../../components/Security/Header";
import header from "../../shared/utils/Header";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { mapearUsuarioRequest } from "../mappers/UsuarioMapper";
import { transformarUsuarios } from "../mappers/UsuarioMapper";



const API_URL = process.env.REACT_APP_URL_API;
const LOGIN = "/auth";
const SIGNUP = "/signin";
const USUARIO_CREAR = "/signin";
const GETUSUARIO = "/getUsuarioUsername";
const UPDATEUSUARIO = "/updateUsuario";
const DATOS_GLOBALES = "/usuarioDatosGlobales";



const ejecutarAPI = async (endpoint, params = {}) => {
    try {
       const response = await axios.post(API_URL + endpoint, params, { 
             // Aquí van los tokens/auth
            // Si necesitas enviar query params (URL?id=1), usa: params: { ... }
        });

        console.log("data api :", JSON.stringify(response.data));
        const rawData = response.data ;
        return transformarUsuarios(rawData);
        } catch (error) {
            if (error.response) {
                // 1. Aquí capturas el objeto UsuarioResponse que enviaste en el body
              //  const datosError = error.response.data; 
                
             //   console.log("Status:", error.response.status); // 409
            //    console.log("Cuerpo del error:", datosError); // Aquí verás el JSON completo
                
                // 2. Accedes al campo donde guardaste el mensaje (username o mensaje)
                //const mensajeServidor = datosError.username; 
                //alert("Atención: " + mensajeServidor); 
                //Swal.fire("Error"+mensajeServidor, "Cuenta","error");                

            } else {
                console.log("Error de red o sin respuesta");
            }
            throw error; 
        }
};


const usuarioCrear = async (usuario) => {
    const params = mapearUsuarioRequest(usuario);
    return await ejecutarAPI(USUARIO_CREAR, params);
};


const signup = (
     username ,
     password,
     email,
     apellidoPaterno,
     apellidoMaterno,
     primerNombre,
     segundoNombre ,
     numeroCelular,
     idSexo,
     idTipoDocumento,
     numeroDocumento


     ) => {
    return axios
    .post(API_URL+SIGNUP,{
        username: username ,
        password: password,
        email: email,
        estado: "A",
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        primer_nombre: primerNombre,
        segundo_nombre:segundoNombre ,
        numero_celular: numeroCelular,
        id_sexo: idSexo,
        id_tipo_documento: idTipoDocumento ,
        numero_documento: numeroDocumento,
        fecha_alta: "",
        fecha_baja: "",
        fecha_modificacion: ""  
    })
    .then((response) => {
        if(response.data.accessToken){
            console.log(localStorage.setItem);
            localStorage.setItem('user',JSON.stringify(response.data));
        }
        return response.data;        
    });
    
};


const login = (user, password) => {
    return axios
    .post(API_URL+LOGIN,{ user, password })
    .then((response) => {

        if(response.data.jwtToken){
            const decoded = jwtDecode(response.data.jwtToken);
            const perfil = {
                username: decoded.sub,
                rol: decoded.rol.authority,
                idPaciente: decoded.idReferencia, 
                idMedico: decoded.idReferencia, 
                idUsuario: decoded.idUsuario, 
                idEntidad: decoded.idEntidad,     
                idReferencia: decoded.idReferencia,     
                idRol: decoded.idRol 

//                usuarioNombres: decoded.usuarioNombres // Opcional para la UI
            };

            sessionStorage.setItem('username',  decoded.sub) ;  
            sessionStorage.setItem('token_data',  JSON.stringify(response.data)) ;
            sessionStorage.setItem('user_profile', JSON.stringify(perfil));

            }
        return response.data;
    });
};




const obtenerDatosGlobales = (token) => {
    return axios
    .post(API_URL+DATOS_GLOBALES ,{},{ headers: header()})
    .then((response) => {
        console.log("Datos Globales response "+response)
        return response.data;
    });
};


const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('username'); // Username guardado aparte
    sessionStorage.removeItem('authority'); // Autoridad/rol guardado aparte
    sessionStorage.removeItem('user'); // Objeto de usuario con el token
    sessionStorage.removeItem('user_profile'); // Objeto de perfil completo
}

const actualizaUsuario = (usuarioData) => {
   return axios
   .post(API_URL+UPDATEUSUARIO,  usuarioData 
    ,{ headers: header()}
    ).catch(function (error) {
        console.log( error.toJSON());
  });
 
};

const leerPerfil = () => {
   return  JSON.parse(sessionStorage.getItem('user_profile'));
};

const leerUsuarioUsername = () => {
    const username = getCurrentUsername();
    // Validación preventiva
    if (!username) {return Promise.reject("No se encontró un nombre de usuario"); }
    return axios.post( API_URL + GETUSUARIO, 
        { username: username }, 
        { headers: header() }
    );
}

const getCurrentUsername = () => {
    return  sessionStorage.getItem('username');
 }

const AuthService = {
    login,
    signup,
    logout,
    obtenerDatosGlobales,    
    actualizaUsuario   , 
    leerPerfil,
    usuarioCrear,
  //  getCurrentUser,
 //   getCurrentUsername,
//    leerUsuario,
    leerUsuarioUsername,
//    getCurrentAuthority,
  //  getContextoActual,
};

export default AuthService;


/*
const getCurrentUsername = () => {
    return  sessionStorage.getItem('username');
 }
 
 const getCurrentAuthority= () => {
    return  sessionStorage.getItem('authority');
 }
 */
/* --------------------*/ 
/*
const leerUsuario = (username) => {
    return axios.post(API_URL+GETUSUARIO,
                 {username: username}
                ,{ headers: header()}
         )
        
};
*/
/*
const leerUsuarioUsername = () => {
    const username = getCurrentUsername();
    // Validación preventiva
    if (!username) {return Promise.reject("No se encontró un nombre de usuario"); }
    return axios.post( API_URL + GETUSUARIO, 
        { username: username }, 
        { headers: header() }
    );
}

*/

/*
const login = (user, password) => {
    return axios
    .post(API_URL+LOGIN,{ user, password })
    .then((response) => {
//            console.log("response login "+JSON.stringify(response.data))

        if(response.data.jwtToken){
            //console.log(JSON.stringify(response.data.jwtToken))
            //console.log(JSON.stringify(response.data))
            const decoded = jwtDecode(response.data.jwtToken);
         //   let a = decoded.rol.authority
         //   let u = decoded.sub
            //console.log(JSON.stringify(decoded))

            // Guardamos el token para las cabeceras de Axios
            sessionStorage.setItem('token', response.data.jwtToken);
            // Creamos un objeto de perfil con lo que el JWT nos da

            const perfil = {
                username: decoded.sub,
                rol: decoded.rol.authority,
                idUsuario: decoded.idUsuario, 
                idEntidad: decoded.idEntidad,     
                idReferencia: decoded.idReferencia,     
                idRol: decoded.idRol, 
            };
            
//            const perfil = {
//                username: decoded.sub,
//                rol: decoded.rol.authority,
//                idMedico: decoded.idMedico, // <-- Asegúrate que el backend lo envíe
//                idEntidad: decoded.idEntidad,     // <-- Asegúrate que el backend lo envíe
//                idPaciente: decoded.idPaciente,     // <-- Asegúrate que el backend lo envíe
//                usuarioNombres: decoded.usuarioNombres // Opcional para la UI
//            };
 
       //     sessionStorage.setItem('username',  u) ;    
       //     sessionStorage.setItem('authority',  a) ;    
            sessionStorage.setItem('user_profile', JSON.stringify(perfil));

       //     sessionStorage.setItem('user',  JSON.stringify(response.data)) ;

            }
        return response.data;
    });
};
*/

/*
const obtenerDatosGlobales = () => {
    return axios
        .post(API_URL + DATOS_GLOBALES, {}, config)
        .then((response) => {
            console.log("Datos Globales cargados con éxito:", response.data);
            return response.data;
        })
        .catch((error) => {
            console.error("Error en obtenerDatosGlobales:", error.response || error);
            throw error; // Re-lanzamos el error para que el Contexto lo maneje
        });
};
*/

/*
const login = (user, password) => {
    return axios
    .post(API_URL+LOGIN,{ user, password })
    .then((response) => {
        if(response.data.jwtToken){
            const decoded = jwtDecode(response.data.jwtToken);
            sessionStorage.setItem('token', response.data.jwtToken);

            const perfil = {
                username: decoded.sub,
                rol: decoded.rol.authority,
                idUsuario: decoded.idUsuario, 
                idEntidad: decoded.idEntidad,     
                idReferencia: decoded.idReferencia,     
                idRol: decoded.idRol, 
            };
            sessionStorage.setItem('user_profile', JSON.stringify(perfil));
        }
        return response.data;
    });
};

*/


/*
export const getContextoActual = () => {
    const profile = JSON.parse(sessionStorage.getItem('user_profile'));
    if (!profile) return null;

    return {
        idMedico: profile.idMedico,
        idEntidad: profile.idEntidad,
        nombreCompleto: profile.nombreCompleto || "", // Valor por defecto si no viene
    };
};
*/
/*
const getCurrentUser = () => {
   return  JSON.parse(sessionStorage.getItem('user'));
}
*/
