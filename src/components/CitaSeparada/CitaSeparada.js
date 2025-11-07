import { useEffect, useState } from "react"
//import CitaService from "./CitaService";
import AuthService from "../Login/services/auth.service";
import { Table,Button,Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormatDate from "../Maestros/FormatDate";
import { FaDollarSign } from 'react-icons/fa';
import PagoVirtual from "../PagoVirtual/PagoVirtual";
import CitaSeparadaService from "./CitaSeparadaService"
import Styles from "../../Styles"

const CitaSeparada= () =>{
    const [loading, setLoading]  = useState(false);
    const navigate = useNavigate();
    /* datos api  */
    const  [citas ,setCitas] = useState([])
    const  [citasConPagoVirtual ,setCitasConPagoVirtual] = useState([])
    const  [citasConComprobante ,setCitasConComprobante] = useState([])
//    const [actualizar, setActualizar]  = useState(actualizaCitas);
    /** modal */
    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);    
    /* datos de cita  */
    const [idProgramacion, setIdProgramacion] = useState(false);
    const [horaInicio,setHoraInicio] = useState(false);
//    const [username, setUsername] = useState("");
    const [idCitaSeparada, setIdCitaSeparada] = useState(false);
    const [precioUnitario,setPrecioUnitario] = useState(false);
    const [nombreDestino,setNombreDestino]    = useState(false);
    const [email,setEmail]    = useState("");
    const [numeroCelular,setNumeroCelular]    = useState("");
    const [actualizar,setActualizar]    = useState(false);
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
//    const [usuario,setUsuario] = useState(false);

    useEffect(() => {
        if(actualizar){
            leerCitaSeparada() ;
        } 
    }, [actualizar]);

    useEffect(() => {
      if( actualizar){
          leerCitaSeparadaConPagoVirtual() ;
      } 
  }, [actualizar]);

  useEffect(() => {
        leerUsuarioUsername() ;
}, []);


const leerCitaSeparada = ()=>{
      console.log("Leer citaSeparada ")
      setLoading(true);
        CitaSeparadaService.getCitasSeparadaLeer()
        .then((response) => {
              console.log("DATA RETORNO citaSeparada :  "+JSON.stringify(response.data.citaSeparada))
            setCitas(response.data.citaSeparada);
            setLoading(false);
            setActualizar(false)                         
          },(error) => {
            setLoading(false);
            setActualizar(false)                         
            AuthService.logout();
            navigate("/login");
            window.location.reload();
          });
} 

const leerCitaSeparadaConPagoVirtual =   () =>{
    console.log("Leer  leerCitaSeparadaConPagoVirtual ")
    setLoading(true);
      CitaSeparadaService.getCitasSeparadaConPagoVirtualLeer()
      .then((response) => {
            console.log("DATA RETORNO leerCitaSeparadaConPagoVirtual  :  "+JSON.stringify(response.data.citaSeparada))
          setCitasConPagoVirtual(response.data.citaSeparada);
          setLoading(false);
          setActualizar(false)                         
        },(error) => {
          setLoading(false);
          setActualizar(false)                         
        console.log("No se pudo leer Cita Separada", error.response);
          if (error.response && error.response.status === 403) {
            setLoading(false);
            setActualizar(false)                         
              AuthService.logout();
              navigate("/login");
              window.location.reload();
          }
        });
} 

const leerCitaSeparadaConComprobante = ()=>{
  //console.log("Leer cita Separada ")
  setLoading(true);
    CitaSeparadaService.getCitasSeparadaConComprobanteLeer()
    .then((response) => {
          console.log("DATA RETORNO :  "+JSON.stringify(response.data.citaSeparada))
        setCitasConComprobante(response.data.citaSeparada);
        setLoading(false);
      },(error) => {
        console.log("No se pudo leer Cita Separada", error.response);
        if (error.response && error.response.status === 403) {
            AuthService.logout();
            navigate("/login");
            window.location.reload();
        }
      });
} 

const onClickFormPago =(idProg,hora=0,cit=0,pre=77,des=0) =>{
    setIdProgramacion(idProg)
    setHoraInicio(hora)
    setIdCitaSeparada(cit)
    setPrecioUnitario(pre)
    setNombreDestino(des)
    setEmail(usuarioData.email)
    setNumeroCelular(usuarioData.numero_celular)
    handleModalShow()   
    
}    

const leerUsuarioUsername = ()=>{
   AuthService.leerUsuarioUsername()
  .then((response) => {
    setUsuarioData(response.data)
//      setEmail(response.data.email);
//      setNumeroCelular(response.data.numero_celular);
      return response
    },(error) => {
      console.log("No se pudo conectar", error.response);
      if (error.response && error.response.status === 403) {
          AuthService.logout();
          navigate("/login");
          window.location.reload();
      }});
        
}


const myTableStyle = {
    width: '400px',
    height: '110px',
  //  overflow: 'scroll'
};   


const onModalClose = (modalClose) => {
  console.log('MODAL '+modalClose +" actualizar:  "+actualizar)
  if (modalClose) {
    setActualizar(true)
    handleModalClose();
  }
}

const actualizarClick = () => {
  // Lógica que quieras ejecutar al hacer clic
  setActualizar(prev => !prev);
};
return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
    {/* CABECERA DE LA PÁGINA Y RESUMEN DEL PACIENTE - FIJOS */}
     <div style={Styles.pageHeaderContainer}>
        <div style={Styles.pageHeader}>
          <button style={Styles.pageHeaderBackButton} onClick={() => navigate(-1)}>
               &larr; {/* Flecha hacia atrás */}
              </button>
              <h1 style={Styles.pageHeaderTitle}>CITAS SEPARADAS</h1>
        </div>
      </div>
      <div style={{ height: '120px' }}>
          <div style={myTableStyle} >        
            <div > 
              <h6  >Citas separadas</h6>
            </div>            
              <div>
                  <Button onClick={actualizarClick}> Actualizar</Button>
              </div>            
            <br></br>
            <Table bordered         
                  style={{fontSize:11 }} 
              >
                  <tbody>
                      <tr>
                          <th>Detalle</th>
                          <th>Precio</th>
                          <th>Pago</th>
                      </tr>
                      {citas.map((cita) => (
                      <tr>
                          <td> <a >{cita.nombreEspecialidad +"  ("}
                                  {FormatDate.format_fecha(cita.fecha)}
                                  {"   "}
                                  {cita.horaInicio+")"} </a>
                                  <br></br>
                                  {cita.nombreMedico}  
                                  
                          </td>    
                          <td>{cita.precioUnitario}  </td>    
                          <td>
                          
                              <Button  
                                  id={cita.idCitaSeparada } 
                                  size="sm"
                                  variant="danger"
                                  onClick = {(e) => onClickFormPago(
                                    cita.idProgramacion,
                                    cita.horaInicio,
                                    cita.idCitaSeparada,
                                    cita.precioUnitario,
                                    '987098098'
                                  )}                                
                              >
                                  <FaDollarSign />                                    
                              </Button>                            
                          </td>
                      </tr>
                  ))}
                  </tbody>
            </Table>
            <div > 
              <h6  >En verificacion pago</h6>
            </div>            
            <Table bordered style={{fontSize:11 }} >
                  <tbody>
                     <tr><th>Detalle</th> <th>Precio</th><th>Pago</th></tr>
                        {citasConPagoVirtual.map((cita) => (
                     <tr key={cita.idCitaSeparada} >
                          <td><a>{cita.nombreEspecialidad +"  ("}
                                  {FormatDate.format_fecha(cita.fecha)}
                                  {"   "}
                                  {cita.horaInicio+")"} </a>
                                  <br></br>
                                  {cita.nombreMedico}  
                          </td>    
                          <td>{cita.precioUnitario}  </td>    
                          <td>
                          { cita.idCita  ? (
                                  <Button  
                                          id={cita.idCitaSeparada } 
                                            size="sm"
                                           variant="success">

                                  <FaDollarSign />                                    
                                  </Button>                            
                        
                              ) : (            
                              <Button  
                                  id={cita.idCitaSeparada } 
                                  size="sm"
                                  variant="warning">
                                  <FaDollarSign />                                    
                              </Button>                            
)
                          }
                          </td>
                      </tr>
                  ))}
                  </tbody>
            </Table>

          </div>          
       </div>            
       <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <PagoVirtual
                idProgramacion={idProgramacion} 
                horaInicio={horaInicio}
                idCitaSeparada={idCitaSeparada}
                precioUnitario={precioUnitario}
                nombreDestino={nombreDestino}            
                email={email}            
                celular={numeroCelular}            
                modalClose={onModalClose}
            >
            </PagoVirtual>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
          <Button variant="primary">
            Grabar
          </Button>
        </Modal.Footer>
       </Modal>
     </div>    
    )
}
export default CitaSeparada

