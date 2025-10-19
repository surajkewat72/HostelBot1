import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { feedbackAPI, complaintsAPI } from '../utils/api';
import '../styles/feedback.css';

const Feedback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [complaint, setComplaint] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const complaintId = searchParams.get('id');

  useEffect(() => {
    if (!complaintId) {
      navigate('/dashboard');
      return;
    }
    fetchComplaint();
  }, [complaintId, navigate]);

  const fetchComplaint = async () => {
    try {
      // Mock: Get complaint details
      const response = await complaintsAPI.getComplaints('student', localStorage.getItem('userEmail'));
      const foundComplaint = response.data.find(c => c.id === parseInt(complaintId));
      
      if (!foundComplaint) {
        navigate('/dashboard');
        return;
      }
      
      if (foundComplaint.status !== 'Resolved') {
        navigate('/dashboard');
        return;
      }
      
      setComplaint(foundComplaint);
    } catch (error) {
      console.error('Error fetching complaint:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Please provide a rating';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please provide feedback comments';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comments must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await feedbackAPI.submitFeedback(complaintId, formData.rating, formData.comment);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({ general: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return 'Very Poor';
      case 2:
        return 'Poor';
      case 3:
        return 'Average';
      case 4:
        return 'Good';
      case 5:
        return 'Excellent';
      default:
        return 'Select a rating';
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={`star ${formData.rating >= star ? 'active' : ''}`}
        onClick={() => handleRatingClick(star)}
      >
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="feedback-container">
        <div className="feedback-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
            <div>Loading complaint details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="feedback-container">
        <div className="feedback-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>❌</div>
            <div>Complaint not found or not resolved yet.</div>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/dashboard')}
              style={{ marginTop: '16px' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="feedback-container">
        <div className="feedback-card">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Thank you for your feedback!
            </div>
            <div>
              Your feedback has been submitted successfully and will help us improve our services.
            </div>
          </div>
          
          <div className="feedback-links">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <div className="feedback-header">
          <div className="feedback-icon">
            📝
          </div>
          <h1 className="feedback-title">Provide Feedback</h1>
          <p className="feedback-subtitle">
            Help us improve by sharing your experience with this resolved complaint
          </p>
        </div>

        <div className="complaint-info">
          <div className="complaint-info-title">Complaint Details</div>
          <div className="complaint-info-details">
            <strong>Title:</strong> {complaint.title}<br />
            <strong>Category:</strong> {complaint.category}<br />
            <strong>Description:</strong> {complaint.description}<br />
            <strong>Room:</strong> {complaint.room}, Block {complaint.block}
          </div>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="rating-section">
            <label className="rating-label">How would you rate the resolution? *</label>
            <div className="rating-stars">
              {renderStars()}
            </div>
            <div className="rating-text">
              {getRatingText(formData.rating)}
            </div>
            {errors.rating && <div className="error-message">{errors.rating}</div>}
          </div>

          <div className="comment-section">
            <label className="comment-label" htmlFor="comment">Additional Comments *</label>
            <textarea
              id="comment"
              name="comment"
              className="comment-textarea"
              placeholder="Please share your experience with the resolution process..."
              value={formData.comment}
              onChange={handleInputChange}
            />
            {errors.comment && <div className="error-message">{errors.comment}</div>}
          </div>

          {errors.general && (
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '16px' }}>
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            className="submit-feedback-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <div className="feedback-links">
          <button 
            className="btn btn-outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
