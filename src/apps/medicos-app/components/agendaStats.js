export const AgendaStats = ({ total, atendidos }) => (
  <div className="stats-row">
    <div className="stat-card">
      <div className="stat-val blue">{total}</div>
      <div className="stat-label">TOTAL CITAS</div>
    </div>
    <div className="stat-card">
      <div className="stat-val green">{atendidos}</div>
      <div className="stat-label">ATENDIDOS</div>
    </div>
  </div>
);