import React, {useState, useEffect} from "react";
import { Form , FloatingLabel} from "react-bootstrap";
import AuthService from "../Login/services/auth.service";
import { useNavigate } from "react-router-dom";
import Styles from "../../Styles";

const xUsuario =({usuarioDataPrincipal}) => {
    const navigate = useNavigate();
    const [loading, setLoading]  = useState(false);
    let buscar_username = sessionStorage.getItem("username") 
    const [usuarioData, setUsuarioData] = useState({
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

useEffect(() => {
        if(buscar_username!="")
          leerUsuario() ;
}, [buscar_username]);



const handleInputChange = (e) => {
    setUsuarioData({
      ...usuarioData,
      [e.target.name]: e.target.value
    });
  };

     
const leerUsuario = ()=>{
            setLoading(true);
            AuthService.leerUsuario(buscar_username)
            .then((response) => {
                setUsuarioData(response.data);
                setLoading(false);
              },(error) => {
                alert("No se pudo conectar", error.response);
                console.log("No se pudo conectar", error.response);
                if (error.response && error.response.status === 403) {
                    AuthService.logout();
                    navigate("/login");
                    window.location.reload();
                }
    });
}
    const actualizarUsuario = async(e) => {
        e.preventDefault();
        try {
            await AuthService.actualizaUsuario(usuarioData)
                .then((response) => {
                    console.log("Signup succesfully", response);
                    leerUsuario()
                }, (error)=>{
                    console.log(error)
                }
            )
        } catch (err) {
            console.log(err);
        }
    };

    return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
    {/* CABECERA DE LA PÁGINA Y RESUMEN DEL PACIENTE - FIJOS */}
     <div style={Styles.pageHeaderContainer}>
        <div style={Styles.pageHeader}>
          <button style={Styles.pageHeaderBackButton} onClick={() => navigate(-1)}>
               &larr; {/* Flecha hacia atrás */}
              </button>
              <h1 style={Styles.pageHeaderTitle}>DATOS PERSONALES</h1>
        </div>
      </div>
          <div className="bg-white p-4 border mb-5">
            <h3 className="mb-4 text-primary"> ACTUALIZACION DE DATOS PERSONALES</h3>
            <Form onSubmit={actualizarUsuario}> 
                <FloatingLabel 
                    controlId="floatingNombreUsuario" 
                    label="Nombre Usuario"
                    className="mb-3"
                    >
                    <Form.Control 
                        disabled
                        type="text" 
                        name="username"
                        value={usuarioData.username}
                        onChange={handleInputChange}
                        placeholder="Nombre Usuario" />
                </FloatingLabel>

                <FloatingLabel
                        label="Numero documento"
                        controlId="floatingNumeroDocumento"
                        className="mb-3"
                        >
                     <Form.Control 
                        type="text"
                        name="numero_documento" 
                        value={usuarioData.numero_documento}
                        onChange={handleInputChange}
                        placeholder="Numero Documento" />
                </FloatingLabel>

                <FloatingLabel 
                    controlId="floatingApellidoPaterno" 
                    label="Apellido Paterno"
                    className="mb-3"
    
                    >
                    <Form.Control 
                        type="text"
                        name="apellido_paterno"
                        value={usuarioData.apellido_paterno}
                        onChange={handleInputChange}
                        placeholder="Apellido Paterno" />
                </FloatingLabel>

                <FloatingLabel 
                    controlId="floatingPassword" 
                    label="Apellido Materno"
                    className="mb-3"
                    value={usuarioData.apellid_materno}
                    onChange={handleInputChange}
                    >
                    <Form.Control 
                        type="text"
                        name="apellido_materno"
                        value={usuarioData.apellido_materno}
                        onChange={handleInputChange}
                        placeholder="Apellido Materno" />
                </FloatingLabel>

                <FloatingLabel
                        controlId="floatingPrimerNombre"
                        label="Primer Nombre"
                        className="mb-3"
                        >
                     <Form.Control 
                            type="text" 
                            name="primer_nombre"
                            value={usuarioData.primer_nombre}
                            onChange={handleInputChange}
                            placeholder="Primer Nombre" />
                </FloatingLabel>
                
                <FloatingLabel 
                    controlId="floatingSegundoNombre" 
                    label="Segundo Nombre"
                    className="mb-3"
                    >
                    <Form.Control 
                        type="text" 
                        name="segundo_nombre"
                        value={usuarioData.segundo_nombre}
                        onChange={handleInputChange}
                    placeholder="Segundo Nombre" />
                </FloatingLabel>

                <FloatingLabel 
                    controlId="floatingSexo" 
                    label="Sexo"
                    className="mb-3"
                >
                    <Form.Select 
                        name="id_sexo"
                        value={usuarioData.id_sexo}
                        onChange={handleInputChange}
                        aria-label="Floating label select example">
                        <option value="0">seleccione sexo</option>
                        <option value="1">Masculino</option>
                        <option value="2">Femenino</option>
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel 
                    controlId="floatingNumeroCelular" 
                    label="Numero Celular"
                    className="mb-3"

                    >
                    <Form.Control 
                        type="text" 
                        name="numero_celular"
                        value={usuarioData.numero_celular}
                        onChange={handleInputChange}
                        placeholder="Numero Celular" />
                </FloatingLabel>

                <FloatingLabel
                        controlId="floatingEmail"
                        label="Email address"
                        className="mb-3"
                        >
                     <Form.Control 
                        type="text" 
                        name="email"
                        value={usuarioData.email}
                        onChange={handleInputChange}
                           placeholder="name@example.com" />
                </FloatingLabel>
                
                <button  type="submit" className="btn btn-primary"> Actualizar </button>                    
            </Form>
          </div>              
        </div>
    )
}

export default xUsuario;

