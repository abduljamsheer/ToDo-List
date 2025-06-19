
import { Navigate } from 'react-router-dom';
import { getToken } from '../AuthOparation'

const ProtectedRoute = ({ children }) => {
  const token = getToken('token');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
