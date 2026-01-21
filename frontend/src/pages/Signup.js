import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/signup.css';
import { authAPI } from '../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    roomNo: '',
    block: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student'
  });
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

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.roomNo.trim()) newErrors.roomNo = 'Room number is required';
    if (!formData.block.trim()) newErrors.block = 'Block is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        room: formData.roomNo,
        block: formData.block,
        userType: formData.userType
      };
      await authAPI.signup(userData);
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate(formData.userType === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Signup failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-logo">
          🏠
        </div>
        <h1 className="signup-title">Join HostelBot</h1>
        <p className="signup-subtitle">Create your account to start managing complaints</p>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="userType">Account Type</label>
            <select
              id="userType"
              name="userType"
              className="form-input"
              value={formData.userType}
              onChange={handleInputChange}
              style={{ cursor: 'pointer' }}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="roomNo">Room Number</label>
              <input
                type="text"
                id="roomNo"
                name="roomNo"
                className="form-input"
                placeholder="e.g., 101"
                value={formData.roomNo}
                onChange={handleInputChange}
              />
              {errors.roomNo && <div className="error-message">{errors.roomNo}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="block">Block</label>
              <input
                type="text"
                id="block"
                name="block"
                className="form-input"
                placeholder="e.g., A, B, C"
                value={formData.block}
                onChange={handleInputChange}
              />
              {errors.block && <div className="error-message">{errors.block}</div>}
            </div>
          </div>

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
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          {errors.general && (
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '16px' }}>
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            className="signup-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-links">
          <p>Already have an account? <Link to="/login" className="signup-link">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
