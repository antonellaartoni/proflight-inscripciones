import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">

      <div className="flex flex-col gap-2">
        <p className="text-6xl font-bold text-gold-500/30">404</p>
        <h1 className="text-xl font-semibold text-white">Página no encontrada</h1>
        <p className="text-white/40 text-sm max-w-xs">
          La ruta que ingresaste no existe. Usá la navegación para volver al inicio.
        </p>
      </div>

      <Link
        to="/cursos"
        className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-black text-sm
          font-semibold rounded-xl transition-colors duration-150"
      >
        Volver a cursos
      </Link>

    </div>
  );
}

export default NotFound;
