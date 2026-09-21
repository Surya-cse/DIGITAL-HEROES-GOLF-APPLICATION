import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from './IdentityGateway';

const prisma = new PrismaClient();

export const MembershipGateway = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'Identity required.' });

  // Rule: Admins bypass membership checks to manage the platform
  if (req.user.role === 'ADMIN') return next();

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    // PRD Rule: "Restrict subscriber-only features when subscription is inactive"
    if (!subscription || subscription.status !== 'ACTIVE') {
      return res.status(402).json({ 
        message: 'Membership Inactive. Please renew your subscription to access this feature.',
        status: 'LAPSED'
      });
    }

    // Verify current date vs period end
    if (new Date() > new Date(subscription.currentPeriodEnd)) {
       return res.status(402).json({ message: 'Membership Expired.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying membership status.' });
  }
};