import header from "../../Security/Header";
import { React} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_URL_API;
const LOGIN = "/auth";
const SIGNUP = "/signin";
const GETUSUARIO = "/getUsuarioUsername";
const UPDATEUSUARIO = "/updateUsuario";
/*const usuarioData = ({
    apellido_materno    :"",
    apellido_paterno    :"",
    email               :"",
    estado              :"" ,
    fecha_alta          :"",
    fecha_baja          :"",
    fecha_modificacion  :"",
    id_sexo             :"",
    id_tipo_documento   :"",
    id_usuario          : 0,
    numero_celular      :"",
    numero_documento    :"",
    password            :"",
    primer_nombre       :"",
    segundo_nombre      :"r",
    username            :""        
  });    
*/

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
            let a = decoded.rol.authority
            let u = decoded.sub
            sessionStorage.setItem('username',  u) ;    
            sessionStorage.setItem('authority',  a) ;    
            sessionStorage.setItem('user',  JSON.stringify(response.data)) ;
            }
        return response.data;
    });
};

const logout = () => {
    sessionStorage.removeItem('user');
    // Eliminar TODOS los ítems de sessionStorage relacionados con el usuario
    sessionStorage.removeItem('user'); // Objeto de usuario con el token
    sessionStorage.removeItem('username'); // Username guardado aparte
    sessionStorage.removeItem('authority'); // Autoridad/rol guardado aparte
    sessionStorage.removeItem('nombres'); // Nombres completos
    sessionStorage.removeItem('idusuario'); // ID de usuario
    sessionStorage.removeItem('userProfile'); // Objeto de perfil completo
    // Si usas localStorage para algo, también deberías limpiarlo aquí
    // localStorage.removeItem('someOtherUserSetting');


}

const getCurrentUser = () => {
   return  JSON.parse(sessionStorage.getItem('user'));
}

const getCurrentUsername = () => {
    return  sessionStorage.getItem('username');
 }
 
 const getCurrentAuthority= () => {
    return  sessionStorage.getItem('authority');
 }
 
/* --------------------*/ 

const leerUsuario = (username) => {
    return axios.post(API_URL+GETUSUARIO,{username: username}
                ,{ headers: header()}
         )
        
};



const leerUsuarioUsername = () => {
    let username= getCurrentUsername()
   return axios.post(API_URL+GETUSUARIO,{username: username}
                ,{ headers: header()}
         )
};


const actualizaUsuario = (usuarioData) => {
 //  alert("DATA A ENVIAR "+JSON.stringify(usuarioData))    
   return axios
   .post(API_URL+UPDATEUSUARIO,  usuarioData 
    ,{ headers: header()}
    ).catch(function (error) {
        console.log( error.toJSON());
  });
 
};




const AuthService = {
    
    login,
    signup,
    logout,
    getCurrentUser,
    getCurrentUsername,
    leerUsuario,
    actualizaUsuario   , 
    leerUsuarioUsername,
    getCurrentAuthority,
};

export default AuthService;


                
//                sessionStorage.setItem('user',  JSON.stringify(response.data)) ;
//                sessionStorage.setItem('username',  user) ;    


/**
 * 
 
 */