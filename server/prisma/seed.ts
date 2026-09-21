import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SQLite database seeding...');

  // 1. Create Admin User (Roles are strings in SQLite mode)
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@digitalheroes.com' },
    update: {},
    create: {
      email: 'admin@digitalheroes.com',
      passwordHash: adminPassword,
      fullName: 'System Administrator',
      role: 'ADMIN', // Changed from Enum to String
    },
  });
  console.log('✅ Admin user created: admin@digitalheroes.com');

  // 2. Create Charities
  const charities = [
    {
      name: 'Ocean Clean-Up Initiative',
      description: 'Removing plastic from our oceans using advanced golf-inspired engineering.',
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1484521111111-ed7bbaae773c?auto=format&fit=crop&q=80',
    },
    {
      name: 'Green Fairways Foundation',
      description: 'Providing golf equipment and training to underprivileged youth.',
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80',
    }
  ];

  for (const charity of charities) {
    await prisma.charity.create({ data: charity });
  }
  console.log('✅ Charities seeded.');

  // 3. Create Initial Draw 
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.draw.create({
    data: {
      drawDate: nextMonth,
      status: 'SCHEDULED',      // Changed from Enum to String
      totalPrizePool: 5000.00, // Changed from Decimal to Float
      winningNumbers: '[]',    // SQLite stores arrays as JSON strings
    }
  });
  console.log('✅ Initial monthly draw scheduled.');

  console.log('🚀 Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });