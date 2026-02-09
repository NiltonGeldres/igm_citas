// TODOS_LOS_TURNOS.js
import { MAPEO_TURNOS } from "../Data/CargarConfiguracionTurnos";

// En lugar de una constante, exportamos una función que lea el objeto en tiempo real
export const obtenerListaTurnos = () => Object.values(MAPEO_TURNOS);