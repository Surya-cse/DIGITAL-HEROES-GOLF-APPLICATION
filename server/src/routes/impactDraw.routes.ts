import { Router } from 'express';
import * as drawController from '../controllers/draw.controller';
import { IdentityGateway } from '../gateways/IdentityGateway';
import { MembershipGateway } from '../gateways/MembershipGateway';

const router = Router();

router.use(IdentityGateway);

// See the draw (Logged in)
router.get('/active', drawController.getActiveDraw);

// Enter the draw (Requires Active Subscription)
router.post('/enter', MembershipGateway, drawController.enterDraw);

export default router;