import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/blog
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      include: { author: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/blog/:slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: { author: { select: { name: true, avatar: true } } },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/blog — admin only
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const post = await prisma.blogPost.create({
      data: { ...req.body, authorId: req.user.id },
    });
    res.status(201).json(post);
  } catch {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;
