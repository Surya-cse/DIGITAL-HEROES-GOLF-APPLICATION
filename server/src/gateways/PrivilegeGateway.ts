import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './IdentityGateway';

/**
 * Higher-order function that takes an array of allowed roles
 * Usage: PrivilegeGateway(['ADMIN']) or PrivilegeGateway(['ADMIN', 'SUBSCRIBER'])
 */
export const PrivilegeGateway = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Identity verification failed.' });
    }

    // Check if the user's role matches any of the allowed roles for this specific route
    const hasPrivilege = allowedRoles.includes(req.user.role);

    if (!hasPrivilege) {
      return res.status(403).json({ 
        message: 'Access Denied: You do not have the required privileges for this action.' 
      });
    }

    next();
  };
};