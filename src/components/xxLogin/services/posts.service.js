import authHeader from "./auth-header";
import axios from "axios";

//const API_URL = "http://localhost:8080/api_hclinica/webresources";
//const TURNOS = "/TurnoService";

//const API_URL = "http://localhost:8080";
const API_URL = process.env.REACT_APP_URL_API;
const TURNOS = "/turno";

const getAllPublicPosts = () => {
    return axios.get(API_URL+TURNOS,{
//        idTipoServicio:"0",
    }, { headers: authHeader() });
};

const getAllPrivatePosts = () => {
 // console.log("en constante  getAllPrivatePosts"+JSON.stringify(authHeader()))
  return axios.get(API_URL+TURNOS,{
  //  idTipoServicio:"1",
}, { headers: authHeader() });
};

const PostService = {
  getAllPublicPosts,
  getAllPrivatePosts,
};

export default PostService;