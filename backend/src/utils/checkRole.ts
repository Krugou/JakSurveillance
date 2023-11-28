import {NextFunction, Request, Response} from 'express';

const checkUserRole = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({error: 'Unauthorized'});
		}
		next();
	};
};

export default checkUserRole;
