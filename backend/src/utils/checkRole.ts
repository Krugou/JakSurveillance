import {NextFunction, Request, Response} from 'express';
/**
 * Middleware to check if the user's role is authorized.
 *
 * @param {string[]} roles - The list of authorized roles.
 * @returns {Function} Middleware function that checks the user's role.
 */
const checkUserRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({error: 'Unauthorized'});
    }
    next();
  };
};

export default checkUserRole;
