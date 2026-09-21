import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const manageScoreEntry = async (userId: string, value: number, date: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the new score
    const newScore = await tx.score.create({
      data: { userId, value, date: new Date(date) }
    });

    // 2. Fetch ALL scores for the user (Newest first)
    const userScores = await tx.score.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    // 3. PRD Rule: Keep only the latest 5. 
    // If we have 6, delete the 6th and anything older.
    if (userScores.length > 5) {
      const surplus = userScores.slice(5);
      const idsToDelete = surplus.map(s => s.id);
      
      await tx.score.deleteMany({
        where: { id: { in: idsToDelete } }
      });
    }

    return newScore;
  });
};