import React from 'react';

interface Symbol {
  variable: string;
  value: string;
  row: number;
  column: number;
}

interface SymbolTableProps {
  symbols: Symbol[];
}

const SymbolTable: React.FC<SymbolTableProps> = ({ symbols }) => (
  <table className="symbol-table">
    <thead>
      <tr>
        <th>No.</th>
        <th>Variable</th>
        <th>Valor</th>
        <th>Fila</th>
        <th>Columna</th>
      </tr>
    </thead>
    <tbody>
      {symbols.map((sym, idx) => (
        <tr key={idx}>
          <td>{idx + 1}</td>
          <td>{sym.variable}</td>
          <td>{sym.value}</td>
          <td>{sym.row}</td>
          <td>{sym.column}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default SymbolTable; 