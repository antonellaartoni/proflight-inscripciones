import { useState } from "react";
import { useApp } from "../context/AppContext";
import InscriptoRow from "../components/InscriptoRow";

function ListaInscriptos() {
  const { state, dispatch } = useApp();
  const [tabActivo, setTabActivo] = useState(null);

  const handleCancelar = (id) => {
    dispatch({ type: "CANCELAR_INSCRIPCION", payload: { id } });
  };

  const getNombreCurso = (cursoId) => {
    const curso = state.cursos.find((c) => c.id === cursoId);
    return curso ? curso.nombre : "Curso desconocido";
  };

  const inscripcionesFiltradas = tabActivo === null
    ? state.inscripciones
    : state.inscripciones.filter((i) => i.cursoId === tabActivo);

  const mostrarColumnaCurso = tabActivo === null;

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Lista de inscriptos</h1>
        <p className="text-white/40 text-sm">
          {state.inscripciones.length === 0
            ? "Todavía no hay ningún inscripto."
            : `${state.inscripciones.length} inscripción${state.inscripciones.length !== 1 ? "es" : ""} registrada${state.inscripciones.length !== 1 ? "s" : ""}.`
          }
        </p>
      </div>

      {state.inscripciones.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-12
          flex flex-col items-center gap-3 text-center">
          <p className="text-white/60 font-medium">No hay inscripciones aún</p>
          <p className="text-white/30 text-sm">
            Las inscripciones aparecerán acá una vez que alguien complete el formulario.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          <div className="flex flex-wrap gap-2">
            <Tab
              label="Todos"
              cantidad={state.inscripciones.length}
              activo={tabActivo === null}
              onClick={() => setTabActivo(null)}
            />
            {state.cursos.map((curso) => {
              const cantidad = state.inscripciones.filter((i) => i.cursoId === curso.id).length;
              return (
                <Tab
                  key={curso.id}
                  label={curso.nombre}
                  cantidad={cantidad}
                  activo={tabActivo === curso.id}
                  onClick={() => setTabActivo(curso.id)}
                />
              );
            })}
          </div>

          {inscripcionesFiltradas.length === 0 ? (
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-10
              flex flex-col items-center gap-2 text-center">
              <p className="text-white/50 font-medium">No hay inscriptos en este curso</p>
            </div>
          ) : (
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">Alumno</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">DNI</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">Email</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">
                        {mostrarColumnaCurso ? "Curso" : "Documentación"}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">Fecha</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscripcionesFiltradas.map((inscripcion) => (
                      <InscriptoRow
                        key={inscripcion.id}
                        inscripcion={inscripcion}
                        nombreCurso={getNombreCurso(inscripcion.cursoId)}
                        onCancelar={handleCancelar}
                        mostrarCurso={mostrarColumnaCurso}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

function Tab({ label, cantidad, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
        border transition-all duration-150
        ${activo
          ? "bg-gold-500/20 text-gold-400 border-gold-500/30"
          : "bg-white/[0.04] text-white/50 border-white/[0.08] hover:bg-white/[0.07] hover:text-white/70"
        }
      `}
    >
      {label}
      <span className={`
        text-xs font-semibold px-1.5 py-0.5 rounded-md
        ${activo ? "bg-gold-500/30 text-gold-300" : "bg-white/[0.08] text-white/40"}
      `}>
        {cantidad}
      </span>
    </button>
  );
}

export default ListaInscriptos;
