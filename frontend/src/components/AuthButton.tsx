import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { getUserDisplayName } from '@/lib/session';
import { LogIn, Settings } from 'lucide-react';

export default function AuthButton() {
  const { isAuthenticated, user } = useAuth();
  const displayName = getUserDisplayName(user);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 rounded-full font-semibold transition-colors text-sm whitespace-nowrap"
      >
        <LogIn className="w-5 h-5" />
        <span>Đăng nhập</span>
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-sm text-white">
        Xin chào, <span className="font-semibold">{displayName}</span>
      </span>
      <div className="flex gap-2">
        <Link
          to="/admin"
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 rounded-full font-semibold transition-colors text-sm whitespace-nowrap"
        >
          <Settings className="w-5 h-5" />
          <span>Quản trị</span>
        </Link>
        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
              window.localStorage.clear();
              window.location.href = '/';
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors text-sm whitespace-nowrap"
        >
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
