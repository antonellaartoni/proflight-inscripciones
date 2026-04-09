# ProFlight ✈️ — Sistema de Inscripciones

Aplicación web para gestionar las inscripciones a cursos de una escuela de aviación.
Desarrollada como ejercicio técnico con React y Claude AI.

---

## Tecnologías

- **React 19** con hooks (`useState`, `useReducer`, `useEffect`, `useContext`)
- **React Router v7** para navegación entre páginas
- **Tailwind CSS v3** para estilos
- **localStorage** para persistencia de datos sin backend

---

## Cómo correr el proyecto

### Requisitos
- Node.js 18 o superior
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd escuela-aviacion

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm start
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

---

## Secciones de la app

| Ruta | Descripción |
|---|---|
| `/cursos` | Lista de cursos disponibles con cupos en tiempo real |
| `/inscripcion` | Formulario de inscripción con validaciones y prerequisitos |
| `/inscriptos` | Tabla de inscriptos con opción de cancelar |
| `/dashboard` | Panel de resumen con métricas y demanda por curso |
| `*` | Página 404 para rutas no definidas |

### Prerequisitos y documentación por curso

El formulario adapta los requisitos documentales según el curso seleccionado:

El árbol de prerequisitos refleja la normativa aeronáutica argentina (RAA Part 61):

```
Piloto Privado            → DNI + doc. secundario (analítico o certificado de alumno regular)
    └── Piloto Comercial        → Licencia de Piloto Privado (RAA 61.113)
            └── Instr. y Nav.  → Licencia de Piloto Comercial (RAA 61.65)

Piloto de Helicóptero     → Licencia de Piloto Privado de Helicóptero / LPPH (RAA 61, Subparte H)
```

**Piloto Privado**
Requiere DNI y documentación del nivel secundario. El formulario pregunta explícitamente si el alumno completó el secundario en lugar de inferirlo por la edad — un alumno técnico de 17-18 años puede seguir cursando sin tener el analítico:
- Si completó el secundario → **Analítico del Secundario**
- Si no lo completó → **Certificado de Alumno Regular**

**Piloto Comercial**
Requiere la **Licencia de Piloto Privado vigente** (RAA 61.113).

**Instrumento y Navegación (IFR)**
Es una habilitación adicional de vuelo por instrumentos, no un curso de base. Requiere la **Licencia de Piloto Comercial vigente** (RAA 61.65).

**Piloto de Helicóptero**
Rama separada de la aviación de ala fija. Requiere la **Licencia de Piloto Privado de Helicóptero (LPPH)** vigente, conforme a la Subparte H del RAA Part 61.

En todos los casos, los archivos (PDF, JPG o JPEG, máx. 3 MB) se validan en el cliente con preview visual. El contenido binario no se almacena — solo el nombre del archivo. Al cambiar de curso, toda la documentación se limpia automáticamente.

### Filtro por curso en Lista de Inscriptos

La página de inscriptos incluye tabs de filtro, uno por curso más "Todos". Cada tab muestra un badge con la cantidad de inscriptos. Al filtrar por curso específico, la columna "Curso" de la tabla se reemplaza por "Documentación" para evitar información redundante, mientras que los badges de archivos adjuntos siempre se muestran.

### Bloque de contacto en Lista de Cursos

Al final de `/cursos`, debajo de la grilla de tarjetas, aparece un bloque de contacto con email y teléfono de la escuela. Se ubicó específicamente en esa página porque es donde el usuario está evaluando opciones y es más probable que surja una duda — no tiene sentido mostrarlo en el Dashboard, la tabla de inscriptos o el formulario. El email es un enlace `mailto:` funcional.

---

### Selector de rol (Alumno / Administrador)

Al abrir la app, se muestra una pantalla de selección de perfil con dos opciones:

- **Alumno**: accede a Cursos e Inscripción
- **Administrador**: accede a todas las secciones (Cursos, Inscripción, Inscriptos, Dashboard)

El rol se guarda en el estado global (Context) pero **no se persiste en localStorage** — cada sesión empieza desde la pantalla de selección. Esto es intencional: si el sistema estuviera en producción, esta pantalla sería reemplazada por una autenticación real. Por ahora cumple la función de adaptar la interfaz al tipo de usuario.

La Navbar filtra los links según el rol activo y muestra un botón "Cambiar rol" que devuelve al selector. Si un alumno intenta acceder a `/inscriptos` o `/dashboard` por URL directa, es redirigido automáticamente a `/cursos`.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx          # Barra de navegación con links filtrados por rol
│   ├── CursoCard.jsx       # Tarjeta de curso con barra de ocupación
│   ├── InscriptoRow.jsx    # Fila de la tabla de inscriptos
│   └── SelectorRol.jsx     # Pantalla de selección de perfil (Alumno / Admin)
├── context/
│   └── AppContext.jsx      # Estado global con useReducer + persistencia + rol
├── data/
│   └── initialData.js      # Datos iniciales de cursos
└── pages/
    ├── ListaCursos.jsx      # Grilla de cursos disponibles
    ├── Inscripcion.jsx      # Formulario de inscripción
    ├── ListaInscriptos.jsx  # Tabla de inscriptos
    ├── Dashboard.jsx        # Panel de métricas
    └── NotFound.jsx         # Página 404
```

---

## Decisiones de diseño

- **Estado derivado vs. almacenado**: `cuposDisponibles` se calcula en tiempo real restando inscripciones del `cupoMaximo`. No se guarda como dato separado para evitar inconsistencias.
- **Persistencia sin backend**: Las inscripciones se guardan en `localStorage` y se recuperan al recargar la página. Los cursos son fijos (datos en memoria).
- **Pre-selección de curso**: Al hacer click en "Inscribirse" desde una tarjeta, el formulario pre-selecciona el curso mediante un query parameter en la URL (`?cursoId=X`).
- **Archivos en memoria, no en storage**: El contenido de los archivos se usa solo para preview (`URL.createObjectURL`), con cleanup explícito via `URL.revokeObjectURL` en el `useEffect`. No se convierten a base64 ni se guardan en `localStorage`. Solo el nombre del archivo se persiste junto a la inscripción.
- **Prerequisitos basados en constantes de ID**: Las validaciones documentales se activan comparando el `cursoId` contra constantes definidas al inicio del archivo (`CURSO_PILOTO_PRIVADO_ID`, `CURSO_PILOTO_COMERCIAL_ID`), para facilitar el mantenimiento.
- **Secundario completo por declaración, no por edad**: En lugar de inferir si el alumno terminó el secundario por su edad, el formulario lo pregunta directamente. Un alumno técnico de 17-18 años puede seguir cursando sin tener el analítico — la edad no es un indicador confiable.
- **Rediseño visual negro/blanco/dorado con glassmorphism**: La paleta reemplaza el esquema azul/slate genérico por negro (`#08080f`), blanco y dorado (`#C9A84C`). Las cards usan `backdrop-blur` con fondo semitransparente. El color dorado se definió como variable en `tailwind.config.js` para usarlo consistentemente en toda la app.
- **Contacto contextual, no global**: El bloque de contacto se colocó solo en `/cursos` y no como footer global, porque es el único punto del flujo donde el usuario está evaluando si inscribirse — en el resto de las páginas ya tomó la decisión.
- **Página 404**: Una ruta catch-all (`path="*"`) captura cualquier URL no definida y muestra una página de error con un link de vuelta a `/cursos`. Evita que el usuario vea una pantalla en blanco si ingresa una ruta inexistente.
- **Título de la pestaña**: Se reemplazó el "React App" por defecto de Create React App por "ProFlight — Escuela de Aviación" en `public/index.html`.
- **Selector de rol como UX, no como auth**: El selector de Alumno / Administrador no es un sistema de login — no hay contraseñas ni tokens. Es una decisión de UX para adaptar la interfaz al tipo de usuario. El rol se almacena en Context (en memoria) y se descarta al recargar la página, reforzando que es temporal y no una sesión real.
