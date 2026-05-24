export const ejemplos = [
  {
    nombre: "Ejemplo 1 - epsilon y no determinismo",
    estados: "q0 q1 q2",
    alfabeto: "a b",
    estadoInicial: "q0",
    estadosFinales: "q2",
    transiciones: `q0,a,q0|q1
q0,b,q0
q1,b,q2
q1,ε,q2`,
  },
  {
    nombre: "Ejemplo 2 - simple no determinístico",
    estados: "A B C",
    alfabeto: "0 1",
    estadoInicial: "A",
    estadosFinales: "C",
    transiciones: `A,0,A|B
A,1,A
B,1,C`,
  },
  {
    nombre: "Ejemplo 3 - ya determinístico (AFD)",
    estados: "s0 s1",
    alfabeto: "a b",
    estadoInicial: "s0",
    estadosFinales: "s1",
    transiciones: `s0,a,s1
s0,b,s0
s1,a,s1
s1,b,s1`,
  },
];
