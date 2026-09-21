import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { manageScoreEntry } from '../services/score.service';

const prisma = new PrismaClient();

export const getScores = async (req: AuthRequest, res: Response) => {
  const scores = await prisma.score.findMany({
    where: { userId: req.user!.id },
    orderBy: { date: 'desc' },
    take: 5 // PRD: Show only the latest 5
  });
  res.json(scores);
};

export const createScore = async (req: AuthRequest, res: Response) => {
  try {
    const { value, date } = req.body;
    // Uses the score.service.ts logic we wrote to handle the automatic deletion of the 6th score
    const score = await manageScoreEntry(req.user!.id, value, date);
    res.status(201).json(score);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteScore = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.score.delete({
      where: { id, userId: req.user!.id }
    });
    res.json({ message: 'Score removed' });
  } catch (error) {
    res.status(400).json({ message: 'Delete failed' });
  }
};