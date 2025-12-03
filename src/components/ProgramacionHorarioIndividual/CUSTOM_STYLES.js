import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, ChevronLeft, ChevronRight, X, PlusCircle, Clock, CheckCircle } from 'lucide-react';

// =================================================================
// 0. DATOS Y ESTILOS GLOBALES (CONSOLIDACIÓN)
// =================================================================

// --- MOCK DATA ---
const SHIFTS_DATA = [
    { id: 'morning', name: 'Mañana', time: '08:00 - 14:00', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'afternoon', name: 'Tarde', time: '14:00 - 20:00', color: 'bg-blue-100 text-blue-800' },
    { id: 'evening', name: 'Noche', time: '20:00 - 02:00', color: 'bg-purple-100 text-purple-800' },
];

// --- CUSTOM STYLES (CORREGIDOS) ---
const CUSTOM_STYLES = `
    /* FIX CRÍTICO: Definición del layout del calendario como una cuadrícula de 7 columnas */
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        /* Agregamos bordes para separar las celdas y visualmente mejorar el layout */
        border-left: 1px solid #e5e7eb; /* gray-200 */
    }
    
    .calendar-grid > div {
        border-right: 1px solid #e5e7eb;
        border-bottom: 1px solid #e5e7eb;
        min-height: 120px; /* Asegura un tamaño mínimo para las celdas */
    }
    
    .calendar-grid > div:nth-child(7n) {
        border-right: none; /* Elimina el borde derecho de la última columna */
    }

    /* Hover effect para el modo de edición individual (cuando NO está en modo masivo) */
    .calendar-cell:hover:not(.selected-for-bulk):not(.bg-gray-50\\/50) {
        /* El doble escape (\\/) es necesario para que el selector funcione correctamente */
        box-shadow: 0 0 0 3px rgba(0, 120, 245, 0.2);
        z-index: 10;
        border-color: #3b82f6; /* blue-500 */
    }
    
    /* 1. Estilo para el modo masivo activado (Activa el cursor de selección) */
    .bulk-mode .calendar-cell:not(.bg-gray-50\\/50) {
        cursor: crosshair !important;
    }

    /* 2. Sobrescribe el hover individual cuando se está en modo masivo */
    .bulk-mode .calendar-cell:hover {
        box-shadow: none !important;
        border-color: #e5e7eb; /* Restaura el color de borde normal */
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
        .calendar-grid > div {
            min-height: 80px;
        }
        .calendar-cell {
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