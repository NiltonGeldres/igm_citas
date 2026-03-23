import  { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthService from "../../master-data/services/auth.service";
import EntidadService from "../../master-data/services/EntidadService";
import Swal from "sweetalert2";
import { 
    User, Mail, Lock, Phone, IdCard, Building2, 
    Loader2, Search, CheckCircle2 
} from "lucide-react";
import "../../shared/components/Signup.css";

const Signup = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [entidad, setEntidad] = useState(null);
    const [sugerencias, setSugerencias] = useState([]); // Siempre inicializado como array
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        primerNombre: "",
        segundoNombre: "",
        numeroCelular: "",
        idSexo: 1,
        idTipoDocumento: 1,
        numeroDocumento: "",
        fechaAlta: "",
        fechaBaja:"",
        fechaModificacion:"",
        estado: "A",
        idEntidad: searchParams.get("cod") || "",
        idReferenciaRol : 1

    });

    // 1. CARGA INICIAL (QR o Link con código)
    useEffect(() => {
        if (formData.codigoEntidad) {
            handleValidarEntidad(formData.codigoEntidad);
        }
    }, []);

    const handleValidarEntidad = async (codigo) => {
        if (!codigo) return;
        try {
            const res = await EntidadService.getEntidadByCodigo(codigo);
            // Aseguramos que tomamos la data correctamente
            const data = res.data || res; 
            if (data) {
                setEntidad(data);
                setMostrarSugerencias(false);
            }
        } catch (error) {
            console.error("Código no válido");
        }
    };

    // 2. BUSCADOR DINÁMICO
    const handleBuscarEntidades = async (texto) => {
        setFormData(prev => ({ ...prev, codigoEntidad: texto }));
        
        if (texto.length < 3) {
            setSugerencias([]);
            setMostrarSugerencias(false);
            return;
        }

        try {
            const res = await EntidadService.obtenerEntidadesPorNombre(texto); 
            console.log(JSON.stringify(res))
            // IMPORTANTE: Si tu Service ya devuelve la data transformada, res es el array.
            // Si no, usa res.data. Aquí usamos un fallback seguro:
            const lista = Array.isArray(res) ? res : (res.data || []);
            
            setSugerencias(lista);
            setMostrarSugerencias(lista.length > 0);
        } catch (error) {
            console.error("Error buscando clínicas", error);
            setSugerencias([]);
        }
    };

    const seleccionarEntidad = (ent) => {
        setEntidad(ent);
        setFormData(prev => ({ ...prev, codigoEntidad: ent.codigo }));
        setMostrarSugerencias(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!entidad) {
            return Swal.fire("Atención", "Es obligatorio seleccionar una clínica.", "warning");
        }

        setLoading(true);
        try {
            await AuthService.usuarioCrear({
                ...formData
            });

            Swal.fire({
                icon: 'success',
                title: '¡Cuenta creada!',
                text: `Bienvenido a ${entidad.nombre}.`,
                confirmButtonColor: '#0078f5'
            });
            navigate("/login");
        } catch (error) {
           const datosError = error.response.data; 
           const mensajeServidor = datosError.username; 

            Swal.fire(mensajeServidor, "error");
            Swal.fire(mensajeServidor, "error");
//            Swal.fire("Error", "No se pudo completar el registro.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="signup-card">
                <div className="auth-header-blue">
                    <h2 className="fw-bold m-0" style={{fontSize: '1.25rem'}}>Registro de Paciente</h2>
                    <p className="m-0" style={{fontSize: '0.8rem', opacity: 0.8}}>
                        {entidad ? `Sede: ${entidad.nombre}` : "MediFlow Cloud"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-body">
                    <div className="form-group mb-4">
                        <label className="list-title">Centro Médico de Atención</label>
                        
                        {entidad ? (
                            <div className="entity-selected-card animate__animated animate__fadeIn">
                                <div className="entity-info">
                                    <div className="entity-icon-bg">
                                        <Building2 size={20} color="#0078f5" />
                                    </div>
                                    <div>
                                        <div className="entity-name">{entidad.nombre}</div>
                                        <div className="entity-badge"><CheckCircle2 size={10} /> Sede Verificada</div>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-change-entity" 
                                    onClick={() => { setEntidad(null); setFormData(p => ({...p, codigoEntidad: ""})); }}
                                >
                                    Cambiar
                                </button>
                            </div>
                        ) : (
                            <div className="position-relative">
                                <div className="mediflow-search-box">
                                    <Search className="search-icon" size={18} />
                                    <input
                                        name="codigoEntidad"
                                        placeholder="Escribe el nombre de tu clínica..."
                                        value={formData.codigoEntidad}
                                        autoComplete="off"
                                        onChange={(e) => handleBuscarEntidades(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                {/* ELIMINACIÓN DE ERROR DE LENGTH */}
                                {mostrarSugerencias && sugerencias?.length > 0 && (
                                    <div className="sugerencias-container shadow-lg" style={{ zIndex: 100, background: 'white', position: 'absolute', width: '100%' }}>
                                        {sugerencias.map((ent) => (
                                            <div key={ent.idEntidad} className="sugerencia-item" onClick={() => seleccionarEntidad(ent)}>
                                                <Building2 size={14} className="me-2 text-primary" />
                                                <div>
                                                    <div className="sugerencia-nombre">{ent.nombre}</div>
                                                    <div className="sugerencia-codigo text-uppercase" style={{fontSize: '0.7rem'}}>{ent.codigo}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sección de inputs (Solo activa si hay entidad) */}
                    <div className={!entidad ? "form-content-disabled" : "form-content-active"}>
                        <div className="divider"><span>Identificación</span></div>
                        <div className="dni-grid mb-3">
                            <select name="idTipoDocumento" className="select-simple" onChange={handleChange} disabled={!entidad}>
                                <option value="1">DNI</option>
                                <option value="2">C.E.</option>
                            </select>
                            <div className="input-box">
                                <IdCard className="icon" size={18} />
                                <input name="numeroDocumento" placeholder="Número" onChange={handleChange} required disabled={!entidad} />
                            </div>
                        </div>

                        <div className="responsive-grid">
                            <div className="input-box">
                                <Phone className="icon" size={18} />
                                <input name="numeroCelular" placeholder="Celular" onChange={handleChange} required disabled={!entidad} />
                            </div>
                            <select name="idSexo" className="select-simple" onChange={handleChange} disabled={!entidad}>
                                <option value="1">Masculino</option>
                                <option value="2">Femenino</option>
                            </select>
                        </div>

                        <div className="responsive-grid">
                            <input name="primerNombre" placeholder="Primer Nombre" className="input-simple" onChange={handleChange} required disabled={!entidad} />
                            <input name="segundoNombre" placeholder="Segundo Nombre" className="input-simple" onChange={handleChange} disabled={!entidad} />
                        </div>

                        <div className="responsive-grid">
                            <input name="apellidoPaterno" placeholder="Ap. Paterno" className="input-simple" onChange={handleChange} required disabled={!entidad} />
                            <input name="apellidoMaterno" placeholder="Ap. Materno" className="input-simple" onChange={handleChange} required disabled={!entidad} />
                        </div>

                        <div className="divider"><span>Seguridad</span></div>
                        <div className="input-box mb-3">
                            <Mail className="icon" size={18} />
                            <input name="email" type="email" placeholder="Correo Electrónico" className="input-simple" onChange={handleChange} required disabled={!entidad} />
                        </div>

                        <div className="responsive-grid">
                            <div className="input-box">
                                <User className="icon" size={18} />
                                <input name="username" placeholder="Usuario" className="input-simple" onChange={handleChange} required disabled={!entidad} />
                            </div>
                            <div className="input-box">
                                <Lock className="icon" size={18} />
                                <input name="password" type="password" placeholder="Contraseña" className="input-simple" onChange={handleChange} required disabled={!entidad} />
                            </div>
                        </div>

                        <button type="submit" className="btn-submit mt-4" disabled={loading || !entidad}>
                            {loading ? <Loader2 className="spinner" size={20} /> : "CREAR MI CUENTA"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;