import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FloatingLabel} from "react-bootstrap";
import AuthService from "../Login/services/auth.service";
import EntidadService from "./EntidadService";

const Entidad = ({valueEntidad, textEntidad }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();
        useEffect(() => {
            const LoadData = ()=>{
                setLoading(true);
                    EntidadService.getXUsuario()
                    .then((response) => {
                        setPosts(response.data.entidad);
                setLoading(false);
                },(error) => {
                    console.log("Entidad PostService Error page", error.response);
                    if (error.response && error.response.status === 403) {
                        AuthService.logout();
                        navigate("/login");
                        window.location.reload();
                    }
                });
        };
        LoadData() ;
        }, []);

        if (loading) {
            return <h2>Loading...</h2>;
          }    
  return (
        <>

                <Form.Select   
                    style={{width: "400px"}} 
                    aria-label="Default select example" 
                    onChange={(e) =>{
                        let valueSelect = e.target.value;
                        let textSelect = e.target.options[e.target.selectedIndex].text;
                        valueEntidad(valueSelect);
                        textEntidad(textSelect);
                      }    
                    } 
                    >

                        <option key={''} value={''}> 
                            {'Entidad'}
                        </option>
                    {
                        posts.map(post => (
                        <option key={post.idEntidad} value={post.idEntidad}> 
                            {post.nombre} 
                        </option>
                    ))}
                </Form.Select>



         </>
    )
}
export default Entidad;

