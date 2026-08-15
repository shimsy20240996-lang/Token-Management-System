import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin User
  const adminExists = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        passwordHash,
        role: 'ADMIN'
      }
    });
    console.log('Admin user created (admin@example.com / admin123)');
  }

  // Services
  const services = [
    { name: 'Customer Service', prefix: 'CS' },
    { name: 'Cashier', prefix: 'CA' },
    { name: 'Payments', prefix: 'P' },
    { name: 'Information', prefix: 'I' }
  ];

  for (const s of services) {
    const exists = await prisma.service.findFirst({ where: { prefix: s.prefix } });
    if (!exists) {
      const created = await prisma.service.create({ data: s });
      
      // Create a counter for the service
      await prisma.counter.create({
        data: {
          name: `Counter ${s.prefix}`,
          serviceId: created.id
        }
      });
      console.log(`Created service ${s.name} and its counter`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
