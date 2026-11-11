import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CriarEmpresa from './pages/CriarEmpresa';
import TutorIA from './pages/TutorIA';
import Carteira from './pages/Carteira';
import Secundario from './pages/Secundario';
import RotaProtegida from './components/RotaProtegida';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/secundario" element={<Secundario />} />
        
        <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
        <Route path="/criar-empresa" element={<RotaProtegida><CriarEmpresa /></RotaProtegida>} />
        <Route path="/tutor" element={<RotaProtegida><TutorIA /></RotaProtegida>} />
        <Route path="/carteira" element={<RotaProtegida><Carteira /></RotaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}
