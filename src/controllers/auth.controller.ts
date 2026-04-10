import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { authService } from "../services/auth.service";

export const authController = {
  async sync(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      if (!auth?.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await authService.syncUser({
        clerkUserId: auth.userId,
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
      });

      res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response) {
    res.status(200).json({ data: req.appUser });
  },
};
