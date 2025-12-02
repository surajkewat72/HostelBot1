import axios from 'axios';

// Base URL for API calls (frontend can override by setting REACT_APP_API_URL)
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Authentication utility
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getCurrentUser = () => {
  return {
    token: localStorage.getItem('token'),
    userType: localStorage.getItem('userType'),
    email: localStorage.getItem('userEmail'),
    name: localStorage.getItem('userName'),
    room: localStorage.getItem('userRoom'),
    block: localStorage.getItem('userBlock')
  };
};

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

// Response interceptor to handle 401 errors (logout on invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

// Keep some mock data as fallback for offline development
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
    downvotes: 1,
    image: null,
    votes: {
      'jane.smith@college.edu': 'up',
      'mike.wilson@college.edu': 'up',
      'sarah.jones@college.edu': 'up',
      'alex.brown@college.edu': 'up',
      'emma.davis@college.edu': 'up',
      'david.lee@college.edu': 'down'
    }
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
    downvotes: 0,
    image: null,
    votes: {
      'john.doe@college.edu': 'up',
      'mike.wilson@college.edu': 'up',
      'sarah.jones@college.edu': 'up'
    }
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
    downvotes: 1,
    image: null,
    votes: {
      'john.doe@college.edu': 'up',
      'jane.smith@college.edu': 'up',
      'sarah.jones@college.edu': 'up',
      'alex.brown@college.edu': 'up',
      'emma.davis@college.edu': 'up',
      'david.lee@college.edu': 'up',
      'lisa.wang@college.edu': 'up',
      'tom.chen@college.edu': 'up',
      'anna.kumar@college.edu': 'down'
    }
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
    downvotes: 2,
    image: null,
    votes: {
      'john.doe@college.edu': 'up',
      'jane.smith@college.edu': 'up',
      'mike.wilson@college.edu': 'up',
      'alex.brown@college.edu': 'up',
      'emma.davis@college.edu': 'up',
      'david.lee@college.edu': 'up',
      'lisa.wang@college.edu': 'up',
      'tom.chen@college.edu': 'up',
      'anna.kumar@college.edu': 'up',
      'robert.singh@college.edu': 'up',
      'priya.patel@college.edu': 'up',
      'raj.gupta@college.edu': 'up',
      'sophie.martin@college.edu': 'down',
      'james.wilson@college.edu': 'down'
    }
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
    downvotes: 0,
    image: null,
    votes: {
      'john.doe@college.edu': 'up',
      'mike.wilson@college.edu': 'up'
    }
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
    // Call backend login
    const res = await api.post('/auth/login', { email, password });
    // backend returns { token, user }
    const { token, user } = res.data;
    
    // Validate user object
    if (typeof user !== 'object' || !user) {
      throw new Error('Invalid user data received');
    }
    
    // Clear any existing data first
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoom');
    localStorage.removeItem('userBlock');
    
    // Store strings only - never objects
    localStorage.setItem('token', String(token));
    localStorage.setItem('userType', String(user.userType || 'student'));
    localStorage.setItem('userEmail', String(user.email || ''));
    localStorage.setItem('userName', String(user.name || ''));
    if (user.room) localStorage.setItem('userRoom', String(user.room));
    if (user.block) localStorage.setItem('userBlock', String(user.block));
    
    return res;
  },

  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    const { token, user } = res.data;
    
    // Validate user object
    if (typeof user !== 'object' || !user) {
      throw new Error('Invalid user data received');
    }
    
    // Clear any existing data first
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoom');
    localStorage.removeItem('userBlock');
    
    // Store strings only - never objects
    localStorage.setItem('token', String(token));
    localStorage.setItem('userType', String(user.userType || 'student'));
    localStorage.setItem('userEmail', String(user.email || ''));
    localStorage.setItem('userName', String(user.name || ''));
    if (user.room) localStorage.setItem('userRoom', String(user.room));
    if (user.block) localStorage.setItem('userBlock', String(user.block));
    
    return res;
  },

  me: async () => {
    const res = await api.get('/auth/me');
    const user = res.data;
    // update localStorage
    localStorage.setItem('userType', user.userType || user.type || 'student');
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name || '');
    if (user.room) localStorage.setItem('userRoom', user.room);
    if (user.block) localStorage.setItem('userBlock', user.block);
    return res;
  }
};

export const complaintsAPI = {
  getComplaints: async (userType) => {
    // For admin, pass ?userType=admin to get all complaints
    const params = {};
    if (userType === 'admin') params.userType = 'admin';
    const res = await api.get('/complaints', { params });
    return res;
  },

  createComplaint: async (complaintData) => {
    const res = await api.post('/complaints', complaintData);
    return res;
  },

  updateComplaintStatus: async (complaintId, status) => {
    const res = await api.put(`/complaints/${complaintId}/status`, { status });
    return res;
  },

  assignComplaint: async (complaintId, staffId) => {
    const res = await api.post(`/complaints/${complaintId}/assign`, { staffId });
    return res;
  }
};

export const staffAPI = {
  getStaff: async () => {
    const res = await api.get('/staff');
    return res;
  }
};

export const feedbackAPI = {
  submitFeedback: async (complaintId, rating, comment) => {
    const res = await api.post('/feedback', { complaintId, rating, comment });
    return res;
  }
};

export const votingAPI = {
  voteComplaint: async (complaintId, voteType) => {
    const res = await api.post(`/complaints/${complaintId}/vote`, { voteType });
    return res;
  }
};

export default api;
