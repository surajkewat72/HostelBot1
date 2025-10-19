import axios from 'axios';

// Base URL for API calls
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRoom');
      localStorage.removeItem('userBlock');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for development
export const mockComplaints = [
  {
    id: 1,
    title: 'Power Outage in Block A',
    category: 'Electricity',
    description: 'No electricity in room 101 since morning. All electronic devices are dead.',
    status: 'Pending',
    date: '2024-01-15',
    student: 'john.doe@college.edu',
    room: '101',
    block: 'A',
    upvotes: 5,
    image: null
  },
  {
    id: 2,
    title: 'Water Leak in Bathroom',
    category: 'Water',
    description: 'Continuous water leak from the ceiling in the common bathroom.',
    status: 'In Progress',
    date: '2024-01-14',
    student: 'jane.smith@college.edu',
    room: '205',
    block: 'B',
    upvotes: 3,
    image: null
  },
  {
    id: 3,
    title: 'Poor Wi-Fi Connection',
    category: 'Wi-Fi',
    description: 'Very slow internet speed in room 150. Cannot attend online classes.',
    status: 'Resolved',
    date: '2024-01-13',
    student: 'mike.wilson@college.edu',
    room: '150',
    block: 'C',
    upvotes: 8,
    image: null
  },
  {
    id: 4,
    title: 'Mess Food Quality',
    category: 'Mess Food',
    description: 'Food served in mess is cold and not properly cooked.',
    status: 'Pending',
    date: '2024-01-12',
    student: 'sarah.jones@college.edu',
    room: '89',
    block: 'A',
    upvotes: 12,
    image: null
  },
  {
    id: 5,
    title: 'Broken Door Lock',
    category: 'Other',
    description: 'Room door lock is broken and cannot be locked properly.',
    status: 'In Progress',
    date: '2024-01-11',
    student: 'alex.brown@college.edu',
    room: '67',
    block: 'B',
    upvotes: 2,
    image: null
  }
];

export const mockStaff = [
  { id: 1, name: 'John Maintenance', department: 'Maintenance' },
  { id: 2, name: 'Sarah Electrician', department: 'Electrical' },
  { id: 3, name: 'Mike Plumber', department: 'Plumbing' },
  { id: 4, name: 'Lisa IT Support', department: 'IT' },
  { id: 5, name: 'David Mess Manager', department: 'Mess' }
];

// API functions
export const authAPI = {
  login: async (email, password, userType) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: `mock-jwt-token-${userType}-${Date.now()}`,
            user: {
              email,
              type: userType,
              name: userType === 'student' ? 'Student User' : 'Admin User'
            }
          }
        });
      }, 1000);
    });
  },

  signup: async (userData) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: `mock-jwt-token-student-${Date.now()}`,
            user: {
              ...userData,
              type: 'student'
            }
          }
        });
      }, 1500);
    });
  }
};

export const complaintsAPI = {
  getComplaints: async (userType, userEmail) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userType === 'admin') {
          resolve({ data: mockComplaints });
        } else {
          // Filter complaints for specific student
          const studentComplaints = mockComplaints.filter(
            complaint => complaint.student === userEmail
          );
          resolve({ data: studentComplaints });
        }
      }, 500);
    });
  },

  createComplaint: async (complaintData) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComplaint = {
          id: mockComplaints.length + 1,
          ...complaintData,
          status: 'Pending',
          date: new Date().toISOString().split('T')[0],
          upvotes: 0
        };
        mockComplaints.unshift(newComplaint);
        resolve({ data: newComplaint });
      }, 1000);
    });
  },

  updateComplaintStatus: async (complaintId, status) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const complaint = mockComplaints.find(c => c.id === complaintId);
        if (complaint) {
          complaint.status = status;
        }
        resolve({ data: complaint });
      }, 500);
    });
  },

  assignComplaint: async (complaintId, staffId) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const complaint = mockComplaints.find(c => c.id === complaintId);
        const staff = mockStaff.find(s => s.id === staffId);
        if (complaint && staff) {
          complaint.assignedTo = staff;
          complaint.status = 'In Progress';
        }
        resolve({ data: complaint });
      }, 500);
    });
  }
};

export const staffAPI = {
  getStaff: async () => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockStaff });
      }, 300);
    });
  }
};

export const feedbackAPI = {
  submitFeedback: async (complaintId, rating, comment) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const complaint = mockComplaints.find(c => c.id === complaintId);
        if (complaint) {
          complaint.feedback = { rating, comment, date: new Date().toISOString() };
        }
        resolve({ data: complaint });
      }, 500);
    });
  }
};

export default api;
