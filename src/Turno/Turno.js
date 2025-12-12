import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form} from "react-bootstrap";
import AuthService from "../components/Login/services/auth.service";
import TurnoService from "./TurnoService";


const Turno = ({handleSelectTurno }) => {
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        LoadData() ;
   }, []);

        const LoadData = ()=>{
            setLoading(true);
                TurnoService.getTodos()
                .then((response) => {
                    console.log("TURNOS  "+JSON.stringify(response) );                    
                    console.log("TURNOS 2 "+JSON.stringify(response.data) );                    
                    setPosts(response.data);

            setLoading(false);
            },(error) => {
                console.log("Turno PostService Error page", error.response);
                if (error.response && error.response.status === 403) {
                    AuthService.logout();
                    navigate("/login");
                    window.location.reload();
                }
            });
    };

    //me falta cargar turnos en un props

        if (loading) {
            return <h2>Loading...</h2>;
          }    
  return (
        <>
                <Form.Select   
                    aria-label="Default select example" 
                    onChange={(e) => handleSelectTurno(JSON.parse(e.target.value))}
                    >

                        <option key={''} value={''}> 
                            {'Turno'}
                        </option>
                    {
                        posts.map(post => (
                        <option key={post.idTurno} value={JSON.stringify(post)}> 
                            {post.descripcion}
                        </option>
                    ))}
                </Form.Select>
         </>
    )
}
export default Turno;

