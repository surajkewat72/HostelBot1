# HostelBot Backend

Server-side API for the Hostel Complaint Management System.

## What This Does

This is the backend (server) that:
- Stores data in a database
- Handles user authentication
- Manages complaints, staff, and feedback
- Provides APIs for the frontend to use

## Technology Used

- **Node.js + Express** - Web server
- **Prisma** - Database tool
- **PostgreSQL** - Database
- **JWT** - Secure user login

## How to Run

1. **Install packages:**
   ```bash
   npm install
   ```

2. **Set up environment file:**
   - Create a `.env` file with:
   ```
   DATABASE_URL="your_database_url_here"
   JWT_SECRET="your_secret_key_here"
   PORT=5001
   ```

3. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Add sample data (optional):**
   ```bash
   npm run seed
   ```
   This creates an admin user: `admin@college.edu` / `admin123`

5. **Start the server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5001`

## API Endpoints

**Authentication:**
- `POST /api/auth/signup` - Register new student
- `POST /api/auth/login` - Login and get token

**Complaints:**
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create new complaint
- `PUT /api/complaints/:id/status` - Update status
- `POST /api/complaints/:id/assign` - Assign staff
- `POST /api/complaints/:id/vote` - Vote on complaint

**Other:**
- `GET /api/staff` - Get staff list
- `POST /api/feedback` - Submit feedback

## Database Schema

The database includes tables for:
- **User** - Students and admins
- **Complaint** - Submitted complaints
- **Staff** - Maintenance staff
- **Vote** - Student votes on complaints
- **Feedback** - Ratings and comments
