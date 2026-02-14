import React, { useState, useEffect } from "react";
import ServicioService from "./ServicioService";
import { useNavigate } from "react-router-dom";
import { Form, FloatingLabel} from "react-bootstrap";
import AuthService from "../Login/services/auth.service";

const Servicio = ({idEntidad,valueServicio, textServicio }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(idEntidad>0 ) 
        LoadData() ;
   }, [idEntidad]);

   const LoadData = ()=>{
       setLoading(true);
        ServicioService.getXIdEntidad(idEntidad)
        .then((response) => {
            console.log(JSON.stringify(response.data.servicio))
            setPosts(response.data.servicio);
            setLoading(false);
        },(error) => {
            console.log("Servicio PostService Error page", error.response);
            if (error.response && error.response.status === 403) {
                AuthService.logout();
                navigate("/login");
                window.location.reload();
            }
        });
    };
        if (loading) {
            return <h2>Loading...</h2>;
          }    
  return (
        <>

                <Form.Select   
                    aria-label="Default select example" 
                    onChange={(e) =>{
                        let valueSelect = e.target.value;
                        let textSelect = e.target.options[e.target.selectedIndex].text;
                        valueServicio(valueSelect);
                        textServicio(textSelect);
                      }    
                    } 
                    >

                        <option key={''} value={''}> 
                            {'Servicio'}
                        </option>
                    {
                        posts.map(post => (
                        <option key={post.idServicio} value={post.idServicio}> 
                            {post.nombre}
                        </option>
                    ))}
                </Form.Select>



         </>
    )
}
export default Servicio;


/*
   const LoadData = ()=>{
       setLoading(true);
        ServicioService.getXIdEspecialidad(idEspecialidad)
        .then((response) => {
            console.log(JSON.stringify(response.data.servicio))
            setPosts(response.data.servicio);
            setLoading(false);
        },(error) => {
            console.log("Servicio PostService Error page", error.response);
            if (error.response && error.response.status === 403) {
                AuthService.logout();
                navigate("/login");
                window.location.reload();
            }
        });
    };

*/
