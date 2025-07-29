import 'reflect-metadata';

import { PrismaClient, Role } from '@prisma/client';
import { HashService } from '../../src/core/services/security/hash.service';
import { container } from 'tsyringe';
const prisma = new PrismaClient();

async function seedUsers() {
  if (process.env.APP_ENV !== 'development') {
    console.log('Skipping user seed: Not in development environment.');
    await prisma.$disconnect();
    return;
  }
  
  const hashService = container.resolve(HashService);

  const plainPassword = '123';
  const hashedPassword = await hashService.hash(plainPassword)

  const users = [
    {
      employee_id: 24375,
      first_name: 'James Angelo',
      last_name: 'Sarona',
      email: 'james.sarona@flatworldsolutions.com.ph',
      password: hashedPassword,
      role: Role.ADMIN,
    },
    {
      employee_id: 99999,
      first_name: 'Manager',
      last_name: 'Manager',
      email: 'management@flatworldsolutions.com',
      password: hashedPassword,
      role: Role.MANAGEMENT,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Seeded minimal users — one per role');
  await prisma.$disconnect();
}

seedUsers().catch((e) => {
  console.error('Error seeding users:', e);
  prisma.$disconnect();
});
