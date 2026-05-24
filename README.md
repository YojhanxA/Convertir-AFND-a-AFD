# Conversor AFND → AFD

Aplicación React + Vite para convertir Autómatas Finitos No Determinísticos (AFND) en Autómatas Finitos Determinísticos (AFD).

Características principales:

- Entrada de estados, alfabeto, estado inicial, estados finales y transiciones.
- Validación para detectar si el autómata ya es determinístico (AFD).
- Detección de transiciones epsilon.
- Visualización con React Flow (diagramas de burbujas, estados finales con fondo diferente).
- Algoritmo de subconjuntos con pasos y tabla de transiciones.
- Ejemplos precargados y botón limpiar.

Ejecución:

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en desarrollo:

```bash
npm run dev
```

Explicación del algoritmo (resumen):

- Se calcula la cerradura epsilon del estado inicial.
- Se generan estados del AFD como subconjuntos de estados del AFND (cerraduras incluidas).
- Para cada nuevo subconjunto y para cada símbolo del alfabeto se calcula el conjunto de estados alcanzables (mover) y su cerradura epsilon.
- Si aparece un subconjunto vacío se añade un estado trampa o error referenciado con el simbolo ∅.
- Se marcan como finales aquellos subconjuntos que contengan algún estado final del AFND.

Archivos importantes:

- `src/utils/automata.js`: parsing, validación y algoritmo de conversión.
- `src/components/GraphView.jsx`: visualización con React Flow.
- `src/components/AutomataForm.jsx`: formulario de entrada.
- `src/components/ConversionSteps.jsx`: pasos y tabla de transición.


