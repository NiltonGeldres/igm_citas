import React, { useState } from 'react';
import './Calendar.css'; // Asegúrate de tener un archivo de estilos CSS para tu calendario

const Calendar = () => {
  const daysInMonth = 31; // Puedes ajustar esto según el mes actual

  // Estado para almacenar los datos ingresados y los números de día en cada celda
  const [cellData, setCellData] = useState(Array(6).fill(Array(7).fill({ text: '', day: 0 })));

  const handleInputChange = (row, col, value) => {
    const newData = cellData.map((r, rowIndex) =>
      r.map((c, colIndex) => (rowIndex === row && colIndex === col ? { ...c, text: value } : c))
    );
    setCellData(newData);
  };

  const renderCalendar = () => {
    const calendarRows = [];

    for (let row = 0; row < 6; row++) {
      const calendarRow = [];

      for (let col = 0; col < 7; col++) {
        const dayNumber = row * 7 + col + 1;
        const isDayValid = dayNumber <= daysInMonth;

        calendarRow.push(
          <td key={`cell-${row}-${col}`} className={`calendar-cell ${isDayValid ? 'valid-day' : 'invalid-day'}`  } >
            {isDayValid && (
              <>
                <div className="day-number ">{dayNumber}</div>
                <input
                  type="text"
                  maxLength="2"
                  value={cellData[row][col].text}
                  onChange={(e) => handleInputChange(row, col, e.target.value)}
                />
              </>
            )}
          </td>
        );
      }

      calendarRows.push(<tr key={`row-${row}`}>{calendarRow}</tr>);
    }

    return calendarRows;
  };

  return (
    <div className="calendar-container">
      <h2>Calendario</h2>
      <table className="calendar-table">
        <thead>
          <tr>
            <th className='col2'>Lun</th>
            <th>Mar</th>
            <th>Mié</th>
            <th>Jue</th>
            <th>Vie</th>
            <th>Sáb</th>
            <th>Dom</th>
          </tr>
        </thead>
        <tbody>{renderCalendar()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;