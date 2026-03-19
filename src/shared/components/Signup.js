import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthService from "../../master-data/services/auth.service";
import EntidadService from "../../master-data/services/EntidadService";
import Swal from "sweetalert2";
import { User, Mail, Lock, Phone, IdCard, Building2, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import "../../shared/components/Signup.css";

const Signup = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [entidad, setEntidad] = useState(null);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        primerNombre: "",
        segundoNombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        numeroCelular: "",
        idSexo: "1",
        idTipoDocumento: "1",
        numeroDocumento: "",
        codigoEntidad: searchParams.get("cod") || ""
    });

    useEffect(() => {
        if (formData.codigoEntidad) {
            handleValidarEntidad(formData.codigoEntidad);
        }
    }, []);

    const handleValidarEntidad = async (codigo) => {
        if (!codigo) return;
        try {
            const res = await EntidadService.getEntidadByCodigo(codigo);
            setEntidad(res.data);
        } catch (error) {
            setEntidad(null);
            console.error("Código de centro médico no válido");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!entidad) {
            return Swal.fire("Atención", "Es obligatorio ingresar un código de clínica válido.", "warning");
        }

        setLoading(true);
        try {
            await AuthService.signup({
                ...formData,
                idEntidad: entidad.id
            });

            Swal.fire({
                icon: 'success',
                title: '¡Cuenta creada!',
                text: `Bienvenido a ${entidad.nombre}. Ahora puedes iniciar sesión.`,
                confirmButtonColor: '#007bff'
            });
            navigate("/login");
        } catch (error) {
            Swal.fire("Error", "No se pudo completar el registro. Verifica los datos.", "error");
        } finally {
            setLoading(false);
        }
    };

 return (
    <div className="auth-page">
        <div className="signup-card">
            <div className="auth-header text-center">
                {entidad?.logoUrl ? (
                    <img src={entidad.logoUrl} alt="Logo Empresa" className="entidad-logo" />
                ) : (
                    <div className="default-icon" style={{color: '#007bff'}}><Building2 size={40} /></div>
                )}
                <h2 className="fw-bold mt-3">Registro de Usuario</h2>
                <p className="text-muted small">
                    {entidad ? `Sede: ${entidad.nombre}` : "Ingresa el código de clínica para activar el registro"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
                
                {/* SECCIÓN SEDE: El botón depende de que esto sea válido */}
                <div className="form-group mb-4">
                    <label className="label-title">Centro Médico / Clínica</label>
                    <div className={`input-box ${entidad ? 'is-valid' : ''}`}>
                        <Building2 className="icon" size={18} />
                        <input
                            name="codigoEntidad"
                            placeholder="Ej: SAN-PABLO"
                            value={formData.codigoEntidad}
                            onChange={handleChange}
                            onBlur={(e) => handleValidarEntidad(e.target.value)}
                            required
                        />
                        {entidad && <CheckCircle className="icon-valid" size={18} />}
                    </div>
                    {!entidad && formData.codigoEntidad.length > 0 && (
                        <small className="text-danger">Código no encontrado. El botón permanecerá desactivado.</small>
                    )}
                </div>

                <div className="divider"><span>Datos Personales</span></div>

                {/* CAMPO DNI Y CELULAR */}
                <div className="form-grid">
                    <div className="input-box">
                        <IdCard className="icon" size={18} />
                        <input 
                            name="numeroDocumento" 
                            type="text"
                            maxLength={12}
                            placeholder="Nro. de DNI / CE" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="input-box">
                        <Phone className="icon" size={18} />
                        <input 
                            name="numeroCelular" 
                            type="text"
                            maxLength={9}
                            placeholder="Celular" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                {/* NOMBRES Y APELLIDOS */}
                <div className="form-grid">
                    <input name="primerNombre" placeholder="Primer Nombre" className="input-simple" onChange={handleChange} required />
                    <input name="segundoNombre" placeholder="Segundo Nombre" className="input-simple" onChange={handleChange} />
                </div>

                <div className="form-grid">
                    <input name="apellidoPaterno" placeholder="Ap. Paterno" className="input-simple" onChange={handleChange} required />
                    <input name="apellidoMaterno" placeholder="Ap. Materno" className="input-simple" onChange={handleChange} required />
                </div>

                <div className="form-grid">
                    <select name="idSexo" className="select-simple" onChange={handleChange}>
                        <option value="1">Masculino</option>
                        <option value="2">Femenino</option>
                    </select>
                    <select name="idTipoDocumento" className="select-simple" onChange={handleChange}>
                        <option value="1">DNI</option>
                        <option value="2">C.E.</option>
                    </select>
                </div>

                <div className="divider"><span>Seguridad de Cuenta</span></div>

                <div className="input-box mb-3">
                    <User className="icon" size={18} />
                    <input name="username" placeholder="Usuario" className="input-account" onChange={handleChange} required />
                </div>
                <div className="input-box mb-3">
                    <Mail className="icon" size={18} />
                    <input name="email" type="email" placeholder="Correo" className="input-account" onChange={handleChange} required />
                </div>
                <div className="input-box mb-4">
                    <Lock className="icon" size={18} />
                    <input name="password" type="password" placeholder="Contraseña" className="input-account" onChange={handleChange} required />
                </div>

                {/* BOTÓN: Se activa solo si 'entidad' existe y no está cargando */}
                <button 
                    type="submit" 
                    className="btn-submit" 
                    disabled={loading || !entidad}
                >
                    {loading ? (
                        <Loader2 className="spinner" />
                    ) : (
                        <>CREAR MI CUENTA <ArrowRight size={20} /></>
                    )}
                </button>
            </form>
        </div>
    </div>
);
};

export default Signup;