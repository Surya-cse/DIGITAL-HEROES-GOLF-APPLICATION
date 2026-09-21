import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Import Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Charities from './pages/Charities';
import DrawMgmt from './pages/admin/DrawMgmt';
import UserMgmt from './pages/admin/UserMgmt';
import BookSlot from './pages/BookSlot';

// Security Wrapper for Member-only pages
function SubscriberRoute({ children }: { children: JSX.Element; }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold">Verifying Session...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Wrapped in MainLayout */}
          <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/charities" element={<MainLayout><Charities /></MainLayout>} />
          <Route path="/book" element={<MainLayout><BookSlot /></MainLayout>} />
          
          {/* Subscriber Routes - Protected */}
          <Route 
            path="/dashboard" 
            element={
              <SubscriberRoute>
                <MainLayout><Dashboard /></MainLayout>
              </SubscriberRoute>
            } 
          />
          
          {/* Admin Routes - Protected by AdminLayout */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminLayout>
                <div className="text-2xl font-black">Admin Overview Content</div>
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/draws" 
            element={<AdminLayout><DrawMgmt /></AdminLayout>} 
          />
          <Route 
            path="/admin/users" 
            element={<AdminLayout><UserMgmt /></AdminLayout>} 
          />

          {/* Redirect any unknown route to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;