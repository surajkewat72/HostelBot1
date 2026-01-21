import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { complaintsAPI, getCurrentUser } from '../utils/api';
import { FaFolder, FaEdit, FaExclamationTriangle, FaFileAlt, FaPaperclip, FaCamera, FaImage } from 'react-icons/fa';
import '../styles/complaint.css';
import '../styles/dashboard.css';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Electricity',
    'Water',
    'Mess Food',
    'Wi-Fi',
    'Other'
  ];

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please upload a valid image or video file' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'File size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi'];
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload a valid image or video file'
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const complaintData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        room: localStorage.getItem('userRoom') || null,
        block: localStorage.getItem('userBlock') || null,
        imageUrl: null
      };

      await complaintsAPI.createComplaint(complaintData);
      alert('Complaint submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Failed to submit complaint.' });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setErrors(prev => ({ ...prev, image: '' }));
  };

  return (
    <div className="dashboard-container">
      <Sidebar userType={user.userType} />
      
      <div className="main-content">
        <div className="content-header">
          <h1 className="content-title">Submit New Complaint</h1>
          <p className="content-subtitle">Report an issue and get it resolved quickly</p>
        </div>

        <div className="content-body">
          <div className="complaint-form-container">
            <form onSubmit={handleSubmit} className="modern-complaint-form">
              {/* Category Selection */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-icon"><FaFolder /></span>
                  <h3 className="section-title">Category</h3>
                </div>
                <div className="form-group">
                  <select
                    id="category"
                    name="category"
                    className="modern-select-input"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <div className="error-message">{errors.category}</div>}
                </div>
              </div>

              {/* Title */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-icon"><FaEdit /></span>
                  <h3 className="section-title">Title</h3>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="modern-text-input"
                    placeholder="Brief description of the issue (e.g., 'Broken AC in Room 101')"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && <div className="error-message">{errors.title}</div>}
                </div>
              </div>

              {/* Description */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-icon"><FaFileAlt /></span>
                  <h3 className="section-title">Description</h3>
                </div>
                <div className="form-group">
                  <textarea
                    id="description"
                    name="description"
                    className="modern-textarea-input"
                    placeholder="Provide detailed information about the complaint..."
                    rows="5"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  <div className="char-count">
                    {formData.description.length} characters
                  </div>
                  {errors.description && <div className="error-message">{errors.description}</div>}
                </div>
              </div>

              {/* File Upload */}
              <div className="form-section">
                <div className="form-section-header">
                  <span className="section-icon"><FaPaperclip /></span>
                  <h3 className="section-title">Attachment (Optional)</h3>
                </div>
                <div className="form-group">
                  <div
                    className={`modern-file-upload ${dragActive ? 'dragover' : ''} ${formData.image ? 'has-file' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !formData.image && document.getElementById('file-input').click()}
                  >
                    {formData.image ? (
                      <div className="file-preview-card">
                        <div className="file-info">
                          <span className="file-icon"><FaImage /></span>
                          <div className="file-details">
                            <div className="file-name">{formData.image.name}</div>
                            <div className="file-size">
                              {(formData.image.size / 1024).toFixed(2)} KB
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <div className="upload-icon"><FaCamera /></div>
                        <div className="upload-text">
                          <strong>Click to upload</strong> or drag and drop
                        </div>
                        <div className="upload-hint">
                          Supports: Images and Videos (Max 5MB)
                        </div>
                      </div>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      className="file-upload-input"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  {errors.image && <div className="error-message">{errors.image}</div>}
                </div>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="alert alert-error">
                  <span className="alert-icon"><FaExclamationTriangle /></span>
                  {errors.general}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate('/dashboard')}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit-modern"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
