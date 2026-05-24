import React from "react";

export default function ConversionSteps({ pasos }) {
  if (!pasos) return null;
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-3">
        Pasos de construcción de subconjuntos
      </h3>
      <div className="space-y-3 max-h-72 overflow-auto">
        {pasos.map((p, idx) => (
          <div key={idx} className="border rounded p-3">
            <div className="font-medium">
              Estado: <span className="text-indigo-600">{p.conjunto}</span>
            </div>
            <table className="w-full mt-2 text-sm table-fixed">
              <thead>
                <tr className="text-left">
                  <th>Símbolo</th>
                  <th>Destino</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(p.transiciones).map(([s, d]) => (
                  <tr key={s}>
                    <td className="pr-4">{s}</td>
                    <td>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
