import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Secret';

export function checkAuth(req: Request, res: Response, next: NextFunction): any {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: 'No token, authorization denied' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Token is not valid' });
      }
      next(); // Proceed to the next middleware or route handler
    });
};
