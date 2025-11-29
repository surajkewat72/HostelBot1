import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/api';
import '../styles/dashboard.css';

const Sidebar = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoom');
    localStorage.removeItem('userBlock');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const studentNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/dashboard/my-complaints', label: 'My Complaints', icon: '📋' },
    { path: '/dashboard/all-complaints', label: 'All Complaints', icon: '🌐' },
    { path: '/dashboard/submit', label: 'Submit Complaint', icon: '➕' }
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Admin Panel', icon: '⚙️' }
  ];

  const navItems = currentUser.userType === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          🏠
        </div>
        <h1 className="sidebar-title">HostelBot</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="profile-btn" 
          onClick={() => navigate('/profile')}
        >
          👤 Profile
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
