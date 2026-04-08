import { useApp } from "../context/AppContext";
import CursoCard from "../components/CursoCard";

function ListaCursos() {
  const { state, getCuposDisponibles } = useApp();

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Cursos disponibles</h1>
        <p className="text-slate-500 text-sm">
          Explorá nuestra oferta de formación aeronáutica y elegí el curso que mejor se adapta a tus objetivos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.cursos.map((curso) => (
          <CursoCard
            key={curso.id}
            curso={curso}
            cuposDisponibles={getCuposDisponibles(curso.id)}
          />
        ))}
      </div>

    </div>
  );
}

export default ListaCursos;
