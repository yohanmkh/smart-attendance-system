import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { selectedRole, isAuthenticated, user } = useAuth();
  
  if (!selectedRole) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'lecturer' ? '/lecturer' : '/student'} replace />;
  }

  return <LoginScreen />;
};

export default Login;
