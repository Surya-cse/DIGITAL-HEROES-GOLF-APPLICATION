import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Charities from "./pages/Charities";
import DrawMgmt from "./pages/admin/DrawMgmt";
import UserMgmt from "./pages/admin/UserMgmt";

// Protected subscriber route
const SubscriberRoute = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-bold">
        Verifying Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected admin route
const AdminRoute = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-bold">
        Verifying Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route
            path="/"
            element={
              <MainLayout>
                <Landing />
              </MainLayout>
            }
          />

          {/* Login page handles BOTH
              Sign In and Sign Up */}
          <Route
            path="/login"
            element={
              <MainLayout>
                <Login />
              </MainLayout>
            }
          />

          <Route
            path="/charities"
            element={
              <MainLayout>
                <Charities />
              </MainLayout>
            }
          />

          {/* =========================
              SUBSCRIBER ROUTES
          ========================= */}

          <Route
            path="/dashboard"
            element={
              <SubscriberRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </SubscriberRoute>
            }
          />

          {/* =========================
              ADMIN ROUTES
          ========================= */}

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout>
                  <div className="text-2xl font-black">
                    Admin Overview Content
                  </div>
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/draws"
            element={
              <AdminRoute>
                <AdminLayout>
                  <DrawMgmt />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <UserMgmt />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* =========================
              UNKNOWN ROUTES
          ========================= */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;