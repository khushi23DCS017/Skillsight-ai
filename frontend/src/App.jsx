import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import FacultyRegister from './pages/FacultyRegister';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyProfileForm from './pages/FacultyProfileForm';
import AdminDashboard from './pages/AdminDashboard';
import TPODashboard from './pages/TPODashboard';
import CompleteProfile from './pages/CompleteProfile';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      return <Navigate to="/login" />;
    }

    const userData = JSON.parse(storedUser);
    if (allowedRole && userData.role !== allowedRole) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-faculty" element={<FacultyRegister />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/complete-profile"
          element={
            <ProtectedRoute allowedRole="student">
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/profile"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyProfileForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tpo"
          element={
            <ProtectedRoute allowedRole="tpo">
              <TPODashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
