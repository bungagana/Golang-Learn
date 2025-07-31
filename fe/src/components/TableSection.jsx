//============================ TABEL =============================================
// import React from "react";

// const TableSection = ({ title, data, page, totalPages, onPageChange }) => {
//   if (!data || data.length === 0) {
//     return (
//       <section className="table-section">
//         <h3>{title}</h3>
//         <p>Tidak ada data</p>
//       </section>
//     );
//   }

//   // Ambil semua kolom dari object pertama
//   const allColumns = Object.keys(data[0] || {});
//   const timestampIndex = allColumns.indexOf("timestamp");

//   // Pastikan kolom timestamp selalu di depan
//   if (timestampIndex > -1) {
//     allColumns.splice(timestampIndex, 1);
//     allColumns.unshift("timestamp");
//   }

//   return (
//     <section className="table-section">
//       <h3>{title}</h3>
//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               {allColumns.map((col, i) => <th key={i}>{col}</th>)}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, i) => (
//               <tr key={i}>
//                 {allColumns.map((col, idx) => (
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
//         <button onClick={() => onPageChange(page - 1)} disabled={page === 0}> Prev</button>
//         <span>Page {page + 1} of {totalPages}</span>
//         <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}>Nxt</button>
//       </div>
//     </section>
//   );
// };

// export default TableSection;


import React from "react";

const TableSection = ({
  title,
  data,
  fullData,
  columns,
  page,
  totalPages,
  onPageChange,
}) => {
  const exportToCSV = () => {
    if (!fullData || fullData.length === 0) return;

    let csvContent = columns.join(",") + "\n";
    fullData.forEach((row) => {
      const rowData = columns.map((col) => {
        let cell = row[col];
        if (typeof cell === "number") cell = cell.toFixed(2);
        if (cell == null) cell = "";
        if (typeof cell === "string" && cell.includes(",")) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      });
      csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}_all.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <section className="table-section">
        <h3>{title}</h3>
        <p>Tidak ada data</p>
      </section>
    );
  }

  return (
    <section className="table-section">
      <h3>{title}</h3>

      <button
        onClick={exportToCSV}
        style={{
          marginBottom: "10px",
          padding: "6px 12px",
          backgroundColor: "#3f51b5",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Download CSV
      </button>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                {columns.map((col, idx) => (
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
        <button onClick={() => onPageChange(page - 1)} disabled={page === 0}>
          Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          Nxt
        </button>
      </div>
    </section>
  );
};

export default TableSection;
