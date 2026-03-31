import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PlaybooksPage from './pages/PlaybooksPage';
import ProductsPage from './pages/ProductsPage';
import DealsPage from './pages/DealsPage';
import MarketingPage from './pages/MarketingPage';
import TrainingPage from './pages/TrainingPage';
import IncentivesPage from './pages/IncentivesPage';
import SupportPage from './pages/SupportPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="playbooks" element={<PlaybooksPage />} />
        <Route path="playbooks/:id" element={<PlaybooksPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductsPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="training" element={<TrainingPage />} />
        <Route path="incentives" element={<IncentivesPage />} />
        <Route path="support" element={<SupportPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
