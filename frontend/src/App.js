import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyComplaints from './pages/MyComplaints';
import AllComplaints from './pages/AllComplaints';
import ComplaintForm from './pages/ComplaintForm';
import AdminPanel from './pages/AdminPanel';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredUserType="student">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/my-complaints" 
            element={
              <ProtectedRoute requiredUserType="student">
                <MyComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/all-complaints" 
            element={
              <ProtectedRoute requiredUserType="student">
                <AllComplaints />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/submit" 
            element={
              <ProtectedRoute requiredUserType="student">
                <ComplaintForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
