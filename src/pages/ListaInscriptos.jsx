import { useApp } from "../context/AppContext";
import InscriptoRow from "../components/InscriptoRow";

function ListaInscriptos() {
  const { state, dispatch } = useApp();

  const handleCancelar = (id) => {
    dispatch({ type: "CANCELAR_INSCRIPCION", payload: { id } });
  };

  // Resolvemos el nombre del curso acá para no acoplar InscriptoRow al contexto global.
  const getNombreCurso = (cursoId) => {
    const curso = state.cursos.find((c) => c.id === cursoId);
    return curso ? curso.nombre : "Curso desconocido";
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Lista de inscriptos</h1>
        <p className="text-slate-500 text-sm">
          {state.inscripciones.length === 0
            ? "Todavía no hay ningún inscripto."
            : `${state.inscripciones.length} inscripción${state.inscripciones.length !== 1 ? "es" : ""} registrada${state.inscripciones.length !== 1 ? "s" : ""}.`
          }
        </p>
      </div>

      {state.inscripciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12
          flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">📋</span>
          <p className="text-slate-600 font-medium">No hay inscripciones aún</p>
          <p className="text-slate-400 text-sm">
            Las inscripciones aparecerán acá una vez que alguien complete el formulario.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Alumno</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">DNI</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Curso</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Acción</th>
                </tr>
              </thead>
              <tbody>
                {state.inscripciones.map((inscripcion) => (
                  <InscriptoRow
                    key={inscripcion.id}
                    inscripcion={inscripcion}
                    nombreCurso={getNombreCurso(inscripcion.cursoId)}
                    onCancelar={handleCancelar}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default ListaInscriptos;
