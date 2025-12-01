import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { authAPI } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    // Accept general email formats (no longer restrict to @college.edu)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (userType) => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Call real backend
      console.log('Attempting login with:', { email: formData.email, userType });
      const res = await authAPI.login(formData.email, formData.password, userType);
      console.log('Login response:', res.data);
      const returnedUser = res.data.user;
      const type = returnedUser.userType || returnedUser.type || userType;
      // Navigate based on user type
      if (type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          🏠
        </div>
        <h1 className="login-title">HostelBot</h1>
        <p className="login-subtitle">Welcome back! Please sign in to continue.</p>
        
        <form className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          {errors.general && (
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '16px' }}>
              {errors.general}
            </div>
          )}

          <div className="login-buttons">
            <button
              type="button"
              className="login-btn login-btn-student"
              onClick={() => handleLogin('student')}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Login as Student'}
            </button>
            <button
              type="button"
              className="login-btn login-btn-admin"
              onClick={() => handleLogin('admin')}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Login as Admin'}
            </button>
          </div>
        </form>

        <div className="login-links">
          <a href="#" className="login-link">Forgot password?</a>
          <span>•</span>
          <a href="/signup" className="login-link">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
