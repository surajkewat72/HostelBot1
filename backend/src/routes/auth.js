const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, room, block, userType } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'This email is already registered. Please use a different email or login.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { name, email, password: hash, room, block, userType: userType || 'student' },
      select: { id: true, email: true, name: true, userType: true, room: true, block: true }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        userType: user.userType, 
        room: user.room || null, 
        block: user.block || null 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'No account found with this email. Please check your email or sign up.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Incorrect password. Please try again.' });

    // Validate that the user is trying to login with the correct role
    if (userType && user.userType !== userType) {
      const correctRole = user.userType === 'admin' ? 'Admin' : 'Student';
      const attemptedRole = userType === 'admin' ? 'Admin' : 'Student';
      return res.status(403).json({ 
        error: `This account is registered as ${correctRole}. Please use "Login as ${correctRole}" button.` 
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        userType: user.userType, 
        room: user.room || null, 
        block: user.block || null 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const { authenticate } = require('../middleware/auth');
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({ id: user.id, email: user.email, name: user.name, userType: user.userType, room: user.room, block: user.block });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
