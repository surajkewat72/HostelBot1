import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { complaintsAPI, getCurrentUser } from '../utils/api';
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
      // Get all complaints (not just user's own)
      const response = await complaintsAPI.getComplaints('admin'); // Use admin to get all complaints
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (complaintId, voteType) => {
    // Update local state immediately for better UX
    setComplaints(prev => prev.map(complaint => {
      if (complaint.id === complaintId) {
        return { ...complaint };
      }
      return complaint;
    }));
  };

  const filteredAndSortedComplaints = complaints
    .filter(complaint => {
      if (filter === 'all') return true;
      return complaint.status.toLowerCase() === filter.toLowerCase();
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'upvotes':
          return (b.upvotes || 0) - (a.upvotes || 0);
        case 'downvotes':
          return (b.downvotes || 0) - (a.downvotes || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
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
          <h1 className="content-title">All Complaints</h1>
          <p className="content-subtitle">View and vote on all hostel complaints</p>
        </div>

        <div className="content-body">
          {/* Filters and Sorting */}
          <div className="complaint-list-header">
            <h2 className="complaint-list-title">Community Complaints</h2>
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
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="upvotes">Sort by Likes</option>
                <option value="downvotes">Sort by Dislikes</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>

          {/* Complaints List */}
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
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
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

          {/* Voting Instructions */}
          <div className="card" style={{ marginTop: '24px', backgroundColor: '#F8F9FA' }}>
            <h3 style={{ marginBottom: '12px', color: '#4B4B4B' }}>How Voting Works</h3>
            <ul style={{ color: '#666666', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
              <li>👍 <strong>Like</strong> complaints you agree with or find important</li>
              <li>👎 <strong>Dislike</strong> complaints you disagree with or find unimportant</li>
              <li>You can only vote once per complaint</li>
              <li>Click the same vote again to remove your vote</li>
              <li>Votes help prioritize which complaints need attention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllComplaints;
