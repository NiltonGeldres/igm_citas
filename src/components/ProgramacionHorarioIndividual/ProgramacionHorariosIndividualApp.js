import React, { useState, useCallback, useMemo } from 'react';
import { CalendarCheck, ChevronLeft, ChevronRight, X, PlusCircle, Clock, CheckCircle } from 'lucide-react';
// Importaciones de subcomponentes (Manteniendo rutas originales para simular la estructura)
import { Icon } from "../ProgramacionHorarioIndividual/Programacion/Components/Icon.js";
import FilterBar from "../ProgramacionHorarioIndividual/Programacion/Components/FilterBar.js";
import BulkScheduler from "../ProgramacionHorarioIndividual/Programacion/Components/BulkScheduler.js";
import CalendarCell from "../ProgramacionHorarioIndividual/Programacion/Components/CalendarCell.js";
import ShiftEditorModal from "../ProgramacionHorarioIndividual/Programacion/Components/ShiftEditorModal.js";
import CUSTOM_STYLES from './CUSTOM_STYLES.js';
//import { MONTHS_ES, WEEKDAYS, ALL_SHIFTS, SHIFT_MAPPING, firebaseConfig, appId, initialAuthToken} from "../ProgramacionHorarioIndividual/Programacion/Data/Constants.js"
//import { MONTHS_ES} from "../ProgramacionHorarioIndividual/Programacion/Data/Constants.js"

import {MONTHS_ES} from "./Programacion/Constants/MONTH_ES.js"
import {WEEKDAYS} from "./Programacion/Constants/WEEKDAYS.js"


export default function ProgramacionHorariosIndividualApp() {

// =================================================================
// 2. COMPONENTE PRINCIPAL (ProgramacionHorariosIndividualApp)
// =================================================================

    // --- ESTADO ---
    // 1. Estado de la fecha actual que se está visualizando
    const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // Inicializado en Noviembre 2025 (mes 10)
    
    // 2. Estados de programación masiva y modal
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDayForIndividualEdit, setSelectedDayForIndividualEdit] = useState(null);
    const [selectedBulkShifts, setSelectedBulkShifts] = useState([]);
    const [selectedBulkDays, setSelectedBulkDays] = useState([]);
    
    // 3. Estado para la programación actual, usando 'YYYY-MM-DD' como clave
    const [calendarSchedule, setCalendarSchedule] = useState({
        '2025-11-03': ['morning', 'afternoon'],
        '2025-11-15': ['morning', 'afternoon', 'evening'],
    });

    // --- LÓGICA DE NAVEGACIÓN MENSUAL ---
    
    // Función para ir al mes anterior
    const goToPreviousMonth = useCallback(() => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getTime());
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
        // Limpiar selección masiva al cambiar de mes
        setIsBulkMode(false);
        setSelectedBulkDays([]);
    }, []);

    // Función para ir al mes siguiente
    const goToNextMonth = useCallback(() => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getTime());
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
        // Limpiar selección masiva al cambiar de mes
        setIsBulkMode(false);
        setSelectedBulkDays([]);
    }, []);

    // --- MANEJADORES DE ESTADO Y LÓGICA EXISTENTE ---

    const toggleBulkMode = useCallback(() => {
        setIsBulkMode(prev => {
            if (prev) {
                setSelectedBulkDays([]);
                setSelectedBulkShifts([]);
            }
            return !prev;
        });
    }, []);

    const toggleBulkShift = useCallback((shiftId) => {
        setSelectedBulkShifts(prev =>
            prev.includes(shiftId)
                ? prev.filter(id => id !== shiftId)
                : [...prev, shiftId]
        );
    }, []);
    
    const applyToAllDays = useCallback(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const allDaysKeys = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const monthPadded = String(month + 1).padStart(2, '0');
            const dayPadded = String(day).padStart(2, '0');
            return `${year}-${monthPadded}-${dayPadded}`;
        });

        setSelectedBulkDays(allDaysKeys);
    }, [currentDate]);

    const applyBulkSchedule = useCallback(() => {
        if (selectedBulkDays.length === 0 || selectedBulkShifts.length === 0) {
            console.error('Error: Debes seleccionar días Y turnos para aplicar la programación masiva.');
            return;
        }

        const newSchedule = { ...calendarSchedule };
        
        selectedBulkDays.forEach(dateKey => {
            newSchedule[dateKey] = selectedBulkShifts;
        });

        setCalendarSchedule(newSchedule);
        console.log(`Programación masiva aplicada a ${selectedBulkDays.length} días.`);
        
        setSelectedBulkShifts([]);
        setSelectedBulkDays([]);
        toggleBulkMode();
    }, [selectedBulkDays, selectedBulkShifts, calendarSchedule, toggleBulkMode]);

    // Maneja el clic en una celda del día, ahora usando la clave 'YYYY-MM-DD'
    const handleDayClick = useCallback((dateKey) => {
        if (isBulkMode) {
            setSelectedBulkDays(prev =>
                prev.includes(dateKey)
                    ? prev.filter(d => d !== dateKey)
                    : [...prev, dateKey]
            );
        } else {
            setSelectedDayForIndividualEdit(dateKey);
            setIsModalOpen(true);
        }
    }, [isBulkMode]);

    const closeShiftEditor = useCallback(() => {
        setIsModalOpen(false);
        setSelectedDayForIndividualEdit(null);
    }, []);


    // --- GENERACIÓN DINÁMICA DEL CALENDARIO (useMemo) ---
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed (0=Enero)
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // El día de la semana en que comienza el mes (0=Dom, 1=Lun, etc.)
        const firstDayOfMonth = new Date(year, month, 1);
        
        // Convertir Sunday=0, Monday=1, ..., Saturday=6 a ISO Weekday (Monday=0, ..., Sunday=6)
        // (DayOfWeek - 1 + 7) % 7
        const startDayOffset = (firstDayOfMonth.getDay() - 1 + 7) % 7; 

        const daysArray = [];
        const todayKey = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' de hoy

        // Agregar celdas vacías de inicio
        for (let i = 0; i < startDayOffset; i++) {
            daysArray.push(<CalendarCell key={`empty-${i}`} isEmpty={true} />);
        }

        // Agregar días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayPadded = String(day).padStart(2, '0');
            const monthPadded = String(month + 1).padStart(2, '0');
            const dateKey = `${year}-${monthPadded}-${dayPadded}`; // Clave para el estado: YYYY-MM-DD
            
            const isToday = dateKey === todayKey;
            const shifts = calendarSchedule[dateKey];
            const hasSchedule = shifts ? shifts.length : 0;
            const isSelectedForBulk = selectedBulkDays.includes(dateKey);

            daysArray.push(
                <CalendarCell
                    key={dateKey}
                    day={day}
                    dateKey={dateKey}
                    isToday={isToday}
                    hasSchedule={hasSchedule}
                    isSelectedForBulk={isSelectedForBulk}
                    handleDayClick={handleDayClick}
                    schedule={calendarSchedule}
                />
            );
        }

        return { daysArray, monthName: MONTHS_ES[month], year };
    }, [currentDate, selectedBulkDays, calendarSchedule, handleDayClick]);

    // --- RENDERIZADO PRINCIPAL ---
    return (
        <>
            {/* INYECCIÓN DE ESTILOS CSS PERSONALIZADOS (incluye Bootstrap) */}
            <style dangerouslySetInnerHTML={{ __html: CUSTOM_STYLES }} />

            {/* CONTENEDOR PRINCIPAL */}
            <div className={`p-4 p-md-5 ${isBulkMode ? 'bulk-mode' : ''} bg-light min-vh-100 font-inter`}>
                <div className="container-lg">
                    <h1 className="h2 fw-bolder text-primary mb-4 d-flex align-items-center">
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
                    <div className="row g-4" id="main-content-wrapper">
                        
                        {/* A. PROGRAMACIÓN MASIVA */}
                        {isBulkMode && (
                            <div className="col-12 col-lg-3 d-flex">
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
                            
                            <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white rounded-3 shadow-sm border">
                                {/* TÍTULO DINÁMICO DEL MES Y AÑO */}
                                <h2 className="h4 fw-bold text-dark mb-0">
                                    {calendarData.monthName} {calendarData.year}
                                </h2>
                                <div className="d-flex gap-2">
                                    <button 
                                        onClick={goToPreviousMonth}
                                        className="btn btn-outline-secondary rounded-circle shadow-sm" 
                                        aria-label="Mes anterior"
                                    >
                                        <Icon name="ChevronLeft" style={{width: '20px', height: '20px'}}/>
                                    </button>
                                    <button 
                                        onClick={goToNextMonth}
                                        className="btn btn-outline-secondary rounded-circle shadow-sm" 
                                        aria-label="Mes siguiente"
                                    >
                                        <Icon name="ChevronRight" style={{width: '20px', height: '20px'}}/>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-4 shadow-lg overflow-hidden border">
                                {/* Encabezados de días */}
                                <div className="calendar-grid text-center small fw-semibold bg-primary-subtle border-bottom">
                                    {WEEKDAYS.map(day => (
                                        <div key={day} className="py-3 text-primary">{day}</div>
                                    ))}
                                </div>
                                
                                {/* Celdas del calendario */}
                                <div className="calendar-grid">
                                    {calendarData.daysArray}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 3. MODAL DE EDICIÓN DE TURNOS INDIVIDUAL */}
                <ShiftEditorModal
                    isOpen={isModalOpen}
                    dayKey={selectedDayForIndividualEdit}
                    onClose={closeShiftEditor}
                    schedule={calendarSchedule}
                    setSchedule={setCalendarSchedule}
                />
            </div>
        </>
    );
};