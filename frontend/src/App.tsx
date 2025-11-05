import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { authService } from './lib/api';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import ArticlePage from './pages/Article';
import CategoryPage from './pages/Category';
import SearchPage from './pages/Search';
import IntroPage from './pages/IntroPage';
import AdminDashboard from './pages/admin/Dashboard';
import UsersList from './pages/admin/users/List';
import UserForm from './pages/admin/users/Form';
import ArticlesList from './pages/admin/articles/List';
import ArticleForm from './pages/admin/articles/Form';
import PagesList from './pages/admin/pages/List';
import PageForm from './pages/admin/pages/Form';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/a/:slug" element={<ArticlePage />} />
          <Route path="/c/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/intro/:slug" element={<IntroPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <ArticlesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/create"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles/:id/edit"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/create"
            element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id/edit"
            element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pages"
            element={
              <ProtectedRoute>
                <PagesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pages/new"
            element={
              <ProtectedRoute>
                <PageForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pages/:id/edit"
            element={
              <ProtectedRoute>
                <PageForm />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
