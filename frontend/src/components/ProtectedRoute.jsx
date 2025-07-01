import { Navigate } from 'react-router-dom';
import userStore from '../store/userStore';

const ProtectedRoute = ({ children }) => {
  const user = userStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute