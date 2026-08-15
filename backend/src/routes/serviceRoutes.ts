import { Router } from 'express';
import { prisma } from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all active services (public)
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { tokens: { where: { status: 'WAITING' } } }
        }
      }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
router.post('/', authenticate, async (req, res) => {
  const { name, prefix } = req.body;
  try {
    const service = await prisma.service.create({
      data: { name, prefix }
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
