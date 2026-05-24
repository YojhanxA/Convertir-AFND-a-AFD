import React, { useEffect, useRef } from "react";

import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

export default function GraphView({ automata }) {
  const cyRef = useRef(null);

  useEffect(() => {
    if (!automata || !cyRef.current) return;

    const elements = [];

    // =========================
    // NODOS
    // =========================
    automata.estados.forEach((estado) => {
      elements.push({
        data: {
          id: estado,

          label: estado,

          // SOLO finales = 1
          isFinal: automata.estadosFinales.includes(estado) ? 1 : 0,

          isInitial: automata.estadoInicial === estado,
        },
      });
    });

    // =========================
    // TRANSICIONES
    // =========================
    Object.entries(automata.transiciones || {}).forEach(
      ([from, transitions]) => {
        Object.entries(transitions).forEach(([symbol, destinations]) => {
          const dests = Array.isArray(destinations)
            ? destinations
            : [destinations];

          dests.forEach((destination, index) => {
            elements.push({
              data: {
                id: `${from}-${destination}-${symbol}-${index}`,

                source: from,
                target: destination,

                label: symbol,
              },
            });
          });
        });
      },
    );

    // =========================
    // CYTOSCAPE
    // =========================
    const cy = cytoscape({
      container: cyRef.current,

      elements,

      style: [
        // =========================
        // NODOS NORMALES
        // =========================
        {
          selector: "node",

          style: {
            label: "data(label)",

            width: 70,
            height: 70,

            "background-color": "#ffffff",

            "border-width": 3,

            "border-color": "#2563eb",

            color: "#111827",

            "font-size": 16,

            "font-weight": "bold",

            "text-valign": "center",

            "text-halign": "center",
          },
        },

        // =========================
        // ESTADOS FINALES
        // =========================
        {
          selector: "node[?isFinal]",

          style: {
            "border-width": 8,

            "border-color": "#2563eb",
          },
        },

        // =========================
        // ESTADO INICIAL
        // =========================
        {
          selector: "node[isInitial]",

          style: {
            "background-color": "#dbeafe",
          },
        },

        // =========================
        // FLECHAS
        // =========================
        {
          selector: "edge",

          style: {
            label: "data(label)",

            width: 2,
            "loop-direction": "-10deg",
            "loop-sweep": "50deg",

            color: "#dc2626",

            "font-size": 14,

            "font-weight": "bold",

            "curve-style": "unbundled-bezier",

            "control-point-step-size": 40,

            "target-arrow-shape": "triangle",

            "line-color": "#4b5563",

            "target-arrow-color": "#4b5563",

            "text-background-color": "#ffffff",

            "text-background-opacity": 1,

            "text-background-padding": 2,

            "text-rotation": "autorotate",
          },
        },
      ],

      // =========================
      // LAYOUT
      // =========================
      layout: {
        name: "dagre",

        rankDir: "LR",

        spacingFactor: 2,

        nodeSep: 120,

        edgeSep: 80,

        rankSep: 180,

        animate: true,
      },
      wheelSensitivity: 4,
    });

    cy.fit();

    return () => {
      cy.destroy();
    };
  }, [automata]);

  return (
    <div
      ref={cyRef}
      style={{
        width: "100%",

        height: "500px",

        border: "1px solid #ddd",

        borderRadius: "12px",

        background: "white",
      }}
    />
  );
}
