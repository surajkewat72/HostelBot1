# HostelBot

A simple hostel complaint management system where students can report issues and track their status.

## What is This?

HostelBot helps hostel students:
- Report problems (broken furniture, plumbing issues, etc.)
- Track complaint status (pending, in progress, resolved)
- Vote on important issues
- Give feedback once problems are fixed

Admins can:
- View all complaints
- Assign staff to fix issues
- Update complaint status

## Technology Used

**Frontend (User Interface):**
- React - for building the website
- CSS - for styling

**Backend (Server):**
- Node.js + Express - web server
- Prisma - database management
- PostgreSQL - database
- JWT - secure login

## Folder Structure

```
HostelBot1/
├── frontend/        # React website (what users see)
│   ├── src/pages/       # Different pages
│   ├── src/components/  # Reusable parts
│   └── src/styles/      # CSS files
│
└── backend/         # Server code
    ├── src/routes/      # API endpoints
    ├── prisma/          # Database setup
    └── src/middleware/  # Authentication
```

## How to Run This Project

### What You Need First

- Node.js installed on your computer
- PostgreSQL database
- A code editor (like VS Code)

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
DATABASE_URL="your_database_connection_here"
JWT_SECRET="any_random_secret_text"
PORT=5001
```

Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5001`

### Step 2: Start the Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm start
```

The website will open at `http://localhost:3000`

## Default Login

After running `npm run seed`, you can login with:
- **Email:** admin@gmail.com
- **Password:** admin123

## Main Features

**For Students:**
- Create account and login
- Submit complaints with images
- See all complaints
- Vote on complaints
- Track your complaint status
- Give feedback on fixed issues

**For Admins:**
- See all complaints
- Assign complaints to staff
- Update complaint status
- View statistics
**For Admins:**
- See all complaints
- Assign complaints to staff
- Update complaint status
- View statistics

## Available Pages

- **Login** - Sign in to your account
- **Signup** - Create a new account
- **Dashboard** - Overview of your complaints
- **Submit Complaint** - Report a new issue
- **My Complaints** - See your submitted complaints
- **All Complaints** - View all complaints (with voting)
- **Admin Panel** - Manage everything (admins only)
- **Feedback** - Rate resolved complaints
- **Profile** - View your information

## Need Help?

**Can't connect to database?**
- Make sure PostgreSQL is running
- Check your DATABASE_URL in the .env file

**Port already in use?**
```bash
# For backend (port 5001)
lsof -ti :5001 | xargs kill -9

# For frontend (port 3000)
lsof -ti :3000 | xargs kill -9
```

**Want to reset the database?**
```bash
cd backend
npx prisma migrate reset
```
