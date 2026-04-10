import { Request, Response, NextFunction } from "express";

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.appUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.appUser.role)) {
      res.status(403).json({ error: "Forbidden: insufficient role" });
      return;
    }

    next();
  };
};
