import userStore from '../store/userStore';
import LoginRequired from './LoginRequired';

const ProtectedRoute = ({ children }) => {
  const user = userStore((state) => state.user);

  if (!user) {
    return <LoginRequired />;
  }

  return children;
}

export default ProtectedRoute