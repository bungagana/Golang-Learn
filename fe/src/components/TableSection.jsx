
import React from "react";

const TableSection = ({ title, data, page, totalPages, onPageChange }) => {
  if (!data || data.length === 0) {
    return (
      <section className="table-section">
        <h3>{title}</h3>
        <p>Tidak ada data</p>
      </section>
    );
  }

  // Ambil semua kolom dari object pertama
  const allColumns = Object.keys(data[0] || {});
  const timestampIndex = allColumns.indexOf("timestamp");

  // Pastikan kolom timestamp selalu di depan
  if (timestampIndex > -1) {
    allColumns.splice(timestampIndex, 1);
    allColumns.unshift("timestamp");
  }

  return (
    <section className="table-section">
      <h3>{title}</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {allColumns.map((col, i) => <th key={i}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                {allColumns.map((col, idx) => (
                  <td key={idx}>
                    {typeof item[col] === "number" 
                      ? item[col].toFixed(2) 
                      : item[col] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 0}> Prev</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}>Nxt</button>
      </div>
    </section>
  );
};

export default TableSection;
