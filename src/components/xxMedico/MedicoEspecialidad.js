import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row ,FloatingLabel,Card,Button} from "react-bootstrap";
import AuthService from "../Login/services/auth.service";
import MedicoService from "./MedicoService";

const MedicoEspecialidad = ( { idEspecialidad, valueMedico, textMedico, precioUnitario } ) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

   useEffect(() => {
        if (idEspecialidad !='' && idEspecialidad !=0) {
              LoadData() ;
         } else {setPosts([])};

        }, [idEspecialidad]);

        if (loading) {
            return <h3>Loading Medico...</h3>;
          }        

  const LoadData = ()=>{
            setLoading(true);
            MedicoService.getMedicoEspecialidad(idEspecialidad)
            .then((response) => {
                console.log(JSON.stringify("DATA "+response.data.medico))                        
                setPosts(response.data.medico);

        setLoading(false);
        },(error) => {
            setPosts([])
            console.log("Medico PostService Error page", error.response);
            if (error.response && error.response.status === 403) {
                AuthService.logout();
                navigate("/login");
                window.location.reload();
            }
        });
};

    // Función para manejar la seleccion o cambio  en el objeto select medico
    const handleSelectMedico = (id) => {
        const medicoSeleccionado = posts.find(post => post.id === parseInt(id, 10));
        if (medicoSeleccionado) {
            precioUnitario(medicoSeleccionado.preciounitario);
            console.log(`Precio seleccionado: $${medicoSeleccionado.preciounitario}`);
        } else {
        precioUnitario(0);
        console.log('Selecciona un producto válido');
        }
    };
            
  return (
        <>
                <Form.Select  className=""
                  //  value={0}
                    aria-label="Seleccionar medico" 
                    onChange={(e) =>{
                        let valueSelect = e.target.value;
                        let textSelect = e.target.options[e.target.selectedIndex].text;
                        valueMedico(valueSelect);
                        textMedico(textSelect);
                        console.log("ID MEDICO:  "+valueSelect)    
                        const medicoSeleccionado = posts.find(post => post.idMedico === valueSelect);
                        if (medicoSeleccionado) {
                            precioUnitario(medicoSeleccionado.preciounitario);
                            console.log(`Precio seleccionado: $${medicoSeleccionado.preciounitario}`);
                        } else {
                        precioUnitario(0);
                        console.log('Selecciona un producto válido');
                        }

                        
//                        handleSelectMedico(valueSelect);
                      }    
                    } 
                    >
                        <option key={''} value={''}> 
                            {"Medico"}
                        </option>
                    {posts.map(post => (
                        <option key={post.idMedico} value={post.idMedico}> 
                            {post.nombres}
                        </option>
                ))}
                </Form.Select>
      </>
    )
}
export default MedicoEspecialidad;
