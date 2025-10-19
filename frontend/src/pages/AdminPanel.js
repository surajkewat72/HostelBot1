import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { complaintsAPI, staffAPI, getCurrentUser } from '../utils/api';
import '../styles/dashboard.css';
import '../styles/admin.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all'
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  const { userType } = getCurrentUser();

  useEffect(() => {
    if (userType !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [userType, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsResponse, staffResponse] = await Promise.all([
        complaintsAPI.getComplaints(userType),
        staffAPI.getStaff()
      ]);
      
      setComplaints(complaintsResponse.data);
      setStaff(staffResponse.data);
      
      // Calculate stats
      const total = complaintsResponse.data.length;
      const pending = complaintsResponse.data.filter(c => c.status === 'Pending').length;
      const inProgress = complaintsResponse.data.filter(c => c.status === 'In Progress').length;
      const resolved = complaintsResponse.data.filter(c => c.status === 'Resolved').length;
      
      setStats({ total, pending, inProgress, resolved });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await complaintsAPI.updateComplaintStatus(complaintId, newStatus);
      setComplaints(prev => prev.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status: newStatus }
          : complaint
      ));
      
      // Update stats
      const total = complaints.length;
      const pending = complaints.filter(c => c.status === 'Pending' || (c.id === complaintId && newStatus === 'Pending')).length;
      const inProgress = complaints.filter(c => c.status === 'In Progress' || (c.id === complaintId && newStatus === 'In Progress')).length;
      const resolved = complaints.filter(c => c.status === 'Resolved' || (c.id === complaintId && newStatus === 'Resolved')).length;
      
      setStats({ total, pending, inProgress, resolved });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowAssignModal(true);
    setSelectedStaff(null);
  };

  const handleStaffSelect = (staffMember) => {
    setSelectedStaff(staffMember);
  };

  const confirmAssignment = async () => {
    if (!selectedStaff || !selectedComplaint) return;

    try {
      await complaintsAPI.assignComplaint(selectedComplaint.id, selectedStaff.id);
      setComplaints(prev => prev.map(complaint => 
        complaint.id === selectedComplaint.id 
          ? { ...complaint, assignedTo: selectedStaff, status: 'In Progress' }
          : complaint
      ));
      
      setShowAssignModal(false);
      setSelectedComplaint(null);
      setSelectedStaff(null);
    } catch (error) {
      console.error('Error assigning complaint:', error);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filters.status !== 'all' && complaint.status !== filters.status) {
      return false;
    }
    if (filters.category !== 'all' && complaint.category !== filters.category) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar userType={userType} />
        <div className="admin-main-content">
          <div className="admin-content-header">
            <h1 className="admin-content-title">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Sidebar userType={userType} />
      
      <div className="admin-main-content">
        <div className="admin-content-header">
          <h1 className="admin-content-title">Admin Panel</h1>
          <p className="admin-content-subtitle">Manage hostel complaints and staff assignments</p>
        </div>

        <div className="admin-content-body">
          {/* Admin Stats */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">📊</div>
              <div className="admin-stat-number">{stats.total}</div>
              <div className="admin-stat-label">Total Complaints</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">⏳</div>
              <div className="admin-stat-number">{stats.pending}</div>
              <div className="admin-stat-label">Pending</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">🔄</div>
              <div className="admin-stat-number">{stats.inProgress}</div>
              <div className="admin-stat-label">In Progress</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">✅</div>
              <div className="admin-stat-number">{stats.resolved}</div>
              <div className="admin-stat-label">Resolved</div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="complaints-table-container">
            <div className="complaints-table-header">
              <h2 className="complaints-table-title">All Complaints</h2>
              <div className="complaints-table-filters">
                <select
                  className="table-filter-select"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <select
                  className="table-filter-select"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="all">All Categories</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Mess Food">Mess Food</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(complaint => (
                  <tr key={complaint.id}>
                    <td className="complaint-id">#{complaint.id}</td>
                    <td>{formatDate(complaint.date)}</td>
                    <td className="complaint-student">
                      <div>{complaint.student}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        Room {complaint.room}, Block {complaint.block}
                      </div>
                    </td>
                    <td>{complaint.category}</td>
                    <td className="complaint-description" title={complaint.description}>
                      {complaint.description}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      <div className="complaint-actions">
                        {complaint.status === 'Pending' && (
                          <button
                            className="action-btn action-btn-primary"
                            onClick={() => handleAssignComplaint(complaint)}
                          >
                            Assign
                          </button>
                        )}
                        {complaint.status !== 'In Progress' && (
                          <button
                            className="action-btn action-btn-secondary"
                            onClick={() => handleStatusChange(complaint.id, 'In Progress')}
                          >
                            Start
                          </button>
                        )}
                        {complaint.status !== 'Resolved' && (
                          <button
                            className="action-btn action-btn-success"
                            onClick={() => handleStatusChange(complaint.id, 'Resolved')}
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredComplaints.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666666' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📋</div>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>No complaints found</div>
                <div style={{ fontSize: '14px', color: '#999999' }}>
                  {filters.status !== 'all' || filters.category !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No complaints have been submitted yet.'
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Staff Assignment Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign Staff Member</h3>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}>
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Complaint:</strong> {selectedComplaint?.title}
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Category:</strong> {selectedComplaint?.category}
            </div>

            <div className="staff-list">
              {staff.map(staffMember => (
                <div
                  key={staffMember.id}
                  className={`staff-item ${selectedStaff?.id === staffMember.id ? 'selected' : ''}`}
                  onClick={() => handleStaffSelect(staffMember)}
                >
                  <div className="staff-name">{staffMember.name}</div>
                  <div className="staff-department">{staffMember.department}</div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn modal-btn-secondary"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn-primary"
                onClick={confirmAssignment}
                disabled={!selectedStaff}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
