import { prisma } from '../db';

export class SmsService {
  static async sendTokenSms(customerId: string, phoneNumber: string, message: string, tokenId?: string) {
    console.log(`\n[SMS MOCK] Sending to: ${phoneNumber}`);
    console.log(`[SMS MOCK] Message: \n${message}\n`);

    // Log to DB
    await prisma.smsLog.create({
      data: {
        customerId,
        tokenId,
        phoneNumber,
        message,
        status: 'SENT',
        provider: 'MOCK'
      }
    });
  }

  static generateTokenMessage(name: string, tokenNumber: string, language: string) {
    if (language === 'si') {
      return `ආයුබෝවන් ${name}, ඔබේ අංකය ${tokenNumber}. කරුණාකර රැඳී සිටින්න.`;
    }
    if (language === 'ta') {
      return `வணக்கம் ${name}, உங்கள் எண் ${tokenNumber}. தயவுசெய்து காத்திருக்கவும்.`;
    }
    return `Hello ${name}, your token number is ${tokenNumber}. Please wait for your turn.`;
  }
}
