import React from "react";

export default function AFDTable({ afd }) {
  if (!afd) return null;

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-3">Tabla del AFD</h3>
      <div className="text-sm mb-2">
        Estado inicial: <strong>{afd.estadoInicial}</strong>
      </div>
      <div className="text-sm mb-2">
        Estados finales: <strong>{afd.estadosFinales.join(", ")}</strong>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th>Estado</th>
            {afd.alfabeto.map((s, idx) => (
              <th key={idx} className="pl-4">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {afd.estados.map((estado, idx) => (
            <tr key={idx} className="border-b hover:bg-slate-50">
              <td className="py-2">{estado}</td>
              {afd.alfabeto.map((sym, i) => (
                <td key={i} className="pl-4">
                  {afd.transiciones[estado]?.[sym] ?? "∅"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
