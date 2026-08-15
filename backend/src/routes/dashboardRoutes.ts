import { Router } from 'express';
import { prisma } from '../db';
import { io } from '../index';
import { authenticate } from '../middleware/auth';
import { SmsService } from '../services/smsService';

const router = Router();

// Staff: Call next token
router.post('/call-next', authenticate, async (req, res) => {
  const { counterId, serviceId } = req.body;
  try {
    // 1. Mark any currently serving token at this counter as COMPLETED
    await prisma.token.updateMany({
      where: { counterId, status: 'SERVING' },
      data: { status: 'COMPLETED', completedAt: new Date() }
    });

    // 2. Find next waiting token
    const nextToken = await prisma.token.findFirst({
      where: { serviceId, status: 'WAITING' },
      orderBy: { createdAt: 'asc' },
      include: { customer: true, counter: true, service: true }
    });

    if (!nextToken) {
      return res.json({ message: 'Queue is empty' });
    }

    // 3. Update token status
    const updatedToken = await prisma.token.update({
      where: { id: nextToken.id },
      data: { status: 'SERVING', counterId, calledAt: new Date() },
      include: { customer: true, counter: true, service: true }
    });

    // 4. Send SMS to customer being called
    let smsMsg = `Token ${updatedToken.tokenNumber} is now being served. Please proceed to ${updatedToken.counter?.name}.`;
    if (updatedToken.customer.language === 'si') smsMsg = `ඔබේ අංකය ${updatedToken.tokenNumber} දැන් කැඳවා ඇත. කරුණාකර ${updatedToken.counter?.name} වෙත යන්න.`;
    if (updatedToken.customer.language === 'ta') smsMsg = `உங்கள் எண் ${updatedToken.tokenNumber} அழைக்கப்பட்டுள்ளது. தயவுசெய்து ${updatedToken.counter?.name} க்கு செல்லவும்.`;
    
    await SmsService.sendTokenSms(updatedToken.customerId, updatedToken.customer.phoneNumber, smsMsg, updatedToken.id);

    // 5. Notify displays via WebSockets
    io.emit('tokenCalled', updatedToken);
    io.emit('queueUpdated', { serviceId });

    res.json(updatedToken);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalToday = await prisma.token.count({ where: { createdAt: { gte: today } } });
    const waiting = await prisma.token.count({ where: { status: 'WAITING', createdAt: { gte: today } } });
    const serving = await prisma.token.count({ where: { status: 'SERVING', createdAt: { gte: today } } });
    const completed = await prisma.token.count({ where: { status: 'COMPLETED', createdAt: { gte: today } } });

    res.json({ totalToday, waiting, serving, completed });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
