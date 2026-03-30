import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email, userId } = req.body;
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, userId: userId || null },
    });
    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  } catch {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// DELETE /api/newsletter/unsubscribe
router.delete('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    await prisma.newsletterSubscriber.delete({ where: { email } });
    res.json({ message: 'Unsubscribed successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;
