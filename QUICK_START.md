# 🚀 Quick Start Guide - HostelBot

## ✅ How to Start EVERYTHING (MySQL + Backend + Frontend)

From the **root directory** (`HostelBot1/`), run:

```bash
npm run dev
```

This will automatically:
- ✅ Check and start MySQL if not running
- ✅ Test database connection
- ✅ Clean up any existing processes
- ✅ Start Backend server (port 5001)
- ✅ Start Frontend server (port 3000)

**That's it! One command does everything!**

---

## Alternative: If MySQL is Already Running

If you know MySQL is running, you can use:

```bash
npm start
```

This starts only backend and frontend.

---

## Stopping the Servers

Press `Ctrl + C` in the terminal to stop both servers.

---

## Manual MySQL Commands

**Start MySQL:**
```bash
npm run mysql-start
```

**Stop MySQL:**
```bash
npm run mysql-stop
```

**Check MySQL Status:**
```bash
npm run mysql-status
```

---

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/api/health

---

## Test Account

- **Email:** suraj@gmail.com
- **Password:** 123456

Or create a new account on the signup page.

---

**🎉 From now on, just run `npm run dev` every day and everything starts automatically!**
