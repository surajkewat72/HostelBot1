import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@college\.edu$/;
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
      newErrors.email = 'Email must end with @college.edu';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock JWT token
      const mockToken = `mock-jwt-token-${userType}-${Date.now()}`;
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userEmail', formData.email);
      
      // Navigate based on user type
      if (userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
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
            <label className="form-label" htmlFor="email">College Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="your.email@college.edu"
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
