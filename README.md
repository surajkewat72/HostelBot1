# HostelBot - Hostel Complaint Management System

A full-stack web application for managing hostel complaints with voting, staff assignment, and feedback features.

## 🏗️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- CSS3

**Backend:**
- Node.js + Express
- Prisma ORM
- MySQL Database
- JWT Authentication
- bcrypt for password hashing

## 📁 Project Structure

```
HostelBot1/
├── backend/          # Express API server
│   ├── src/
│   │   ├── index.js          # Server entry point
│   │   ├── prismaClient.js   # Prisma client instance
│   │   ├── middleware/       # Auth middleware
│   │   └── routes/           # API routes
│   └── prisma/
│       ├── schema.prisma     # Database schema
│       └── seed.js           # Seed data script
└── frontend/         # React application
    ├── src/
    │   ├── App.js            # Main app component
    │   ├── components/       # Reusable components
    │   ├── pages/            # Page components
    │   ├── styles/           # CSS files
    │   └── utils/            # API utilities
    └── public/
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd HostelBot1/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Update `.env` file with your MySQL credentials:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/HostelBot"
   JWT_SECRET="your_secure_random_secret_key"
   PORT=5001
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Seed initial data (optional - creates admin user and staff):**
   ```bash
   npm run seed
   ```
   Default admin credentials: `admin@college.edu` / `admin123`

7. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   Backend will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd HostelBot1/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   - The `.env` file is already configured to point to `http://localhost:5001/api`
   - Modify if your backend runs on a different port

4. **Start the development server:**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## 🎯 Features

### Student Features
- User registration and login
- Submit complaints with category, description, and optional images
- View all complaints with voting system
- Upvote/downvote complaints
- Track own complaints status
- Submit feedback for resolved complaints

### Admin Features
- View all complaints
- Assign complaints to staff members
- Update complaint status (Pending → In Progress → Resolved)
- View feedback and ratings

### Authentication
- JWT-based authentication
- Protected routes for logged-in users
- Role-based access control (student/admin)

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Complaints
- `GET /api/complaints` - List complaints
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id/status` - Update status
- `POST /api/complaints/:id/assign` - Assign to staff
- `POST /api/complaints/:id/vote` - Vote on complaint

### Staff
- `GET /api/staff` - List all staff members

### Feedback
- `POST /api/feedback` - Submit feedback for resolved complaint

## 🗄️ Database Schema

- **User** - Students and admins
- **Staff** - Maintenance staff with departments
- **Complaint** - Complaint tickets with status tracking
- **Vote** - Upvote/downvote system
- **Feedback** - Post-resolution feedback and ratings

## 🛠️ Development

### Quick Start Commands

**Start Backend (with auto-reload):**
```bash
cd HostelBot1/backend
npm run dev
```

**Start Frontend:**
```bash
cd HostelBot1/frontend
npm start
```

**Start Both Servers at Once:**
```bash
cd HostelBot1
./start-dev.sh
```

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start  # Hot reload enabled
```

### Database Management

**View/Edit database with Prisma Studio:**
```bash
cd backend
npx prisma studio
```

**Create new migration:**
```bash
npx prisma migrate dev --name migration_name
```

**Reset database (development only):**
```bash
npx prisma migrate reset
```

## 🌐 Production Build

### Backend
```bash
cd backend
npm start
```
Consider using PM2 or similar process manager for production.

### Frontend
```bash
cd frontend
npm run build
```
Serve the `build/` folder with a static file server.

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5001 (backend)
lsof -ti :5001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti :3000 | xargs kill -9
```

**Database connection issues:**
- Verify MySQL is running
- Check DATABASE_URL in `.env`
- Ensure database `HostelBot` exists

**Prisma errors:**
```bash
# Regenerate Prisma client
npx prisma generate

# Check migration status
npx prisma migrate status
```

## 📝 License

MIT

## 👥 Contributors

Created for hostel management automation.
