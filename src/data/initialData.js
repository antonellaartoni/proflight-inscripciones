// cupoMaximo es el límite fijo de cada curso.
// Los cupos disponibles se calculan dinámicamente en el contexto
// restando las inscripciones activas, para evitar inconsistencias.
export const cursosIniciales = [
  { id: 1, nombre: "Piloto Privado",           duracion: "6 meses",  cupoMaximo: 10 },
  { id: 2, nombre: "Piloto Comercial",          duracion: "12 meses", cupoMaximo: 8  },
  { id: 3, nombre: "Instrumento y Navegación",  duracion: "3 meses",  cupoMaximo: 12 },
  { id: 4, nombre: "Piloto de Helicóptero",     duracion: "8 meses",  cupoMaximo: 6  },
];

export const inscripcionesIniciales = [];
