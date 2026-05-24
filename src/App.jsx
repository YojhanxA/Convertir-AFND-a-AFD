import React, { useState } from "react";
import AutomataForm from "./components/AutomataForm";
import GraphView from "./components/GraphView";
import ConversionSteps from "./components/ConversionSteps";
import AFDTable from "./components/AFDTable";
import { ejemplos } from "./utils/examples";
import {
  parseAutomata,
  validarAutomata,
  convertirAFNDaAFD,
} from "./utils/automata";

export default function App() {
  const [afnd, setAfnd] = useState(null);
  const [afd, setAfd] = useState(null);
  const [mensaje, setMensaje] = useState("Carga un ejemplo o define un AFND.");
  const [pasos, setPasos] = useState([]);
  const [validacion, setValidacion] = useState(null);

  function handleParse(datos) {
    try {
      const aut = parseAutomata(datos);
      const val = validarAutomata(aut);
      setValidacion(val);
      if (val.errores.length) {
        setMensaje("Errores: " + val.errores.join("; "));
        setAfnd(null);
        setAfd(null);
        setPasos([]);
        return;
      }
      // Determinar si es no determinístico: usar tanto el flag como las razones
      const esNoDet = Boolean(
        val.esNoDeterministico || (val.razones && val.razones.length > 0),
      );
      if (!esNoDet) {
        setMensaje(
          "El autómata ingresado es determinístico (AFD). No se convierte automáticamente.",
        );
        setAfnd(aut);
        console.log(JSON.stringify(aut, null, 2));
        setAfd(null);
        setPasos([]);
        return;
      }

      setAfnd(aut);
      console.log("AUTOMATA:", aut);
      const { afd: resultadoAFD, pasos: pas } = convertirAFNDaAFD(aut);
      setAfd(resultadoAFD);
      setPasos(pas);
      setMensaje("Conversión completa. Revise el AFD y la tabla de pasos.");
    } catch (e) {
      setMensaje("Error: " + e.message);
      setAfnd(null);
      setAfd(null);
      setPasos([]);
    }
  }

  function handleClear() {
    setAfnd(null);
    setAfd(null);
    setPasos([]);
    setMensaje("Limpio.");
  }

  function handleForceShowAFD() {
    if (!afnd) {
      setMensaje("No hay AFND cargado. Cargue o defina uno.");
      return;
    }
    try {
      const { afd: resultadoAFD, pasos: pas } = convertirAFNDaAFD(afnd);
      setAfd(resultadoAFD);
      setPasos(pas);
      setMensaje("AFD forzado mostrado.");
    } catch (e) {
      setMensaje("Error forzando AFD: " + e.message);
    }
  }

  return (
    <div className="app-shell min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Conversor AFND → AFD</h1>
            <p className="text-sm text-slate-600">
              Valida y convierte autómatas no determinísticos con pasos y
              visualización.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-1">
            <AutomataForm
              onParse={handleParse}
              ejemplos={ejemplos}
              onClear={handleClear}
              onLoadEjemplo={(n) => setMensaje("Cargado: " + n)}
            />
            <div className="mt-4 p-3 bg-white rounded shadow">
              <div className="font-medium">Estado</div>
              <div className="text-sm text-slate-600">{mensaje}</div>
              {validacion && (
                <div className="mt-3 text-xs text-slate-500">
                  <div className="font-semibold">Detalles de validación:</div>
                  {validacion.errores.length > 0 ? (
                    <div>Errores: {validacion.errores.join("; ")}</div>
                  ) : (
                    <div>
                      Razones: {validacion.razones.join("; ") || "Ninguna"}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-sm"
                  onClick={handleForceShowAFD}
                >
                  Forzar mostrar AFD
                </button>
                <button
                  className="px-3 py-1 bg-slate-50 text-slate-700 rounded text-sm"
                  onClick={() => {
                    console.log("AFND debug", afnd);
                    alert("Ver consola para debug AFND");
                  }}
                >
                  Ver debug (console)
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 font-semibold">AFND</h3>
                <GraphView automata={afnd} />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">AFD resultante</h3>
                <GraphView automata={afd} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ConversionSteps pasos={pasos} />
              <AFDTable afd={afd} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
