import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, ChevronLeft, ChevronRight, X, PlusCircle, Clock, CheckCircle } from 'lucide-react';

// =================================================================
// 0. DEFINICIÓN DE ESTILOS GLOBALES (FIX para el problema de reconocimiento)
// =================================================================

// Se define el CSS como una cadena para inyectarlo de forma segura con dangerouslySetInnerHTML,
// asegurando que no sea ignorado por el entorno de React.
const CUSTOM_STYLES = `
    /* Estilos CSS adaptados para el componente */
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
    }
    .calendar-cell {
        min-height: 100px;
        border: 1px solid #e5e7eb; /* gray-200 */
    }
    /* Hover effect para el modo de edición individual */
    .calendar-cell:hover:not(.bg-gray-50\/50):not(.selected-for-bulk):not(.bulk-mode .calendar-cell) {
        box-shadow: 0 0 0 3px rgba(0, 120, 245, 0.2); 
        z-index: 10;
        border-color: #3b82f6; /* blue-500 */
    }
    
    /* Estilo para el modo masivo activado */
    .bulk-mode .calendar-cell:not(.bg-gray-50\/50) {
        cursor: crosshair;
    }

    /* Estilo para la celda seleccionada en modo masivo */
    .selected-for-bulk {
        background-color: #d1fae5 !important; /* green-100 */
        border-color: #34d399 !important; /* green-400 */
        box-shadow: 0 0 0 3px #6ee7b7; /* green-300 ring */
        z-index: 20;
    }

    /* Ajuste de diseño responsivo */
    @media (max-width: 640px) {
        .calendar-cell {
            min-height: 80px;
            padding: 8px;
        }
        .calendar-cell span {
            font-size: 1rem;
        }
        .day-info {
            font-size: 0.65rem;
        }
    }
`;

export default CUSTOM_STYLES;