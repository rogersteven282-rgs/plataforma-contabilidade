import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Home from './pages/Home';
import Registo from './pages/Registo';
import Login from './pages/Login';
import ClasseUnidades from './pages/ClasseUnidades';
import UnidadeTemas from './pages/UnidadeTemas';
import MinhasUnidades from './pages/MinhasUnidades';
import Perfil from './pages/Perfil';
import AdminLogin from './pages/admin/AdminLogin';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminConteudo from './pages/admin/AdminConteudo';
import AdminAlunos from './pages/admin/AdminAlunos';
import AdminConfiguracoes from './pages/admin/AdminConfiguracoes';
import AdminConta from './pages/admin/AdminConta';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

export default function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/registo" element={<Registo />} />
              <Route path="/entrar" element={<Login />} />
              <Route path="/classes/:classeId" element={<ClasseUnidades />} />
              <Route path="/unidades/:unidadeId" element={<UnidadeTemas />} />
              <Route path="/minhas-unidades" element={<MinhasUnidades />} />
              <Route path="/perfil" element={<Perfil />} />

              <Route path="/admin/entrar" element={<AdminLogin />} />
              <Route
                path="/admin/pedidos"
                element={
                  <ProtectedAdminRoute>
                    <AdminPedidos />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/conteudo"
                element={
                  <ProtectedAdminRoute>
                    <AdminConteudo />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/alunos"
                element={
                  <ProtectedAdminRoute>
                    <AdminAlunos />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/configuracoes"
                element={
                  <ProtectedAdminRoute>
                    <AdminConfiguracoes />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/conta"
                element={
                  <ProtectedAdminRoute>
                    <AdminConta />
                  </ProtectedAdminRoute>
                }
              />
              <Route path="/admin" element={<ProtectedAdminRoute><AdminPedidos /></ProtectedAdminRoute>} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}
