const ESTILOS_PERSONALIZADOS = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');

    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; }
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
    .calendar-cell { min-height: 110px; transition: all 0.2s ease; }
    .calendar-cell:hover { background-color: #f1f5f9 !important; z-index: 10; transform: scale(1.02); border-radius: 8px; }
    .is-bulk-selected { background-color: #e0f2fe !important; border-color: #0ea5e9 !important; }
    .bulk-mode .calendar-cell:not(.is-bulk-selected) { opacity: 0.6; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

export default ESTILOS_PERSONALIZADOS;