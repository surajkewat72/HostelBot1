import React, { useState } from 'react';
import '../styles/complaint.css';

const ComplaintCard = ({ complaint, onUpvote, onStatusChange, showActions = false }) => {
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted);
    if (onUpvote) {
      onUpvote(complaint.id, !isUpvoted);
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

  return (
    <div className="complaint-card">
      <div className="complaint-header">
        <h3 className="complaint-title">{complaint.title}</h3>
        <span className={`status-badge ${getStatusClass(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>

      <div className="complaint-meta">
        <span className="complaint-category">{complaint.category}</span>
        <span>Room: {complaint.room}</span>
        <span>Block: {complaint.block}</span>
        {complaint.assignedTo && (
          <span>Assigned to: {complaint.assignedTo.name}</span>
        )}
      </div>

      <p className="complaint-description">{complaint.description}</p>

      <div className="complaint-footer">
        <div className="complaint-date">
          Submitted on {formatDate(complaint.date)}
        </div>
        <div className="complaint-upvotes">
          <button
            className={`upvote-btn ${isUpvoted ? 'active' : ''}`}
            onClick={handleUpvote}
            title="Upvote this complaint"
          >
            👍
          </button>
          <span>{complaint.upvotes + (isUpvoted ? 1 : 0)}</span>
        </div>
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
