import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { complaintsAPI, getCurrentUser } from '../utils/api';
import { FaChartBar, FaHourglassHalf, FaSync, FaCheckCircle, FaClipboardList, FaEdit, FaCalendarAlt, FaThumbsUp, FaThumbsDown, FaInfoCircle } from 'react-icons/fa';
import '../styles/dashboard.css';
import '../styles/complaint.css';

const AllComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const { userType } = getCurrentUser();

  useEffect(() => {
    if (userType !== 'student') {
      navigate('/admin');
      return;
    }
    fetchAllComplaints();
  }, [userType, navigate]);

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getComplaints('admin');
      setComplaints(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    try {
      const response = await complaintsAPI.getComplaints('admin');
      setComplaints(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateVotes = (complaint) => {
    if (!complaint.votes?.length) return { upvotes: 0, downvotes: 0 };
    return {
      upvotes: complaint.votes.filter(v => v.voteType === 'up').length,
      downvotes: complaint.votes.filter(v => v.voteType === 'down').length
    };
  };

  const filteredAndSortedComplaints = complaints
    .filter(c => filter === 'all' || c.status.toLowerCase() === filter.toLowerCase())
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'upvotes') return calculateVotes(b).upvotes - calculateVotes(a).upvotes;
      if (sortBy === 'downvotes') return calculateVotes(b).downvotes - calculateVotes(a).downvotes;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
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

  // Calculate statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status.toLowerCase() === 'pending').length,
    inProgress: complaints.filter(c => c.status.toLowerCase() === 'in progress').length,
    resolved: complaints.filter(c => c.status.toLowerCase() === 'resolved').length
  };

  return (
    <div className="dashboard-container">
      <Sidebar userType={userType} />
      
      <div className="main-content">
        <div className="content-header">
          <h1 className="content-title">All Complaints</h1>
          <p className="content-subtitle">View and vote on all hostel complaints</p>
        </div>

        <div className="content-body">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}><FaChartBar /></div>
              <div className="stat-info">
                <div className="stat-label">Total</div>
                <div className="stat-value">{stats.total}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F4C542, #E6B73A)' }}><FaHourglassHalf /></div>
              <div className="stat-info">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{stats.pending}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667EEA, #764BA2)' }}><FaSync /></div>
              <div className="stat-info">
                <div className="stat-label">In Progress</div>
                <div className="stat-value">{stats.inProgress}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48BB78, #38A169)' }}><FaCheckCircle /></div>
              <div className="stat-info">
                <div className="stat-label">Resolved</div>
                <div className="stat-value">{stats.resolved}</div>
              </div>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="modern-filters-section">
            <div className="filters-header">
              <h2 className="filters-title">Filter & Sort</h2>
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
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select
                  className="modern-filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Latest First</option>
                  <option value="upvotes">Most Liked</option>
                  <option value="downvotes">Most Disliked</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="complaints-section">
            <div className="complaints-header">
              <h2 className="complaints-section-title"><FaClipboardList /> Community Complaints</h2>
              <div className="complaints-count">{filteredAndSortedComplaints.length} results</div>
            </div>
            
            <div className="complaint-list">
              {filteredAndSortedComplaints.length > 0 ? (
                filteredAndSortedComplaints.map(complaint => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onVote={handleVote}
                    showVoting={true}
                  />
                ))
              ) : (
                <div className="modern-empty-state">
                  <div className="empty-state-icon"><FaEdit /></div>
                  <div className="empty-state-text">No complaints found</div>
                  <div className="empty-state-subtext">
                    {filter === 'all' 
                      ? "No complaints have been submitted yet."
                      : `No complaints with status "${filter}".`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Voting Instructions */}
          <div className="info-card">
            <div className="info-card-header">
              <span className="info-icon"><FaInfoCircle /></span>
              <h3 className="info-title">How Voting Works</h3>
            </div>
            <div className="info-card-body">
              <div className="info-item">
                <span className="info-bullet"><FaThumbsUp /></span>
                <div>
                  <strong>Like</strong> complaints you agree with or find important
                </div>
              </div>
              <div className="info-item">
                <span className="info-bullet"><FaThumbsDown /></span>
                <div>
                  <strong>Dislike</strong> complaints you disagree with or find unimportant
                </div>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <div>You can only vote once per complaint</div>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <div>Click the same vote again to remove your vote</div>
              </div>
              <div className="info-item">
                <span className="info-bullet">•</span>
                <div>Votes help prioritize which complaints need attention</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllComplaints;
