import React, {useState} from "react";
import AuthService from "./services/auth.service";
import { Form , FloatingLabel} from "react-bootstrap";

const Signup =() => {
    const [email, setEmail]=useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [primerNombre, setPrimerNombre] = useState("");
    const [segundoNombre, setSegundoNombre] = useState("");
    const [numeroCelular, setNumeroCelular] = useState("");
    const [idSexo, setIdSexo] = useState("1");
    const [idTipoDocumento, setIdTipoDocumento] = useState("1");
    const [numeroDocumento, setNumeroDocumento] = useState("");
    
    

//    const navigate = useNavigate();
    const handleSignup = async(e) => {
        e.preventDefault();
        alert("*** ID SEXO  "+idSexo);
        try {
            await AuthService.signup(
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
                                numeroDocumento)
                                .then(
                (response) => {
                    console.log("Signup succesfully", response);
                },
                (error)=>{
                    console.log(error)
                }
            )
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
          <div className="bg-white p-4 border mb-5">
            <h1 className="mb-4 text-dark"> Registrese</h1>
            <h3 className="mb-4 text-primary"> Ingrese sus datos Personales</h3>
            <Form onSubmit={handleSignup}> 
                <FloatingLabel
                        controlId="floatingNumeroDocumento"
                        label="Numero documento"
                        className="mb-3"
                        value={numeroDocumento}
                        onChange={(e) => setNumeroDocumento(e.target.value)}

                        >
                     <Form.Control type="text" placeholder="Numero Documento" />
                </FloatingLabel>

                <FloatingLabel 
                    controlId="floatingApellidoPaterno" 
                    label="Apellido Paterno"
                    className="mb-3"
                    value={apellidoPaterno}
                    onChange={(e) => setApellidoPaterno(e.target.value)}

                    >
                    <Form.Control type="text" placeholder="Apellido Paterno" />
                </FloatingLabel>

                <FloatingLabel 
                    controlId="floatingPassword" 
                    label="Apellido Materno"
                    className="mb-3"
                    value={apellidoMaterno}
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                    >
                    <Form.Control type="text" placeholder="Apellido Materno" />
                </FloatingLabel>

                <FloatingLabel
                        controlId="floatingPrimerNombre"
                        label="Primer Nombre"
                        className="mb-3"
                        value={primerNombre}
                        onChange={(e) => setPrimerNombre(e.target.value)}
                        >
                     <Form.Control type="text" placeholder="Primer Nombre" />
                </FloatingLabel>
                
                <FloatingLabel 
                    controlId="floatingSegundoNombre" 
                    label="Segundo Nombre"
                    className="mb-3"
                    value={segundoNombre}
                    onChange={(e) => setSegundoNombre(e.target.value)}
                    >
                    <Form.Control type="text" placeholder="Segundo Nombre" />
                </FloatingLabel>

                <FloatingLabel 
                controlId="floatingSexo" 
                label="Sexo"
                className="mb-3"
                >
                    <Form.Select 
                    defaultValue="1"
                    onChange={(e) => setIdSexo(e.target.value)}
                    aria-label="Floating label select example">
                        <option value="1">Masculino</option>
                        <option value="2">Femenino</option>
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel 
                    controlId="floatingNumeroCelular" 
                    label="Numero Celular"
                    className="mb-3"
                    value={numeroCelular}
                    onChange={(e) => setNumeroCelular(e.target.value)}

                    >
                    <Form.Control type="text" placeholder="Numero Celular" />
                </FloatingLabel>

                <FloatingLabel
                        controlId="floatingEmail"
                        label="Email address"
                        className="mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        >
                     <Form.Control type="text" placeholder="name@example.com" />
                </FloatingLabel>
                
                <FloatingLabel 
                    controlId="floatingNombreUsuario" 
                    label="Nombre Usuario"
                    value={username}
                    className="mb-3"
                    onChange={(e) => setUsername(e.target.value)}

                    >
                    <Form.Control type="text" placeholder="Nombre Usuario" />
                </FloatingLabel>

                <FloatingLabel 
                    controlId="floatingPassword" 
                    label="Password"
                    className="mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                    >
                    <Form.Control type="password" placeholder="Password" />
                </FloatingLabel>

                <button  type="submit" className="btn btn-primary"> Sign Up </button>                    

            </Form>
          </div>              
        </>
    )
}

export default Signup;
