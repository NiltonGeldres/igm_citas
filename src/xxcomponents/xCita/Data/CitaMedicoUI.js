import { User, ShieldCheck } from 'lucide-react';

const CONFIG_VISUAL_MEDICOS = {
  defaultAvatar: <User size={40} className="text-slate-400" />,
  badgeVerificado: <ShieldCheck size={16} className="text-blue-500" />,
  estilos: {
    tarjeta: "border rounded-xl p-3 hover:shadow-md transition-all cursor-pointer",
    monto: "text-success fw-bold fs-5"
  }
};

export const transformarMedicos = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((medico) => {
    // Formateador de moneda local (Soles)
    const formateador = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    });

    return {
      // 1. Data original
      ...medico,

      // 2. Mapeo de nombres de campos
      id: medico.id,
      nombres: medico.nombres,
      
      // 3. Formateo de Negocio (El Monto)
      monto: medico.monto || 0,
      montoFormateado: formateador.format(medico.monto || 0),

      // 4. Inyección de UI
      fotoPerfil: medico.urlFoto || CONFIG_VISUAL_MEDICOS.defaultAvatar,
      verificado: !!medico.colegiatura, // Boolean basado en si tiene colegiatura
      claseContenedor: CONFIG_VISUAL_MEDICOS.estilos.tarjeta,
      
      // 5. Metadatos para filtrado
      busquedaRapida: `${medico.nombre} ${medico.apellidoPaterno}`.toLowerCase(),
    };
  });
};