import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import MyRegistrations from './pages/MyRegistrations';
import AdminDashboard from './pages/AdminDashboard';

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        {user && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${user ? 'lg:pl-0' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute role="admin">
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-registrations" 
              element={
                <ProtectedRoute role="student">
                  <MyRegistrations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
