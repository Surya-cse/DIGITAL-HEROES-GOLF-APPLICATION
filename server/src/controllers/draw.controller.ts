import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { simulateDrawResults } from '../services/draw.service';

const prisma = new PrismaClient();

export const getActiveDraw = async (req: AuthRequest, res: Response) => {
  const draw = await prisma.draw.findFirst({
    where: { status: 'SCHEDULED' },
    orderBy: { drawDate: 'asc' }
  });
  res.json(draw);
};

export const enterDraw = async (req: AuthRequest, res: Response) => {
  try {
    const { drawId, numbers } = req.body; // numbers is Int[]
    const entry = await prisma.drawEntry.create({
      data: { userId: req.user!.id, drawId, numbers }
    });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Failed to enter draw' });
  }
};

// Admin Controller Logic
export const simulateDraw = async (req: AuthRequest, res: Response) => {
  const { drawId, winningNumbers } = req.body;
  try {
    const results = await simulateDrawResults(drawId, winningNumbers);
    res.json(results);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};