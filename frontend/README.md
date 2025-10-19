# HostelBot - Hostel Complaint Management System

A modern, responsive React frontend for managing hostel complaints with a clean, minimalist design.

## 🎯 Features

### Student Features
- **User Authentication**: Login/Signup with college email validation
- **Dashboard**: View complaint statistics and quick actions
- **Complaint Management**: Submit, view, and track complaints
- **File Upload**: Support for images and videos
- **Feedback System**: Rate and comment on resolved complaints

### Admin Features
- **Admin Panel**: Comprehensive complaint management
- **Staff Assignment**: Assign complaints to staff members
- **Status Management**: Update complaint status (Pending, In Progress, Resolved)
- **Filtering**: Filter complaints by status and category
- **Statistics**: View complaint statistics and trends

## 🎨 Design System

### Colors
- **Primary**: #F4C542 (Gold Yellow)
- **Secondary**: #FFF9E6 (Light Beige)
- **Background**: #FFFDF5 (Soft Beige)
- **Text**: #222222 (Dark Gray)
- **Accent**: #4B4B4B (Medium Gray)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: 8px border radius, smooth hover transitions
- **Forms**: Clean inputs with focus states
- **Status Badges**: Color-coded for different states

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HostelBot1/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── App.js                 # Main app component with routing
├── index.js              # Entry point
├── components/           # Reusable components
│   ├── Navbar.js
│   ├── Sidebar.js
│   ├── ComplaintCard.js
│   └── ProtectedRoute.js
├── pages/               # Page components
│   ├── Login.js
│   ├── Signup.js
│   ├── Dashboard.js
│   ├── ComplaintForm.js
│   ├── AdminPanel.js
│   └── Feedback.js
├── styles/              # CSS files
│   ├── global.css
│   ├── login.css
│   ├── signup.css
│   ├── dashboard.css
│   ├── complaint.css
│   ├── admin.css
│   └── feedback.css
└── utils/               # Utility functions
    └── api.js           # API calls and mock data
```

## 🔐 Authentication

The app uses JWT tokens stored in localStorage for authentication:

- **Student Login**: `student@college.edu` / `password123`
- **Admin Login**: `admin@college.edu` / `password123`

### User Roles
- **Student**: Can submit and view their own complaints
- **Admin**: Can manage all complaints and assign staff

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full sidebar layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Stack layout with touch-friendly controls

## 🎯 Key Pages

### 1. Login Page
- Clean card-based design
- Email validation (@college.edu domain)
- Role-based login (Student/Admin)
- Forgot password and signup links

### 2. Student Dashboard
- Statistics cards showing complaint counts
- Tabbed interface (My Complaints / Submit Complaint)
- Quick action buttons
- Filterable complaint list

### 3. Admin Panel
- Comprehensive complaint management table
- Staff assignment modal
- Status update controls
- Advanced filtering options

### 4. Complaint Form
- Category selection (Electricity, Water, Mess Food, Wi-Fi, Other)
- File upload with drag & drop
- Form validation
- Responsive design

### 5. Feedback Page
- Star rating system (1-5 stars)
- Comment section
- Success confirmation
- Navigation back to dashboard

## 🛠️ Technologies Used

- **React 18**: Frontend framework
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Styling with custom properties
- **Google Fonts**: Inter font family

## 📊 Mock Data

The application includes comprehensive mock data:
- 5 sample complaints with different statuses
- 5 staff members across different departments
- Realistic complaint categories and descriptions

## 🔧 Customization

### Adding New Complaint Categories
Edit the `categories` array in `ComplaintForm.js`:
```javascript
const categories = [
  'Electricity',
  'Water',
  'Mess Food',
  'Wi-Fi',
  'Other',
  'New Category' // Add here
];
```

### Modifying Colors
Update CSS custom properties in `global.css`:
```css
:root {
  --primary-color: #F4C542;
  --secondary-color: #FFF9E6;
  --background-color: #FFFDF5;
}
```

## 🚀 Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify

### Vercel
1. Connect your GitHub repository
2. Vercel will automatically build and deploy

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json
3. Run: `npm run deploy`

## 📝 License

This project is created for educational purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please contact the development team.

---

**HostelBot** - Making hostel life better, one complaint at a time! 🏠✨
