import React from "react";

export default function ArrowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEndId,
  data,
}) {
  // Fallback simple straight path and midpoint for label
  // ajustar endpoint para que la flecha quede fuera del nodo (no cubierta)
  const targetRadius = data?.targetRadius || 46; // radio estimado del nodo
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const adjTargetX = targetX - ux * targetRadius;
  const adjTargetY = targetY - uy * targetRadius;
  const edgePath = `M ${sourceX} ${sourceY} L ${adjTargetX} ${adjTargetY}`;
  const center = {
    x: (sourceX + adjTargetX) / 2,
    y: (sourceY + adjTargetY) / 2,
  };

  return (
    <g className="react-flow__edge">
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="9"
          refY="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L12,6 L0,12 z" fill={style.stroke || "#0f172a"} />
        </marker>
      </defs>
      <path
        id={id}
        d={edgePath}
        stroke={style.stroke || "#0f172a"}
        strokeWidth={style.strokeWidth || 3}
        fill="none"
        markerEnd={`url(#arrow-${id})`}
        vectorEffect="non-scaling-stroke"
      />
      {data?.label && (
        <g transform={`translate(${center.x}, ${center.y})`}>
          <rect
            x={-20}
            y={-14}
            width={40}
            height={18}
            rx={4}
            fill="#fff"
            stroke="none"
          />
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: 12, fill: "#9a3412", fontWeight: 600 }}
          >
            {data.label}
          </text>
        </g>
      )}
    </g>
  );
}
