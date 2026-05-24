// Utilidades y algoritmo para validar y convertir AFND -> AFD
export const EPSILON = "ε";

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

export function parseAutomata({
  estados,
  alfabeto,
  estadoInicial,
  estadosFinales,
  transicionesText,
  transiciones, // aceptar también `transiciones` desde el formulario
}) {
  // espera strings; devuelve estructura normalizada
  const limpiar = (s) =>
    String(s ?? "")
      .trim()
      .replace(/[{}]/g, "");
  const lista = (str) =>
    uniq(
      String(str || "")
        .split(/[,;\s]+/)
        .map(limpiar),
    );

  const estadosList = lista(estados);
  const alfabetoList = lista(alfabeto)
    .map((sym) => normalizeSymbol(sym))
    .filter((s) => s !== EPSILON);
  const inicial = limpiar(estadoInicial);
  const finales = lista(estadosFinales);

  const automata = {
    estados: estadosList,
    alfabeto: alfabetoList,
    estadoInicial: inicial,
    estadosFinales: finales,
    transiciones: {},
  };

  const rawTrans = transicionesText || transiciones || "";
  const lines = String(rawTrans).split(/\r?\n/);
  lines.forEach((ln, i) => {
    const line = ln.trim();
    if (!line || line.startsWith("#")) return;
    const parts = line.replace(/->/g, ",").replace(/;/g, ",").split(",");
    if (parts.length < 3)
      throw new Error(
        `Línea ${i + 1} inválida. Uso: origen,simbolo,destino1|destino2`,
      );
    const origen = limpiar(parts[0]);
    const simbolo = normalizeSymbol(parts[1]);
    const destPart = parts.slice(2).join(",");
    const destinos = uniq(destPart.split(/[|/]/).map(limpiar));
    if (!automata.transiciones[origen]) automata.transiciones[origen] = {};
    if (!automata.transiciones[origen][simbolo])
      automata.transiciones[origen][simbolo] = [];
    destinos.forEach((d) => {
      if (!automata.transiciones[origen][simbolo].includes(d))
        automata.transiciones[origen][simbolo].push(d);
    });
  });

  return automata;
}

export function normalizeSymbol(s) {
  const str = String(s || "").trim();
  const low = str.toLowerCase();
  if (!str) return "";
  if (["ε", "epsilon", "eps", "e"].includes(low)) return EPSILON;
  return str;
}

// Validación: detecta errores y determinismo
export function validarAutomata(automata) {
  const errores = [];
  const razones = [];
  let esNoDet = false;

  if (!automata.estados.includes(automata.estadoInicial))
    errores.push(`El estado inicial '${automata.estadoInicial}' no existe.`);
  automata.estadosFinales.forEach((f) => {
    if (!automata.estados.includes(f))
      errores.push(`El estado final '${f}' no existe.`);
  });

  Object.entries(automata.transiciones).forEach(([origen, map]) => {
    if (!automata.estados.includes(origen))
      errores.push(`El estado '${origen}' no está en la lista de estados.`);
    Object.entries(map).forEach(([simbolo, dests]) => {
      if (simbolo === EPSILON) {
        esNoDet = true;
        razones.push(`Transición epsilon desde ${origen}`);
      }
      if (simbolo !== EPSILON && !automata.alfabeto.includes(simbolo))
        errores.push(`Símbolo '${simbolo}' no pertenece al alfabeto.`);
      if (dests.length > 1) {
        esNoDet = true;
        razones.push(
          `Múltiples destinos desde ${origen} con símbolo '${simbolo}'`,
        );
      }
      dests.forEach((d) => {
        if (!automata.estados.includes(d))
          errores.push(`Destino '${d}' no existe.`);
      });
    });
  });

  return { errores, razones, esNoDeteterministico: esNoDet };
}

// Estructura del AFD resultante con pasos
export function convertirAFNDaAFD(automata) {
  // Subconjuntos con cerradura de epsilon
  const cerrarEps = (estList) => {
    const pila = [...estList];
    const cerr = new Set(estList.filter(Boolean));
    while (pila.length) {
      const e = pila.pop();
      const trans = automata.transiciones[e] || {};
      const epsDests = trans[EPSILON] || [];
      epsDests.forEach((d) => {
        if (!cerr.has(d)) {
          cerr.add(d);
          pila.push(d);
        }
      });
    }
    return Array.from(cerr).sort();
  };

  const mover = (estList, simbolo) => {
    const res = new Set();
    estList.forEach((e) => {
      const trans = automata.transiciones[e] || {};
      (trans[simbolo] || []).forEach((d) => res.add(d));
    });
    return Array.from(res).sort();
  };

  const alfabet = automata.alfabeto;
  const inicialCerr = cerrarEps([automata.estadoInicial]);
  const estadosConj = [];
  const nombres = {};
  const keyOf = (arr) => (arr.length ? arr.join("|") : "∅");
  const nameOf = (arr) => (arr.length ? `{${arr.join(",")}}` : "∅");

  const queue = [inicialCerr];
  estadosConj.push(inicialCerr);
  nombres[keyOf(inicialCerr)] = nameOf(inicialCerr);

  const pasos = [];

  while (queue.length) {
    const conjunto = queue.shift();
    const clave = keyOf(conjunto);
    const row = { conjunto: nameOf(conjunto), transiciones: {} };
    alfabet.forEach((sym) => {
      const mov = mover(conjunto, sym);
      const cerr = cerrarEps(mov);
      const clave2 = keyOf(cerr);
      if (!nombres[clave2]) {
        nombres[clave2] = nameOf(cerr);
        estadosConj.push(cerr);
        queue.push(cerr);
      }
      row.transiciones[sym] = nameOf(cerr);
    });
    pasos.push(row);
  }

  // Construir AFD final
  const afd = {
    estados: [],
    alfabeto: [...alfabet],
    estadoInicial: nameOf(inicialCerr),
    estadosFinales: [],
    transiciones: {},
  };
  estadosConj.forEach((conj) => {
    const nombre = nameOf(conj);
    afd.estados.push(nombre);
    afd.transiciones[nombre] = {};
    if (conj.some((s) => automata.estadosFinales.includes(s)))
      afd.estadosFinales.push(nombre);
  });

  pasos.forEach((p) => {
    const origen = p.conjunto;
    afd.transiciones[origen] = p.transiciones;
  });

  return { afd, pasos };
}
