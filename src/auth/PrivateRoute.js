import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

function PrivateRoute({ children }) {
  const { isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children || <Outlet />;
}

export default PrivateRoute;
