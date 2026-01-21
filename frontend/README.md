# HostelBot Frontend

React-based user interface for the Hostel Complaint Management System.

## What This Does

This is the frontend (user interface) part of HostelBot where students and admins can:
- Submit and track hostel complaints
- Vote on important issues
- Give feedback on resolved complaints
- Manage complaints (admin only)

## How to Run

1. **Install packages:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npm start
   ```

3. **Open in browser:** Go to `http://localhost:3000`

## Key Features

**For Students:**
- Login/Signup
- Submit complaints with images
- Track complaint status
- Vote on complaints
- Give feedback

**For Admins:**
- View all complaints
- Assign staff to complaints
- Update complaint status
- View statistics

## Pages

- **Login/Signup** - User authentication
- **Dashboard** - Overview of your complaints
- **Submit Complaint** - Report a new issue
- **My Complaints** - Track your submissions
- **All Complaints** - View all complaints (admin)
- **Admin Panel** - Manage all complaints (admin)
- **Feedback** - Rate resolved complaints
- **Profile** - View your information

## Project Folder Structure

```
src/
├── pages/          # Different pages (Login, Dashboard, etc.)
├── components/     # Reusable parts (Sidebar, ComplaintCard, etc.)
├── styles/         # CSS styling files
└── utils/          # Helper functions (API calls)
```

## Authentication

The app uses JWT tokens stored in localStorage for authentication:

- **Student Login**: `student@college.edu` / `password123`
- **Admin Login**: `admin@college.edu` / `password123`

### User Roles
- **Student**: Can submit and view their own complaints
- **Admin**: Can manage all complaints and assign staff

## Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full sidebar layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Stack layout with touch-friendly controls

## Key Pages

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

## Technologies Used

- **React 18**: Frontend framework
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Styling with custom properties
- **Google Fonts**: Inter font family

## Mock Data

The application includes comprehensive mock data:
- 5 sample complaints with different statuses
- 5 staff members across different departments
- Realistic complaint categories and descriptions

## Customization

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

## Deployment

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

## License

This project is created for educational purposes. Feel free to use and modify as needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For questions or support, please contact the development team.

---

**HostelBot** - Making hostel life better, one complaint at a time!
