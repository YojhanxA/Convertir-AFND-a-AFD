import React, { useState } from "react";

export default function AutomataForm({
  onParse,
  ejemplos,
  onLoadEjemplo,
  onClear,
}) {
  const [estados, setEstados] = useState("A B C");
  const [alfabeto, setAlfabeto] = useState("0 1");
  const [estadoInicial, setEstadoInicial] = useState("A");
  const [estadosFinales, setEstadosFinales] = useState("C");
  const [transiciones, setTransiciones] = useState(
    "A,0,A|B\nA,1,B|C\nB,0,B|C\nC,0,C",
  );

  // Exponer valores al padre
  function handleConvert() {
    onParse({ estados, alfabeto, estadoInicial, estadosFinales, transiciones });
  }

  function cargarEj(e) {
    const ex = ejemplos[e];
    if (!ex) return;
    setEstados(ex.estados);
    setAlfabeto(ex.alfabeto);
    setEstadoInicial(ex.estadoInicial);
    setEstadosFinales(ex.estadosFinales);
    setTransiciones(ex.transiciones);
    onLoadEjemplo && onLoadEjemplo(ex.nombre);
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Definir AFND</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-slate-200 rounded" onClick={onClear}>
            Limpiar
          </button>
          <button
            className="px-3 py-1 bg-indigo-600 text-white rounded"
            onClick={handleConvert}
          >
            Validar & Convertir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">
            Estados (separar por espacio/comas)
          </label>
          <input
            value={estados}
            onChange={(e) => setEstados(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            Alfabeto (separar por espacio/comas)
          </label>
          <input
            value={alfabeto}
            onChange={(e) => setAlfabeto(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Estado inicial</label>
          <input
            value={estadoInicial}
            onChange={(e) => setEstadoInicial(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Estados finales</label>
          <input
            value={estadosFinales}
            onChange={(e) => setEstadosFinales(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">
          Transiciones (una por línea: origen,simbolo,dest1|dest2)
        </label>
        <textarea
          value={transiciones}
          onChange={(e) => setTransiciones(e.target.value)}
          className="w-full border rounded p-2 mt-1 min-h-[120px]"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Ejemplos precargados:</label>
        {ejemplos.map((ex, idx) => (
          <button
            key={idx}
            className="px-2 py-1 bg-slate-100 rounded text-sm"
            onClick={() => cargarEj(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
