export const ejemplos = [
  {
    nombre: "Ejemplo clase",
    estados: "A B C",
    alfabeto: "0 1",
    estadoInicial: "A",
    estadosFinales: "C",
    transiciones: `A,0,A|B
A,1,B|C
B,0,B|C
C,0,C`,
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
