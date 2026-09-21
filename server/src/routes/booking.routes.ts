import { Router } from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.controller';
import { IdentityGateway } from '../gateways/IdentityGateway';
import { MembershipGateway } from '../gateways/MembershipGateway';

const router = Router();
router.use(IdentityGateway);
router.use(MembershipGateway); // Only active subscribers can book

router.post('/', createBooking);
router.get('/', getMyBookings);

export default router;