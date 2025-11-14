import React from "react";
import "./info-table.css"

interface InfoTableProps {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}

export default function InfoTable({ headers, rows }: InfoTableProps) {
  return (
    <table className="info-table">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
