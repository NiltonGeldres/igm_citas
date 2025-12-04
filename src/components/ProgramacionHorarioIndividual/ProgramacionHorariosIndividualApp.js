import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, ChevronLeft, ChevronRight, X, PlusCircle, Clock, CheckCircle } from 'lucide-react';
// Importaciones de subcomponentes (Manteniendo rutas originales para simular la estructura)
import { Icon } from "../ProgramacionHorarioIndividual/Programacion/Components/Icon.js";
import FilterBar from "../ProgramacionHorarioIndividual/Programacion/Components/FilterBar.js";
import BulkScheduler from "../ProgramacionHorarioIndividual/Programacion/Components/BulkScheduler.js";
import CalendarCell from "../ProgramacionHorarioIndividual/Programacion/Components/CalendarCell.js";
import ShiftEditorModal from "../ProgramacionHorarioIndividual/Programacion/Components/ShiftEditorModal.js";
import  Data from  ".//Programacion/Data/Data.js"
import CUSTOM_STYLES from './CUSTOM_STYLES.js';

// =================================================================
// COMPONENTE PRINCIPAL (ProgramacionHorariosIndividualApp)
// =================================================================

// =================================================================
// COMPONENTE PRINCIPAL (ProgramacionHorariosApp)
// =================================================================

// =================================================================
// 2. COMPONENTE PRINCIPAL (ProgramacionHorariosIndividualApp)
// =================================================================

const ProgramacionHorariosIndividualApp = () => {
    // --- ESTADO ---
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDayForIndividualEdit, setSelectedDayForIndividualEdit] = useState(null);
    const [selectedBulkShifts, setSelectedBulkShifts] = useState([]);
    const [selectedBulkDays, setSelectedBulkDays] = useState([]);
    
    // Estado para simular la programación actual de turnos en el calendario
    const [calendarSchedule, setCalendarSchedule] = useState({
        '3': ['morning', 'afternoon'],
        '15': ['morning', 'afternoon', 'evening'],
    });

    // --- MANEJADORES DE ESTADO Y LÓGICA ---

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
        const startDayOffset = 5; // Empezar en Sábado (0=Lun, 1=Mar, 2=Mier, 3=Jue, 4=Vie, 5=Sab, 6=Dom)
        const daysArray = [];

        // Agregar celdas vacías de inicio
        for (let i = 0; i < startDayOffset; i++) {
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
            {/* INYECCIÓN DE ESTILOS CSS PERSONALIZADOS */}
            <style dangerouslySetInnerHTML={{ __html: CUSTOM_STYLES }} />

            {/* CONTENEDOR PRINCIPAL: Adaptado a Bootstrap */}
            <div className={`p-4 p-md-5 ${isBulkMode ? 'bulk-mode' : ''} bg-light min-vh-100 font-inter`}>
                <div className="container-lg">
                    <h1 className="h2 fw-bolder text-dark mb-4 d-flex align-items-center">
                        <Icon name="CalendarCheck" className="text-primary me-3" style={{width: '32px', height: '32px'}} />
                        Programación Horaria Mensual
                    </h1>
                    <p className="text-secondary mb-4">Define tu disponibilidad de turnos para el mes y servicio.</p>

                    {/* 1. FILTROS */}
                    <FilterBar />

                    {/* Botón para alternar el modo masivo */}
                    <div className="mb-4 d-flex justify-content-end">
                        <button
                            id="toggle-bulk-mode"
                            onClick={toggleBulkMode}
                            className={`btn ${isBulkMode ? 'btn-secondary' : 'btn-primary'} d-flex align-items-center fw-semibold shadow-sm`}
                            aria-label={isBulkMode ? 'Cerrar Programación Masiva' : 'Abrir Programación Masiva'}
                        >
                            <Icon name={isBulkMode ? "X" : "PlusCircle"} style={{width: '20px', height: '20px'}} className="me-2" />
                            {isBulkMode ? 'Cerrar Programación Masiva' : 'Programación Masiva'}
                        </button>
                    </div>

                    {/* 2. CONTENEDOR PRINCIPAL: Panel Masivo (condicional) y Calendario */}
                    {/* Se usa el sistema de grid de Bootstrap: col-lg-3 para Bulk, col-lg-9 para Calendario */}
                    <div className="row g-4" id="main-content-wrapper">
                        
                        {/* A. PROGRAMACIÓN MASIVA */}
                        {isBulkMode && (
                            <div className="col-12 col-lg-3">
                                <BulkScheduler
                                    selectedShifts={selectedBulkShifts}
                                    toggleShift={toggleBulkShift}
                                    applyToAllDays={applyToAllDays}
                                    applyBulkSchedule={applyBulkSchedule}
                                />
                            </div>
                        )}

                        {/* B. CALENDARIO */}
                        <div className={`col-12 ${isBulkMode ? 'col-lg-9' : 'col-lg-12'}`}>
                            
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2 className="h4 fw-bold text-dark">Noviembre 2025</h2>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-secondary rounded-circle shadow-sm" aria-label="Mes anterior">
                                        <Icon name="ChevronLeft" style={{width: '20px', height: '20px'}}/>
                                    </button>
                                    <button className="btn btn-outline-secondary rounded-circle shadow-sm" aria-label="Mes siguiente">
                                        <Icon name="ChevronRight" style={{width: '20px', height: '20px'}}/>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-4 shadow-lg overflow-hidden border">
                                {/* Encabezados de días */}
                                <div className="calendar-grid text-center small fw-semibold bg-light border-bottom">
                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
                                        <div key={day} className="py-2 text-secondary">{day}</div>
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