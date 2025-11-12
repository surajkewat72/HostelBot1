const express = require('express');
const prisma = require('../prismaClient');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { complaintId, rating, comment } = req.body;
    if (!complaintId || !rating || !comment) return res.status(400).json({ error: 'Missing fields' });

    // ensure complaint exists and is resolved
    const complaint = await prisma.complaint.findUnique({ where: { id: parseInt(complaintId) } });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    if (complaint.status !== 'Resolved') return res.status(400).json({ error: 'Complaint not resolved' });

    const feedback = await prisma.feedback.create({ data: { complaintId: parseInt(complaintId), rating: parseInt(rating), comment, userId: req.user.id } });
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
