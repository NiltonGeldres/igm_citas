import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form} from "react-bootstrap";
import ServicioService from "../../master-data/services/ServicioService"
import AuthService from "../../master-data/services/auth.service"

const Servicio = ({idEntidad,valueServicio, textServicio, value }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();
   useEffect(() => {
        const loadData = () => {
            setLoading(true);
            ServicioService.getXIdEntidad(idEntidad)
                .then((response) => {
                    setPosts(response.data.servicio);
                    setLoading(false);
                })
                .catch((error) => {
                    // En producción es mejor manejar el error sin console.log si no es necesario
                    if (error.response && error.response.status === 403) {
                        AuthService.logout();
                        navigate("/login");
                        window.location.reload();
                    }
                    setLoading(false);
                });
        };

        if (idEntidad > 0) {
            loadData();
        }
    }, [idEntidad, navigate]); // Solo dependemos de idEntidad y navigate

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


