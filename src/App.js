import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import SelectorRol from "./components/SelectorRol";
import ListaCursos from "./pages/ListaCursos";
import Inscripcion from "./pages/Inscripcion";
import ListaInscriptos from "./pages/ListaInscriptos";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  const { state } = useApp();

  // Sin rol elegido, mostramos la pantalla de selección de perfil.
  if (state.rol === null) {
    return <SelectorRol />;
  }

  // Solo los administradores pueden acceder a /inscriptos y /dashboard.
  // Si un alumno intenta entrar por URL directa, lo redirigimos a /cursos.
  const soloAdmin = (element) =>
    state.rol === "admin" ? element : <Navigate to="/cursos" replace />;

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/cursos" replace />} />
            <Route path="/cursos" element={<ListaCursos />} />
            <Route path="/inscripcion" element={<Inscripcion />} />
            <Route path="/inscriptos" element={soloAdmin(<ListaInscriptos />)} />
            <Route path="/dashboard" element={soloAdmin(<Dashboard />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
