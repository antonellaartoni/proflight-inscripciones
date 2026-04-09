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
- **Prerequisito de licencia (Piloto Comercial)**: Le planteé el problema de dominio — en Argentina, el acceso a Piloto Comercial requiere tener Piloto Privado (RAA 61.113) — y le pregunté qué opciones había para implementar una validación de documentación sin backend ni servicios externos. Me presentó tres opciones con sus trade-offs (solo metadata, preview en memoria, base64 en localStorage) y elegí la combinación de las dos primeras: preview visual sin persistencia del binario.
- **Documentación de ingreso (Piloto Privado)**: Planteé que el curso de Piloto Privado también tiene requisitos documentales, y que la documentación varía según si el alumno completó el secundario o no. Discutí con Claude si usar la edad como criterio — él propuso calcularla desde una fecha de nacimiento — pero lo descarté porque un alumno técnico de 17-18 años puede seguir cursando sin tener el analítico. Decidí preguntar directamente si completó el secundario y mostrar condicionalmente el documento correspondiente.
- **Árbol de prerequisitos completo**: Extendí la lógica de documentación a los cuatro cursos. Para Instrumento y Navegación le consulté a Claude cuál era el prerequisito correcto en Argentina y confirmamos que es la Licencia de Piloto Comercial (RAA 61.65), ya que IFR es una habilitación adicional que no puede hacerse con Piloto Privado solo. Para Helicóptero, el término correcto es Licencia de Piloto Privado de Helicóptero (LPPH), regulada bajo la Subparte H del RAA Part 61 — rama completamente separada de la aviación de ala fija.
- **Filtro por tabs en Lista de Inscriptos**: Planteé agregar un sistema de filtro para no mostrar todos los inscriptos mezclados. Elegí tabs sobre un select porque con 4 cursos fijos los tabs permiten mostrar el contador de inscriptos por curso directamente en la interfaz, sin necesidad de abrir un dropdown. Claude propuso además ocultar la columna "Curso" al filtrar — la acepté pero con una corrección: los badges de documentación deben seguir visibles aunque el nombre del curso se oculte, por lo que la celda siempre renderiza y solo cambia el encabezado de "Curso" a "Documentación".
- **Rediseño visual**: Le pedí a Claude que propusiera una paleta más profesional para una escuela de aviación. Sugirió negro, blanco y dorado con glassmorphism. Acepté la dirección general pero decidí el tono exacto del dorado (`#C9A84C`) y que los emojis decorativos se reemplazaran por tipografía y elementos geométricos. También definí que el color dorado se registre en `tailwind.config.js` como variable reutilizable en lugar de usar valores arbitrarios en cada clase.
- **Bloque de contacto en Lista de Cursos**: Le pregunté a Claude dónde tenía más sentido ubicar la información de contacto. Discutimos tres opciones (página separada, footer global, bloque contextual en cursos) y elegí la tercera porque es el único punto del flujo donde el usuario está evaluando si inscribirse. En el formulario, el dashboard y la lista de inscriptos ya tomó la decisión — el contacto ahí no aporta valor.
- **Página 404 y título**: Le pedí que agregara una ruta catch-all para URLs no definidas y que corrigiera el título de la pestaña. Ambos son detalles que el enunciado no pide pero que cualquier producto real tiene — una pantalla en blanco o una pestaña que dice "React App" rompe la ilusión de que esto es un sistema real.

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
- La decisión de **no usar la edad** para determinar qué documentación pedir al Piloto Privado — Claude propuso calcular la edad desde una fecha de nacimiento, pero identifiqué que eso no cubre el caso de alumnos técnicos de 17-18 años que siguen cursando. Preguntar directamente es más preciso y no asume nada sobre la situación del alumno

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

## Selector de rol (Alumno / Administrador)

Le pedí a Claude que propusiera e implementara un sistema de selección de perfil como último feature antes de la entrega. El resultado:

- **`SelectorRol.jsx`** (nuevo): Pantalla de bienvenida con dos cards — Alumno y Administrador — con el mismo lenguaje visual glass/gold de toda la app. Cada card muestra las secciones a las que da acceso el perfil.
- **`AppContext.jsx`**: Se agregó `rol: null` al estado inicial y la acción `SET_ROL` al reducer. No se persiste en `localStorage` a propósito — el rol es temporal por diseño.
- **`App.js`**: Si `state.rol === null`, renderiza `SelectorRol` antes del `BrowserRouter`. Si el rol está definido, monta el router normalmente. Las rutas `/inscriptos` y `/dashboard` tienen un guardián: si el rol es `"alumno"`, redirigen a `/cursos`.
- **`Navbar.jsx`**: Cada link tiene una propiedad `roles` que lista qué perfiles pueden verlo. La navbar filtra en base a `state.rol`. Se agregó un separador y un botón "Cambiar rol" que despacha `SET_ROL` con `null`, volviendo al selector.

**Decisión clave**: Este selector es UX, no autenticación. No hay contraseñas, tokens ni sesiones. Si el sistema fuera a producción, este selector sería reemplazado por un login real — pero para el contexto del ejercicio, es una forma honesta de mostrar que el sistema puede tener distintas vistas según el tipo de usuario.

---

## Algo que aprendí usando Claude como herramienta

Aprendí la diferencia entre **estado derivado** y **estado almacenado**. Mi primer instinto fue guardar `cuposDisponibles` directamente en el objeto de cada curso y actualizarlo al inscribir o cancelar. Claude me explicó que eso genera inconsistencias: si se cancela una inscripción y por error no se actualiza el campo, el dato queda desincronizado.

La solución correcta es calcular `cuposDisponibles` en tiempo real restando las inscripciones activas del `cupoMaximo`. Así hay una sola fuente de verdad y es imposible que los datos queden inconsistentes.

También aprendí a usar Claude no solo para generar código, sino para **explorar opciones antes de implementar**. En la feature de prerequisitos, antes de escribir una línea le pedí que me listara los trade-offs de cada approach. Eso me permitió tomar una decisión informada en lugar de implementar lo primero que se me ocurrió y tener que reescribirlo después.
