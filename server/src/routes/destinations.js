import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/destinations — list with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, city, country, search } = req.query;
    const destinations = await prisma.destination.findMany({
      where: {
        isActive: true,
        ...(type && { type }),
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        ...(country && { country: { contains: country, mode: 'insensitive' } }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { reviews: { select: { rating: true } } },
    });
    res.json(destinations);
  } catch {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET /api/destinations/:slug
router.get('/:slug', async (req, res) => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { slug: req.params.slug },
      include: {
        reviews: { include: { user: { select: { name: true, avatar: true } } } },
      },
    });
    if (!destination) return res.status(404).json({ error: 'Not found' });
    res.json(destination);
  } catch {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// POST /api/destinations — admin only
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const destination = await prisma.destination.create({ data: req.body });
    res.status(201).json(destination);
  } catch {
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

// PUT /api/destinations/:id — admin only
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const destination = await prisma.destination.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(destination);
  } catch {
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

export default router;
