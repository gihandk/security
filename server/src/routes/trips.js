import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/trips — current user's trip plans
router.get('/', authenticate, async (req, res) => {
  try {
    const trips = await prisma.tripPlan.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { destination: true }, orderBy: [{ dayNumber: 'asc' }, { order: 'asc' }] } },
      orderBy: { startDate: 'asc' },
    });
    res.json(trips);
  } catch {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// POST /api/trips
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, startDate, endDate, notes } = req.body;
    const trip = await prisma.tripPlan.create({
      data: { userId: req.user.id, title, startDate: new Date(startDate), endDate: new Date(endDate), notes },
    });
    res.status(201).json(trip);
  } catch {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// POST /api/trips/:id/items — add destination to trip
router.post('/:id/items', authenticate, async (req, res) => {
  try {
    const { destinationId, dayNumber, order, notes } = req.body;
    const item = await prisma.tripItem.create({
      data: { tripPlanId: req.params.id, destinationId, dayNumber, order, notes },
      include: { destination: true },
    });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Failed to add item to trip' });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await prisma.tripItem.deleteMany({ where: { tripPlanId: req.params.id } });
    await prisma.tripPlan.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: 'Trip deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

export default router;
