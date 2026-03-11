import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FloatingLabel} from "react-bootstrap";
import ServicioService from "../../master-data/services/ServicioService"
import AuthService from "../../master-data/services/auth.service"

const Servicio = ({idEntidad,valueServicio, textServicio, value }) => {
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
            value={value || ''} // Si 'value' no llega, usa string vacío (opción por defecto)
            onChange={(e) => {
                let valueSelect = e.target.value;
                let textSelect = e.target.options[e.target.selectedIndex].text;
                valueServicio(valueSelect);
                textServicio(textSelect);
            }} 
        >
            <option value="">Seleccione Consultorio/Servicio</option>
            {posts.map(post => (
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


/**
 * 
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
                            {'Seleccione Consultorio/Servicio'}
                        </option>
                    {
                        posts.map(post => (
                        <option key={post.idServicio} value={post.idServicio}> 
                            {post.nombre}
                        </option>
                    ))}
                </Form.Select>

 */