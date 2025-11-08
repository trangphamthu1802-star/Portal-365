import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/api/client';
import { useEffect, useState } from 'react';


interface RequireAuthProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // e.g. ['Admin', 'Editor']
}

export const RequireAuth = ({ children, requiredRoles = ['Admin', 'Editor'] }: RequireAuthProps) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [debug, setDebug] = useState<string>('');

  useEffect(() => {
    async function checkAuth() {
      setChecking(true);
      const isAuth = authService.isAuthenticated();
      setDebug(`isAuthenticated: ${isAuth}`);
      if (!isAuth) {
        setAuthenticated(false);
        setDebug(prev => prev + ' | No token, will redirect');
        setChecking(false);
        return;
      }
      setAuthenticated(true);
      // Check roles
      const user = authService.getUser();
      setDebug(prev => prev + ` | user: ${JSON.stringify(user)}`);
      if (!user || !user.roles || !user.roles.some((r: string) => requiredRoles.includes(r))) {
        setForbidden(true);
        setDebug(prev => prev + ' | Forbidden: missing required role');
      } else {
        setForbidden(false);
        setDebug(prev => prev + ' | Allowed: has required role');
      }
      setChecking(false);
    }
    checkAuth();
  }, [requiredRoles]);

  if (checking) {
    return <div className="p-8 text-center text-gray-600">Đang kiểm tra quyền truy cập...<br /><pre>{debug}</pre></div>;
  }
  if (!authenticated) {
    // Redirect to login page with return url
    const redirect = encodeURIComponent(location.pathname + location.search + location.hash);
    return <div className="p-8 text-center text-gray-600">Redirecting to login...<br /><pre>{debug}</pre><Navigate to={`/login?redirect=${redirect}`} replace /></div>;
  }
  if (forbidden) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">403 - FORBIDDEN</h2>
        <p className="text-gray-700 mb-2">Bạn không có quyền truy cập trang này.</p>
        <pre>{debug}</pre>
      </div>
    );
  }
  return <>{children}</>;
};
