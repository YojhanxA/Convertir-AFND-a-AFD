import React from "react";

// Dibuja un overlay SVG con aristas y puntas. Recibe nodos con posiciones absolutas y edges con source/target ids.
export default function SvgOverlay({
  nodes = [],
  edges = [],
  className = "",
  transform = "",
}) {
  const nodeMap = {};
  nodes.forEach((n) => (nodeMap[n.id] = n));

  const paths = edges
    .map((e) => {
      const s = nodeMap[e.source];
      const t = nodeMap[e.target];
      if (!s || !t) return null;
      const sx = s.position.x + (s.width || 46) / 2;
      const sy = s.position.y + (s.height || 46) / 2;
      const tx = t.position.x + (t.width || 46) / 2;
      const ty = t.position.y + (t.height || 46) / 2;

      // control points para curva
      const dx = tx - sx;
      const dy = ty - sy;
      const mx = sx + dx * 0.5;
      const my = sy + dy * 0.5 - Math.min(80, Math.abs(dx) / 2);
      const path = `M ${sx} ${sy} Q ${mx} ${my} ${tx} ${ty}`;

      return { id: e.id, path, sx, sy, tx, ty, label: e.label };
    })
    .filter(Boolean);

  return (
    <svg
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
        transformOrigin: "0 0",
        transform: transform || undefined,
        zIndex: 0,
      }}
    >
      <defs>
        <marker
          id="overlay-arrow"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L12,6 L0,12 z" fill="#0f172a" />
        </marker>
      </defs>
      {paths.map((p) => (
        <g key={p.id}>
          <path
            d={p.path}
            stroke="#0f172a"
            strokeWidth={3}
            fill="none"
            markerEnd={`url(#overlay-arrow)`}
          />
          {p.label && (
            <text
              x={(p.sx + p.tx) / 2}
              y={(p.sy + p.ty) / 2 - 8}
              textAnchor="middle"
              style={{ fontSize: 12, fontWeight: 600, fill: "#9a3412" }}
            >
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
