import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

// Using the exact names we just defined
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;