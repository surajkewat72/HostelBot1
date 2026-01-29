import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const isAuthenticated = () => !!localStorage.getItem('token');

export const getCurrentUser = () => ({
  token: localStorage.getItem('token'),
  userType: localStorage.getItem('userType'),
  email: localStorage.getItem('userEmail'),
  name: localStorage.getItem('userName'),
  room: localStorage.getItem('userRoom'),
  block: localStorage.getItem('userBlock')
});

const clearUserData = () => {
  ['token', 'userType', 'userEmail', 'userName', 'userRoom', 'userBlock'].forEach(key => 
    localStorage.removeItem(key)
  );
};

const storeUserData = (token, user) => {
  if (!user || typeof user !== 'object') throw new Error('Invalid user data');
  
  clearUserData();
  localStorage.setItem('token', String(token));
  localStorage.setItem('userType', String(user.userType || 'student'));
  localStorage.setItem('userEmail', String(user.email || ''));
  localStorage.setItem('userName', String(user.name || ''));
  if (user.room) localStorage.setItem('userRoom', String(user.room));
  if (user.block) localStorage.setItem('userBlock', String(user.block));
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearUserData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const mockComplaints = [
  {
    id: 1,
    title: 'Power Outage in Block A',
    category: 'Electricity',
    description: 'No electricity in room 101 since morning.',
    status: 'Pending',
    date: '2024-01-15',
    student: 'john.doe@college.edu',
    room: '101',
    block: 'A',
    upvotes: 5,
    downvotes: 1,
    image: null
  },
  {
    id: 2,
    title: 'Water Leak in Bathroom',
    category: 'Water',
    description: 'Continuous water leak from ceiling.',
    status: 'In Progress',
    date: '2024-01-14',
    student: 'jane.smith@college.edu',
    room: '205',
    block: 'B',
    upvotes: 3,
    downvotes: 0,
    image: null
  }
];

export const mockStaff = [
  { id: 1, name: 'John Maintenance', department: 'Maintenance' },
  { id: 2, name: 'Sarah Electrician', department: 'Electrical' },
  { id: 3, name: 'Mike Plumber', department: 'Plumbing' }
];

export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    storeUserData(res.data.token, res.data.user);
    return res;
  },

  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    storeUserData(res.data.token, res.data.user);
    return res;
  },

  me: async () => {
    const res = await api.get('/auth/me');
    const user = res.data;
    localStorage.setItem('userType', user.userType || 'student');
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name || '');
    if (user.room) localStorage.setItem('userRoom', user.room);
    if (user.block) localStorage.setItem('userBlock', user.block);
    return res;
  }
};

export const complaintsAPI = {
  getComplaints: async (userType) => {
    const params = userType === 'admin' ? { userType: 'admin' } : {};
    return await api.get('/complaints', { params });
  },

  createComplaint: async (complaintData) => api.post('/complaints', complaintData),

  updateComplaint: async (complaintId, complaintData) => 
    api.put(`/complaints/${complaintId}`, complaintData),

  deleteComplaint: async (complaintId) => api.delete(`/complaints/${complaintId}`),

  updateComplaintStatus: async (complaintId, status) => 
    api.put(`/complaints/${complaintId}/status`, { status }),

  assignComplaint: async (complaintId, staffId) => 
    api.post(`/complaints/${complaintId}/assign`, { staffId })
};

export const staffAPI = {
  getStaff: async () => api.get('/staff')
};

export const feedbackAPI = {
  submitFeedback: async (complaintId, rating, comment) => 
    api.post('/feedback', { complaintId, rating, comment })
};

export const votingAPI = {
  voteComplaint: async (complaintId, voteType) => 
    api.post(`/complaints/${complaintId}/vote`, { voteType })
};

export default api;
