import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
