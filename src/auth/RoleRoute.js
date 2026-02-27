import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

function RoleRoute({ allowedRoles = [], children }) {
  const { isInitialized, isAuthenticated, role } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to='/' replace />;
  }

  return children || <Outlet />;
}

export default RoleRoute;
