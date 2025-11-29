import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getCurrentUser } from '../utils/api';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="dashboard-container">
      <Sidebar userType={user.userType} />
      
      <div className="main-content">
        <div className="content-header">
          <h1 className="content-title">My Profile</h1>
          <p className="content-subtitle">View and manage your account details</p>
        </div>

        <div className="content-body">
          <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="avatar-icon">
                  {user.userType === 'admin' ? '👨‍💼' : '👤'}
                </span>
              </div>
              <div className="profile-header-info">
                <h2 className="profile-name">{user.name || 'User'}</h2>
                <p className="profile-role">
                  {user.userType === 'admin' ? 'Administrator' : 'Student'}
                </p>
              </div>
            </div>

            {/* Profile Details Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3 className="profile-card-title">Personal Information</h3>
              </div>
              
              <div className="profile-details">
                <div className="profile-detail-item">
                  <span className="detail-icon">👤</span>
                  <div className="detail-content">
                    <label className="detail-label">Full Name</label>
                    <p className="detail-value">{user.name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <span className="detail-icon">✉️</span>
                  <div className="detail-content">
                    <label className="detail-label">Email Address</label>
                    <p className="detail-value">{user.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <span className="detail-icon">🏷️</span>
                  <div className="detail-content">
                    <label className="detail-label">Role</label>
                    <p className="detail-value">
                      {user.userType === 'admin' ? 'Administrator' : 'Student'}
                    </p>
                  </div>
                </div>

                {user.userType === 'student' && (
                  <>
                    <div className="profile-detail-item">
                      <span className="detail-icon">🚪</span>
                      <div className="detail-content">
                        <label className="detail-label">Room Number</label>
                        <p className="detail-value">{user.room || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="profile-detail-item">
                      <span className="detail-icon">🏢</span>
                      <div className="detail-content">
                        <label className="detail-label">Block</label>
                        <p className="detail-value">{user.block || 'Not provided'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Account Status Card */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3 className="profile-card-title">Account Status</h3>
              </div>
              
              <div className="profile-details">
                <div className="profile-detail-item">
                  <span className="detail-icon">✅</span>
                  <div className="detail-content">
                    <label className="detail-label">Account Status</label>
                    <p className="detail-value status-active">Active</p>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <span className="detail-icon">🔑</span>
                  <div className="detail-content">
                    <label className="detail-label">Authentication</label>
                    <p className="detail-value">Token-based Login</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              <button 
                className="btn-back"
                onClick={() => navigate(user.userType === 'admin' ? '/admin' : '/dashboard')}
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
