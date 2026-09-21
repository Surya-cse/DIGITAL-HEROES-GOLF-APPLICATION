import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../gateways/IdentityGateway';

const prisma = new PrismaClient();

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { date, timeSlot, course } = req.body;
    
    const booking = await prisma.booking.create({
      data: {
        userId: req.user!.id,
        date: new Date(date),
        timeSlot,
        course
      }
    });
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: "This slot is already taken. Please choose another time." });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user!.id },
    orderBy: { date: 'asc' }
  });
  res.json(bookings);
};