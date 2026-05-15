export const ESTILOS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');

  body { 
    font-family: 'Plus Jakarta Sans', sans-serif !important; 
    background-color: #f8fafc; 
    color: #1e293b;
  }
  
  .calendario-grid { 
    display: grid; 
    grid-template-columns: repeat(7, 1fr); 
    gap: 4px;
  }
  
  .calendario-celda { 
    min-height: 45px; 
    transition: all 0.2s ease; 
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.85rem;
    border-radius: 8px;
  }
  
  .calendario-celda:hover:not(:disabled) { 
    background-color: #f1f5f9 !important; 
    z-index: 10; 
    transform: scale(1.05); 
    color: #0ea5e9;
  }
  
  .seleccion-masiva { 
    background-color: #0ea5e9 !important; 
    border: 2px solid #0ea5e9 !important; 
    color: white !important;
  }
  
  .girar { 
    animation: girar 1s linear infinite; 
  }
  
  @keyframes girar { 
    from { transform: rotate(0deg); } 
    to { transform: rotate(360deg); } 
  }

  .nav-difuminado {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.8);
  }

  .tarjeta-personalizada {
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .tarjeta-personalizada:active {
    transform: scale(0.98);
  }

  .etiqueta-pago {
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }
`;
