import { useState } from 'react';
import { BarraPasosFirma } from './components/BarraPasosFirma';
import { ListaAtencionesLote } from './components/ListaAtencionesLote';
import { VisorDocumentoFirma } from './components/VisorDocumentoFirma';
import { ExplicacionPasoFooter } from './components/ExplicacionPasoFooter';
import './styles/firma-digital.css'
function FirmaDigitalForm() {
  const [pasoActual, setPasoActual] = useState(1);

  const [atenciones, setAtenciones] = useState([
    {
      id: 284,
      pacienteNombre: 'JUAN PEREZ SOTO',
      dni: '21447464',
      nombreArchivo: 'atencion_284_2.pdf',
      estado: 'DESCARGADO',
      seleccionado: true,
      fecha: '07/09/2026',
      anamnesis: 'Paciente refiere malestar general y dolor de garganta.',
      diagnostico: 'Rinofaringitis aguda [J00]',
      tratamiento: 'Paracetamol 500mg c/8h por 3 días.',
    },
    {
      id: 285,
      pacienteNombre: 'MARIA LOPEZ RAMOS',
      dni: '45892110',
      nombreArchivo: 'atencion_285_2.pdf',
      estado: 'DESCARGADO',
      seleccionado: true,
      fecha: '07/09/2026',
      anamnesis: 'Control postoperatorio de colecistectomía.',
      diagnostico: 'Evolución favorable [Z09]',
      tratamiento: 'Retiro de puntos en 3 días.',
    },
    {
      id: 286,
      pacienteNombre: 'CARLOS MENDOZA CHAVEZ',
      dni: '71002388',
      nombreArchivo: 'atencion_286_2.pdf',
      estado: 'PENDIENTE',
      seleccionado: false,
      fecha: '07/09/2026',
      anamnesis: 'Cefalea pulsátil de 2 días de evolución.',
      diagnostico: 'Migraña sin aura [G43.0]',
      tratamiento: 'Naproxeno 550mg c/12h.',
    },
  ]);

  const [atencionSeleccionada, setAtencionSeleccionada] = useState(atenciones[0]);

  const manejarAccionPaso = () => {
    if (pasoActual === 1) {
      setAtenciones(prev => prev.map(a => ({ ...a, estado: 'DESCARGADO', seleccionado: true })));
      setPasoActual(2);
    } else if (pasoActual === 2) {
      setAtenciones(prev => prev.map(a => a.id !== 286 ? { ...a, estado: 'FIRMADO' } : a));
      setPasoActual(3);
    } else if (pasoActual === 3) {
      alert('¡Lote consolidado exitosamente en Cloudflare R2 y BD Neon!');
    }
  };

  return (
    
    <div className="main-layout-hce bg-slate-950 text-slate-100 min-h-screen p-6 font-sans">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-sky-400">Módulo de Firma Digital - PASO {pasoActual}</h1>
          <p className="text-xs text-slate-400">
            {pasoActual === 1 && 'Descarga de PDFs a Carpeta Local y Selección Habilitada'}
            {pasoActual === 2 && 'Ejecución de ReFirma PC y Visualización Exclusiva de Firmados'}
            {pasoActual === 3 && 'Confirmación de Guardado, Almacenamiento en R2 y Purga de Borradores'}
          </p>
        </div>
        <div className="bg-sky-950 border border-sky-800 text-sky-200 px-4 py-1.5 rounded-full text-xs font-semibold">
          Dr. Nilton Geldres | CMP: 85421
        </div>
      </div>

      <BarraPasosFirma pasoActual={pasoActual} alSeleccionarPaso={setPasoActual} />

      <div className="flex gap-4 h-[540px]">
        <ListaAtencionesLote
          pasoActual={pasoActual}
          atenciones={atenciones}
          atencionSeleccionada={atencionSeleccionada}
          alSeleccionarAtencion={setAtencionSeleccionada}
          alAccionarBotonPaso={manejarAccionPaso}
        />
        <VisorDocumentoFirma pasoActual={pasoActual} atencion={atencionSeleccionada} />
      </div>

      <ExplicacionPasoFooter pasoActual={pasoActual} />
    </div>
  );
}

export default FirmaDigitalForm;