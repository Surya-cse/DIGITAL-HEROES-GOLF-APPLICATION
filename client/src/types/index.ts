

export type UserRole = 'PUBLIC' | 'SUBSCRIBER' | 'ADMIN';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'LAPSED';

export type DrawStatus = 'SCHEDULED' | 'SIMULATED' | 'PUBLISHED';

export type PayoutStatus = 'PENDING' | 'PAID';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  stripeCustId?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  planType: 'MONTHLY' | 'YEARLY';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface PerformanceScore {
  id: string;
  userId: string;
  value: number; // PRD: 1-45
  date: string;
  createdAt: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  websiteUrl?: string;
  isFeatured: boolean;
}

export interface UserCharity {
  id: string;
  userId: string;
  charityId: string;
  contributionPercent: number; // Min 10
  charity?: Charity;
}

export interface ImpactDraw {
  id: string;
  drawDate: string;
  status: DrawStatus;
  winningNumbers: number[]; // Array of 5
  totalPrizePool: number;
}

export interface DrawEntry {
  id: string;
  drawId: string;
  userId: string;
  numbers: number[]; // The 5 numbers the user picked
}

export interface Winner {
  id: string;
  drawId: string;
  userId: string;
  tier: number; // 3, 4, or 5
  prizeAmount: number;
  payoutStatus: PayoutStatus;
  proofUrl?: string;
  user?: User;
  draw?: ImpactDraw;
}