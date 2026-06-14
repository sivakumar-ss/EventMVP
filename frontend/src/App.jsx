import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/Dashboard';
import BrowseEvents from './pages/student/BrowseEvents';
import MyEvents from './pages/student/MyEvents';
import StudentProfile from './pages/student/Profile';
import StudentNetwork from './pages/student/Network';
import AdminDashboard from './pages/admin/Dashboard';
import ManageEvents from './pages/admin/ManageEvents';
import CreateEvent from './pages/admin/CreateEvent';
import Participants from './pages/admin/Participants';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import MasterDashboard from './pages/master-admin/Dashboard';
import MasterAccounts from './pages/master-admin/Accounts';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/student/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

// Allow both ROLE_ADMIN and ROLE_MASTER_ADMIN to access admin routes
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/student/login" />;
  if (user.role !== 'ROLE_ADMIN' && user.role !== 'ROLE_MASTER_ADMIN') return <Navigate to="/" />;

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student/login" element={<LoginPage />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="ROLE_STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/events" element={<BrowseEvents />} />
          <Route path="/student/my-events" element={
            <ProtectedRoute role="ROLE_STUDENT">
              <MyEvents />
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute role="ROLE_STUDENT">
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/student/network" element={
            <ProtectedRoute role="ROLE_STUDENT">
              <StudentNetwork />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/events" element={
            <AdminRoute>
              <ManageEvents />
            </AdminRoute>
          } />
          <Route path="/admin/create-event" element={
            <AdminRoute>
              <CreateEvent />
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          } />
          <Route path="/admin/settings" element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          } />
          <Route path="/admin/participants" element={
            <AdminRoute>
              <Participants />
            </AdminRoute>
          } />

          {/* Master Admin Routes */}
          <Route path="/master-admin/dashboard" element={
            <ProtectedRoute role="ROLE_MASTER_ADMIN">
              <MasterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/master-admin/accounts" element={
            <ProtectedRoute role="ROLE_MASTER_ADMIN">
              <MasterAccounts />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Toaster position="bottom-right" toastOptions={{
        className: 'glass text-white border border-white/10',
        style: { background: 'rgba(15, 15, 40, 0.9)', color: '#fff' }
      }} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
// Trigger dev HMR reload
