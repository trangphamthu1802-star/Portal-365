import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequireAuth } from './components/auth/RequireAuth';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import ArticlePage from './pages/article/ArticlePage';
import CategoryPage from './pages/category/CategoryPage';
import CategoryDetailPage from './pages/CategoryDetail';
import SearchPage from './pages/Search';
import IntroPage from './pages/Intro';
import UsersList from './pages/admin/users/List';
import UserForm from './pages/admin/users/Form';
import ArticlesList from './pages/admin/articles/List';
import ArticleForm from './pages/admin/articles/Form';
import AdminDashboard from './pages/admin/Dashboard';
import NewsAdminList from './pages/admin/news/List';
import DocsAdminList from './pages/admin/docs/List';
import MediaAdminList from './pages/admin/media/List';
import BannersAdminList from './pages/admin/banners/List';
import BannerForm from './pages/admin/banners/Form';
import PagesList from './pages/admin/pages/List';
import PageForm from './pages/admin/pages/Form';
import IntroductionList from './pages/admin/Introduction';
import IntroductionEdit from './pages/admin/IntroductionEdit';
import NotFound from './pages/NotFound';

// New section pages
import ActivitiesIndex from './pages/activities/Index';
import NewsIndex from './pages/news/Index';
import DocsIndex from './pages/docs/Index';
import MediaVideos from './pages/media/Videos';
import MediaPhotos from './pages/media/Photos';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Remove legacy ProtectedRoute, use RequireAuth for admin routes

// Redirect old article URLs to new format
function RedirectToArticle() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/a/${slug}`} replace />;
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
            {/* Redirect old article URLs */}
            <Route path="/articles/:slug" element={<RedirectToArticle />} />
            {/* New category pages */}
            <Route path="/c/:slug" element={<CategoryPage />} />
            {/* Legacy category routes */}
            <Route path="/category/:slug" element={<CategoryDetailPage />} />
            <Route path="/documents/:slug" element={<CategoryDetailPage />} />
            <Route path="/media/:slug" element={<CategoryDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/intro/:slug" element={<IntroPage />} />
            <Route path="/gioi-thieu/:slug" element={<IntroPage />} />
            
            {/* Section Pages */}
            <Route path="/activities" element={<ActivitiesIndex />} />
            <Route path="/news" element={<NewsIndex />} />
            <Route path="/docs" element={<DocsIndex />} />
            <Route path="/media/videos" element={<MediaVideos />} />
            <Route path="/media/photos" element={<MediaPhotos />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            {/* Redirect old /admin/activities to /admin */}
            <Route
              path="/admin/activities"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <Navigate to="/admin" replace />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/articles"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <ArticlesList />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/articles/create"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <ArticleForm />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/articles/:id/edit"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <ArticleForm />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <UsersList />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <UserForm />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users/:id/edit"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <UserForm />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/pages"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <PagesList />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/pages/new"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <PageForm />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/pages/:id/edit"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <PageForm />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/introduction"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <IntroductionList />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/introduction/:key"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <IntroductionEdit />
                </RequireAuth>
              }
            />

            {/* Admin News */}
            <Route
              path="/admin/news"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <NewsAdminList />
                </RequireAuth>
              }
            />

            {/* Admin Documents */}
            <Route
              path="/admin/docs"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <DocsAdminList />
                </RequireAuth>
              }
            />

            {/* Admin Media */}
            <Route
              path="/admin/media"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <MediaAdminList />
                </RequireAuth>
              }
            />

            {/* Admin Banners */}
            <Route
              path="/admin/banners"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <BannersAdminList />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/banners/new"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <BannerForm />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/banners/:id/edit"
              element={
                <RequireAuth requiredRoles={["Admin","Editor"]}>
                  <BannerForm />
                </RequireAuth>
              }
            />

            {/* Catch all - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
