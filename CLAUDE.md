# CLAUDE.md — Cómo usé Claude en este proyecto

## Herramienta utilizada

Usé **Claude Code** (claude.ai/code), la CLI oficial de Anthropic, directamente integrada en VS Code. Esto me permitió trabajar con Claude dentro del editor, con acceso al árbol de archivos y contexto del proyecto completo.

---

## Qué le pedí a Claude

Le pedí a Claude que me ayudara a construir la aplicación paso a paso, empezando por la arquitectura y luego implementando cada módulo. Algunos ejemplos concretos de lo que le pedí:

- **Arquitectura global**: Le pregunté cómo estructurar el estado compartido entre las 4 páginas (cursos e inscripciones). Me propuso `useReducer` + Context API en lugar de un estado local en cada componente.
- **Validaciones del formulario**: Le pedí que implementara validación de campos obligatorios, formato de email con regex, y verificación de cupos disponibles antes de aceptar el submit.
- **Persistencia en localStorage**: Le pregunté si era posible que los datos sobrevivieran a un refresh de la página sin usar una base de datos. Sugirió guardar las inscripciones en `localStorage` dentro de un `useEffect`.
- **Dashboard**: Le pedí que generara un panel de resumen con métricas calculadas del estado, ordenando los cursos por demanda.
- **Prerequisito de licencia**: Le planteé el problema de dominio — en Argentina, el acceso a Piloto Comercial requiere tener Piloto Privado (RAA 61.113) — y le pregunté qué opciones había para implementar una validación de documentación sin backend ni servicios externos. Me presentó tres opciones con sus trade-offs (solo metadata, preview en memoria, base64 en localStorage) y elegí la combinación de las dos primeras: preview visual sin persistencia del binario.

---

## Qué modificó Claude vs. qué modifiqué yo

### Claude generó:
- La estructura base del `AppContext.jsx` con el reducer y las acciones `INSCRIBIR` y `CANCELAR_INSCRIPCION`
- El componente `CursoCard` con la barra de ocupación y la lógica de colores condicionales
- La estructura de la tabla en `ListaInscriptos`
- Los comentarios explicativos en el código

### Yo modifiqué o decidí:
- El orden de las columnas en la tabla de inscriptos (puse apellido primero, que es la convención en listas de alumnos)
- La decisión de separar `InscriptoRow` como componente propio en lugar de un map inline dentro de la tabla
- Cambié el color de la tarjeta "cursos llenos" en el Dashboard para que sea `slate` (neutral) cuando el valor es 0, en lugar de rojo, porque mostrar rojo con valor 0 generaba una falsa alarma visual
- Los textos de los mensajes de error y feedback al usuario
- La feature de prerequisito de licencia fue una iniciativa propia, no pedida en el enunciado. La incorporé porque refleja una restricción real del dominio aeronáutico argentino y agrega valor real al sistema
- La decisión de **no** guardar el binario en localStorage — Claude generó una primera versión que convertía el archivo a base64, pero rechacé ese approach porque localStorage tiene un límite de ~5 MB y un PDF de licencia puede superarlo fácilmente, rompiendo la persistencia de todas las inscripciones en silencio

---

## Algo que Claude generó mal y cómo lo corregí

En una primera versión del Dashboard, Claude ordenó los cursos por porcentaje de ocupación en lugar de por cantidad absoluta de inscriptos. El resultado era confuso: un curso con 2/2 inscriptos aparecía antes que uno con 8/10, a pesar de que el segundo tiene más demanda real.

Lo corregí cambiando `.sort((a, b) => b.porcentaje - a.porcentaje)` por `.sort((a, b) => b.inscriptos - a.inscriptos)`, que ordena por número absoluto de inscriptos y refleja mejor la demanda real de cada curso.

---

## Algo que Claude generó mal y cómo lo corregí (segunda instancia)

En la implementación de la preview de archivo, Claude usó `URL.createObjectURL` pero no incluyó la limpieza de esa URL al desmontar el componente. Eso causa una pérdida de memoria progresiva: cada vez que el usuario cambia de archivo, la URL anterior queda referenciada en memoria sin liberarse.

Lo corregí agregando el cleanup dentro del `useEffect`:

```js
return () => URL.revokeObjectURL(url);
```

Esta función de limpieza se ejecuta automáticamente antes de que el efecto corra de nuevo o cuando el componente se desmonta, asegurando que el navegador libere la referencia al objeto en memoria.

---

## Algo que aprendí usando Claude como herramienta

Aprendí la diferencia entre **estado derivado** y **estado almacenado**. Mi primer instinto fue guardar `cuposDisponibles` directamente en el objeto de cada curso y actualizarlo al inscribir o cancelar. Claude me explicó que eso genera inconsistencias: si se cancela una inscripción y por error no se actualiza el campo, el dato queda desincronizado.

La solución correcta es calcular `cuposDisponibles` en tiempo real restando las inscripciones activas del `cupoMaximo`. Así hay una sola fuente de verdad y es imposible que los datos queden inconsistentes.

También aprendí a usar Claude no solo para generar código, sino para **explorar opciones antes de implementar**. En la feature de prerequisitos, antes de escribir una línea le pedí que me listara los trade-offs de cada approach. Eso me permitió tomar una decisión informada en lugar de implementar lo primero que se me ocurrió y tener que reescribirlo después.
