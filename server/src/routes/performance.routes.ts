import { Router } from 'express';
import * as scoreController from '../controllers/score.controller';
import { IdentityGateway } from '../gateways/IdentityGateway';
import { MembershipGateway } from '../gateways/MembershipGateway';

const router = Router();

// PRD: All score features require active subscription
router.use(IdentityGateway);
router.use(MembershipGateway);

router.get('/', scoreController.getScores);
router.post('/', scoreController.createScore);
router.delete('/:id', scoreController.deleteScore);

export default router;