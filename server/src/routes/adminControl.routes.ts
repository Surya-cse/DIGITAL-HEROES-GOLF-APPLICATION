import { Router } from 'express';
import * as drawController from '../controllers/draw.controller';
import { IdentityGateway } from '../gateways/IdentityGateway';
import { PrivilegeGateway } from '../gateways/PrivilegeGateway';

const router = Router();

// Apply Admin Lock to all routes in this file
router.use(IdentityGateway);
router.use(PrivilegeGateway(['ADMIN']));

// Draw Management
router.post('/draw/simulate', drawController.simulateDraw);
router.get('/active-draw', drawController.getActiveDraw);

// User Management (Admin can view all users)
router.get('/users', (req, res) => res.json({ message: "User List Logic" }));
router.get('/stats', (req, res) => res.json({ activeSubs: 150 })); // Mock for UI

export default router;