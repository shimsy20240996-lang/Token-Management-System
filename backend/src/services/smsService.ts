import { prisma } from '../db';
import twilio from 'twilio';

export class SmsService {
  static async sendTokenSms(customerId: string, phoneNumber: string, message: string, tokenId?: string) {
    console.log(`\n[MESSAGE] Sending to: ${phoneNumber}`);
    console.log(`[MESSAGE] Content: \n${message}\n`);

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. 'whatsapp:+14155238886'

    let status = 'LOGGED';
    let provider = 'MOCK';

    if (accountSid && authToken && fromWhatsApp) {
      try {
        const client = twilio(accountSid, authToken);
        
        let formattedToNumber = phoneNumber.trim();
        if (formattedToNumber.startsWith('0')) {
          formattedToNumber = '+94' + formattedToNumber.substring(1);
        } else if (!formattedToNumber.startsWith('+')) {
          formattedToNumber = '+' + formattedToNumber;
        }

        await client.messages.create({
          body: message,
          from: fromWhatsApp,
          to: `whatsapp:${formattedToNumber}`
        });

        status = 'SENT';
        provider = 'TWILIO_WHATSAPP';
        console.log('[TWILIO] WhatsApp message sent successfully!');
      } catch (error) {
        console.error('[TWILIO] Error sending WhatsApp message:', error);
        status = 'FAILED';
        provider = 'TWILIO_WHATSAPP';
      }
    }

    // Log to DB
    await prisma.smsLog.create({
      data: {
        customerId,
        tokenId,
        phoneNumber,
        message,
        status,
        provider
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
