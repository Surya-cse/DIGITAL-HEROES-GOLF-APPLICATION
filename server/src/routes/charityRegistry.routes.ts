import { Router } from 'express';
import * as charityController from '../controllers/charity.controller';
import { IdentityGateway } from '../gateways/IdentityGateway';

const router = Router();

// Public: Anyone can see the charities (PRD Landing Page requirement)
router.get('/', charityController.getCharities);

// Protected: Only logged in users can select a charity
router.post('/select', IdentityGateway, charityController.updateSelection);

export default router;