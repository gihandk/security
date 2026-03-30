import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// GET /api/admin/stats — dashboard numbers
router.get('/stats', async (req, res) => {
  try {
    const [users, destinations, bookings, revenue, subscribers] = await Promise.all([
      prisma.user.count(),
      prisma.destination.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.newsletterSubscriber.count(),
    ]);
    res.json({
      users,
      destinations,
      bookings,
      revenue: revenue._sum.totalPrice || 0,
      subscribers,
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/bookings — all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        destination: { select: { name: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PUT /api/admin/bookings/:id — update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(booking);
  } catch {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// GET /api/admin/newsletter
router.get('/newsletter', async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
    res.json(subscribers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// DELETE /api/admin/destinations/:id
router.delete('/destinations/:id', async (req, res) => {
  try {
    await prisma.destination.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Destination deactivated' });
  } catch {
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

// GET /api/admin/blog — all posts (including unpublished)
router.get('/blog', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// PUT /api/admin/blog/:id — update blog post (publish/unpublish/edit)
router.put('/blog/:id', async (req, res) => {
  try {
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(post);
  } catch {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/admin/blog/:id
router.delete('/blog/:id', async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
