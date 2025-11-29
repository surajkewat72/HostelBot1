import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { complaintsAPI, getCurrentUser } from '../utils/api';
import '../styles/dashboard.css';
import '../styles/complaint.css';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const { userType, email: userEmail } = getCurrentUser();

  useEffect(() => {
    if (userType !== 'student') {
      navigate('/admin');
      return;
    }
    fetchMyComplaints();
  }, [userType, navigate]);

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getComplaints(userType);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status.toLowerCase() === filter.toLowerCase();
  });

  // Sort by date (newest first)
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Calculate statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status.toLowerCase() === 'pending').length,
    inProgress: complaints.filter(c => c.status.toLowerCase() === 'in progress').length,
    resolved: complaints.filter(c => c.status.toLowerCase() === 'resolved').length
  };

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
          <h1 className="content-title">My Complaints</h1>
          <p className="content-subtitle">Track the status of your submitted complaints</p>
        </div>

        <div className="content-body">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}>📊</div>
              <div className="stat-info">
                <div className="stat-label">Total</div>
                <div className="stat-value">{stats.total}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F4C542, #E6B73A)' }}>⏳</div>
              <div className="stat-info">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats.pending}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}>🔄</div>
              <div className="stat-info">
                <div className="stat-label">In Progress</div>
                <div className="stat-value">{stats.inProgress}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48BB78, #38A169)' }}>✅</div>
              <div className="stat-info">
                <div className="stat-label">Resolved</div>
                <div className="stat-value">{stats.resolved}</div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="modern-filters-section">
            <div className="filters-header">
              <h2 className="filters-title">🔍 Filter Complaints</h2>
            </div>
            <div className="filters-controls">
              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select
                  className="modern-filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="in progress">🔄 In Progress</option>
                  <option value="resolved">✅ Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="complaints-section">
            <div className="complaints-header">
              <h2 className="complaints-section-title">📋 Your Complaints</h2>
              <div className="complaints-count">{sortedComplaints.length} results</div>
            </div>
            
            <div className="complaint-list">
              {sortedComplaints.length > 0 ? (
                sortedComplaints.map(complaint => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    showVoting={false}
                  />
                ))
              ) : (
                <div className="modern-empty-state">
                  <div className="empty-state-icon">📝</div>
                  <div className="empty-state-text">No complaints found</div>
                  <div className="empty-state-subtext">
                    {filter === 'all' 
                      ? "You haven't submitted any complaints yet."
                      : `No complaints with status "${filter}".`
                    }
                  </div>
                  {filter === 'all' && (
                    <button 
                      className="btn-submit-modern" 
                      onClick={() => navigate('/dashboard/submit')}
                      style={{ marginTop: '20px' }}
                    >
                      <span>✓</span>
                      Submit Your First Complaint
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-modern">
            <button 
              className="action-card action-primary" 
              onClick={() => navigate('/dashboard/submit')}
            >
              <div className="action-icon">➕</div>
              <div className="action-content">
                <div className="action-title">Submit New Complaint</div>
                <div className="action-desc">Report a new issue or concern</div>
              </div>
            </button>
            <button 
              className="action-card action-secondary" 
              onClick={() => navigate('/dashboard/all-complaints')}
            >
              <div className="action-icon">🌐</div>
              <div className="action-content">
                <div className="action-title">View All Complaints</div>
                <div className="action-desc">See community complaints and vote</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;
