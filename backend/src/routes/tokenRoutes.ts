import { Router } from 'express';
import { prisma } from '../db';
import { io } from '../index';
import { SmsService } from '../services/smsService';
import { authenticate } from '../middleware/auth';

const router = Router();

// 1. Generate Token (Public)
router.post('/generate', async (req, res) => {
  const { name, phoneNumber, language, serviceId } = req.body;
  
  try {
    // Basic validation
    if (!name || !phoneNumber || !serviceId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get service details
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Database transaction to ensure atomic token generation
    const result = await prisma.$transaction(async (tx) => {
      // Find today's tokens for this service to determine next number
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const count = await tx.token.count({
        where: {
          serviceId,
          createdAt: { gte: today }
        }
      });

      const nextNumber = count + 1;
      const tokenString = `${service.prefix}-${nextNumber.toString().padStart(3, '0')}`;

      // Find or create customer
      let customer = await tx.customer.findFirst({ where: { phoneNumber } });
      if (!customer) {
        customer = await tx.customer.create({
          data: { name, phoneNumber, language }
        });
      } else {
        // Update language if different
        await tx.customer.update({ where: { id: customer.id }, data: { language } });
      }

      // Create token
      const token = await tx.token.create({
        data: {
          tokenNumber: tokenString,
          customerId: customer.id,
          serviceId: service.id,
        },
        include: { service: true }
      });

      return { customer, token };
    });

    // Calculate queue position
    const waitingCount = await prisma.token.count({
      where: {
        serviceId,
        status: 'WAITING',
        createdAt: { lt: result.token.createdAt }
      }
    });

    // Send SMS
    const smsMessage = SmsService.generateTokenMessage(result.customer.name, result.token.tokenNumber, result.customer.language);
    await SmsService.sendTokenSms(result.customer.id, result.customer.phoneNumber, smsMessage, result.token.id);

    // Notify displays
    io.emit('queueUpdated', { serviceId });

    res.json({
      token: result.token,
      peopleAhead: waitingCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating token' });
  }
});

// 2. Track Token (Public)
router.get('/track/:tokenNumber', async (req, res) => {
  const { tokenNumber } = req.params;
  try {
    const token = await prisma.token.findFirst({
      where: { tokenNumber },
      include: { service: true, customer: true, counter: true }
    });

    if (!token) return res.status(404).json({ message: 'Token not found' });

    const peopleAhead = await prisma.token.count({
      where: {
        serviceId: token.serviceId,
        status: 'WAITING',
        createdAt: { lt: token.createdAt }
      }
    });

    const currentlyServing = await prisma.token.findFirst({
      where: {
        serviceId: token.serviceId,
        status: 'SERVING'
      },
      orderBy: { calledAt: 'desc' }
    });

    res.json({ token, peopleAhead, currentlyServing });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
