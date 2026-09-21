import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getCharities = async (req: AuthRequest, res: Response) => {
  const charities = await prisma.charity.findMany({
    orderBy: { isFeatured: 'desc' }
  });
  res.json(charities);
};

export const updateSelection = async (req: AuthRequest, res: Response) => {
  try {
    const { charityId, percentage } = req.body;
    
    // PRD Rule: Minimum contribution is 10%
    if (percentage < 10) return res.status(400).json({ message: 'Minimum contribution is 10%' });

    const selection = await prisma.userCharity.upsert({
      where: { userId: req.user!.id },
      update: { charityId, contributionPercent: percentage },
      create: { userId: req.user!.id, charityId, contributionPercent: percentage }
    });
    
    res.json(selection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update selection' });
  }
};