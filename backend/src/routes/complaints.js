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
      const complaints = await prisma.complaint.findMany({ 
        include: { 
          assignedTo: true, 
          student: { 
            select: { 
              id: true, 
              name: true, 
              email: true, 
              userType: true, 
              room: true, 
              block: true 
            } 
          }, 
          votes: { include: { user: { select: { id: true, name: true, email: true } } } }, 
          feedback: true 
        } 
      });
      return res.json(complaints);
    }

    // For student, return only their complaints
    const complaints = await prisma.complaint.findMany({ 
      where: { studentId: user.id }, 
      include: { 
        assignedTo: true, 
        votes: { include: { user: { select: { id: true, name: true, email: true } } } }, 
        feedback: true 
      } 
    });
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

    const complaint = await prisma.complaint.create({ 
      data: {
        title,
        description,
        category,
        imageUrl,
        room,
        block,
        studentId: req.user.id
      }, 
      include: { 
        student: { 
          select: { 
            id: true, 
            name: true, 
            email: true, 
            userType: true, 
            room: true, 
            block: true 
          } 
        } 
      } 
    });

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

// Update complaint (only by owner)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, imageUrl, room, block } = req.body;
    const complaintId = parseInt(id);

    // Check if complaint exists and belongs to user
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    if (complaint.studentId !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'You can only edit your own complaints' });
    }

    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: { title, description, category, imageUrl, room, block },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
            room: true,
            block: true
          }
        },
        votes: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete complaint (only by owner)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const complaintId = parseInt(id);

    // Check if complaint exists and belongs to user
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    if (complaint.studentId !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own complaints' });
    }

    // Delete related votes and feedback first
    await prisma.vote.deleteMany({ where: { complaintId } });
    await prisma.feedback.deleteMany({ where: { complaintId } });
    
    // Delete the complaint
    await prisma.complaint.delete({ where: { id: complaintId } });
    res.json({ message: 'Complaint deleted successfully' });
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

    // Check if user has already voted
    const existing = await prisma.vote.findFirst({ 
      where: { 
        userId: userId, 
        complaintId: complaintId 
      } 
    });

    if (existing) {
      // If same voteType -> remove vote (toggle off)
      if (existing.voteType === voteType) {
        await prisma.vote.delete({ where: { id: existing.id } });
        return res.json({ message: 'Vote removed' });
      } else {
        // Different voteType -> update vote
        const updated = await prisma.vote.update({ 
          where: { id: existing.id }, 
          data: { voteType } 
        });
        return res.json(updated);
      }
    }

    // No existing vote -> create new vote
    const created = await prisma.vote.create({ 
      data: { voteType, userId, complaintId } 
    });
    res.json(created);
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
