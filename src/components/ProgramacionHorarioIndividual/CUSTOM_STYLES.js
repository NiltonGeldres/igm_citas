import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, ChevronLeft, ChevronRight, X, PlusCircle, Clock, CheckCircle } from 'lucide-react';

// --- ESTILOS PERSONALIZADOS MÍNIMOS (SOLO PARA EL CALENDARIO Y BULK SELECT) ---
const CUSTOM_STYLES = `
    /* Necesario para hacer que el componente funcione en una única página HTML */
    @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
    
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-top: 1px solid var(--bs-border-color);
        border-left: 1px solid var(--bs-border-color);
    }
    .calendar-cell {
        min-height: 120px;
        border-right: 1px solid var(--bs-border-color);
        border-bottom: 1px solid var(--bs-border-color);
        transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
    }
    
    /* Efecto hover cuando NO está en modo masivo (edición individual) */
    .calendar-cell:hover:not(.selected-for-bulk):not(.bg-light) {
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25); /* Primary blue ring */
        border-color: #0d6efd; /* Primary blue */
        z-index: 10;
        cursor: pointer;
    }

    /* 1. Estilo para el modo masivo activado (Activa el cursor de selección) */
    .bulk-mode .calendar-cell:not(.bg-light) {
        cursor: crosshair !important;
    }
    
    /* 2. Sobrescribe el hover individual cuando se está en modo masivo */
    .bulk-mode .calendar-cell:hover:not(.selected-for-bulk) {
        background-color: var(--bs-gray-200); /* Gray 200 */
        box-shadow: none !important;
        border-color: var(--bs-border-color);
    }

    /* Estilo para la celda seleccionada en modo masivo (Bootstrap success color) */
    .selected-for-bulk {
        background-color: var(--bs-green-100) !important; 
        border: 2px solid var(--bs-success) !important;
        box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.5); /* Success ring */
        z-index: 20;
    }

    /* Responsive adjustments */
    @media (max-width: 576px) {
        .calendar-cell {
            min-height: 80px;
            padding: 8px;
        }
        .day-info {
            font-size: 0.7rem;
        }
    }
`;

export default CUSTOM_STYLES;