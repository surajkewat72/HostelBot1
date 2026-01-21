import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../utils/api';
import { FaHome, FaClipboardList, FaGlobe, FaPlus, FaCog, FaUser, FaDoorOpen } from 'react-icons/fa';
import '../styles/dashboard.css';

const Sidebar = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    ['token', 'userType', 'userEmail', 'userName', 'userRoom', 'userBlock'].forEach(key => 
      localStorage.removeItem(key)
    );
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const studentNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/dashboard/my-complaints', label: 'My Complaints', icon: <FaClipboardList /> },
    { path: '/dashboard/all-complaints', label: 'All Complaints', icon: <FaGlobe /> },
    { path: '/dashboard/submit', label: 'Submit Complaint', icon: <FaPlus /> }
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Admin Panel', icon: <FaCog /> }
  ];

  const navItems = currentUser.userType === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FaHome />
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
          <FaUser /> Profile
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <FaDoorOpen /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
