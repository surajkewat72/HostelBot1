import React, { useState, useEffect } from 'react';
import { votingAPI } from '../utils/api';
import '../styles/complaint.css';

const ComplaintCard = ({ complaint, onVote, onStatusChange, showActions = false, showVoting = false }) => {
  const [localComplaint, setLocalComplaint] = useState(complaint);
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  
  // Debug logging
  // console.log('ComplaintCard:', { showVoting, userEmail, votes: complaint.votes });

  // Calculate votes from votes array
  const calculateVotes = (complaint) => {
    if (!complaint.votes || !Array.isArray(complaint.votes)) {
      return { upvotes: 0, downvotes: 0 };
    }
    const upvotes = complaint.votes.filter(v => v.voteType === 'up').length;
    const downvotes = complaint.votes.filter(v => v.voteType === 'down').length;
    return { upvotes, downvotes };
  };

  // Get current user's vote
  const getUserVote = (complaint) => {
    if (!complaint.votes || !Array.isArray(complaint.votes) || !userEmail) {
      return null;
    }
    // Try to find vote by user email - handle different possible user object structures
    const vote = complaint.votes.find(v => {
      if (!v.user) return false;
      // Check if user has email property
      if (v.user.email === userEmail) return true;
      // Fallback: check if the vote userId matches (if we had access to userId)
      return false;
    });
    return vote ? vote.voteType : null;
  };

  useEffect(() => {
    setLocalComplaint(complaint);
    if (showVoting && userEmail) {
      const vote = getUserVote(complaint);
      setUserVote(vote);
    }
  }, [complaint, userEmail, showVoting]);

  const handleVote = async (voteType) => {
    if (!showVoting) {
      console.warn('Voting is disabled for this complaint');
      return;
    }
    if (!userEmail) {
      console.error('User email not found. Please log in again.');
      return;
    }
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      await votingAPI.voteComplaint(complaint.id, voteType);
      
      // Trigger refetch of complaints
      if (onVote) {
        await onVote(complaint.id, voteType);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in progress':
        return 'status-inprogress';
      case 'resolved':
        return 'status-resolved';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(complaint.id, newStatus);
    }
  };

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

      <p className="complaint-description">{localComplaint.description}</p>

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
              👍
            </button>
            <span className="vote-count">{upvotes}</span>
            <button
              className={`vote-btn downvote-btn ${userVote === 'down' ? 'active' : ''}`}
              onClick={() => handleVote('down')}
              disabled={isVoting}
              title="Dislike this complaint"
            >
              👎
            </button>
            <span className="vote-count">{downvotes}</span>
          </div>
        ) : (
          <div className="complaint-upvotes">
            <span>👍 {upvotes}</span>
            <span>👎 {downvotes}</span>
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
    </div>
  );
};

export default ComplaintCard;
