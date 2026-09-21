import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const prisma = new PrismaClient();

export const createMemberSession = async (userId: string, email: string, plan: 'MONTHLY' | 'YEARLY') => {
  const priceId = plan === 'YEARLY' ? 'price_yearly_id' : 'price_monthly_id';

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/membership`,
    metadata: { userId }
  });

  return session.url;
};

export const handleSubscriptionChange = async (subscriptionId: string, status: string, userId: string) => {
  const isPaid = status === 'active';
  
  await prisma.subscription.upsert({
    where: { userId },
    update: { 
      status: isPaid ? 'ACTIVE' : 'LAPSED',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Mock 30 days
    },
    create: {
      userId,
      status: isPaid ? 'ACTIVE' : 'LAPSED',
      planType: 'MONTHLY',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });
};