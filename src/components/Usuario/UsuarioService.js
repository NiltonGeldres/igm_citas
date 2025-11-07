import header from "../Security/Header";
import axios from "axios";

const API_URL = process.env.REACT_APP_URL_API;
const LOGIN = "/auth";
const SIGNUP = "/signin";
const GETUSUARIO = "/getUsuarioUsername";
const UPDATEUSUARIO = "/updateUsuario";

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

/*
const xxleerUsuarioUsername1 = () => {
    let username= getCurrentUsername()
   return axios.post(API_URL+GETUSUARIO,{username: username}
                ,{ headers: header()}
         )
};
*/

const leerUsuarioUsername = () => {
     alert("ingreso ")   
    let username= getCurrentUsername()
    return axios
    .post(API_URL+GETUSUARIO,{username: username})
    .then((response) => {
        if(response.data){
            let userEntity = response.data;
            let nombres = userEntity.apellido_paterno
            alert(nombres)
            sessionStorage.setItem('nombres',  nombres) ;    
            }
        return response.data;
    });
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




const UsuarioService = {
    signup,
    getCurrentUser,
    getCurrentUsername,
    leerUsuario,
    actualizaUsuario   , 
    leerUsuarioUsername,
    getCurrentAuthority,
};

export default UsuarioService;


                
//                sessionStorage.setItem('user',  JSON.stringify(response.data)) ;
//                sessionStorage.setItem('username',  user) ;    
