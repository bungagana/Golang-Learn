import React from "react";

const TableSection = ({ title, data, columns, renderRow, page, totalPages, onPageChange }) => (
  <section className="table-section">
    <h3>{title}</h3>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            {columns.map((col, i) => <th key={i}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.timestamp}</td>
              {renderRow(item).map((val, idx) => <td key={idx}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>⏮ Prev</button>
      <span>Page {page + 1} of {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}>Next ⏭</button>
    </div>
  </section>
);

export default TableSection;
