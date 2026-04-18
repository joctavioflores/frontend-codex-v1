import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from './useAuth';

interface RequireAuthProps {
  redirectTo?: string;
}

export const RequireAuth = ({ redirectTo = '/login' }: RequireAuthProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p>Cargando sesión...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
