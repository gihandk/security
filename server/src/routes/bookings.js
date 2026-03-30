import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/bookings — current user's bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { destination: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings
router.post('/', authenticate, async (req, res) => {
  try {
    const { destinationId, checkIn, checkOut, guests, notes } = req.body;

    const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!destination) return res.status(404).json({ error: 'Destination not found' });

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = (destination.pricePerNight || 0) * nights * guests;

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        destinationId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        totalPrice,
        notes,
      },
      include: { destination: true },
    });
    res.status(201).json(booking);
  } catch {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
