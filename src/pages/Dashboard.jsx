import { useApp } from "../context/AppContext";

function Dashboard() {
  const { state, getCuposDisponibles } = useApp();

  const totalInscriptos = state.inscripciones.length;
  const totalCupos = state.cursos.reduce((acc, curso) => acc + curso.cupoMaximo, 0);
  const cuposLibres = state.cursos.reduce((acc, curso) => acc + getCuposDisponibles(curso.id), 0);
  const cursosLlenos = state.cursos.filter((curso) => getCuposDisponibles(curso.id) === 0).length;

  // Enriquecemos cada curso con sus métricas y ordenamos por inscriptos
  // de mayor a menor para mostrar primero los más demandados.
  const resumenPorCurso = state.cursos
    .map((curso) => {
      const inscriptos = state.inscripciones.filter((i) => i.cursoId === curso.id).length;
      const cuposLibresCurso = getCuposDisponibles(curso.id);
      const porcentaje = Math.round((inscriptos / curso.cupoMaximo) * 100);
      return { ...curso, inscriptos, cuposLibresCurso, porcentaje };
    })
    .sort((a, b) => b.inscriptos - a.inscriptos);

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm">Resumen general del estado de inscripciones.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricaCard icono="👥" valor={totalInscriptos} label="Inscriptos totales" color="blue" />
        <MetricaCard icono="✅" valor={cuposLibres} label={`Cupos libres de ${totalCupos}`} color="emerald" />
        <MetricaCard
          icono="🔴"
          valor={cursosLlenos}
          label={`Curso${cursosLlenos !== 1 ? "s" : ""} con cupo lleno`}
          color={cursosLlenos > 0 ? "red" : "slate"}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Demanda por curso</h2>
          <p className="text-slate-400 text-xs mt-0.5">Ordenado de mayor a menor demanda</p>
        </div>

        <div className="divide-y divide-slate-100">
          {resumenPorCurso.map((curso) => {
            const colorBarra =
              curso.porcentaje === 100 ? "bg-red-500"
              : curso.porcentaje >= 70  ? "bg-amber-400"
              : "bg-emerald-500";

            return (
              <div key={curso.id} className="px-6 py-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{curso.nombre}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {curso.inscriptos} inscripto{curso.inscriptos !== 1 ? "s" : ""} · {curso.cuposLibresCurso} cupo{curso.cuposLibresCurso !== 1 ? "s" : ""} libre{curso.cuposLibresCurso !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${curso.porcentaje === 100 ? "text-red-600" : "text-slate-700"}`}>
                    {curso.porcentaje}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorBarra}`}
                    style={{ width: `${curso.porcentaje}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function MetricaCard({ icono, valor, label, color }) {
  const colores = {
    blue:    "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    red:     "bg-red-50 text-red-700",
    slate:   "bg-slate-50 text-slate-700",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center ${colores[color]}`}>
        {icono}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">{valor}</p>
        <p className="text-slate-500 text-sm mt-1">{label}</p>
      </div>
    </div>
  );
}

export default Dashboard;
