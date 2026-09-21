import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getRegistryData = async () => {
  return await prisma.charity.findMany({
    orderBy: { isFeatured: 'desc' }
  });
};

export const saveImpactPreference = async (userId: string, charityId: string, percent: number) => {
  // PRD Rule: Minimum contribution is 10% of subscription fee
  if (percent < 10) {
    throw new Error('The minimum voluntary contribution is 10%.');
  }

  return await prisma.userCharity.upsert({
    where: { userId },
    update: { charityId, contributionPercent: percent },
    create: { userId, charityId, contributionPercent: percent }
  });
};