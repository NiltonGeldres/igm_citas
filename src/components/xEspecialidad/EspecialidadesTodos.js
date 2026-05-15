import React, { useState, useEffect ,showError} from "react";
import EspecialidadService from "./EspecialidadService";
import { useNavigate } from "react-router-dom";
import { Form, FloatingLabel} from "react-bootstrap";
import AuthService from "../Login/services/auth.service";

const EspecialidadTodos = ({valueEspecialidad, textEspecialidad }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();

        useEffect(() => {
            const LoadData = ()=>{
                setLoading(true);
                    EspecialidadService.getTodos()
                    .then((response) => {
                        setPosts(response.data.especialidad);
                setLoading(false);
                },(error) => {
                    console.log("Especialidad PostService Error page", error.response);
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
                    aria-label="Default select example" 
                    onChange={(es) =>{
                        let valueSelect = es.target.value;
                        let textSelect = es.target.options[es.target.selectedIndex].text;
                        valueEspecialidad(valueSelect);
                        textEspecialidad(textSelect);
                      }    
                    } 
                    >
                        <option key={''} value={''}> 
                            {'Especialidad'}
                        </option>
                    {
                        posts.map(post => (
                        <option key={post.idEspecialidad} value={post.idEspecialidad}> 
                            {post.descripcionEspecialidad}
                        </option>
                    ))}
                </Form.Select>



         </>
    )
}
export default EspecialidadTodos;