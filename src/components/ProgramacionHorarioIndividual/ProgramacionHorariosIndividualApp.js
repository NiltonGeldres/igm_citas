import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, ChevronLeft, ChevronRight, X, PlusCircle, Clock, CheckCircle } from 'lucide-react';
// Importaciones de subcomponentes (Manteniendo rutas originales para simular la estructura)
import { Icon } from "../ProgramacionHorarioIndividual/Programacion/Components/Icons.js";
import FilterBar from "../ProgramacionHorarioIndividual/Programacion/Components/FilterBar.js";
import BulkScheduler from "../ProgramacionHorarioIndividual/Programacion/Components/BulkScheduler.js";
import CalendarCell from "../ProgramacionHorarioIndividual/Programacion/Components/CalendarCell.js";
import ShiftEditorModal from "../ProgramacionHorarioIndividual/Programacion/Components/ShiftEditorModal.js";

import CUSTOM_STYLES from './CUSTOM_STYLES.js';

// =================================================================
// COMPONENTE PRINCIPAL (ProgramacionHorariosIndividualApp)
// =================================================================

// =================================================================
// COMPONENTE PRINCIPAL (ProgramacionHorariosApp)
// =================================================================

const ProgramacionHorariosIndividualApp = () => {
    // --- ESTADO ---
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDayForIndividualEdit, setSelectedDayForIndividualEdit] = useState(null);
    const [selectedBulkShifts, setSelectedBulkShifts] = useState([]);
    const [selectedBulkDays, setSelectedBulkDays] = useState([]);
    
    // Estado para simular la programación actual de turnos en el calendario (Day: [Shift IDs])
    const [calendarSchedule, setCalendarSchedule] = useState({
        '3': ['morning', 'afternoon'],
        '15': ['morning', 'afternoon', 'evening'],
    });

    // --- MANEJADORES DE ESTADO Y LÓGICA (usando useCallback para optimización) ---

    // Función para alternar el modo de programación masiva
    const toggleBulkMode = useCallback(() => {
        setIsBulkMode(prev => {
            if (prev) {
                // Limpiar selección masiva al salir del modo
                setSelectedBulkDays([]);
                setSelectedBulkShifts([]);
            }
            return !prev;
        });
    }, []);

    // Función para seleccionar/deseleccionar turnos en el panel masivo
    const toggleBulkShift = useCallback((shiftId) => {
        setSelectedBulkShifts(prev =>
            prev.includes(shiftId)
                ? prev.filter(id => id !== shiftId)
                : [...prev, shiftId]
        );
    }, []);

    // Función para seleccionar/deseleccionar días en el calendario durante el modo masivo
    const toggleBulkDaySelection = useCallback((day) => {
        setSelectedBulkDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    }, []);
    
    // Aplica la selección masiva a todos los días del mes (mock: 30 días)
    const applyToAllDays = useCallback(() => {
        const totalDays = 30; // Días del mes mockeado
        const allDays = Array.from({ length: totalDays }, (_, i) => String(i + 1));
        setSelectedBulkDays(allDays);
    }, []);

    // Aplica y guarda la programación masiva en el estado principal
    const applyBulkSchedule = useCallback(() => {
        if (selectedBulkDays.length === 0 || selectedBulkShifts.length === 0) {
            console.error('Error: Debes seleccionar días Y turnos para aplicar la programación masiva.');
            // Reemplazo de alert() por console.log o un modal
            alert('Debes seleccionar días Y turnos para aplicar la programación masiva.'); 
            return;
        }

        // Crear una copia del horario actual
        const newSchedule = { ...calendarSchedule };
        
        // Aplicar los turnos seleccionados a todos los días marcados
        selectedBulkDays.forEach(day => {
            // Reemplaza el horario existente con la nueva selección masiva
            newSchedule[day] = selectedBulkShifts;
        });

        setCalendarSchedule(newSchedule);
        console.log(`Programación masiva aplicada a ${selectedBulkDays.length} días.`);
        
        // Reset y salida del modo masivo
        setSelectedBulkShifts([]);
        setSelectedBulkDays([]);
        toggleBulkMode();
    }, [selectedBulkDays, selectedBulkShifts, calendarSchedule, toggleBulkMode]);

    // Maneja el clic en una celda del día (abre modal o selecciona día masivo)
    const handleDayClick = useCallback((day) => {
        if (isBulkMode) {
            toggleBulkDaySelection(day);
        } else {
            setSelectedDayForIndividualEdit(day);
            setIsModalOpen(true);
        }
    }, [isBulkMode, toggleBulkDaySelection]);

    // Cierra el modal de edición individual
    const closeShiftEditor = useCallback(() => {
        setIsModalOpen(false);
        setSelectedDayForIndividualEdit(null);
    }, []);


    // --- GENERACIÓN DEL CALENDARIO (useMemo para optimización) ---
    const calendarDays = useMemo(() => {
        // Simulación: Noviembre 2025: 30 días, empieza en Sábado (5 celdas vacías previas)
        const totalDays = 30;
        const startDayOffset = 5;
        const daysArray = [];

        // Agregar celdas vacías de inicio
        for (let i = 0; i < startDayOffset; i++) {
            // CORRECCIÓN: Se usa la celda vacía para mantener la estructura de la cuadrícula
            daysArray.push(<CalendarCell key={`empty-${i}`} isEmpty={true} />);
        }

        // Agregar días del mes
        for (let day = 1; day <= totalDays; day++) {
            const dayString = String(day);
            const isToday = day === 4; // Mock: Día 4 es hoy
            const shifts = calendarSchedule[dayString];
            const hasSchedule = shifts ? shifts.length : 0;
            const isSelectedForBulk = selectedBulkDays.includes(dayString);

            daysArray.push(
                <CalendarCell
                    key={day}
                    day={day}
                    isToday={isToday}
                    hasSchedule={hasSchedule}
                    isSelectedForBulk={isSelectedForBulk}
                    handleDayClick={handleDayClick}
                />
            );
        }

        return daysArray;
    }, [selectedBulkDays, calendarSchedule, handleDayClick]);

    // --- RENDERIZADO PRINCIPAL ---
    return (
        <>
            {/* FIX: Inyección de estilos CSS con dangerouslySetInnerHTML */}
            <style dangerouslySetInnerHTML={{ __html: CUSTOM_STYLES }} />

            <div className={`p-4 md:p-8 ${isBulkMode ? 'bulk-mode' : ''} bg-gray-50 min-h-screen font-inter`}>
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                        <Icon name="CalendarCheck" className="w-8 h-8 mr-3 text-blue-600" />
                        Programación Horaria Mensual
                    </h1>
                    <p className="text-gray-600 mb-8">Define tu disponibilidad de turnos para el mes y servicio.</p>

                    {/* 1. FILTROS */}
                    <FilterBar />

                    {/* Botón para alternar el modo masivo */}
                    <div className="mb-6 flex justify-end">
                        <button
                            id="toggle-bulk-mode"
                            onClick={toggleBulkMode}
                            className={`flex items-center px-4 py-2 font-semibold rounded-lg shadow-md transition ${isBulkMode ? 'bg-gray-500 hover:bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
                            aria-label={isBulkMode ? 'Cerrar Programación Masiva' : 'Abrir Programación Masiva'}
                        >
                            <Icon name={isBulkMode ? "X" : "PlusCircle"} className="w-5 h-5 mr-2" />
                            {isBulkMode ? 'Cerrar Programación Masiva' : 'Programación Masiva'}
                        </button>
                    </div>

                    {/* 2. CONTENEDOR PRINCIPAL: Panel Masivo (condicional) y Calendario */}
                    <div
                        id="main-content-wrapper"
                        className={`lg:grid gap-6 ${isBulkMode ? 'lg:grid-cols-[280px_1fr]' : 'lg:grid-cols-1'}`}
                    >
                        {/* A. PROGRAMACIÓN MASIVA */}
                        {isBulkMode && (
                            <BulkScheduler
                                selectedShifts={selectedBulkShifts}
                                toggleShift={toggleBulkShift}
                                applyToAllDays={applyToAllDays}
                                applyBulkSchedule={applyBulkSchedule}
                            />
                        )}

                        {/* B. CALENDARIO */}
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Noviembre 2025</h2>
                                <div className="flex space-x-2">
                                    <button className="p-2 border rounded-full bg-white hover:bg-gray-100 transition shadow" aria-label="Mes anterior">
                                        <Icon name="ChevronLeft" className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <button className="p-2 border rounded-full bg-white hover:bg-gray-100 transition shadow" aria-label="Mes siguiente">
                                        <Icon name="ChevronRight" className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                                {/* Encabezados de días */}
                                <div className="calendar-grid text-center font-semibold text-sm bg-gray-100 border-b border-gray-200">
                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
                                        // CORRECCIÓN: La clase calendar-grid ya define los bordes, pero mantenemos flex/text-center.
                                        <div key={day} className="py-3 text-gray-600 flex items-center justify-center">{day}</div>
                                    ))}
                                </div>
                                
                                {/* Celdas del calendario */}
                                <div className="calendar-grid">
                                    {calendarDays}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 3. MODAL DE EDICIÓN DE TURNOS INDIVIDUAL */}
                <ShiftEditorModal
                    isOpen={isModalOpen}
                    day={selectedDayForIndividualEdit}
                    onClose={closeShiftEditor}
                />
            </div>
        </>
    );
};

export default ProgramacionHorariosIndividualApp;