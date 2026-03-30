import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/reviews
router.post('/', authenticate, async (req, res) => {
  try {
    const { destinationId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: { userId: req.user.id, destinationId, rating, comment },
      include: { user: { select: { name: true, avatar: true } } },
    });
    res.status(201).json(review);
  } catch {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

export default router;
