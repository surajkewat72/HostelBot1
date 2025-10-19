import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { complaintsAPI } from '../utils/api';
import '../styles/dashboard.css';
import '../styles/complaint.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  const userType = localStorage.getItem('userType');
  const userName = localStorage.getItem('userName') || 'Student';
  const userEmail = localStorage.getItem('userEmail');

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
      const response = await complaintsAPI.getComplaints(userType, userEmail);
      setComplaints(response.data);
      
      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(c => c.status === 'Pending').length;
      const inProgress = response.data.filter(c => c.status === 'In Progress').length;
      const resolved = response.data.filter(c => c.status === 'Resolved').length;
      
      setStats({ total, pending, inProgress, resolved });
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = (complaintId, isUpvoted) => {
    // Mock upvote functionality
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, upvotes: complaint.upvotes + (isUpvoted ? 1 : -1) }
        : complaint
    ));
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status.toLowerCase() === filter.toLowerCase();
  });

  const handleSubmitComplaint = () => {
    navigate('/dashboard/submit');
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
          <h1 className="content-title">Student Dashboard</h1>
          <p className="content-subtitle">Welcome back, {userName}!</p>
        </div>

        <div className="content-body">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Complaints</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={handleSubmitComplaint}>
              ➕ Submit New Complaint
            </button>
            <button 
              className="quick-action-btn" 
              onClick={() => setActiveTab('complaints')}
              style={{ backgroundColor: '#4B4B4B' }}
            >
              📋 View My Complaints
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab-button ${activeTab === 'complaints' ? 'active' : ''}`}
                onClick={() => setActiveTab('complaints')}
              >
                My Complaints
              </button>
              <button
                className={`tab-button ${activeTab === 'submit' ? 'active' : ''}`}
                onClick={() => setActiveTab('submit')}
              >
                Submit Complaint
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'complaints' && (
                <div>
                  <div className="complaint-list-header">
                    <h2 className="complaint-list-title">My Complaints</h2>
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

                  <div className="complaint-list">
                    {filteredComplaints.length > 0 ? (
                      filteredComplaints.map(complaint => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          onUpvote={handleUpvote}
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
                            onClick={handleSubmitComplaint}
                            style={{ marginTop: '16px' }}
                          >
                            Submit Your First Complaint
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'submit' && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ marginBottom: '12px' }}>Submit New Complaint</h2>
                    <p style={{ color: '#666666' }}>
                      Use the form below to submit a new complaint
                    </p>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSubmitComplaint}
                    style={{ width: '100%', padding: '16px' }}
                  >
                    ➕ Open Complaint Form
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
