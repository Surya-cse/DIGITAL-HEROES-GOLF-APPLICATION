import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Custom interface to allow attaching the user to the Request object
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'PUBLIC' | 'SUBSCRIBER' | 'ADMIN';
  };
}

export const IdentityGateway = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  // PRD Check: Ensure the token exists in the 'Bearer <token>' format
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Identity required. Please sign in to access this resource.' 
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'hero_secret_vault_99';
    const verified = jwt.verify(token, secret) as any;
    
    // Attach the decrypted user data to the request for the next gateway or controller
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired identity token.' });
  }
};