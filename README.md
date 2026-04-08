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

### Prerequisito: Licencia de Piloto Privado

Al seleccionar el curso **Piloto Comercial**, el formulario muestra una sección adicional que requiere adjuntar la licencia de Piloto Privado vigente. Esto refleja la normativa aeronáutica argentina (RAA 61.113), que exige contar con esa habilitación previa antes de acceder a la instrucción comercial.

El archivo (PDF, JPG o JPEG, máx. 3 MB) se valida en el cliente y se muestra una preview antes del envío. El contenido binario **no se almacena** — solo se guarda el nombre del archivo junto a la inscripción como referencia. Si el usuario cambia a otro curso, la sección y el archivo se limpian automáticamente.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx          # Barra de navegación con link activo
│   ├── CursoCard.jsx       # Tarjeta de curso con barra de ocupación
│   └── InscriptoRow.jsx    # Fila de la tabla de inscriptos
├── context/
│   └── AppContext.jsx      # Estado global con useReducer + persistencia
├── data/
│   └── initialData.js      # Datos iniciales de cursos
└── pages/
    ├── ListaCursos.jsx      # Grilla de cursos disponibles
    ├── Inscripcion.jsx      # Formulario de inscripción
    ├── ListaInscriptos.jsx  # Tabla de inscriptos
    └── Dashboard.jsx        # Panel de métricas
```

---

## Decisiones de diseño

- **Estado derivado vs. almacenado**: `cuposDisponibles` se calcula en tiempo real restando inscripciones del `cupoMaximo`. No se guarda como dato separado para evitar inconsistencias.
- **Persistencia sin backend**: Las inscripciones se guardan en `localStorage` y se recuperan al recargar la página. Los cursos son fijos (datos en memoria).
- **Pre-selección de curso**: Al hacer click en "Inscribirse" desde una tarjeta, el formulario pre-selecciona el curso mediante un query parameter en la URL (`?cursoId=X`).
- **Archivo de licencia en memoria, no en storage**: El contenido del archivo se usa solo para preview (`URL.createObjectURL`). No se convierte a base64 ni se guarda en `localStorage` para evitar superar el límite de ~5 MB. Solo el nombre del archivo se persiste junto a la inscripción.
- **Prerequisito basado en ID de curso**: La validación de licencia se activa comparando el `cursoId` seleccionado contra una constante (`CURSO_PILOTO_COMERCIAL_ID = 2`), definida al inicio del archivo para facilitar su mantenimiento.
