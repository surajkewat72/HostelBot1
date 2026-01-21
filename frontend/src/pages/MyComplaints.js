import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { complaintsAPI, getCurrentUser } from '../utils/api';
import { FaChartBar, FaHourglassHalf, FaSync, FaCheckCircle, FaClipboardList, FaEdit, FaCalendarAlt, FaGlobe, FaPlus } from 'react-icons/fa';
import '../styles/dashboard.css';
import '../styles/complaint.css';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    room: '',
    block: '',
    imageUrl: ''
  });

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComplaint = (complaint) => {
    setEditingComplaint(complaint);
    setEditFormData({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      room: complaint.room,
      block: complaint.block,
      imageUrl: complaint.imageUrl || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    try {
      await complaintsAPI.updateComplaint(editingComplaint.id, editFormData);
      alert('Complaint updated successfully!');
      setShowEditModal(false);
      setEditingComplaint(null);
      fetchMyComplaints();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update complaint.');
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await complaintsAPI.deleteComplaint(complaintId);
        alert('Complaint deleted successfully!');
        fetchMyComplaints();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete complaint.');
      }
    }
  };

  const handleEditFormChange = (e) => {
    setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredComplaints = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status.toLowerCase() === filter.toLowerCase());

  const sortedComplaints = [...filteredComplaints].sort((a, b) => new Date(b.date) - new Date(a.date));

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

          {/* Filter Section */}
          <div className="modern-filters-section">
            <div className="filters-header">
              <h2 className="filters-title">Filter Complaints</h2>
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
            </div>
          </div>

          {/* Complaints List */}
          <div className="complaints-section">
            <div className="complaints-header">
              <h2 className="complaints-section-title"><FaClipboardList /> Your Complaints</h2>
              <div className="complaints-count">{sortedComplaints.length} results</div>
            </div>
            
            <div className="complaint-list">
              {sortedComplaints.length > 0 ? (
                sortedComplaints.map(complaint => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    showVoting={false}
                    showStudentActions={true}
                    onEdit={handleEditComplaint}
                    onDelete={handleDeleteComplaint}
                  />
                ))
              ) : (
                <div className="modern-empty-state">
                  <div className="empty-state-icon"><FaEdit /></div>
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
              <div className="action-icon"><FaPlus /></div>
              <div className="action-content">
                <div className="action-title">Submit New Complaint</div>
                <div className="action-desc">Report a new issue or concern</div>
              </div>
            </button>
            <button 
              className="action-card action-secondary" 
              onClick={() => navigate('/dashboard/all-complaints')}
            >
              <div className="action-icon"><FaGlobe /></div>
              <div className="action-content">
                <div className="action-title">View All Complaints</div>
                <div className="action-desc">See community complaints and vote</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Complaint</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdateComplaint} className="edit-complaint-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  required
                  placeholder="Enter complaint title"
                />
              </div>
              
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditFormChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Mess">Mess</option>
                  <option value="Internet">Internet</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room Number *</label>
                  <input
                    type="text"
                    name="room"
                    value={editFormData.room}
                    onChange={handleEditFormChange}
                    required
                    placeholder="e.g., 101"
                  />
                </div>
                
                <div className="form-group">
                  <label>Block *</label>
                  <input
                    type="text"
                    name="block"
                    value={editFormData.block}
                    onChange={handleEditFormChange}
                    required
                    placeholder="e.g., A"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  required
                  rows="4"
                  placeholder="Describe the issue in detail"
                />
              </div>

              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={editFormData.imageUrl}
                  onChange={handleEditFormChange}
                  placeholder="Enter image URL if available"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
