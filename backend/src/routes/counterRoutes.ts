import { Router } from 'express';
import { prisma } from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all counters
router.get('/', async (req, res) => {
  try {
    const counters = await prisma.counter.findMany({
      include: { service: true }
    });
    res.json(counters);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create counter (Admin)
router.post('/', authenticate, async (req, res) => {
  const { name, serviceId } = req.body;
  try {
    const counter = await prisma.counter.create({
      data: { name, serviceId }
    });
    res.json(counter);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
