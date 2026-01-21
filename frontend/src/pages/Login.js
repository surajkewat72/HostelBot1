import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import '../styles/login.css';
import { authAPI } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (userType) => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await authAPI.login(formData.email, formData.password, userType);
      const type = res.data.user.userType || userType;
      navigate(type === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <FaHome />
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
