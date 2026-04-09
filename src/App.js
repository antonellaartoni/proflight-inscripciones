import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListaCursos from "./pages/ListaCursos";
import Inscripcion from "./pages/Inscripcion";
import ListaInscriptos from "./pages/ListaInscriptos";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/cursos" replace />} />
            <Route path="/cursos" element={<ListaCursos />} />
            <Route path="/inscripcion" element={<Inscripcion />} />
            <Route path="/inscriptos" element={<ListaInscriptos />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
