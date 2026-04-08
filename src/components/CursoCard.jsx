import { Link } from "react-router-dom";

function CursoCard({ curso, cuposDisponibles }) {
  const estaLleno = cuposDisponibles === 0;

  // Redondeamos para evitar decimales como 66.666...
  const porcentajeOcupado = Math.round(
    ((curso.cupoMaximo - cuposDisponibles) / curso.cupoMaximo) * 100
  );

  const colorBarra =
    estaLleno
      ? "bg-red-500"
      : porcentajeOcupado >= 70
      ? "bg-amber-400"
      : "bg-emerald-500";

  return (
    <div className={`
      bg-white rounded-2xl border p-6 flex flex-col gap-4
      shadow-sm transition-shadow duration-200 hover:shadow-md
      ${estaLleno ? "border-red-200 opacity-75" : "border-slate-200"}
    `}>

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800 text-lg leading-tight">
          {curso.nombre}
        </h3>
        <span className={`
          text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap
          ${estaLleno
            ? "bg-red-100 text-red-700"
            : "bg-emerald-100 text-emerald-700"}
        `}>
          {estaLleno ? "Cupo lleno" : "Disponible"}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-sm text-slate-500">
        <span>⏱ Duración: <strong className="text-slate-700">{curso.duracion}</strong></span>
        <span>👥 Cupo máximo: <strong className="text-slate-700">{curso.cupoMaximo} alumnos</strong></span>
        <span>✅ Cupos disponibles: <strong className={estaLleno ? "text-red-600" : "text-emerald-600"}>
          {cuposDisponibles}
        </strong></span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Ocupación</span>
          <span>{porcentajeOcupado}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colorBarra}`}
            style={{ width: `${porcentajeOcupado}%` }}
          />
        </div>
      </div>

      <div className="mt-auto pt-2">
        {estaLleno ? (
          <span className="block text-center w-full py-2 px-4 rounded-xl
            bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed">
            Sin cupos disponibles
          </span>
        ) : (
          // El link pasa el ID del curso como query param para pre-seleccionarlo en el formulario.
          <Link
            to={`/inscripcion?cursoId=${curso.id}`}
            className="block text-center w-full py-2 px-4 rounded-xl
              bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
              transition-colors duration-150"
          >
            Inscribirse
          </Link>
        )}
      </div>

    </div>
  );
}

export default CursoCard;
