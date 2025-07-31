// //=============== TANPA FILTER ==========

// import React from "react";

// const TableSection = ({
//   title,
//   data,
//   fullData,
//   columns,
//   page,
//   totalPages,
//   onPageChange,
// }) => {
//   const exportToCSV = () => {
//     if (!fullData || fullData.length === 0) return;

//     let csvContent = columns.join(",") + "\n";
//     fullData.forEach((row) => {
//       const rowData = columns.map((col) => {
//         let cell = row[col];
//         if (typeof cell === "number") cell = cell.toFixed(2);
//         if (cell == null) cell = "";
//         if (typeof cell === "string" && cell.includes(",")) {
//           cell = `"${cell.replace(/"/g, '""')}"`;
//         }
//         return cell;
//       });
//       csvContent += rowData.join(",") + "\n";
//     });

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}_all.csv`;

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", fileName);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   if (!data || data.length === 0) {
//     return (
//       <section className="table-section">
//         <h3>{title}</h3>
//         <p>Tidak ada data</p>
//       </section>
//     );
//   }

//   return (
//     <section className="table-section">
//       <h3>{title}</h3>

//       <button
//         onClick={exportToCSV}
//         style={{
//           marginBottom: "10px",
//           padding: "6px 12px",
//           backgroundColor: "#3f51b5",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//           fontSize: "14px",
//         }}
//       >
//         Download CSV
//       </button>

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               {columns.map((col, i) => (
//                 <th key={i}>{col}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, i) => (
//               <tr key={i}>
//                 {columns.map((col, idx) => (
//                   <td key={idx}>
//                     {typeof item[col] === "number"
//                       ? item[col].toFixed(2)
//                       : item[col] ?? "-"}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>
//           Prev
//         </button>
//         <span>
//           Page {page + 1} of {totalPages}
//         </span>
//         <button
//           onClick={() => onPageChange(page + 1)}
//           disabled={page >= totalPages - 1}
//         >
//           Nxt
//         </button>
//       </div>
//     </section>
//   );
// };

// export default TableSection;


//================== VERSI TABEL FILTER ==========
import React, { useState, useEffect } from "react";
import { FaFilter, FaRedo } from "react-icons/fa"; 

const ITEMS_PER_PAGE = 10;

const TableSection = ({ title, fullData, columns, page, onPageChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visibleCols, setVisibleCols] = useState(columns);
  const [sortConfig, setSortConfig] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [allChecked, setAllChecked] = useState(true);

  useEffect(() => onPageChange(0), [startDate, endDate, visibleCols, sortConfig]);

  const filteredByDate = fullData.filter(row => {
    const d = new Date(row.timestamp.replace(" ", "T"));
    const s = startDate ? new Date(startDate + "T00:00:00") : null;
    const e = endDate ? new Date(endDate + "T23:59:59") : null;
    return (!s || d >= s) && (!e || d <= e);
  });

  const sorted = [...filteredByDate];
  if (sortConfig) {
    sorted.sort((a, b) => {
      const aV = a[sortConfig.key], bV = b[sortConfig.key];
      if (aV == null) return 1;
      if (bV == null) return -1;
      if (typeof aV === "number") {
        return sortConfig.direction === "asc" ? aV - bV : bV - aV;
      }
      return sortConfig.direction === "asc"
        ? String(aV).localeCompare(bV)
        : String(bV).localeCompare(aV);
    });
  }

  const paginated = sorted.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const toggleSort = col => {
    setSortConfig(prev => {
      if (!prev || prev.key !== col) return { key: col, direction: "asc" };
      if (prev.direction === "asc") return { key: col, direction: "desc" };
      return null;
    });
  };

  const handleCheckAll = () => {
    if (allChecked) {
      setVisibleCols([]);
    } else {
      setVisibleCols(columns);
    }
    setAllChecked(!allChecked);
  };

  const handleToggleCol = col => {
    setVisibleCols(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
    setAllChecked(visibleCols.length === columns.length - 1);
  };

  const resetAll = () => {
    setStartDate("");
    setEndDate("");
    setVisibleCols(columns);
    setSortConfig(null);
    setAllChecked(true);
  };

  const exportToCSV = () => {
    if (!sorted.length) { alert("Tidak ada data untuk diekspor."); return; }
    let csv = visibleCols.join(",") + "\n";
    sorted.forEach(r => {
      const arr = visibleCols.map(c => {
        let v = r[c];
        if (typeof v === "number") v = v.toFixed(2);
        if (v == null) v = "";
        if (typeof v === "string" && v.includes(",")) v = `"${v.replace(/"/g, '""')}"`;
        return v;
      });
      csv += arr.join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const filename = `${title.replace(/\s+/g, "_")}_${startDate || "all"}_${endDate || "all"}.csv`;
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="table-section">
      <div className="header-bar">
        <h3>{title}</h3>
        <div className="controls">
          <button onClick={() => setShowModal(true)} title="Filter Kolom">
            <FaFilter />
          </button>
          <button onClick={resetAll} title="Reset Semua Filter">
            <FaRedo />
          </button>
        </div>
      </div>

      <div className="date-filter">
        <div className="date-group">
          <label>Start:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="date-group">
          <label>End:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <button className="btn-export" onClick={exportToCSV}>Export CSV</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {visibleCols.map(col => (
                <th
                  key={col}
                  className={`sortable${sortConfig?.key === col ? ` active-${sortConfig.direction}` : ""}`}
                  onClick={() => toggleSort(col)}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((r,i) => (
              <tr key={i}>
                {visibleCols.map(col => (
                  <td key={col}>{typeof r[col] === "number" ? r[col].toFixed(2) : r[col] ?? "-"}</td>
                ))}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={visibleCols.length} style={{ textAlign: "center" }}>Data tidak tersedia</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>Prev</button>
        <span>{page+1} / {Math.ceil(sorted.length / ITEMS_PER_PAGE)}</span>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= Math.ceil(sorted.length / ITEMS_PER_PAGE) - 1}>Next</button>
      </div>

  {showModal && (
  <div className="modal-backdrop" onClick={() => setShowModal(false)}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h4>Filter Kolom</h4>
        <button className="btn-close" onClick={() => setShowModal(false)} title="Tutup">×</button>
      </div>

      <button className="check-all-btn" onClick={handleCheckAll}>
        {allChecked ? "Uncheck All" : "Check All"}
      </button>

      <ul className="col-list">
        {columns.map(col => (
          <li key={col}>
            <label>
              <input
                type="checkbox"
                checked={visibleCols.includes(col)}
                onChange={() => handleToggleCol(col)}
              />
              {col}
            </label>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

    </section>
  );
};

export default TableSection;
