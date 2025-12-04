import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, ChevronLeft, ChevronRight, X, PlusCircle, Clock, CheckCircle } from 'lucide-react';
// Estilos CSS personalizados (Adaptados a Bootstrap 5 para el look and feel)
const CUSTOM_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    /* Importación de Bootstrap */
    @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');

    .font-inter { font-family: 'Inter', sans-serif; }
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }
    .calendar-cell {
        min-height: 100px; /* Altura mínima para celdas grandes */
        cursor: pointer;
    }
    .calendar-cell:hover {
        background-color: var(--bs-light) !important;
    }
    .is-bulk-selected {
        background-color: var(--bs-primary-bg-subtle) !important;
        border-color: var(--bs-primary) !important;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
    .bulk-mode .calendar-cell:not(.is-bulk-selected) {
        opacity: 0.7;
    }
`;

export default CUSTOM_STYLES;