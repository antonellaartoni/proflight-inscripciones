import { createContext, useContext, useReducer, useEffect } from "react";
import { cursosIniciales, inscripcionesIniciales } from "../data/initialData";

// Intentamos recuperar inscripciones guardadas en localStorage.
// Si no hay nada (primera vez), usamos el array vacío de initialData.
const estadoInicial = {
  cursos: cursosIniciales,
  inscripciones: JSON.parse(localStorage.getItem("inscripciones")) || inscripcionesIniciales,
  // null = no elegido aún (muestra el selector de rol).
  // No se persiste en localStorage: cada sesión arranca desde la pantalla de selección.
  rol: null,
};

function appReducer(state, action) {
  switch (action.type) {

    case "INSCRIBIR": {
      // Usamos Date.now() como ID único. En producción usaríamos UUID,
      // pero es suficiente para un sistema sin concurrencia real.
      const nuevaInscripcion = {
        id: Date.now(),
        cursoId: action.payload.cursoId,
        nombre: action.payload.nombre,
        apellido: action.payload.apellido,
        dni: action.payload.dni,
        email: action.payload.email,
        fechaInscripcion: new Date().toLocaleDateString("es-AR"),
        // Documentación por curso. Guardamos solo el nombre del archivo, no el binario.
        // Cada campo es null si el curso no lo requiere.
        licenciaArchivo:    action.payload.licenciaArchivo    || null, // Piloto Comercial → Licencia PP
        licenciaComercial:  action.payload.licenciaComercial  || null, // Instrumento y Nav → Licencia PC
        licenciaHelicoptero: action.payload.licenciaHelicoptero || null, // Helicóptero → Licencia PPH
        secundarioCompleto: action.payload.secundarioCompleto ?? null,  // Piloto Privado
        docDni:             action.payload.docDni             || null,  // Piloto Privado
        docSecundario:      action.payload.docSecundario      || null,  // Piloto Privado
      };
      return {
        ...state,
        inscripciones: [...state.inscripciones, nuevaInscripcion],
      };
    }

    case "SET_ROL": {
      return { ...state, rol: action.payload.rol };
    }

    case "CANCELAR_INSCRIPCION": {
      return {
        ...state,
        inscripciones: state.inscripciones.filter(
          (inscripcion) => inscripcion.id !== action.payload.id
        ),
      };
    }

    default:
      return state;
  }
}

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, estadoInicial);

  // Persistimos las inscripciones cada vez que cambian.
  useEffect(() => {
    localStorage.setItem("inscripciones", JSON.stringify(state.inscripciones));
  }, [state.inscripciones]);

  // Calculamos cupos disponibles en tiempo real para evitar
  // tener dos fuentes de verdad que puedan desincronizarse.
  const getCuposDisponibles = (cursoId) => {
    const curso = state.cursos.find((c) => c.id === cursoId);
    const inscriptos = state.inscripciones.filter((i) => i.cursoId === cursoId);
    return curso.cupoMaximo - inscriptos.length;
  };

  // Previene inscripciones duplicadas del mismo DNI en el mismo curso.
  const isDniDuplicado = (cursoId, dni) => {
    return state.inscripciones.some(
      (i) => i.cursoId === cursoId && i.dni === dni
    );
  };

  return (
    <AppContext.Provider
      value={{ state, dispatch, getCuposDisponibles, isDniDuplicado }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook para consumir el contexto sin importar AppContext y useContext en cada componente.
export function useApp() {
  return useContext(AppContext);
}
