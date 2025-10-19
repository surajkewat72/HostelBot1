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
      const response = await complaintsAPI.getComplaints(userType, userEmail);
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
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-number">{complaints.length}</div>
              <div className="stat-label">Total Submitted</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-number">{complaints.filter(c => c.status === 'Pending').length}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-number">{complaints.filter(c => c.status === 'In Progress').length}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-number">{complaints.filter(c => c.status === 'Resolved').length}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>

          {/* Filters */}
          <div className="complaint-list-header">
            <h2 className="complaint-list-title">Your Complaints</h2>
            <div className="complaint-filters">
              <select
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Complaints List */}
          <div className="complaint-list">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(complaint => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  showVoting={false}
                />
              ))
            ) : (
              <div className="empty-state">
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
                    className="btn btn-primary" 
                    onClick={() => navigate('/dashboard/submit')}
                    style={{ marginTop: '16px' }}
                  >
                    Submit Your First Complaint
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className="quick-action-btn" 
              onClick={() => navigate('/dashboard/submit')}
            >
              ➕ Submit New Complaint
            </button>
            <button 
              className="quick-action-btn" 
              onClick={() => navigate('/dashboard/all-complaints')}
              style={{ backgroundColor: '#4B4B4B' }}
            >
              🌐 View All Complaints
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;
