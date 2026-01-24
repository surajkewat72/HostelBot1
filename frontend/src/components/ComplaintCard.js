import React, { useState, useEffect } from 'react';
import { votingAPI } from '../utils/api';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/complaint.css';

const ComplaintCard = ({ complaint, onVote, onStatusChange, onEdit, onDelete, showActions = false, showVoting = false, showStudentActions = false }) => {
  const [localComplaint, setLocalComplaint] = useState(complaint);
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const userEmail = localStorage.getItem('userEmail');

  const calculateVotes = (complaint) => {
    if (!complaint.votes?.length) return { upvotes: 0, downvotes: 0 };
    return {
      upvotes: complaint.votes.filter(v => v.voteType === 'up').length,
      downvotes: complaint.votes.filter(v => v.voteType === 'down').length
    };
  };

  const getUserVote = (complaint) => {
    if (!complaint.votes?.length || !userEmail) return null;
    const vote = complaint.votes.find(v => v.user?.email === userEmail);
    return vote?.voteType || null;
  };

  useEffect(() => {
    setLocalComplaint(complaint);
    if (showVoting && userEmail) setUserVote(getUserVote(complaint));
  }, [complaint, userEmail, showVoting]);

  const handleVote = async (voteType) => {
    if (!showVoting || !userEmail || isVoting) return;
    
    setIsVoting(true);
    try {
      await votingAPI.voteComplaint(complaint.id, voteType);
      if (onVote) await onVote(complaint.id, voteType);
    } catch (error) {
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'in progress': 'status-inprogress',
      'resolved': 'status-resolved'
    };
    return statusMap[status.toLowerCase()] || 'status-pending';
  };

  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const handleStatusChange = (newStatus) => onStatusChange?.(complaint.id, newStatus);

  const { upvotes, downvotes } = calculateVotes(localComplaint);

  return (
    <div className="complaint-card">
      <div className="complaint-header">
        <h3 className="complaint-title">{localComplaint.title}</h3>
        <span className={`status-badge ${getStatusClass(localComplaint.status)}`}>
          {localComplaint.status}
        </span>
      </div>

      <div className="complaint-meta">
        <span className="complaint-category">{localComplaint.category}</span>
        <span>Room: {localComplaint.room}</span>
        <span>Block: {localComplaint.block}</span>
        {localComplaint.assignedTo && (
          <span>Assigned to: {localComplaint.assignedTo.name}</span>
        )}
      </div>

      <p 
        className={`complaint-description ${isDescriptionExpanded ? 'expanded' : ''}`}
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        title="Click to expand/collapse"
      >
        {localComplaint.description}
      </p>

      <div className="complaint-footer">
        <div className="complaint-date">
          Submitted on {formatDate(localComplaint.date)}
        </div>
        {showVoting ? (
          <div className="complaint-voting">
            <button
              className={`vote-btn upvote-btn ${userVote === 'up' ? 'active' : ''}`}
              onClick={() => handleVote('up')}
              disabled={isVoting}
              title="Like this complaint"
            >
              <FaThumbsUp />
            </button>
            <span className="vote-count">{upvotes}</span>
            <button
              className={`vote-btn downvote-btn ${userVote === 'down' ? 'active' : ''}`}
              onClick={() => handleVote('down')}
              disabled={isVoting}
              title="Dislike this complaint"
            >
              <FaThumbsDown />
            </button>
            <span className="vote-count">{downvotes}</span>
          </div>
        ) : (
          <div className="complaint-upvotes">
            <span><FaThumbsUp /> {upvotes}</span>
            <span><FaThumbsDown /> {downvotes}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="complaint-actions" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E6E6E6' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {complaint.status !== 'In Progress' && (
              <button
                className="btn btn-outline"
                onClick={() => handleStatusChange('In Progress')}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Start Progress
              </button>
            )}
            {complaint.status !== 'Resolved' && (
              <button
                className="btn btn-primary"
                onClick={() => handleStatusChange('Resolved')}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Mark Resolved
              </button>
            )}
            {complaint.status === 'Resolved' && (
              <button
                className="btn btn-secondary"
                onClick={() => handleStatusChange('Pending')}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Reopen
              </button>
            )}
          </div>
        </div>
      )}

      {showStudentActions && (
        <div className="complaint-actions" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E6E6E6' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-outline"
              onClick={() => onEdit && onEdit(complaint)}
              style={{ fontSize: '12px', padding: '6px 12px', background: '#4A90E2', color: 'white', border: 'none' }}
            >
              <FaEdit /> Edit
            </button>
            <button
              className="btn btn-outline"
              onClick={() => onDelete && onDelete(complaint.id)}
              style={{ fontSize: '12px', padding: '6px 12px', background: '#E74C3C', color: 'white', border: 'none' }}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
