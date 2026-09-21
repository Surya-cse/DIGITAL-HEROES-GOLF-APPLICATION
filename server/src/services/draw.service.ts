import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const simulateDrawResults = async (drawId: string, winningNumbers: number[]) => {
  const draw = await prisma.draw.findUnique({ 
    where: { id: drawId },
    include: { entries: true } 
  });

  if (!draw) throw new Error("Draw instance not found.");

  const pool = Number(draw.totalPrizePool);
  const results = {
    tier5: [] as string[], // 5 numbers matched
    tier4: [] as string[], // 4 numbers matched
    tier3: [] as string[]  // 3 numbers matched
  };

  // Algorithmic Match Checking
  draw.entries.forEach(entry => {
    const matches = entry.numbers.filter(n => winningNumbers.includes(n)).length;
    if (matches === 5) results.tier5.push(entry.userId);
    else if (matches === 4) results.tier4.push(entry.userId);
    else if (matches === 3) results.tier3.push(entry.userId);
  });

  // PRD Prize Splits: 5-match (40%), 4-match (35%), 3-match (25%)
  return {
    winningNumbers,
    winners: results,
    prizeSplits: {
      tier5: results.tier5.length > 0 ? (pool * 0.40) / results.tier5.length : 0,
      tier4: results.tier4.length > 0 ? (pool * 0.35) / results.tier4.length : 0,
      tier3: results.tier3.length > 0 ? (pool * 0.25) / results.tier3.length : 0,
    },
    jackpotRollover: results.tier5.length === 0 ? (pool * 0.40) : 0
  };
};