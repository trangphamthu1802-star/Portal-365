import { authService } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portal 365 CMS</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.full_name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Articles</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Published</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Users</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Content Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <a
              href="/admin/articles"
              className="block p-4 border-2 border-blue-600 rounded-lg text-center hover:bg-blue-50 transition"
            >
              <span className="text-blue-600 font-semibold">📰 Articles</span>
            </a>
            <a
              href="/admin/introduction"
              className="block p-4 border-2 border-indigo-600 rounded-lg text-center hover:bg-indigo-50 transition"
            >
              <span className="text-indigo-600 font-semibold">📋 Introduction</span>
            </a>
            <a
              href="/admin/activities"
              className="block p-4 border-2 border-cyan-600 rounded-lg text-center hover:bg-cyan-50 transition"
            >
              <span className="text-cyan-600 font-semibold">🎯 Activities</span>
            </a>
            <a
              href="/admin/categories"
              className="block p-4 border-2 border-green-600 rounded-lg text-center hover:bg-green-50 transition"
            >
              <span className="text-green-600 font-semibold">📁 Categories</span>
            </a>
          </div>

          <h2 className="text-xl font-bold mb-4 mt-6">Media & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <a
              href="/admin/media"
              className="block p-4 border-2 border-purple-600 rounded-lg text-center hover:bg-purple-50 transition"
            >
              <span className="text-purple-600 font-semibold">🖼️ Media Library</span>
            </a>
            <a
              href="/admin/pages"
              className="block p-4 border-2 border-pink-600 rounded-lg text-center hover:bg-pink-50 transition"
            >
              <span className="text-pink-600 font-semibold">📄 Pages</span>
            </a>
            <a
              href="/admin/banners"
              className="block p-4 border-2 border-orange-600 rounded-lg text-center hover:bg-orange-50 transition"
            >
              <span className="text-orange-600 font-semibold">🎨 Banners</span>
            </a>
            <a
              href="/admin/menus"
              className="block p-4 border-2 border-teal-600 rounded-lg text-center hover:bg-teal-50 transition"
            >
              <span className="text-teal-600 font-semibold">🗂️ Menus</span>
            </a>
          </div>

          <h2 className="text-xl font-bold mb-4 mt-6">System Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/users"
              className="block p-4 border-2 border-slate-600 rounded-lg text-center hover:bg-slate-50 transition"
            >
              <span className="text-slate-600 font-semibold">👥 Users</span>
            </a>
            <a
              href="/admin/comments"
              className="block p-4 border-2 border-amber-600 rounded-lg text-center hover:bg-amber-50 transition"
            >
              <span className="text-amber-600 font-semibold">💬 Comments</span>
            </a>
            <a
              href="/admin/settings"
              className="block p-4 border-2 border-gray-600 rounded-lg text-center hover:bg-gray-50 transition"
            >
              <span className="text-gray-600 font-semibold">⚙️ Settings</span>
            </a>
            <a
              href="/admin/audit-logs"
              className="block p-4 border-2 border-red-600 rounded-lg text-center hover:bg-red-50 transition"
            >
              <span className="text-red-600 font-semibold">📊 Audit Logs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
