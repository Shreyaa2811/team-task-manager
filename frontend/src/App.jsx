import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './state/AppContext';
import AppShell from './components/appShell';
import Toasts from './components/toasts';
import SignIn from './views/signIn';
import Register from './views/register';
import Home from './views/home';
import Workspaces from './views/workspaces';
import WorkspaceDetail from './views/workspaceDetail';

// gates a route to authed-only — redirect to /signin otherwise
function PrivateRoute({ children }) {
  const { state } = useApp();
  if (state.auth.booting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 font-mono text-sm">restoring session...</p>
      </div>
    );
  }
  if (!state.auth.user) return <Navigate to="/signin" replace />;
  return <AppShell>{children}</AppShell>;
}

// route for /signin and /register — if you're already signed in, kick to home
function PublicOnly({ children }) {
  const { state } = useApp();
  if (state.auth.booting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 font-mono text-sm">loading...</p>
      </div>
    );
  }
  if (state.auth.user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/signin"
            element={
              <PublicOnly>
                <SignIn />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/workspaces"
            element={
              <PrivateRoute>
                <Workspaces />
              </PrivateRoute>
            }
          />
          <Route
            path="/workspaces/:id"
            element={
              <PrivateRoute>
                <WorkspaceDetail />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toasts />
      </BrowserRouter>
    </AppProvider>
  );
}
