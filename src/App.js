import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListaCursos from "./pages/ListaCursos";
import Inscripcion from "./pages/Inscripcion";
import ListaInscriptos from "./pages/ListaInscriptos";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    // BrowserRouter es el componente que habilita todo el sistema
    // de rutas. Debe envolver todo lo que use navegación.
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        
        {/* La Navbar vive fuera de las Routes porque queremos
            que aparezca en TODAS las páginas, siempre */}
        <Navbar />

        {/* El contenedor principal tiene padding top para que
            el contenido no quede tapado por la Navbar fija */}
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            {/* Ruta raíz: redirige automáticamente a /cursos */}
            <Route path="/" element={<Navigate to="/cursos" replace />} />
            <Route path="/cursos" element={<ListaCursos />} />
            <Route path="/inscripcion" element={<Inscripcion />} />
            <Route path="/inscriptos" element={<ListaInscriptos />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;