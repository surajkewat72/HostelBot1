require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const complaintsRoutes = require('./routes/complaints');
const feedbackRoutes = require('./routes/feedback');
const prisma = require('./prismaClient');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/feedback', feedbackRoutes);

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
});
