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
import AdminDashboard from './pages/admin/Dashboard';
import ManageEvents from './pages/admin/ManageEvents';
import CreateEvent from './pages/admin/CreateEvent';
import Reports from './pages/admin/Reports';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loader component
  if (!user) return <Navigate to="/student/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

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

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute role="ROLE_ADMIN">
              <ManageEvents />
            </ProtectedRoute>
          } />
          <Route path="/admin/create-event" element={
            <ProtectedRoute role="ROLE_ADMIN">
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Reports />
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
