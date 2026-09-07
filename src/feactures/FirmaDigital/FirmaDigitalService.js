// AtencionMedicaService.js
import header from "../../shared/utils/Header";
import axios from "axios";

const API_URL = process.env.REACT_APP_URL_API; 
const SERVICE_BASE = "/api/v1/atenciones-medicas";
const ENDPOINT_GUARDAR_FIRMA = "/atencionMedicaGuardar"; 
const ENDPOINT_GENERAR_PDF_BORRADOR = "/preparar-pdf";

const guardarPdfFirmado = async (atencionMedicaRequest) => {
  const respuesta = await axios.post(
    `${API_URL}${SERVICE_BASE}${ENDPOINT_GUARDAR_FIRMA}`,
    atencionMedicaRequest,
    { headers: header() }
  );
  return respuesta.data;
};

const generarPdfBorrador = async (atencionId) => {
  const respuesta = await axios.post(
    `${API_URL}${SERVICE_BASE}${ENDPOINT_GENERAR_PDF_BORRADOR}`,
    { atencionId },
    { headers: header(), responseType: 'blob' }
  );
  return respuesta.data;
};

const AtencionMedicaService = {
  guardarPdfFirmado,
  generarPdfBorrador
};

export default AtencionMedicaService;