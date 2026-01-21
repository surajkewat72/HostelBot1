import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { complaintsAPI, getCurrentUser } from '../utils/api';
import '../styles/dashboard.css';
import '../styles/complaint.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  const { userType, name: userName, email: userEmail } = getCurrentUser();

  useEffect(() => {
    if (userType !== 'student') {
      navigate('/admin');
      return;
    }
    fetchComplaints();
  }, [userType, navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getComplaints(userType);
      setComplaints(response.data);
      
      const total = response.data.length;
      const pending = response.data.filter(c => c.status === 'Pending').length;
      const inProgress = response.data.filter(c => c.status === 'In Progress').length;
      const resolved = response.data.filter(c => c.status === 'Resolved').length;
      
      setStats({ total, pending, inProgress, resolved });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status.toLowerCase() === filter.toLowerCase());

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const handleSubmitComplaint = () => navigate('/dashboard/submit');

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar userType={userType} />
        <div className="main-content">
          <div className="content-header">
            <h1 className="content-title">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar userType={userType} />
      
      <div className="main-content">
        <div className="content-header">
          <div className="welcome-banner">
            <div className="welcome-content">
              <h1 className="welcome-title">Welcome back, {userName}! 👋</h1>
            </div>
          </div>
        </div>

        <div className="content-body">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-animated">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}>📊</div>
              <div className="stat-info">
                <div className="stat-label">Total Complaints</div>
                <div className="stat-value">{stats.total}</div>
              </div>
            </div>
            <div className="stat-card stat-card-animated">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F4C542, #E6B73A)' }}>⏳</div>
              <div className="stat-info">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats.pending}</div>
              </div>
            </div>
            <div className="stat-card stat-card-animated">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}>🔄</div>
              <div className="stat-info">
                <div className="stat-label">In Progress</div>
                <div className="stat-value">{stats.inProgress}</div>
              </div>
            </div>
            <div className="stat-card stat-card-animated">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48BB78, #38A169)' }}>✅</div>
              <div className="stat-info">
                <div className="stat-label">Resolved</div>
                <div className="stat-value">{stats.resolved}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-actions-grid">
            <button 
              className="action-card action-primary" 
              onClick={handleSubmitComplaint}
            >
              <div className="action-icon">📝</div>
              <div className="action-content">
                <div className="action-title">Submit Complaint</div>
                <div className="action-desc">Report a new issue</div>
              </div>
              <div className="action-arrow">→</div>
            </button>
            <button 
              className="action-card action-secondary" 
              onClick={() => navigate('/dashboard/my-complaints')}
            >
              <div className="action-icon">📋</div>
              <div className="action-content">
                <div className="action-title">My Complaints</div>
                <div className="action-desc">Track your issues</div>
              </div>
              <div className="action-arrow">→</div>
            </button>
            <button 
              className="action-card action-tertiary" 
              onClick={() => navigate('/dashboard/all-complaints')}
            >
              <div className="action-icon">🌐</div>
              <div className="action-content">
                <div className="action-title">All Complaints</div>
                <div className="action-desc">View & vote on issues</div>
              </div>
              <div className="action-arrow">→</div>
            </button>
          </div>

          {/* Recent Activity Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">📊 Recent Activity</h2>
              <button 
                className="section-link"
                onClick={() => navigate('/dashboard/my-complaints')}
              >
                View All →
              </button>
            </div>
            
            <div className="recent-complaints">
              {recentComplaints.length > 0 ? (
                recentComplaints.map(complaint => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    showVoting={false}
                  />
                ))
              ) : (
                <div className="modern-empty-state">
                  <div className="empty-state-icon">📝</div>
                  <div className="empty-state-text">No complaints yet</div>
                  <div className="empty-state-subtext">
                    Get started by submitting your first complaint
                  </div>
                  <button 
                    className="btn-submit-modern" 
                    onClick={handleSubmitComplaint}
                    style={{ marginTop: '20px' }}
                  >
                    <span>+</span>
                    Submit First Complaint
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tips & Info Section */}
          <div className="info-card" style={{ marginTop: '28px' }}>
            <div className="info-card-header">
              <span className="info-icon">💡</span>
              <h3 className="info-title">Quick Tips</h3>
            </div>
            <div className="info-card-body">
              <div className="info-item">
                <span className="info-bullet">✓</span>
                <div>Be specific and detailed when describing your complaint</div>
              </div>
              <div className="info-item">
                <span className="info-bullet">✓</span>
                <div>Include photos or videos if possible to help staff understand the issue</div>
              </div>
              <div className="info-item">
                <span className="info-bullet">✓</span>
                <div>Vote on other students' complaints to help prioritize important issues</div>
              </div>
              <div className="info-item">
                <span className="info-bullet">✓</span>
                <div>Check your complaint status regularly for updates from staff</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
