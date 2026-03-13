import { User } from "lucide-react";

export const EmptyAgenda = ({ onGoToToday }) => (
  <div className="empty-state-card">
    <div className="icon-circle">
      <User size={32} />
    </div>
    <p>No hay citas para esta fecha.</p>
    <button onClick={onGoToToday}>Ir a Hoy</button>
  </div>
);