const express = require('express');
const prisma = require('../prismaClient');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get complaints. If userType=admin or authenticated admin -> all complaints
router.get('/', authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { userType, userEmail } = req.query;

    if (user.userType === 'admin' || userType === 'admin') {
      const complaints = await prisma.complaint.findMany({ include: { assignedTo: true, student: true, votes: true, feedback: true } });
      return res.json(complaints);
    }

    // For student, return only their complaints
    const complaints = await prisma.complaint.findMany({ where: { studentId: user.id }, include: { assignedTo: true, votes: true, feedback: true } });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create complaint
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, category, imageUrl, room, block } = req.body;
    if (!title || !description || !category) return res.status(400).json({ error: 'Missing fields' });

    const complaint = await prisma.complaint.create({ data: {
      title,
      description,
      category,
      imageUrl,
      room,
      block,
      studentId: req.user.id
    }, include: { student: true } });

    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update status
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Missing status' });

    const updated = await prisma.complaint.update({ where: { id: parseInt(id) }, data: { status } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Assign complaint to staff
router.post('/:id/assign', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;
    if (!staffId) return res.status(400).json({ error: 'Missing staffId' });

    const updated = await prisma.complaint.update({ where: { id: parseInt(id) }, data: { assignedToId: staffId, status: 'In Progress' }, include: { assignedTo: true } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vote (toggle)
router.post('/:id/vote', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;
    if (!voteType || !['up','down'].includes(voteType)) return res.status(400).json({ error: 'Invalid vote' });

    const complaintId = parseInt(id);
    const userId = req.user.id;

    const existing = await prisma.vote.findUnique({ where: { userId_complaintId: { userId, complaintId } } }).catch(()=>null);

    if (existing) {
      // If same voteType -> remove vote, else update
      if (existing.voteType === voteType) {
        await prisma.vote.delete({ where: { id: existing.id } });
        return res.json({ message: 'Vote removed' });
      } else {
        const updated = await prisma.vote.update({ where: { id: existing.id }, data: { voteType } });
        return res.json(updated);
      }
    }

    const created = await prisma.vote.create({ data: { voteType, userId, complaintId } });
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
