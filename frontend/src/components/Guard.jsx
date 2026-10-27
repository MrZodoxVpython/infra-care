import { Navigate } from 'react-router-dom';
import { getUser } from '../api.js';

export default function Guard({ roles, children }) {
  return roles.includes(getUser()?.role) ? children : <Navigate to="/app" />;
}
