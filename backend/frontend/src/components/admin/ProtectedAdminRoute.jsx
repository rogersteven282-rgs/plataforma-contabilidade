import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedAdminRoute({ children }) {
  const { admin } = useAdminAuth();
  if (!admin) return <Navigate to="/admin/entrar" replace />;
  return children;
}
